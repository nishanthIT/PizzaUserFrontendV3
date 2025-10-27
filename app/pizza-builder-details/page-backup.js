"use client";
import FixedBtn from "@/components/custom/FixedBtn";
import WellFoodLayout from "@/layout/WellFoodLayout";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState, Suspense } from "react";
import { API_URL } from "@/services/config";
import PizzaLoader from "@/components/pizzaLoader";
import { useDispatch } from "react-redux";
import { addToCart } from "@/features/cart/cartSlice";
import Counter from "@/components/Counter";
import axios from "axios";

const PizzaBuilderDetailsContent = () => {
  const [deal, setDeal] = useState(null);
  const [selectedBase, setSelectedBase] = useState(null);
  const [selectedSauce, setSelectedSauce] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const dealId = searchParams.get("id");
  const fromMenu = searchParams.get("fromMenu");

  useEffect(() => {
    if (!dealId) {
      setError("Invalid deal ID");
      setLoading(false);
      return;
    }

    fetchDealDetails();
  }, [dealId]);

  const fetchDealDetails = async () => {
    try {
      setLoading(true);
      const allowInactive = fromMenu === 'true';
      const url = `${API_URL}/getPizzaBuilderDeal/${dealId}${allowInactive ? '?allowInactive=true' : ''}`;
      
      console.log("🔍 Fetching deal from:", url);
      const response = await axios.get(url);
      console.log("🔍 Deal response:", response.data);
      
      if (response.data) {
        setDeal(response.data);
        
        // Auto-select first base, sauce, and size if only one option available
        if (response.data.availableBases?.length === 1) {
          setSelectedBase(response.data.availableBases[0]);
        }
        if (response.data.availableSauces?.length === 1) {
          setSelectedSauce(response.data.availableSauces[0]);
        }
        if (response.data.availableSizes?.length === 1) {
          setSelectedSize(response.data.availableSizes[0]);
        }
      } else {
        setError("No deal data received");
      }
    } catch (error) {
      console.error("Error fetching pizza builder deal:", error);
      if (error.response?.status === 404) {
        setError("Deal not found. Please check the deal ID.");
      } else if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        setError("Unable to connect to server. Please check if the backend is running.");
      } else {
        setError("Failed to load deal. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBaseSelect = (base) => {
    setSelectedBase(base);
  };

  const handleSauceSelect = (sauce) => {
    setSelectedSauce(sauce);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleToppingToggle = (topping) => {
    setSelectedToppings(prev => {
      const exists = prev.find(t => t.id === topping.id);
      if (exists) {
        return prev.filter(t => t.id !== topping.id);
      } else {
        // Check if max toppings reached
        if (prev.length >= deal.maxToppings) {
          alert(`You can select maximum ${deal.maxToppings} toppings`);
          return prev;
        }
        return [...prev, topping];
      }
    });
  };

  const calculatePrice = () => {
    if (!selectedSize || !deal) return 0;
    
    // Use individual price fields instead of JSON sizePricing
    let basePrice = 0;
    
    switch (selectedSize.toLowerCase()) {
      case 'medium':
        basePrice = Number(deal.mediumPrice) || 0;
        break;
      case 'large':
        basePrice = Number(deal.largePrice) || 0;
        break;
      case 'super':
      case 'supersize':
      case 'super size':
      case 'super-size':
      case 'super_size':
        basePrice = Number(deal.superSizePrice) || 0;
        break;
      default:
        // Fallback: try to match by size name in deal.availableSizes or use medium as default
        // Attempt case-insensitive match for known labels
        const lower = selectedSize.toLowerCase();
        if (lower.includes('super')) {
          basePrice = Number(deal.superSizePrice) || Number(deal.largePrice) || Number(deal.mediumPrice) || 0;
        } else if (lower.includes('large')) {
          basePrice = Number(deal.largePrice) || Number(deal.mediumPrice) || 0;
        } else {
          basePrice = Number(deal.mediumPrice) || Number(deal.largePrice) || 0;
        }
    }
    
    // Add topping costs
    const toppingCost = selectedToppings.reduce((total, topping) => {
      return total + (Number(topping.additionalToppingCost) || 0);
    }, 0);
    
    return (basePrice + toppingCost) * quantity;
  };

  // Helper function to get price for display in size selection
  const getSizePrice = (size) => {
    if (!deal) return 0;
    
    switch (size.toLowerCase()) {
      case 'medium':
        return Number(deal.mediumPrice) || 0;
      case 'large':
        return Number(deal.largePrice) || 0;
      case 'super':
      case 'supersize':
      case 'super size':
      case 'super-size':
      case 'super_size':
        return Number(deal.superSizePrice) || 0;
      default:
        // Fallback: try to match by size name
        const lower = size.toLowerCase();
        if (lower.includes('super')) {
          return Number(deal.superSizePrice) || Number(deal.largePrice) || Number(deal.mediumPrice) || 0;
        } else if (lower.includes('large')) {
          return Number(deal.largePrice) || Number(deal.mediumPrice) || 0;
        } else {
          return Number(deal.mediumPrice) || Number(deal.largePrice) || 0;
        }
    }
  };

  // Safe data access helpers
  const getAvailableBases = () => deal?.availableBases || ['Thin Crust', 'Deep Pan', 'Stuffed Crust'];
  const getAvailableSauces = () => deal?.availableSauces || ['Tomato Sauce', 'BBQ Sauce', 'White Sauce'];
  const getAvailableSizes = () => deal?.availableSizes || ['MEDIUM', 'LARGE', 'SUPER_SIZE'];
  const getAvailableToppings = () => deal?.availableToppings || [];
  const getMaxToppings = () => deal?.maxToppings || 4;

  const canAddToCart = () => {
    return selectedBase && selectedSauce && selectedSize && selectedToppings.length > 0;
  };

  const handleAddToCart = async () => {
    if (!canAddToCart()) {
      alert("Please select base, sauce, size, and at least one topping");
      return;
    }

    setIsAddingToCart(true);
    
    try {
      const cartItem = {
        pizzaBuilderDealId: deal.id,
        selectedBase: selectedBase,
        selectedSauce: selectedSauce,
        selectedSize: selectedSize,
        selectedToppings: selectedToppings.map(t => ({
          id: t.id,
          name: t.name
        })),
        size: selectedSize,
        quantity: quantity,
        basePrice: calculatePrice() / quantity,
        finalPrice: calculatePrice(),
        name: deal.name,
        description: `${selectedBase} • ${selectedSauce} • ${selectedSize} • ${selectedToppings.map(t => t.name).join(', ')}`
      };

      await dispatch(addToCart(cartItem)).unwrap();
      router.push("/cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add to cart. Please try again.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <WellFoodLayout>
        <PizzaLoader />
      </WellFoodLayout>
    );
  }

  if (error || !deal) {
    return (
      <WellFoodLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
            <p className="mb-4">{error || "Deal not found"}</p>
            <Link href="/" className="btn btn-primary">
              Return to Home
            </Link>
          </div>
        </div>
      </WellFoodLayout>
    );
  }

  return (
    <WellFoodLayout>
      <section className="product-details pb-10" style={{ paddingTop: "130px" }}>
        <div className="container">
          <div className="row">
            {/* Image Section */}
            <div className="col-lg-6">
              <div className="product-details-image rmb-55" data-aos="fade-left" data-aos-duration={1500} data-aos-offset={50}>
                <div className="product-image-wrapper" style={{ display: "flex", justifyContent: "center" }}>
                  <img
                    className="product-image"
                    src="/assets/pizza-default.png"
                    alt="Custom Pizza"
                    style={{
                      width: "40%",
                      height: "auto",
                      objectFit: "contain",
                      borderRadius: "12px",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="col-lg-6">
              <div className="product-details-content" data-aos="fade-right" data-aos-duration={1500} data-aos-offset={50}>
                <div className="section-title">
                  <h2 className="mb-4" style={{ fontSize: "2.5rem", fontWeight: "700", color: "#333" }}>
                    {deal?.name || "Custom Pizza Builder"}
                  </h2>
                  
                  <div className="alert alert-info mb-3" style={{
                    backgroundColor: "#e7f3ff",
                    border: "1px solid #b6d7ff",
                    borderRadius: "8px",
                    padding: "12px",
                    fontSize: "1rem",
                    color: "#0066cc"
                  }}>
                    <strong>🍕 Pizza Builder:</strong> Build your perfect pizza with custom size, base, sauce and up to {getMaxToppings()} toppings!
                  </div>
                  
                  <p className="mb-4" style={{ fontSize: "1.2rem", color: "#666" }}>
                    {deal?.description || "Create your perfect pizza with our pizza builder. Choose your size, base, sauce and toppings."}
                  </p>

                  {/* Pizza Base Selection */}
                  <div className="base-container mb-4">
                    <h5 className="mb-3" style={{ fontSize: "1.2rem", fontWeight: "600" }}>
                      Pizza Base
                    </h5>
                    <div className="base-options" style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                      {getAvailableBases().map((base) => (
                        <label
                          key={base}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "10px 15px",
                            borderRadius: "8px",
                            border: "2px solid",
                            borderColor: selectedBase === base ? "#ff6b35" : "#ddd",
                            backgroundColor: selectedBase === base ? "#fff4f0" : "#fff",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                          }}
                        >
                          <input
                            type="radio"
                            name="pizzaBase"
                            value={base}
                            checked={selectedBase === base}
                            onChange={() => setSelectedBase(base)}
                            style={{ display: "none" }}
                          />
                          <span style={{
                            fontWeight: selectedBase === base ? "600" : "400",
                            color: selectedBase === base ? "#ff6b35" : "#333"
                          }}>
                            {base}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Pizza Sauce Selection */}
                  <div className="sauce-container mb-4">
                    <h5 className="mb-3" style={{ fontSize: "1.2rem", fontWeight: "600" }}>
                      Pizza Sauce
                    </h5>
                    <div className="sauce-options" style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                      {getAvailableSauces().map((sauce) => (
                        <label
                          key={sauce}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "10px 15px",
                            borderRadius: "8px",
                            border: "2px solid",
                            borderColor: selectedSauce === sauce ? "#ff6b35" : "#ddd",
                            backgroundColor: selectedSauce === sauce ? "#fff4f0" : "#fff",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                          }}
                        >
                          <input
                            type="radio"
                            name="pizzaSauce"
                            value={sauce}
                            checked={selectedSauce === sauce}
                            onChange={() => setSelectedSauce(sauce)}
                            style={{ display: "none" }}
                          />
                          <span style={{
                            fontWeight: selectedSauce === sauce ? "600" : "400",
                            color: selectedSauce === sauce ? "#ff6b35" : "#333"
                          }}>
                            {sauce}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Size Selection */}
                  <div className="size-container mb-4">
                    <h5 className="mb-3" style={{ fontSize: "1.2rem", fontWeight: "600" }}>
                      Pizza Size
                    </h5>
                    <div className="size-options" style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                      {getAvailableSizes().map((size) => (
                        <label
                          key={size}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            padding: "15px",
                            borderRadius: "8px",
                            border: "2px solid",
                            borderColor: selectedSize === size ? "#ff6b35" : "#ddd",
                            backgroundColor: selectedSize === size ? "#fff4f0" : "#fff",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            minWidth: "120px"
                          }}
                        >
                          <input
                            type="radio"
                            name="pizzaSize"
                            value={size}
                            checked={selectedSize === size}
                            onChange={() => handleSizeSelect(size)}
                            style={{ display: "none" }}
                          />
                          <span style={{
                            fontWeight: selectedSize === size ? "600" : "400",
                            color: selectedSize === size ? "#ff6b35" : "#333",
                            marginBottom: "5px"
                          }}>
                            {size.replace('_', ' ')}
                          </span>
                          <span style={{
                            fontSize: "1.2rem",
                            fontWeight: "bold",
                            color: "#ff6b35"
                          }}>
                            £{getSizePrice(size).toFixed(2)}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Toppings Selection */}
                  <div className="toppings-container mb-4">
                    <h5 className="mb-3" style={{ fontSize: "1.2rem", fontWeight: "600" }}>
                      Choose Your Toppings
                    </h5>
                    <p style={{ color: "#666", marginBottom: "15px", fontSize: "0.9rem" }}>
                      Selected: <span style={{ fontWeight: "bold", color: "#ff6b35" }}>{selectedToppings.length}</span> / {getMaxToppings()}
                    </p>
                    <div className="toppings-grid" style={{ 
                      display: "grid", 
                      gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", 
                      gap: "10px" 
                    }}>
                      {getAvailableToppings().map((topping) => {
                        const isSelected = selectedToppings.find(t => t.id === topping.id);
                        return (
                          <div
                            key={topping.id}
                            onClick={() => handleToppingToggle(topping)}
                            style={{
                              border: isSelected ? "2px solid #ff6b35" : "2px solid #ddd",
                              borderRadius: "8px",
                              padding: "12px",
                              cursor: "pointer",
                              background: isSelected ? "#fff4f0" : "#fff",
                              transition: "all 0.3s ease",
                              textAlign: "center"
                            }}
                          >
                            <div style={{ fontWeight: "600", fontSize: "0.9rem", color: "#333", marginBottom: "5px" }}>
                              {topping.name}
                            </div>
                            <div style={{ fontSize: "0.8rem", color: "#ff6b35", fontWeight: "bold" }}>
                              +£{topping.additionalToppingCost ? topping.additionalToppingCost.toFixed(2) : '0.00'}
                            </div>
                            {isSelected && (
                              <div style={{ marginTop: "5px", color: "#ff6b35", fontSize: "1rem" }}>✓</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quantity and Add to Cart */}
                  <div className="quantity-cart-container" style={{ 
                    background: "linear-gradient(to right, #fff5f5, #fffaf0)", 
                    borderRadius: "10px", 
                    padding: "20px",
                    marginTop: "30px"
                  }}>
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <h5 style={{ fontSize: "1.3rem", fontWeight: "600", margin: 0 }}>Order Summary</h5>
                      <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#ff6b35" }}>
                        £{calculatePrice().toFixed(2)}
                      </div>
                    </div>
                    
                    <div className="quantity-selector mb-3" style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                      <span style={{ fontWeight: "600" }}>Quantity:</span>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          style={{
                            width: "35px",
                            height: "35px",
                            borderRadius: "50%",
                            border: "2px solid #ff6b35",
                            background: "#fff",
                            color: "#ff6b35",
                            fontSize: "1.2rem",
                            fontWeight: "bold",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          -
                        </button>
                        <span style={{ 
                          minWidth: "40px", 
                          textAlign: "center", 
                          fontSize: "1.2rem", 
                          fontWeight: "bold" 
                        }}>
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          style={{
                            width: "35px",
                            height: "35px",
                            borderRadius: "50%",
                            border: "2px solid #ff6b35",
                            background: "#ff6b35",
                            color: "#fff",
                            fontSize: "1.2rem",
                            fontWeight: "bold",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      disabled={!selectedSize || !selectedBase || !selectedSauce || isAddingToCart}
                      style={{
                        width: "100%",
                        padding: "15px",
                        backgroundColor: (!selectedSize || !selectedBase || !selectedSauce || isAddingToCart) ? "#ccc" : "#ff6b35",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "1.1rem",
                        fontWeight: "600",
                        cursor: (!selectedSize || !selectedBase || !selectedSauce || isAddingToCart) ? "not-allowed" : "pointer",
                        transition: "all 0.3s ease"
                      }}
                    >
                      {isAddingToCart ? "Adding..." : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </WellFoodLayout>
  );
};

const PizzaBuilderDetails = () => {
  return (
    <Suspense fallback={<PizzaLoader />}>
      <PizzaBuilderDetailsContent />
    </Suspense>
  );
};

export default PizzaBuilderDetails;
