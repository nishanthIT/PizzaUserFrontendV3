"use client";
import FixedBtn from "@/components/custom/FixedBtn";
import WellFoodLayout from "@/layout/WellFoodLayout";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { addItem } from "../../features/cart/cartSlice.js";
import React, { useEffect, useState, useRef, Suspense } from "react";
import axios from "axios";
import PizzaLoader from "@/components/pizzaLoader";

const PizzaBuilderDetailsContent = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const dealId = searchParams.get("id");
  const maxToppingsParam = parseInt(searchParams.get("maxToppings")) || 5;
  
  const [deal, setDeal] = useState(null);
  const [allToppings, setAllToppings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  // Pizza customization states - exactly like product-details
  const [size, setSize] = useState("Medium");
  const [toppings, setToppings] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [pizzaBase, setPizzaBase] = useState("Regular Crust");
  const [initialBasePrice, setInitialBasePrice] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [showExtraChargeWarning, setShowExtraChargeWarning] = useState(false);
  const [warningTopping, setWarningTopping] = useState(null);
  const [showToppingValidation, setShowToppingValidation] = useState(false);

  // Get total toppings count
  const getTotalToppingsCount = () => {
    return toppings.reduce((sum, topping) => sum + topping.quantity, 0);
  };

  // Check if adding more toppings would exceed max free toppings
  const wouldExceedMaxToppings = (currentCount = null) => {
    const totalCount = currentCount !== null ? currentCount : getTotalToppingsCount();
    return totalCount >= maxToppingsParam;
  };

  // Check for mobile screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      console.log("🍕 Fetching pizza builder data for dealId:", dealId);
      try {
        // Fetch deal data and all toppings
        console.log("🔄 Making API calls...");
        const [dealResponse, toppingsResponse] = await Promise.all([
          axios.get(`http://localhost:3003/api/pizza-builder-deals/${dealId}`),
          axios.get(`http://localhost:3003/api/getAllToppings`)
        ]);

        console.log("✅ Deal response:", dealResponse.data);
        console.log("✅ Toppings response:", toppingsResponse);
        console.log("✅ Toppings response data:", toppingsResponse.data);
        console.log("✅ Toppings response length:", toppingsResponse.data?.length);

        let dealData = null;
        if (dealResponse.data) {
          dealData = dealResponse.data;
          setDeal(dealData);
          console.log("✅ Deal set:", dealData.name);
          console.log("✅ Available toppings for this deal:", dealData.toppingsData || dealData.availableToppings);
          
          // Set initial base price using medium price
          const mediumPrice = Number(dealData.mediumPrice) || 0;
          setInitialBasePrice(mediumPrice);
          setFinalPrice(mediumPrice);
        } else {
          console.error("❌ No deal data in response");
        }

        // Process toppings separately - check if toppings response has data
        const toppingsData = toppingsResponse.data || toppingsResponse || [];
        console.log("🔍 Actual toppings data:", toppingsData);
        
        if (toppingsData && Array.isArray(toppingsData) && toppingsData.length > 0 && dealData?.toppingsData) {
          // Use new toppingsData format {id: name} instead of availableToppings array
          const availableToppingsObj = dealData.toppingsData || dealData.availableToppings;
          const allToppingsData = toppingsData;
          
          console.log("🔄 Processing toppings...");
          console.log("Available toppings object:", availableToppingsObj);
          console.log("All toppings from API:", allToppingsData.length);
          
          // Handle both old array format and new {id: name} format for backward compatibility
          let toppingEntries = [];
          if (typeof availableToppingsObj === 'object' && !Array.isArray(availableToppingsObj)) {
            // New format: {id: name}
            toppingEntries = Object.entries(availableToppingsObj);
            console.log("✅ Using new {id: name} format");
          } else if (Array.isArray(availableToppingsObj)) {
            // Old format: [name1, name2]
            toppingEntries = availableToppingsObj.map(name => [null, name]);
            console.log("⚠️ Using legacy array format");
          }
          
          // Create toppings array from the entries
          const dealToppings = toppingEntries.map(([toppingId, toppingName]) => {
            // Find the topping data from API response
            const toppingData = allToppingsData.find(t => t.id === toppingId || t.name === toppingName);
            console.log(`🔍 Processing ${toppingName} (ID: ${toppingId}):`, toppingData ? `Found with price ${toppingData.additionalToppingCost}` : 'Not found in API');
            
            return {
              id: toppingData?.id || toppingId || toppingName, // Use actual ID, fallback to provided ID, then name
              name: toppingName,
              price: Number(toppingData?.additionalToppingCost) || 0,
              quantity: 0, // All toppings start at 0
              included: false,
            };
          });
          
          console.log("✅ Final deal toppings created:", dealToppings.length, dealToppings);
          setToppings(dealToppings);
          setAllToppings(dealToppings);
        } else {
          console.error("❌ Missing data for toppings processing:", {
            toppingsResponseExists: !!toppingsResponse,
            toppingsDataExists: !!toppingsData,
            toppingsDataIsArray: Array.isArray(toppingsData),
            toppingsDataLength: toppingsData?.length || 0,
            dealData: !!dealData,
            toppingsData: !!dealData?.toppingsData,
            availableToppings: !!dealData?.availableToppings, // Legacy fallback
          });
          
          // Fallback: create toppings without API pricing
          const fallbackToppingsSource = dealData?.toppingsData || dealData?.availableToppings;
          if (fallbackToppingsSource) {
            console.log("🔄 Creating fallback toppings without API pricing...");
            
            let fallbackToppings = [];
            if (typeof fallbackToppingsSource === 'object' && !Array.isArray(fallbackToppingsSource)) {
              // New format: {id: name}
              fallbackToppings = Object.entries(fallbackToppingsSource).map(([toppingId, toppingName]) => ({
                id: toppingId,
                name: toppingName,
                price: 1.0, // Default price
                quantity: 0,
                included: false,
              }));
            } else if (Array.isArray(fallbackToppingsSource)) {
              // Old format: [name1, name2]
              fallbackToppings = fallbackToppingsSource.map((toppingName, index) => ({
                id: `fallback-${index}`,
                name: toppingName,
                price: 1.0, // Default price
                quantity: 0,
                included: false,
              }));
            }
            
            console.log("✅ Fallback toppings created:", fallbackToppings.length);
            setToppings(fallbackToppings);
            setAllToppings(fallbackToppings);
          }
        }
      } catch (error) {
        console.error("❌ Error fetching data:", error);
        console.error("❌ Error details:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    if (dealId) {
      fetchData();
    }
  }, [dealId]);

  // Get size multiplier for dynamic topping pricing - same as product-details
  const getSizeMultiplier = () => {
    switch (size) {
      case "Large":
        return 1.5; // 50% extra
      case "Super Size":
        return 2; // 100% extra
      default:
        return 1; // Medium is base
    }
  };

  // Get current base price based on selected size
  const getCurrentBasePrice = () => {
    if (!deal) return 0;
    
    switch (size) {
      case "Large":
        return Number(deal.largePrice) || 0;
      case "Super Size":
        return Number(deal.superSizePrice) || 0;
      default:
        return Number(deal.mediumPrice) || 0;
    }
  };

  // Calculate price - same logic as product-details but with pizza builder pricing
  const getPrice = () => {
    if (!deal) return 0;

    const currentBasePrice = getCurrentBasePrice();
    const sizeMultiplier = getSizeMultiplier();
    
    // Calculate topping costs - Pizza Builder mode: charge for extras beyond maxToppingsParam
    let totalToppingCost = 0;
    const totalToppingUnits = toppings.reduce((sum, top) => sum + top.quantity, 0);
    const freeToppings = maxToppingsParam;
    const extraToppings = Math.max(0, totalToppingUnits - freeToppings);
    
    if (extraToppings > 0) {
      let extraUnitsRemaining = extraToppings;
      
      toppings.forEach((top) => {
        if (top.quantity > 0 && extraUnitsRemaining > 0) {
          const adjustedPrice = top.price * sizeMultiplier;
          const unitsToCharge = Math.min(top.quantity, extraUnitsRemaining);
          totalToppingCost += unitsToCharge * adjustedPrice;
          extraUnitsRemaining -= unitsToCharge;
        }
      });
    }

    // Add stuffed crust pricing if selected - same as product-details
    let calculatedPrice = currentBasePrice + totalToppingCost;
    if (pizzaBase.includes("Stuffed Crust")) {
      switch (size) {
        case "Large":
          calculatedPrice += 3;
          break;
        case "Super Size":
          calculatedPrice += 4;
          break;
        default:
          calculatedPrice += 2;
          break;
      }
    }

    return Number(calculatedPrice * quantity);
  };

  // Handle topping quantity changes with max topping logic
  const updatedToppingQuantity = (index, operation) => {
    const currentTotalCount = getTotalToppingsCount();
    const currentTopping = toppings[index];
    
    if (operation === "add") {
      // Check if this would exceed max free toppings
      if (currentTotalCount >= maxToppingsParam) {
        // Show warning popup about extra charges
        setWarningTopping({
          name: currentTopping.name,
          price: currentTopping.price,
          index: index
        });
        setShowExtraChargeWarning(true);
        return; // Don't add yet, wait for user confirmation
      }
    }
    
    // Proceed with normal quantity update
    setToppings((prevToppings) =>
      prevToppings.map((topping, idx) =>
        idx === index
          ? {
              ...topping,
              quantity:
                operation === "add"
                  ? Math.min(topping.quantity + 1, 5)
                  : Math.max(topping.quantity - 1, 0),
            }
          : topping
      )
    );
  };

  // Confirm adding extra topping with charge
  const confirmExtraTopping = () => {
    if (warningTopping) {
      setToppings((prevToppings) =>
        prevToppings.map((topping, idx) =>
          idx === warningTopping.index
            ? {
                ...topping,
                quantity: Math.min(topping.quantity + 1, 5),
              }
            : topping
        )
      );
    }
    setShowExtraChargeWarning(false);
    setWarningTopping(null);
  };

  // Cancel adding extra topping
  const cancelExtraTopping = () => {
    setShowExtraChargeWarning(false);
    setWarningTopping(null);
  };

  // Handle quantity changes - same as product-details
  const handleIncrease = (event) => {
    event.preventDefault();
    if (quantity < 10) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrease = (event) => {
    event.preventDefault();
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Handle add to cart - same structure as product-details
  const handleAddToCart = (e) => {
    e.preventDefault();
    
    // Check if at least one topping is selected
    const totalToppingsSelected = getTotalToppingsCount();
    if (totalToppingsSelected === 0) {
      setShowToppingValidation(true);
      return;
    }
    
    // **FIXED: Only send selected toppings with quantity > 0**
    const selectedToppings = toppings.filter(t => t.quantity > 0);
    
    console.log("🛒 DEBUG - All toppings:", toppings.length);
    console.log("🛒 DEBUG - All toppings with quantities:", toppings.map(t => `${t.name}: ${t.quantity}`));
    console.log("🛒 DEBUG - Selected toppings:", selectedToppings.length);
    console.log("🛒 DEBUG - Selected toppings details:", selectedToppings.map(t => `${t.name}: ${t.quantity}`));
    
    // **ADDITIONAL CHECK: Ensure we're only sending toppings with quantity > 0**
    const cleanSelectedToppings = selectedToppings.filter(t => t.quantity && t.quantity > 0);
    console.log("🛒 DEBUG - Clean selected toppings:", cleanSelectedToppings.length);
    
    const cartItem = {
      id: dealId,
      title: deal?.name || "Custom Pizza",
      img: null, // Pizza builder doesn't have specific images
      price: Number(getPrice()),
      eachprice: Number(getPrice() / quantity),
      ingredients: [], // No ingredients for pizza builder
      toppings: cleanSelectedToppings, // Only actually selected toppings
      quantity: Number(quantity),
      size: size,
      pizzaBase: pizzaBase,
      isPizzaBuilder: true,
      pizzaBuilderDealId: dealId, // Add explicit Pizza Builder deal ID
      maxToppings: maxToppingsParam,
    };
    
    console.log("🛒 Final cart item toppings count:", cartItem.toppings.length);
    console.log("🛒 Final cart item toppings:", cartItem.toppings.map(t => `${t.name}(${t.quantity})`));
    
    if (quantity > 0) {
      dispatch(addItem(cartItem));
      
      // Redirect to cart after successful add
      router.push('/cart');
    } else {
      console.error("Quantity must be greater than 0");
    }
  };

  if (loading) {
    console.log("🔄 Still loading...", { loading, deal: !!deal });
    return <PizzaLoader />;
  }

  if (!deal) {
    console.log("❌ No deal found, dealId:", dealId);
    return (
      <WellFoodLayout>
        <div className="container">
          <div className="text-center py-5">
            <h2>Pizza Builder not found</h2>
            <p>Deal ID: {dealId}</p>
            <p>Debug: Check browser console for API errors</p>
          </div>
        </div>
      </WellFoodLayout>
    );
  }

  return (
    <WellFoodLayout>
      <section className="product-details pb-10" style={{ 
        paddingTop: isMobile ? "80px" : "130px" 
      }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div
                className="product-details-image rmb-55"
                data-aos="fade-left"
                data-aos-duration={1500}
                data-aos-offset={50}
              >
                <div
                  className="product-image-wrapper"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <img
                    className="product-image"
                    src="/assets/pizza-default.png"
                    alt="Custom Pizza"
                    style={{
                      width: isMobile ? "50%" : "40%",
                      height: "auto",
                      objectFit: "contain",
                      borderRadius: "12px",
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div
                className="product-details-content"
                data-aos="fade-right"
                data-aos-duration={1500}
                data-aos-offset={50}
              >
                <div className="section-title">
                  <h2
                    className="mb-4"
                    style={{
                      fontSize: "2.5rem",
                      fontWeight: "700",
                      color: "#333",
                    }}
                  >
                    {deal.name}
                  </h2>
                  
                  <div className="alert alert-info mb-3" style={{
                    backgroundColor: "#e7f3ff",
                    border: "1px solid #b6d7ff",
                    borderRadius: "8px",
                    padding: "12px",
                    fontSize: "1rem",
                    color: "#0066cc"
                  }}>
                    <strong>🍕 Pizza Builder:</strong> Build your perfect pizza with custom size, base, and up to {maxToppingsParam} toppings!<br/>
                    {/* <small>Available toppings: {toppings.length} selected toppings for this pizza builder</small> */}
                  </div>
                  
                  <p
                    className="mb-4"
                    style={{ fontSize: "1.2rem", color: "#666" }}
                  >
                    {deal.description || "Create your perfect pizza with our pizza builder. Choose your size, base and toppings."}
                  </p>

                  {/* Pizza Base Selection - same as product-details */}
                  <div className="base-container mb-4">
                    <h5
                      className="mb-3"
                      style={{ fontSize: "1.2rem", fontWeight: "600" }}
                    >
                      Pizza Base
                    </h5>
                    <div
                      className="base-options responsive-base-options"
                      style={{
                        display: "flex",
                        gap: "15px",
                        flexWrap: "wrap",
                      }}
                    >
                      {["Regular Crust", "ThinCrust", (() => {
                        switch (size) {
                          case "Large":
                            return "Stuffed Crust +£3";
                          case "Super Size":
                            return "Stuffed Crust +£4";
                          default:
                            return "Stuffed Crust +£2";
                        }
                      })()].map((baseOption) => (
                        <label
                          key={baseOption}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "10px 15px",
                            borderRadius: "8px",
                            border: "2px solid",
                            borderColor: baseOption.includes("Stuffed Crust") 
                              ? (pizzaBase.includes("Stuffed Crust") ? "#ff6b35" : "#ddd") 
                              : (pizzaBase === baseOption ? "#ff6b35" : "#ddd"),
                            backgroundColor: baseOption.includes("Stuffed Crust") 
                              ? (pizzaBase.includes("Stuffed Crust") ? "#fff4f0" : "#fff") 
                              : (pizzaBase === baseOption ? "#fff4f0" : "#fff"),
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                          }}
                        >
                          <input
                            type="radio"
                            name="pizzaBase"
                            value={baseOption}
                            checked={baseOption.includes("Stuffed Crust") 
                              ? pizzaBase.includes("Stuffed Crust") 
                              : pizzaBase === baseOption}
                            onChange={() => setPizzaBase(baseOption)}
                            style={{
                              display: "none",
                            }}
                          />
                          <span
                            style={{
                              fontWeight: baseOption.includes("Stuffed Crust") 
                                ? (pizzaBase.includes("Stuffed Crust") ? "600" : "400") 
                                : (pizzaBase === baseOption ? "600" : "400"),
                              color: baseOption.includes("Stuffed Crust") 
                                ? (pizzaBase.includes("Stuffed Crust") ? "#ff6b35" : "#333") 
                                : (pizzaBase === baseOption ? "#ff6b35" : "#333"),
                            }}
                          >
                            {baseOption}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Size Selection - same as product-details */}
                  <div className="size-container mb-4">
                    <h5
                      className="mb-3"
                      style={{ fontSize: "1.2rem", fontWeight: "600" }}
                    >
                      Size Selection
                    </h5>
                    <div
                      className="size-options"
                      style={{ display: "flex", gap: "15px" }}
                    >
                      {["Medium", "Large", "Super Size"].map((sizeOption) => (
                        <label
                          key={sizeOption}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "10px 15px",
                            borderRadius: "8px",
                            border: "2px solid",
                            borderColor:
                              size === sizeOption ? "#ff6b35" : "#ddd",
                            backgroundColor:
                              size === sizeOption ? "#fff4f0" : "#fff",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                          }}
                        >
                          <input
                            type="radio"
                            name="size"
                            value={sizeOption}
                            checked={size === sizeOption}
                            onChange={() => setSize(sizeOption)}
                            style={{ marginRight: "8px" }}
                          />
                          <span
                            style={{
                              fontWeight: size === sizeOption ? "600" : "400",
                            }}
                          >
                            {sizeOption}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Display - same as product-details */}
                  <div className="price-container mb-4">
                    <h5 style={{ fontSize: "1.2rem", fontWeight: "600" }}>
                      Total Price
                    </h5>
                    <span
                      className="price"
                      style={{
                        fontSize: "2.2rem",
                        fontWeight: "700",
                        color: "#ff6b35",
                        display: "block",
                        marginTop: "5px",
                      }}
                    >
                      £{getPrice().toFixed(2)}
                    </span>
                  </div>

                  {/* Quantity Controls - same as product-details */}
                  <form className="add-to-cart mb-4">
                    <div className="quantity-controls">
                      <div
                        className="custom-quantity"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "15px",
                          marginBottom: "20px",
                        }}
                      >
                        <h5
                          style={{
                            margin: "0",
                            fontSize: "1.2rem",
                            fontWeight: "600",
                          }}
                        >
                          Quantity
                        </h5>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            border: "2px solid #eee",
                            borderRadius: "8px",
                            overflow: "hidden",
                          }}
                        >
                          <button
                            type="button"
                            style={{
                              width: "40px",
                              height: "40px",
                              border: "none",
                              background: "#f5f5f5",
                              fontSize: "1.2rem",
                              cursor: quantity <= 1 ? "not-allowed" : "pointer",
                              opacity: quantity <= 1 ? "0.5" : "1",
                            }}
                            disabled={quantity <= 1}
                            onClick={handleDecrease}
                          >
                            -
                          </button>
                          <span
                            style={{
                              width: "40px",
                              textAlign: "center",
                              fontSize: "1.1rem",
                              fontWeight: "600",
                            }}
                          >
                            {quantity}
                          </span>
                          <button
                            type="button"
                            style={{
                              width: "40px",
                              height: "40px",
                              border: "none",
                              background: "#f5f5f5",
                              fontSize: "1.2rem",
                              cursor: quantity >= 10 ? "not-allowed" : "pointer",
                              opacity: quantity >= 10 ? "0.5" : "1",
                            }}
                            disabled={quantity >= 10}
                            onClick={handleIncrease}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Add to Cart Button - same as product-details */}
                    <button
                      type="submit"
                      className="theme-btn"
                      onClick={handleAddToCart}
                      style={{
                        padding: "14px 30px",
                        fontSize: "1.1rem",
                        fontWeight: "600",
                        borderRadius: "8px",
                        background: "#ff6b35",
                        border: "none",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        transition: "all 0.3s ease",
                        boxShadow: "0 4px 10px rgba(255, 107, 53, 0.3)",
                        cursor: "pointer",
                      }}
                    >
                      Add to Cart
                      <i className="far fa-arrow-alt-right" />
                    </button>
                  </form>

                  {/* Toppings Section - show available toppings from pizza builder deal */}
                  <div className="toppings-section mb-4">
                    <h5
                      className="mb-3"
                      style={{
                        fontSize: "1.2rem",
                        fontWeight: "600",
                      }}
                    >
                      Available Toppings ({toppings?.length || 0})
                    </h5>
                    
                    {/* Debug info */}
                    {process.env.NODE_ENV === 'development' && (
                      <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '10px' }}>
                        Debug: Toppings loaded: {toppings?.length || 0} | Deal: {deal?.name || 'Loading...'}
                      </div>
                    )}
                    
                    {toppings && toppings.length > 0 ? (
                      <>
                        {/* Max Toppings Info */}
                        <div style={{ 
                          padding: '10px', 
                          backgroundColor: '#f0f8ff', 
                          border: '1px solid #b6d7ff',
                          borderRadius: '6px',
                          marginBottom: '15px',
                          fontSize: '0.9rem',
                          color: '#0066cc'
                        }}>
                          <strong>Free Toppings:</strong> {getTotalToppingsCount()}/{maxToppingsParam} used
                          {getTotalToppingsCount() >= maxToppingsParam && (
                            <span style={{ color: '#ff6b35', marginLeft: '10px' }}>
                              ⚠️ Extra toppings will be charged
                            </span>
                          )}
                        </div>

                        <ul
                          className="toppings-list"
                          style={{ listStyle: "none", padding: "0" }}
                        >
                          {toppings.map((topping, index) => {
                            const sizeMultiplier = getSizeMultiplier();
                            const adjustedPrice = topping.price * sizeMultiplier;
                            const currentTotalCount = getTotalToppingsCount();
                            // Only show price when at max limit or beyond
                            const showPrice = currentTotalCount >= maxToppingsParam;

                            return (
                              <li
                                key={`topping-${topping.id}-${index}`}
                                className="topping-item"
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  padding: "12px 15px",
                                  margin: "8px 0",
                                  borderRadius: "8px",
                                  backgroundColor: "#f9f9f9",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                                }}
                              >
                                <span style={{ fontWeight: "500" }}>
                                  {topping.name}
                                  {showPrice && (
                                    <span style={{ color: '#ff6b35', fontSize: '0.9rem' }}>
                                      {' '}- £{adjustedPrice.toFixed(1)}
                                    </span>
                                  )}
                                </span>
                                <div
                                  className="topping-controls"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      border: "1px solid #ddd",
                                      borderRadius: "6px",
                                      overflow: "hidden",
                                    }}
                                  >
                                    <button
                                      type="button"
                                      style={{
                                        width: "30px",
                                        height: "30px",
                                        border: "none",
                                        background: "#f0f0f0",
                                        cursor:
                                          topping.quantity <= 0
                                            ? "not-allowed"
                                            : "pointer",
                                        opacity: topping.quantity <= 0 ? "0.5" : "1",
                                      }}
                                      disabled={topping.quantity <= 0}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        updatedToppingQuantity(index, "subtract");
                                      }}
                                    >
                                      -
                                    </button>
                                    <span
                                      style={{
                                        width: "30px",
                                        textAlign: "center",
                                      }}
                                    >
                                      {topping.quantity}
                                    </span>
                                    <button
                                      type="button"
                                      style={{
                                        width: "30px",
                                        height: "30px",
                                        border: "none",
                                        background: "#f0f0f0",
                                        cursor:
                                          topping.quantity >= 5
                                            ? "not-allowed"
                                            : "pointer",
                                        opacity:
                                          topping.quantity >= 5
                                            ? "0.5"
                                            : "1",
                                      }}
                                      disabled={topping.quantity >= 5}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        updatedToppingQuantity(index, "add");
                                      }}
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </>
                    ) : (
                      <div style={{ 
                        padding: '20px', 
                        textAlign: 'center', 
                        backgroundColor: '#f8f9fa', 
                        borderRadius: '8px',
                        color: '#666'
                      }}>
                        {loading ? 'Loading toppings...' : 'No toppings available for this pizza builder'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fixed Button at bottom - same as product-details */}
      <FixedBtn
        price={getPrice()}
        onAddToCart={handleAddToCart}
        name={"Add To Cart"}
        link="/cart"
      />

      {/* Extra Charge Warning Popup */}
      {showExtraChargeWarning && warningTopping && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
          }}
          onClick={cancelExtraTopping}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '12px',
              maxWidth: '400px',
              width: '90%',
              textAlign: 'center',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: '2rem', marginBottom: '15px' }}>⚠️</div>
            <h3 style={{ marginBottom: '15px', color: '#333' }}>Extra Charge Alert</h3>
            <p style={{ marginBottom: '20px', color: '#666', lineHeight: '1.5' }}>
              You've reached your {maxToppingsParam} free toppings limit. 
              Adding <strong>{warningTopping.name}</strong> will cost an extra{' '}
              <strong style={{ color: '#ff6b35' }}>
                £{(warningTopping.price * getSizeMultiplier()).toFixed(2)}
              </strong>
            </p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button
                onClick={cancelExtraTopping}
                style={{
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: '2px solid #ddd',
                  backgroundColor: 'white',
                  color: '#666',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmExtraTopping}
                style={{
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#ff6b35',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  boxShadow: '0 4px 10px rgba(255, 107, 53, 0.3)',
                }}
              >
                Add Anyway
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Topping Selection Required Popup */}
      {showToppingValidation && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
          }}
          onClick={() => setShowToppingValidation(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '12px',
              maxWidth: '400px',
              width: '90%',
              textAlign: 'center',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: '2rem', marginBottom: '15px' }}>🍕</div>
            <h3 style={{ marginBottom: '15px', color: '#333' }}>Select Your Toppings</h3>
            <p style={{ marginBottom: '20px', color: '#666', lineHeight: '1.5' }}>
              Please select at least one topping for your pizza before adding to cart.
              You can choose up to <strong>{maxToppingsParam} free toppings</strong>!
            </p>
            <button
              onClick={() => setShowToppingValidation(false)}
              style={{
                padding: '12px 30px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#ff6b35',
                color: 'white',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                boxShadow: '0 4px 10px rgba(255, 107, 53, 0.3)',
              }}
            >
              Got It!
            </button>
          </div>
        </div>
      )}
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