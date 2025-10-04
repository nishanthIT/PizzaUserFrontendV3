




"use client";
import FixedBtn from "@/components/custom/FixedBtn";
import WellFoodLayout from "@/layout/WellFoodLayout";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "@/features/cart/cartSlice";
import { API_URL } from "@/services/config";
import PizzaLoader from "@/components/pizzaLoader";

const ComboStyleDetails = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  // URL parameters
  const itemId = searchParams.get("id");
  const selectedSize = searchParams.get("size");
  const isMealDeal = searchParams.get("mealDeal") === "true";

  // State
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSauce, setSelectedSauce] = useState("");
  const [selectedSides, setSelectedSides] = useState([]);
  const [selectedDrinks, setSelectedDrinks] = useState([]);
  const [availableSides, setAvailableSides] = useState([]);
  const [availableDrinks, setAvailableDrinks] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    if (!itemId || !selectedSize) {
      setError("Missing required parameters");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        console.log('🔧 Fetching combo style item details...');
        
        // Fetch the specific item
        const itemResponse = await fetch(`${API_URL}/getComboStyleItems`);
        if (!itemResponse.ok) {
          throw new Error(`Failed to fetch items: ${itemResponse.status}`);
        }
        const itemsData = await itemResponse.json();
        
        const currentItem = Array.isArray(itemsData) ? 
          itemsData.find(i => i.id == itemId || i.id === parseInt(itemId)) : null;

        if (!currentItem) {
          setError("Item not found");
          setLoading(false);
          return;
        }

        console.log('🔧 Found item:', currentItem);
        console.log('🔧 Selected size:', selectedSize);
        console.log('🔧 Size pricing:', currentItem.sizePricing);
        console.log('🔧 Meal deal config:', currentItem.mealDealConfig);

        // Check if the selected size exists in pricing
        if (!currentItem.sizePricing || !currentItem.sizePricing[selectedSize]) {
          setError(`Size "${selectedSize}" not available for this item`);
          setLoading(false);
          return;
        }

        setItem(currentItem);

        // Removed default sauce selection - user must choose manually
        // if (currentItem.availableSauces && currentItem.availableSauces.length > 0) {
        //   setSelectedSauce(currentItem.availableSauces[0]);
        // }

        // If meal deal, fetch sides and drinks based on the mealDealConfig
        if (isMealDeal) {
          console.log('🔧 Fetching meal deal options for size:', selectedSize);
          
          const mealDealInfo = currentItem.mealDealConfig?.[selectedSize];
          console.log('🔧 Meal deal info for size:', mealDealInfo);
          
          if (mealDealInfo) {
            // Fetch sides if configured
            if (mealDealInfo.sides && mealDealInfo.sides.categoryId) {
              try {
                console.log('🔧 Fetching sides for category:', mealDealInfo.sides.categoryId);
                const sidesResponse = await fetch(`${API_URL}/getComboStyleItemSides?itemId=${itemId}&size=${selectedSize}`);
                if (sidesResponse.ok) {
                  const sidesData = await sidesResponse.json();
                  console.log('🔧 Fetched sides:', sidesData);
                  setAvailableSides(Array.isArray(sidesData) ? sidesData : []);
                } else {
                  console.warn('🔧 Failed to fetch sides:', sidesResponse.status);
                  setAvailableSides([]);
                }
              } catch (sidesError) {
                console.error('🔧 Error fetching sides:', sidesError);
                setAvailableSides([]);
              }
            }

            // Fetch drinks if configured
            if (mealDealInfo.drinks && mealDealInfo.drinks.categoryId) {
              try {
                console.log('🔧 Fetching drinks for category:', mealDealInfo.drinks.categoryId);
                const drinksResponse = await fetch(`${API_URL}/getComboStyleItemDrinks?itemId=${itemId}&size=${selectedSize}`);
                if (drinksResponse.ok) {
                  const drinksData = await drinksResponse.json();
                  console.log('🔧 Fetched drinks:', drinksData);
                  setAvailableDrinks(Array.isArray(drinksData) ? drinksData : []);
                } else {
                  console.warn('🔧 Failed to fetch drinks:', drinksResponse.status);
                  setAvailableDrinks([]);
                }
              } catch (drinksError) {
                console.error('🔧 Error fetching drinks:', drinksError);
                setAvailableDrinks([]);
              }
            }
          }
        }

      } catch (error) {
        console.error("Error fetching data:", error);
        setError(`Failed to load item details: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [itemId, selectedSize, isMealDeal]);

  // Handle side selection with quantity support (like user choice)
  const handleSideSelection = (side) => {
    const mealDealInfo = item?.mealDealConfig?.[selectedSize];
    const maxSides = mealDealInfo?.sides?.count || 1;
    
    // Find if this exact side is already selected
    const existingIndex = selectedSides.findIndex(selected => selected.id === side.id);
    
    if (existingIndex >= 0) {
      // Side already selected - increment quantity
      const existingSide = selectedSides[existingIndex];
      const newQuantity = (existingSide.quantity || 1) + 1;
      
      // Calculate total count including new quantity
      const totalSelected = selectedSides.reduce((sum, selectedSide, index) => {
        if (index === existingIndex) {
          return sum + newQuantity; // Use new quantity for clicked side
        }
        return sum + (selectedSide.quantity || 1);
      }, 0);
      
      if (totalSelected <= maxSides) {
        // Within limit, increase quantity
        const updatedSelection = [...selectedSides];
        updatedSelection[existingIndex] = { ...existingSide, quantity: newQuantity };
        setSelectedSides(updatedSelection);
      } else {
        // Would exceed limit - set this side to maxSides and remove others
        if (newQuantity > maxSides) {
          setSelectedSides([{ ...existingSide, quantity: maxSides }]);
        } else {
          // Remove other sides and increase current side
          setSelectedSides([{ ...existingSide, quantity: newQuantity }]);
        }
      }
    } else {
      // New side selection
      const totalSelected = selectedSides.reduce((sum, side) => sum + (side.quantity || 1), 0);
      
      if (totalSelected < maxSides) {
        // Add new side if under limit
        setSelectedSides([...selectedSides, { ...side, quantity: 1 }]);
      } else {
        // At limit - remove first side and add new side
        const updatedSelection = [...selectedSides];
        updatedSelection.splice(0, 1); // Remove first side
        updatedSelection.push({ ...side, quantity: 1 }); // Add new side
        setSelectedSides(updatedSelection);
      }
    }
  };

  // Handle drink selection with quantity support (like user choice)
  const handleDrinkSelection = (drink) => {
    const mealDealInfo = item?.mealDealConfig?.[selectedSize];
    const maxDrinks = mealDealInfo?.drinks?.count || 1;
    
    // Find if this exact drink is already selected
    const existingIndex = selectedDrinks.findIndex(selected => selected.id === drink.id);
    
    if (existingIndex >= 0) {
      // Drink already selected - increment quantity
      const existingDrink = selectedDrinks[existingIndex];
      const newQuantity = (existingDrink.quantity || 1) + 1;
      
      // Calculate total count including new quantity
      const totalSelected = selectedDrinks.reduce((sum, selectedDrink, index) => {
        if (index === existingIndex) {
          return sum + newQuantity; // Use new quantity for clicked drink
        }
        return sum + (selectedDrink.quantity || 1);
      }, 0);
      
      if (totalSelected <= maxDrinks) {
        // Within limit, increase quantity
        const updatedSelection = [...selectedDrinks];
        updatedSelection[existingIndex] = { ...existingDrink, quantity: newQuantity };
        setSelectedDrinks(updatedSelection);
      } else {
        // Would exceed limit - set this drink to maxDrinks and remove others
        if (newQuantity > maxDrinks) {
          setSelectedDrinks([{ ...existingDrink, quantity: maxDrinks }]);
        } else {
          // Remove other drinks and increase current drink
          setSelectedDrinks([{ ...existingDrink, quantity: newQuantity }]);
        }
      }
    } else {
      // New drink selection
      const totalSelected = selectedDrinks.reduce((sum, drink) => sum + (drink.quantity || 1), 0);
      
      if (totalSelected < maxDrinks) {
        // Add new drink if under limit
        setSelectedDrinks([...selectedDrinks, { ...drink, quantity: 1 }]);
      } else {
        // At limit - remove first drink and add new drink
        const updatedSelection = [...selectedDrinks];
        updatedSelection.splice(0, 1); // Remove first drink
        updatedSelection.push({ ...drink, quantity: 1 }); // Add new drink
        setSelectedDrinks(updatedSelection);
      }
    }
  };

  const handleAddToCart = () => {
    // Only check for sauce selection if sauces are available
    if (item.availableSauces && item.availableSauces.length > 0 && !selectedSauce) {
      alert("Please select a sauce");
      return;
    }

    if (isMealDeal) {
      const mealDealInfo = item?.mealDealConfig?.[selectedSize];
      const requiredSides = mealDealInfo?.sides?.count || 0;
      const requiredDrinks = mealDealInfo?.drinks?.count || 0;

      // Calculate total selected quantities
      const totalSelectedSides = selectedSides.reduce((sum, side) => sum + (side.quantity || 1), 0);
      const totalSelectedDrinks = selectedDrinks.reduce((sum, drink) => sum + (drink.quantity || 1), 0);

      if (requiredSides > 0 && totalSelectedSides !== requiredSides) {
        alert(`Please select ${requiredSides} side${requiredSides > 1 ? 's' : ''}`);
        return;
      }

      if (requiredDrinks > 0 && totalSelectedDrinks !== requiredDrinks) {
        alert(`Please select ${requiredDrinks} drink${requiredDrinks > 1 ? 's' : ''}`);
        return;
      }
    }

    const pricing = item.sizePricing[selectedSize];
    const price = isMealDeal ? pricing.mealDealPrice : pricing.basePrice;

    const cartItem = {
      id: `${item.id}-${selectedSize}-${isMealDeal ? 'meal' : 'normal'}-${Date.now()}`,
      type: 'comboStyleItem',
      itemId: item.id,
      name: item.name,
      size: selectedSize,
      sauce: selectedSauce || "No sauce", // Use "No sauce" if no sauce selected/available
      price: parseFloat(price),
      quantity: quantity,
      isMealDeal: isMealDeal,
      selectedSides: selectedSides, // Store the full objects with quantities
      selectedDrinks: selectedDrinks, // Store the full objects with quantities
      // Keep backwards compatibility with details for display
      sidesDetails: selectedSides,
      drinksDetails: selectedDrinks,
      image: item.imageUrl || 'default-combo.png'
    };

    console.log('🔧 Adding to cart:', cartItem);
    dispatch(addToCart(cartItem));
    
    // Navigate to cart after adding
    setTimeout(() => {
      router.push("/cart");
    }, 100);
  };

  if (loading) {
    return (
      <WellFoodLayout>
        <PizzaLoader forceDuration={4000} />
      </WellFoodLayout>
    );
  }

  if (error || !item) {
    return (
      <WellFoodLayout>
        <div className="container">
          <div className="text-center py-5">
            <h2 className="mb-4">{error || "Item not found"}</h2>
            <Link href="/combo-style-menu">
              <button className="theme-btn">Back to Menu</button>
            </Link>
          </div>
        </div>
      </WellFoodLayout>
    );
  }

  const pricing = item.sizePricing?.[selectedSize];
  if (!pricing) {
    return (
      <WellFoodLayout>
        <div className="container">
          <div className="text-center py-5">
            <h2 className="mb-4">Invalid size selection</h2>
            <Link href="/combo-style-menu">
              <button className="theme-btn">Back to Menu</button>
            </Link>
          </div>
        </div>
      </WellFoodLayout>
    );
  }

  const price = isMealDeal ? pricing.mealDealPrice : pricing.basePrice;
  const mealDealInfo = item?.mealDealConfig?.[selectedSize];
  const requiredSides = mealDealInfo?.sides?.count || 0;
  const requiredDrinks = mealDealInfo?.drinks?.count || 0;

  return (
    <WellFoodLayout>
      <div className="product-details-area" style={{ 
        paddingTop: isMobile ? "60px" : "120px", 
        paddingBottom: "85px" 
      }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="product-details-images mb-30">
                <img
                  src={`${API_URL}/images/${item.imageUrl || 'default-combo.png'}`}
                  alt={item.name}
                  style={{
                    width: isMobile ? "60%" : "100%",
                    height: "auto",
                    objectFit: "contain",
                    borderRadius: "15px",
                    display: "block",
                    margin: "0 auto"
                  }}
                  onError={(e) => {
                    e.target.src = `${API_URL}/images/default-combo.png`;
                  }}
                />
              </div>
            </div>

            <div className="col-lg-6">
              <div className="product-details-content">
                <h1 style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "20px" }}>
                  {item.name}
                </h1>
                
                <div style={{ 
                  background: "#fff5f2", 
                  padding: "20px", 
                  borderRadius: "12px",
                  border: "1px solid #ff6b35",
                  marginBottom: "30px"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h3 style={{ fontSize: "1.5rem", fontWeight: "600", textTransform: "capitalize" }}>
                        {selectedSize === "wings" ? "8 Wings" : selectedSize}
                      </h3>
                      {isMealDeal && (
                        <p style={{ color: "#ff6b35", fontWeight: "600", margin: "5px 0" }}>
                          🌟 Meal Deal - with {requiredSides} side{requiredSides > 1 ? 's' : ''} and {requiredDrinks} drink{requiredDrinks > 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "2rem", fontWeight: "700", color: "#ff6b35" }}>
                        £{parseFloat(price).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: "1.1rem", color: "#666", marginBottom: "30px" }}>
                  {item.description}
                </p>

                {/* Sauce Selection - Only show if sauces are available */}
                {item.availableSauces && item.availableSauces.length > 0 && (
                  <div style={{ marginBottom: "30px" }}>
                    <h4 style={{ fontSize: "1.3rem", fontWeight: "600", marginBottom: "15px" }}>
                      Choose Your Sauce (No Extra Charge):
                    </h4>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "10px" }}>
                      {item.availableSauces?.map((sauce, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedSauce(sauce)}
                          style={{
                            padding: "12px 16px",
                            borderRadius: "8px",
                            border: selectedSauce === sauce ? "2px solid #ff6b35" : "2px solid #f0f0f0",
                            background: selectedSauce === sauce ? "#fff5f2" : "#fff",
                            color: selectedSauce === sauce ? "#ff6b35" : "#333",
                            fontWeight: selectedSauce === sauce ? "600" : "400",
                            cursor: "pointer",
                            transition: "all 0.3s ease"
                          }}
                        >
                          {sauce}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Meal Deal Selections */}
                {isMealDeal && (
                  <>
                    {/* Sides Selection */}
                    {requiredSides > 0 && (
                      <div style={{ marginBottom: "30px" }}>
                        <h4 style={{ fontSize: "1.3rem", fontWeight: "600", marginBottom: "15px" }}>
                          Choose {requiredSides} Side{requiredSides > 1 ? 's' : ''}:
                        </h4>
                        {availableSides.length > 0 ? (
                          <>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px" }}>
                              {availableSides.map((side) => {
                                const selectedSide = selectedSides.find(s => s.id === side.id);
                                const quantity = selectedSide?.quantity || 0;
                                const isSelected = quantity > 0;
                                
                                return (
                                  <button
                                    key={side.id}
                                    onClick={() => handleSideSelection(side)}
                                    style={{
                                      padding: "12px 16px",
                                      borderRadius: "8px",
                                      border: isSelected ? "2px solid #ff6b35" : "2px solid #f0f0f0",
                                      background: isSelected ? "#fff5f2" : "#fff",
                                      color: isSelected ? "#ff6b35" : "#333",
                                      fontWeight: isSelected ? "600" : "400",
                                      cursor: "pointer",
                                      transition: "all 0.3s ease",
                                      textAlign: "left",
                                      position: "relative"
                                    }}
                                  >
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                      <div>
                                        <div>{side.name}</div>
                                      </div>
                                      {isSelected && (
                                        <div style={{
                                          background: "#ff6b35",
                                          color: "white",
                                          borderRadius: "50%",
                                          width: "24px",
                                          height: "24px",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          fontSize: "14px",
                                          fontWeight: "bold"
                                        }}>
                                          {quantity > 1 ? quantity : "+"}
                                        </div>
                                      )}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                            <small style={{ color: "#666", marginTop: "10px", display: "block" }}>
                              Selected: {selectedSides.reduce((sum, side) => sum + (side.quantity || 1), 0)} / {requiredSides}
                            </small>
                          </>
                        ) : (
                          <div style={{ 
                            padding: "20px", 
                            background: "#f8f9fa", 
                            borderRadius: "8px", 
                            textAlign: "center",
                            color: "#666"
                          }}>
                            No sides available for this item
                          </div>
                        )}
                      </div>
                    )}

                    {/* Drinks Selection */}
                    {requiredDrinks > 0 && (
                      <div style={{ marginBottom: "30px" }}>
                        <h4 style={{ fontSize: "1.3rem", fontWeight: "600", marginBottom: "15px" }}>
                          Choose {requiredDrinks} Drink{requiredDrinks > 1 ? 's' : ''}:
                        </h4>
                        {availableDrinks.length > 0 ? (
                          <>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px" }}>
                              {availableDrinks.map((drink) => {
                                const selectedDrink = selectedDrinks.find(d => d.id === drink.id);
                                const quantity = selectedDrink?.quantity || 0;
                                const isSelected = quantity > 0;
                                
                                return (
                                  <button
                                    key={drink.id}
                                    onClick={() => handleDrinkSelection(drink)}
                                    style={{
                                      padding: "12px 16px",
                                      borderRadius: "8px",
                                      border: isSelected ? "2px solid #ff6b35" : "2px solid #f0f0f0",
                                      background: isSelected ? "#fff5f2" : "#fff",
                                      color: isSelected ? "#ff6b35" : "#333",
                                      fontWeight: isSelected ? "600" : "400",
                                      cursor: "pointer",
                                      transition: "all 0.3s ease",
                                      textAlign: "left",
                                      position: "relative"
                                    }}
                                  >
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                      <div>
                                        <div>{drink.name}</div>
                                      </div>
                                      {isSelected && (
                                        <div style={{
                                          background: "#ff6b35",
                                          color: "white",
                                          borderRadius: "50%",
                                          width: "24px",
                                          height: "24px",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          fontSize: "14px",
                                          fontWeight: "bold"
                                        }}>
                                          {quantity > 1 ? quantity : "+"}
                                        </div>
                                      )}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                            <small style={{ color: "#666", marginTop: "10px", display: "block" }}>
                              Selected: {selectedDrinks.reduce((sum, drink) => sum + (drink.quantity || 1), 0)} / {requiredDrinks}
                            </small>
                          </>
                        ) : (
                          <div style={{ 
                            padding: "20px", 
                            background: "#f8f9fa", 
                            borderRadius: "8px", 
                            textAlign: "center",
                            color: "#666"
                          }}>
                            No drinks available for this item
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>
      
      <FixedBtn 
        price={parseFloat(price) * quantity}
        quantity={quantity}
        setQuantity={setQuantity}
        onAddToCart={handleAddToCart}
        name="Add to Cart"
        link="/cart"
      />
    </WellFoodLayout>
  );
};

export default ComboStyleDetails;