"use client";
import FixedBtn from "@/components/custom/FixedBtn";
import WellFoodLayout from "@/layout/WellFoodLayout";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { addItem } from "../../features/cart/cartSlice.js";
import React, { useEffect, useState } from "react";
import { API_URL } from "@/services/config";
import PizzaLoader from "@/components/pizzaLoader";

const PeriPeriDetailsPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const itemId = searchParams.get("id");
  const isMealDeal = searchParams.get("mealDeal") === "true";

  const [item, setItem] = useState(null);
  const [availableSides, setAvailableSides] = useState([]);
  const [availableDrinks, setAvailableDrinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form state
  const [selectedSauce, setSelectedSauce] = useState("");
  const [selectedSides, setSelectedSides] = useState([]);
  const [selectedDrinks, setSelectedDrinks] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (itemId) {
      fetchItemDetails();
      if (isMealDeal) {
        fetchSidesAndDrinks();
      }
    }
  }, [itemId, isMealDeal]);

  useEffect(() => {
    if (item) {
      const basePrice = isMealDeal ? item.mealDealPrice : item.basePrice;
      setTotalPrice(Number(basePrice) * quantity);
    }
  }, [quantity, item, isMealDeal]);

  const fetchItemDetails = async () => {
    try {
      const response = await fetch(`${API_URL}/getPeriPeriItem/${itemId}`);
      const data = await response.json();

      if (!response.ok) {
        setError("Item not found");
        return;
      }

      setItem(data);
      
      // Set default sauce
      if (data.availableSauces) {
        try {
          const sauces = JSON.parse(data.availableSauces);
          if (sauces.length > 0) {
            setSelectedSauce(sauces[0]);
          }
        } catch (error) {
          console.error("Error parsing available sauces:", error);
        }
      }
    } catch (error) {
      console.error("Error fetching item:", error);
      setError("Failed to load item details. Please try again later.");
    }
  };

  const fetchSidesAndDrinks = async () => {
    try {
      const [sidesResponse, drinksResponse] = await Promise.all([
        fetch(`${API_URL}/getAvailableSides`),
        fetch(`${API_URL}/getAvailableDrinks`)
      ]);

      const sides = await sidesResponse.json();
      const drinks = await drinksResponse.json();

      setAvailableSides(sides);
      setAvailableDrinks(drinks);
    } catch (error) {
      console.error("Error fetching sides and drinks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isMealDeal) {
      setLoading(false);
    }
  }, [isMealDeal]);

  const handleSideSelection = (side) => {
    const maxSides = item?.sideCount || 0;
    if (selectedSides.includes(side.id)) {
      setSelectedSides(selectedSides.filter(id => id !== side.id));
    } else if (selectedSides.length < maxSides) {
      setSelectedSides([...selectedSides, side.id]);
    }
  };

  const handleDrinkSelection = (drink) => {
    const maxDrinks = item?.drinkCount || 0;
    if (selectedDrinks.includes(drink.id)) {
      setSelectedDrinks(selectedDrinks.filter(id => id !== drink.id));
    } else if (selectedDrinks.length < maxDrinks) {
      setSelectedDrinks([...selectedDrinks, drink.id]);
    }
  };

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

  const handleAddToCart = (e) => {
    e.preventDefault();
    
    if (!selectedSauce) {
      alert("Please select a sauce for your Peri Peri chicken.");
      return;
    }

    if (isMealDeal) {
      const requiredSides = item?.sideCount || 0;
      const requiredDrinks = item?.drinkCount || 0;
      
      if (selectedSides.length !== requiredSides) {
        alert(`Please select ${requiredSides} side${requiredSides > 1 ? 's' : ''} for your meal deal.`);
        return;
      }
      
      if (selectedDrinks.length !== requiredDrinks) {
        alert(`Please select ${requiredDrinks} drink${requiredDrinks > 1 ? 's' : ''} for your meal deal.`);
        return;
      }
    }

    const selectedSideItems = availableSides.filter(side => selectedSides.includes(side.id));
    const selectedDrinkItems = availableDrinks.filter(drink => selectedDrinks.includes(drink.id));

    dispatch(
      addItem({
        id: `${itemId}-${isMealDeal ? 'meal' : 'solo'}-${selectedSauce}`,
        title: item.name + (isMealDeal ? " (Meal Deal)" : ""),
        img: item.imageUrl,
        price: Number(totalPrice),
        eachprice: isMealDeal ? Number(item.mealDealPrice) : Number(item.basePrice),
        quantity: Number(quantity),
        isPeriPeri: true,
        periPeriId: itemId,
        size: item.itemType,
        basePrice: isMealDeal ? Number(item.mealDealPrice) : Number(item.basePrice),
        finalPrice: Number(totalPrice),
        sauce: selectedSauce,
        isMealDeal: isMealDeal,
        selectedSides: isMealDeal ? JSON.stringify(selectedSideItems) : null,
        selectedDrinks: isMealDeal ? JSON.stringify(selectedDrinkItems) : null,
      })
    );

    router.push('/cart');
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
            <Link href="/peri-peri-menu">
              <button className="theme-btn">Back to Peri Peri Menu</button>
            </Link>
          </div>
        </div>
      </WellFoodLayout>
    );
  }

  let availableSauces = [];
  if (item.availableSauces) {
    try {
      availableSauces = JSON.parse(item.availableSauces);
    } catch (error) {
      console.error("Error parsing available sauces:", error);
    }
  }

  return (
    <WellFoodLayout>
      <div className="product-details-area pt-120 rpt-100 pb-85 rpb-65">
        <div className="container">
          <div className="row align-items-start">
            <div className="col-lg-6">
              <div className="product-details-image rmb-55">
                <img
                  src={`${API_URL}/images/peri-${item.itemType}.png`}
                  alt={item?.name}
                  onError={(e) => {
                    e.target.src = `${API_URL}/images/dummy.png`;
                  }}
                />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="product-details-content">
                <h2>{item?.name}</h2>
                <p className="price">
                  £{isMealDeal ? item?.mealDealPrice : item?.basePrice}
                  {isMealDeal && (
                    <span style={{ fontSize: "0.8rem", color: "#ff6b35", display: "block" }}>
                      🌟 Meal Deal includes {item.sideCount} side{item.sideCount > 1 ? 's' : ''} & {item.drinkCount} drink{item.drinkCount > 1 ? 's' : ''}
                    </span>
                  )}
                </p>
                <p>{item?.description}</p>

                {/* Sauce Selection */}
                {availableSauces.length > 0 && (
                  <div style={{ marginBottom: "25px" }}>
                    <h5 style={{ 
                      margin: "0 0 15px 0", 
                      fontSize: "1.2rem", 
                      fontWeight: "600",
                      color: "#333"
                    }}>
                      Choose Your Sauce
                    </h5>
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                      gap: "10px"
                    }}>
                      {availableSauces.map((sauce) => (
                        <label
                          key={sauce}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "10px 15px",
                            border: `2px solid ${selectedSauce === sauce ? "#ff6b35" : "#eee"}`,
                            borderRadius: "8px",
                            cursor: "pointer",
                            backgroundColor: selectedSauce === sauce ? "#fff5f2" : "#fff",
                            transition: "all 0.3s ease",
                            fontSize: "0.95rem",
                            fontWeight: selectedSauce === sauce ? "600" : "400",
                            color: selectedSauce === sauce ? "#ff6b35" : "#333"
                          }}
                        >
                          <input
                            type="radio"
                            name="sauce"
                            value={sauce}
                            checked={selectedSauce === sauce}
                            onChange={(e) => setSelectedSauce(e.target.value)}
                            style={{ 
                              marginRight: "8px",
                              accentColor: "#ff6b35"
                            }}
                          />
                          {sauce}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sides Selection - Only for meal deals */}
                {isMealDeal && availableSides.length > 0 && (
                  <div style={{ marginBottom: "25px" }}>
                    <h5 style={{ 
                      margin: "0 0 15px 0", 
                      fontSize: "1.2rem", 
                      fontWeight: "600",
                      color: "#333"
                    }}>
                      Choose Your Side{item.sideCount > 1 ? 's' : ''} ({selectedSides.length}/{item.sideCount})
                    </h5>
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                      gap: "10px"
                    }}>
                      {availableSides.map((side) => (
                        <div
                          key={side.id}
                          onClick={() => handleSideSelection(side)}
                          style={{
                            padding: "10px",
                            border: `2px solid ${selectedSides.includes(side.id) ? "#ff6b35" : "#eee"}`,
                            borderRadius: "8px",
                            cursor: selectedSides.length >= item.sideCount && !selectedSides.includes(side.id) ? "not-allowed" : "pointer",
                            backgroundColor: selectedSides.includes(side.id) ? "#fff5f2" : "#fff",
                            textAlign: "center",
                            fontSize: "0.9rem",
                            opacity: selectedSides.length >= item.sideCount && !selectedSides.includes(side.id) ? 0.5 : 1
                          }}
                        >
                          {side.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Drinks Selection - Only for meal deals */}
                {isMealDeal && availableDrinks.length > 0 && (
                  <div style={{ marginBottom: "25px" }}>
                    <h5 style={{ 
                      margin: "0 0 15px 0", 
                      fontSize: "1.2rem", 
                      fontWeight: "600",
                      color: "#333"
                    }}>
                      Choose Your Drink{item.drinkCount > 1 ? 's' : ''} ({selectedDrinks.length}/{item.drinkCount})
                    </h5>
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                      gap: "10px"
                    }}>
                      {availableDrinks.map((drink) => (
                        <div
                          key={drink.id}
                          onClick={() => handleDrinkSelection(drink)}
                          style={{
                            padding: "10px",
                            border: `2px solid ${selectedDrinks.includes(drink.id) ? "#ff6b35" : "#eee"}`,
                            borderRadius: "8px",
                            cursor: selectedDrinks.length >= item.drinkCount && !selectedDrinks.includes(drink.id) ? "not-allowed" : "pointer",
                            backgroundColor: selectedDrinks.includes(drink.id) ? "#fff5f2" : "#fff",
                            textAlign: "center",
                            fontSize: "0.9rem",
                            opacity: selectedDrinks.length >= item.drinkCount && !selectedDrinks.includes(drink.id) ? 0.5 : 1
                          }}
                        >
                          {drink.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Controls */}
                <form className="add-to-cart mb-4">
                  <div className="quantity-controls">
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "15px",
                      marginBottom: "20px",
                    }}>
                      <h5 style={{
                        margin: "0",
                        fontSize: "1.2rem",
                        fontWeight: "600",
                      }}>
                        Quantity
                      </h5>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        border: "2px solid #eee",
                        borderRadius: "8px",
                        overflow: "hidden",
                      }}>
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
                        <span style={{
                          width: "40px",
                          textAlign: "center",
                          fontSize: "1.1rem",
                          fontWeight: "600",
                        }}>
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

                  {/* Add to Cart Button */}
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
                    }}
                  >
                    Add to Cart
                    <i className="far fa-arrow-alt-right" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FixedBtn
        price={totalPrice}
        onAddToCart={handleAddToCart}
        name="Add To Cart"
        link="/cart"
      />
    </WellFoodLayout>
  );
};

export default PeriPeriDetailsPage;
