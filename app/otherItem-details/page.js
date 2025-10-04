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

const page = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const itemId = searchParams.get("id");
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedSauce, setSelectedSauce] = useState("");
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
    const fetchItem = async () => {
      try {
        const response = await fetch(`${API_URL}/getOtherItemById/${itemId}`);
        const data = await response.json();

        if (!data || !data.id) {
          setError("Item not found");
          return;
        }

        setItem(data);
        setTotalPrice(Number(data.price));
        
        // If the item has available sauces, set the first one as default
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
      } finally {
        setLoading(false);
      }
    };

    if (itemId) {
      fetchItem();
    }
  }, [itemId]);

  // Update total price when quantity changes
  useEffect(() => {
    if (item) {
      setTotalPrice(Number(item.price) * quantity);
    }
  }, [quantity, item]);

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
    if (quantity > 0) {
      // Check if sauce is required and selected
      let availableSauces = [];
      if (item.availableSauces) {
        try {
          availableSauces = JSON.parse(item.availableSauces);
        } catch (error) {
          console.error("Error parsing available sauces:", error);
        }
      }
      
      if (availableSauces.length > 0 && !selectedSauce) {
        alert("Please select a sauce for this item.");
        return;
      }

      dispatch(
        addItem({
          id: itemId,
          title: item.name,
          img: item.imageUrl,
          price: Number(totalPrice),
          eachprice: Number(item.price),
          quantity: Number(quantity),
          isOtherItem: true,
          otherItemId: itemId,
          size: "regular",
          basePrice: Number(item.price),
          finalPrice: Number(totalPrice),
          sauce: selectedSauce || null, // Add sauce selection
        })
      );
    } else {
      console.error("Quantity must be greater than 0");
    }
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
            <Link href="/menu-pizza">
              <button
                className="theme-btn"
                style={{
                  padding: "14px 30px",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  borderRadius: "8px",
                  background: "#ff6b35",
                  border: "none",
                  color: "#fff",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 10px rgba(255, 107, 53, 0.3)",
                }}
              >
                Back to Menu
                <i className="far fa-arrow-alt-right" />
              </button>
            </Link>
          </div>
        </div>
      </WellFoodLayout>
    );
  }

  return (
    <WellFoodLayout>
      <div className="product-details-area" style={{ 
        paddingTop: isMobile ? "60px" : "120px", 
        paddingBottom: "85px" 
      }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="product-details-image rmb-55">
                <img
                  src={`${API_URL}/images/other-${item.id}.png`}
                  alt={item?.name}
                  style={{
                    width: isMobile ? "60%" : "100%",
                    height: "auto",
                    objectFit: "contain",
                    borderRadius: "15px",
                    display: "block",
                    margin: "0 auto"
                  }}
                />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="product-details-content">
                <h2>{item?.name}</h2>
                <p className="price">£ {item?.price}</p>
                <p>{item?.description}</p>

                {/* Sauce Selection */}
                {item?.availableSauces && (() => {
                  try {
                    const sauces = JSON.parse(item.availableSauces);
                    if (sauces.length > 0) {
                      return (
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
                            {sauces.map((sauce) => (
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
                                onMouseEnter={(e) => {
                                  if (selectedSauce !== sauce) {
                                    e.target.style.borderColor = "#ff6b35";
                                    e.target.style.backgroundColor = "#fff5f2";
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (selectedSauce !== sauce) {
                                    e.target.style.borderColor = "#eee";
                                    e.target.style.backgroundColor = "#fff";
                                  }
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
                          <p style={{
                            fontSize: "0.85rem",
                            color: "#666",
                            margin: "8px 0 0 0",
                            fontStyle: "italic"
                          }}>
                            ✨ No extra charge for sauce selection
                          </p>
                        </div>
                      );
                    }
                  } catch (error) {
                    console.error("Error parsing available sauces:", error);
                  }
                  return null;
                })()}

                {/* Quantity Controls */}
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
                  <Link href="/cart">
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
                  </Link>
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

export default page;
