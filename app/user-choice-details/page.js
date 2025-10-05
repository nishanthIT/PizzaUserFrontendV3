"use client";
import FixedBtn from "@/components/custom/FixedBtn";
import WellFoodLayout from "@/layout/WellFoodLayout";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState, Suspense } from "react";
import { API_URL } from "@/services/config";
import PizzaLoader from "@/components/pizzaLoader";
import { fetchUserChoiceById, fetchCategoryItems } from "@/services/userChoiceServices";
import { useDispatch } from "react-redux";
import { addToCart } from "@/features/cart/cartSlice";
import Counter from "@/components/Counter";

const UserChoiceDetailsContent = () => {
  const [userChoice, setUserChoice] = useState(null);
  const [selectedItems, setSelectedItems] = useState({});
  const [categoryItems, setCategoryItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const userChoiceId = searchParams.get("id");
  const fromMenu = searchParams.get("fromMenu"); // Check if coming from restaurant menu

  useEffect(() => {
    if (!userChoiceId) {
      setError("Invalid meal deal ID");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch user choice details
        // Allow inactive items if coming from restaurant menu
        const allowInactive = fromMenu === 'true';
        const userChoiceData = await fetchUserChoiceById(userChoiceId, allowInactive);
        
        if (userChoiceData.success) {
          setUserChoice(userChoiceData.data);
          
          // Initialize selected items structure
          const initialSelected = {};
          userChoiceData.data.categoryConfigs.forEach(config => {
            initialSelected[config.categoryId] = [];
          });
          setSelectedItems(initialSelected);
          
          // Fetch items for each category
          const categoryItemsData = {};
          for (const config of userChoiceData.data.categoryConfigs) {
            try {
              console.log(`🔧 Fetching items for category: ${config.categoryName} (${config.categoryId})`);
              const itemsData = await fetchCategoryItems(userChoiceId, config, allowInactive);
              if (itemsData.success) {
                console.log(`🔧 Retrieved ${itemsData.data.length} items for ${config.categoryName}:`, itemsData.data);
                categoryItemsData[config.categoryId] = itemsData.data;
              } else {
                console.log(`🔧 Failed to fetch items for ${config.categoryName}`);
              }
            } catch (err) {
              console.error(`Error fetching items for category ${config.categoryId} (${config.categoryName}):`, err);
            }
          }
          setCategoryItems(categoryItemsData);
        } else {
          setError("Failed to load meal deal details");
        }
      } catch (error) {
        console.error("Error fetching user choice details:", error);
        setError("Failed to load meal deal. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userChoiceId]);

  const handleItemSelection = (categoryId, item) => {
    const categoryConfig = userChoice.categoryConfigs.find(c => c.categoryId === categoryId);
    const maxItems = categoryConfig.itemCount;
    const currentSelected = selectedItems[categoryId] || [];
    
    // Find if this exact item is already selected
    const existingIndex = currentSelected.findIndex(selected => selected.id === item.id);
    const isPizzaCategory = categoryConfig.categoryType === 'pizza';

    setSelectedItems(prev => {
      if (existingIndex >= 0) {
        // Item already selected - increment quantity
        const existingItem = currentSelected[existingIndex];
        const newQuantity = (existingItem.quantity || 1) + 1;
        
        if (isPizzaCategory) {
          // For pizza, always allow more selections
          const updatedSelection = [...currentSelected];
          updatedSelection[existingIndex] = { ...existingItem, quantity: newQuantity };
          return {
            ...prev,
            [categoryId]: updatedSelection
          };
        } else {
          // For other categories - calculate total count including new quantity
          const totalSelected = currentSelected.reduce((sum, selectedItem, index) => {
            if (index === existingIndex) {
              return sum + newQuantity; // Use new quantity for clicked item
            }
            return sum + (selectedItem.quantity || 1);
          }, 0);
          
          if (totalSelected <= maxItems) {
            // Within limit, increase quantity
            const updatedSelection = [...currentSelected];
            updatedSelection[existingIndex] = { ...existingItem, quantity: newQuantity };
            return {
              ...prev,
              [categoryId]: updatedSelection
            };
          } else {
            // Would exceed limit
            // If new quantity would be greater than maxItems, limit it to maxItems
            if (newQuantity > maxItems) {
              const updatedSelection = [{ ...existingItem, quantity: maxItems }];
              return {
                ...prev,
                [categoryId]: updatedSelection
              };
            } else {
              // Remove other items and increase current item
              const updatedSelection = [{ ...existingItem, quantity: newQuantity }];
              return {
                ...prev,
                [categoryId]: updatedSelection
              };
            }
          }
        }
      } else {
        // New item selection
        const totalSelected = currentSelected.reduce((sum, item) => sum + (item.quantity || 1), 0);
        
        if (isPizzaCategory || totalSelected < maxItems) {
          // Add new item if under limit
          return {
            ...prev,
            [categoryId]: [...currentSelected, { ...item, quantity: 1 }]
          };
        } else {
          // At limit - remove first item and add new item to maintain limit
          const updatedSelection = [...currentSelected];
          updatedSelection.splice(0, 1); // Remove first item
          updatedSelection.push({ ...item, quantity: 1 }); // Add new item
          return {
            ...prev,
            [categoryId]: updatedSelection
          };
        }
      }
    });
  };

  const calculateTotalPrice = () => {
    // Only use base price, ignore individual item prices
    return parseFloat(userChoice?.basePrice || 0);
  };

  const isSelectionComplete = () => {
    if (!userChoice) return false;
    
    return userChoice.categoryConfigs.every(config => {
      const selected = selectedItems[config.categoryId] || [];
      // Count total quantity, not just unique items
      const totalQuantity = selected.reduce((sum, item) => sum + (item.quantity || 1), 0);
      return totalQuantity === config.itemCount;
    });
  };

  const handleAddToCart = () => {
    if (!isSelectionComplete()) {
      alert("Please complete all your selections");
      return;
    }

    setIsAddingToCart(true);
    
    // Prepare category-specific display information
    let hasPizzaCategory = false;
    let hasComboStyleCategory = false;
    let pizzaBaseInfo = null;
    let sauceInfo = null;
    
    userChoice.categoryConfigs.forEach(config => {
      const categoryItems = selectedItems[config.categoryId] || [];
      if (config.categoryType === 'pizza') {
        hasPizzaCategory = true;
        pizzaBaseInfo = "Thin Crust"; // Default pizza base
      } else if (config.categoryType === 'comboStyle') {
        hasComboStyleCategory = true;
        sauceInfo = categoryItems.length > 0 
          ? categoryItems.map(item => `${item.quantity > 1 ? item.quantity + 'x ' : ''}${item.name}`).join(', ')
          : "No sauce";
      }
      // For other categories, don't add any extra display info
    });

    const cartItem = {
      id: userChoice.id,
      type: "userChoice",
      title: userChoice.name, // Cart expects 'title' not 'name'
      name: userChoice.name,
      basePrice: parseFloat(userChoice.basePrice),
      quantity: 1,
      eachprice: parseFloat(userChoice.basePrice), // Cart expects this field
      price: parseFloat(userChoice.basePrice), // Cart expects this field
      selectedItems: selectedItems,
      totalPrice: calculateTotalPrice(),
      img: userChoice.imageUrl || "/assets/images/food/pm-food1.png",
      // Category-specific fields for cart display
      size: "Regular", // Default size
      pizzaBase: hasPizzaCategory ? pizzaBaseInfo : null, // Only set if has pizza category
      sauce: hasComboStyleCategory ? sauceInfo : null, // Only set if has combo style category
      ingredients: [], // Always empty for UserChoice items
      toppings: [], // Keep empty for compatibility
      hasPizzaCategory: hasPizzaCategory, // Flag to help cart component decide what to show
      hasComboStyleCategory: hasComboStyleCategory // Flag to help cart component decide what to show
    };

    dispatch(addToCart(cartItem));
    
    setTimeout(() => {
      setIsAddingToCart(false);
      router.push("/cart");
    }, 500);
  };

  if (loading) {
    return (
      <WellFoodLayout>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '60vh',
          flexDirection: 'column'
        }}>
          <PizzaLoader />
          <p style={{ marginTop: '20px', fontSize: '1.1rem' }}>Loading your meal deal...</p>
        </div>
      </WellFoodLayout>
    );
  }

  if (error) {
    return (
      <WellFoodLayout>
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <h2 style={{ color: '#ff6b35', marginBottom: '20px' }}>Oops!</h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '30px' }}>{error}</p>
          <Link href="/menu-pizza">
            <button style={{
              padding: '12px 24px',
              background: '#ff6b35',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              cursor: 'pointer'
            }}>
              Back to Menu
            </button>
          </Link>
        </div>
      </WellFoodLayout>
    );
  }

  return (
    <WellFoodLayout>
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '20px',
        paddingBottom: '120px',
        fontSize: '16px',
        lineHeight: '1.6'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <Link href="/menu-pizza" style={{ 
            color: '#ff6b35', 
            textDecoration: 'none',
            fontSize: '0.9rem',
            marginBottom: '15px',
            display: 'inline-block'
          }}>
            ← Back to Menu
          </Link>
          
          {/* Item Image and Details */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ 
              width: '100%', 
              height: '200px', 
              borderRadius: '12px', 
              overflow: 'hidden',
              marginBottom: '20px',
              background: '#f8f9fa'
            }}>
              <img 
                src={userChoice?.imageUrl 
                  ? (userChoice.imageUrl.startsWith('http') 
                      ? userChoice.imageUrl 
                      : `${API_URL}/images/${userChoice.imageUrl}`)
                  : "/assets/images/food/pm-food1.png"
                }
                alt={userChoice?.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                onError={(e) => {
                  e.target.src = "/assets/images/food/pm-food1.png";
                }}
              />
            </div>
            
            <h1 style={{ 
              fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', 
              fontWeight: '700', 
              color: '#333',
              marginBottom: '10px',
              lineHeight: '1.2'
            }}>
              {userChoice?.name}
            </h1>
            
            {userChoice?.description && (
              <p style={{ fontSize: "1rem", color: "#666", marginBottom: '15px' }}>
                {userChoice.description}
              </p>
            )}
            
            <div style={{ 
              fontSize: "1.8rem", 
              fontWeight: "700", 
              color: "#ff6b35",
              marginBottom: '20px'
            }}>
              £{calculateTotalPrice().toFixed(2)}
            </div>
          </div>
        </div>

        {/* Category Selections */}
        {userChoice?.categoryConfigs.map((config) => {
          const items = categoryItems[config.categoryId] || [];
          console.log(items)
          const selectedInCategory = selectedItems[config.categoryId] || [];
          
          return (
            <div key={config.categoryId} style={{ marginBottom: "40px" }}>
              <h4 style={{ 
                fontSize: "1.3rem", 
                fontWeight: "600", 
                marginBottom: "15px",
                color: '#333'
              }}>
                Choose {config.itemCount} {config.categoryName ? config.categoryName.toLowerCase() : config.type + (config.itemCount > 1 ? 's' : '')}
                {config.type === 'pizza' && config.pizzaSize && (
                  <span style={{ color: '#ff6b35', fontSize: '0.9rem', fontWeight: '500' }}>
                    {' '}({config.pizzaSize})
                  </span>
                )}:
              </h4>
              
              {items.length > 0 ? (
                <>
                  <div style={{ 
                    display: "grid", 
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
                    gap: "12px",
                    marginBottom: "10px"
                  }}>
                    {items.map((item) => {
                      const isSelected = selectedInCategory.find(selected => selected.id === item.id);
                      
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleItemSelection(config.categoryId, item)}
                          style={{
                            padding: "16px",
                            borderRadius: "10px",
                            border: isSelected ? "2px solid #ff6b35" : "2px solid #f0f0f0",
                            background: isSelected ? "#fff5f2" : "#fff",
                            color: isSelected ? "#ff6b35" : "#333",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            textAlign: "left",
                            width: "100%",
                            fontSize: "1rem",
                            boxShadow: isSelected ? "0 4px 12px rgba(255, 107, 53, 0.15)" : "0 2px 8px rgba(0,0,0,0.05)"
                          }}
                        >
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '8px'
                          }}>
                            <div style={{ flex: 1, minWidth: '0' }}>
                              <div style={{ 
                                fontWeight: isSelected ? "600" : "500",
                                fontSize: '1rem',
                                marginBottom: '4px',
                                wordBreak: 'break-word'
                              }}>
                                {item.name}
                              </div>
                              {item.description && (
                                <div style={{ 
                                  fontSize: '0.85rem', 
                                  color: '#666',
                                  lineHeight: '1.3'
                                }}>
                                  {item.description}
                                </div>
                              )}
                            </div>
                            <div style={{ 
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              flexShrink: 0
                            }}>
                              {isSelected && (
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}>
                                  {(isSelected.quantity || 1) > 1 && (
                                    <span style={{
                                      background: '#ff6b35',
                                      color: 'white',
                                      borderRadius: '50%',
                                      width: '20px',
                                      height: '20px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontSize: '0.7rem',
                                      fontWeight: '600'
                                    }}>
                                      {isSelected.quantity}
                                    </span>
                                  )}
                                  <span style={{
                                    background: '#ff6b35',
                                    color: 'white',
                                    borderRadius: '50%',
                                    width: '20px',
                                    height: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.8rem',
                                    fontWeight: '600'
                                  }}>
                                    +
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <small style={{ 
                    color: "#666", 
                    display: "block",
                    fontSize: '0.9rem'
                  }}>
                    {(() => {
                      const totalQuantity = selectedInCategory.reduce((sum, item) => sum + (item.quantity || 1), 0);
                      return `Selected: ${totalQuantity} / ${config.itemCount}`;
                    })()}
                    {(() => {
                      const totalQuantity = selectedInCategory.reduce((sum, item) => sum + (item.quantity || 1), 0);
                      return totalQuantity === config.itemCount && (
                        <span style={{ color: '#ff6b35', marginLeft: '8px' }}>✓ Complete</span>
                      );
                    })()}
                  </small>
                </>
              ) : (
                <div style={{ 
                  padding: "30px", 
                  background: "#f8f9fa",
                  borderRadius: "10px",
                  textAlign: "center",
                  color: "#666"
                }}>
                  <p>No items available for this category</p>
                </div>
              )}
            </div>
          );
        })}

        {/* Selection Summary */}
        {Object.keys(selectedItems).length > 0 && (
          <div style={{
            background: '#f8f9fa',
            padding: '20px',
            borderRadius: '10px',
            marginBottom: '30px'
          }}>
            <h4 style={{ 
              fontSize: '1.2rem', 
              fontWeight: '600', 
              marginBottom: '15px',
              color: '#333'
            }}>
              Your Selection:
            </h4>
            {userChoice?.categoryConfigs.map((config) => {
              const selectedInCategory = selectedItems[config.categoryId] || [];
              if (selectedInCategory.length === 0) return null;
              
              return (
                <div key={config.categoryId} style={{ marginBottom: '12px' }}>
                  <strong style={{ color: '#ff6b35', fontSize: '0.9rem' }}>
                    {config.type.charAt(0).toUpperCase() + config.type.slice(1)}:
                  </strong>
                  <ul style={{ margin: '5px 0 0 20px', padding: 0 }}>
                    {selectedInCategory.map((item) => (
                      <li key={item.id} style={{ 
                        fontSize: '0.9rem', 
                        color: '#666',
                        marginBottom: '2px'
                      }}>
                        {item.quantity && item.quantity > 1 ? `${item.quantity}x ` : ''}{item.name}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Desktop Add to Cart Section */}
      <div style={{
        position: 'sticky',
        bottom: '20px',
        margin: '0 auto',
        maxWidth: '800px',
        padding: '0 20px',
        display: 'none'
      }}
      className="desktop-add-to-cart">
        <div style={{
          background: 'white',
          border: '2px solid #f0f0f0',
          borderRadius: '12px',
          padding: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            display: 'flex',
            gap: '20px',
            alignItems: 'center',
            color: '#333'
          }}>
            <span style={{ color: '#666', fontSize: '1rem' }}>Total Price</span>
            <span style={{ 
              color: '#333', 
              fontSize: '1.5rem', 
              fontWeight: '700' 
            }}>
              £{calculateTotalPrice().toFixed(2)}
            </span>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart || !isSelectionComplete()}
            style={{
              background: isSelectionComplete() ? '#ff6b35' : '#666',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: isSelectionComplete() ? 'pointer' : 'not-allowed',
              opacity: isAddingToCart ? 0.7 : 1,
              transition: 'all 0.3s ease',
              minWidth: '140px'
            }}
          >
            {isAddingToCart ? "Adding..." : isSelectionComplete() ? "Add to Cart" : "Complete Selection"}
          </button>
        </div>
      </div>
      
      {/* Mobile Fixed Button */}
      <FixedBtn 
        price={calculateTotalPrice()}
        onAddToCart={handleAddToCart}
        name={isAddingToCart ? "Adding..." : isSelectionComplete() ? "Add to Cart" : "Complete Selection"}
        link="#"
      />
    </WellFoodLayout>
  );
};

export default function UserChoiceDetails() {
  return (
    <Suspense fallback={
      <WellFoodLayout>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '60vh' 
        }}>
          <PizzaLoader />
        </div>
      </WellFoodLayout>
    }>
      <UserChoiceDetailsContent />
    </Suspense>
  );
}