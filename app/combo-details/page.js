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

  const comboId = searchParams.get("id");
  const [combo, setCombo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchCombo = async () => {
      try {
        const response = await fetch(`${API_URL}/getComboById/${comboId}`);
        const data = await response.json();
        setCombo(data);
        console.log(data);
        setTotalPrice(Number(data.price));
      } catch (error) {
        console.error("Error fetching combo:", error);
      } finally {
        setLoading(false);
      }
    };

    if (comboId) {
      fetchCombo();
    }
  }, [comboId]);

  // Update total price when quantity changes
  useEffect(() => {
    if (combo) {
      setTotalPrice(Number(combo.price) * quantity);
    }
  }, [quantity, combo]);

  const handleIncrease = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (quantity < 10) {
      setQuantity(prevQuantity => prevQuantity + 1);
    }
  };

  const handleDecrease = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };

  // Function to map actual sizes to display sizes
  const mapSizeForDisplay = (actualSize) => {
    const sizeMapping = {
      'MEDIUM': 'MEDIUM',
      'LARGE': 'LARGE', 
      'SUPER_SIZE': 'SUPER SIZE'
    };
    
    return sizeMapping[actualSize?.toUpperCase()] || actualSize;
  };

  const handleAddToCart = (e) => {
    if (quantity > 0) {
      dispatch(
        addItem({
          id: comboId,
          title: combo?.name,
          img: combo?.imageUrl,
          price: Number(totalPrice),
          eachprice: Number(combo?.price),
          quantity: Number(quantity),
          isCombo: true,
          pizzas: combo?.pizzas || [],
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
console.log(combo);
  return (
    <WellFoodLayout>
      <style jsx>{`
        @media (max-width: 768px) {
          .product-details-area {
            padding-top: 60px !important;
            padding-bottom: 40px !important;
          }
          .product-details-image {
            margin-bottom: 30px !important;
          }
          .product-details-image img {
            max-width: 100%;
            height: auto;
            max-height: 200px !important;
            width: 100%;
            object-fit: cover;
            border-radius: 8px;
          }
          .product-details-content {
            padding: 0 15px;
          }
          .product-details-content h2 {
            font-size: 1.4rem !important;
            margin-bottom: 1rem;
            text-align: center;
          }
          .price-section {
            text-align: center;
            margin-bottom: 20px !important;
          }
          .price-section .price {
            font-size: 1.8rem !important;
          }
          .custom-quantity {
            justify-content: center !important;
            flex-wrap: nowrap !important;
            gap: 20px !important;
          }
          .custom-quantity h5 {
            font-size: 1.1rem !important;
            min-width: auto !important;
          }
          .quantity-button {
            width: 50px !important;
            height: 50px !important;
            font-size: 1.6rem !important;
            touch-action: manipulation;
            -webkit-tap-highlight-color: transparent;
          }
          .quantity-display {
            width: 60px !important;
            font-size: 1.3rem !important;
            padding: 0 15px !important;
          }
          .add-to-cart button {
            width: 100% !important;
            justify-content: center !important;
            padding: 16px 20px !important;
            font-size: 1.2rem !important;
          }
          .combo-pizzas {
            margin-top: 2rem !important;
            padding: 15px !important;
          }
          .combo-pizzas h4 {
            font-size: 1.2rem !important;
          }
          .combo-pizzas li {
            padding: 10px 0 !important;
            font-size: 0.95rem !important;
          }
          .container {
            padding-left: 10px !important;
            padding-right: 10px !important;
          }
        }
        
        @media (min-width: 769px) {
          .product-details-image img {
            max-width: 100%;
            height: auto;
            max-height: 400px;
            object-fit: cover;
            border-radius: 12px;
          }
        }
        
        .price-section {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          border-left: 4px solid #ff6b35;
        }
        
        .quantity-button {
          border: none !important;
          background: #f5f5f5 !important;
          transition: all 0.2s ease !important;
          user-select: none;
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          touch-action: manipulation;
        }
        
        .quantity-button:active {
          background: #e0e0e0 !important;
          transform: scale(0.95);
        }
        
        .quantity-button:hover:not(:disabled) {
          background: #e9ecef !important;
        }
        
        .quantity-button:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(255, 107, 53, 0.3);
        }
      `}</style>
      <div className="product-details-area pt-120 rpt-100 pb-85 rpb-65">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="product-details-image rmb-55">
                <img
                  src={`${API_URL}/images/combo-${combo.id}.png`}
                  alt={combo?.name}
                />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="product-details-content">
                <h2>{combo?.name}</h2>
                <div className="price-section mb-3">
                  <p className="price" style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ff6b35', margin: '0' }}>
                    £{totalPrice.toFixed(2)}
                  </p>
                  {quantity > 1 && (
                    <small className="text-muted">
                      £{combo?.price} x {quantity}
                    </small>
                  )}
                </div>
                <p>{combo?.description}</p>

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
                        flexWrap: "wrap",
                        justifyContent: "center",
                      }}
                    >
                      <h5
                        style={{
                          margin: "0",
                          fontSize: "1.2rem",
                          fontWeight: "600",
                          minWidth: "80px",
                        }}
                      >
                        Quantity
                      </h5>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          border: "2px solid #ddd",
                          borderRadius: "10px",
                          overflow: "hidden",
                          backgroundColor: "#fff",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        }}
                      >
                        <button
                          type="button"
                          className="quantity-button"
                          style={{
                            width: "45px",
                            height: "45px",
                            border: "none",
                            background: "#f5f5f5",
                            fontSize: "1.4rem",
                            cursor: quantity <= 1 ? "not-allowed" : "pointer",
                            opacity: quantity <= 1 ? "0.5" : "1",
                            transition: "all 0.2s ease",
                            touchAction: "manipulation",
                            WebkitTapHighlightColor: "transparent",
                            userSelect: "none",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          disabled={quantity <= 1}
                          onClick={handleDecrease}
                        >
                          −
                        </button>
                        <span
                          className="quantity-display"
                          style={{
                            width: "50px",
                            textAlign: "center",
                            fontSize: "1.2rem",
                            fontWeight: "600",
                            padding: "0 10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            minHeight: "45px",
                          }}
                        >
                          {quantity}
                        </span>
                        <button
                          type="button"
                          className="quantity-button"
                          style={{
                            width: "45px",
                            height: "45px",
                            border: "none",
                            background: "#f5f5f5",
                            fontSize: "1.4rem",
                            cursor: quantity >= 10 ? "not-allowed" : "pointer",
                            opacity: quantity >= 10 ? "0.5" : "1",
                            transition: "all 0.2s ease",
                            touchAction: "manipulation",
                            WebkitTapHighlightColor: "transparent",
                            userSelect: "none",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
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
                        justifyContent: "center",
                        gap: "10px",
                        transition: "all 0.3s ease",
                        boxShadow: "0 4px 10px rgba(255, 107, 53, 0.3)",
                        width: "100%",
                        touchAction: "manipulation",
                        WebkitTapHighlightColor: "transparent",
                        minHeight: "50px",
                      }}
                    >
                      Add to Cart
                      <i className="far fa-arrow-alt-right" />
                    </button>
                  </Link>
                </form>

                {combo?.pizzas && combo.pizzas.length > 0 && (
                  <div className="combo-pizzas mt-4" style={{ 
                    background: '#f8f9fa', 
                    padding: '20px', 
                    borderRadius: '8px',
                    border: '1px solid #e9ecef'
                  }}>
                    <h4 style={{ 
                      marginBottom: '15px', 
                      color: '#333',
                      fontSize: '1.3rem',
                      fontWeight: '600'
                    }}>
                      Combo Includes:
                    </h4>
                    <ul className="list-unstyled" style={{ margin: '0' }}>
                      {combo.pizzas.map((pizzaItem, index) => (
                        <li key={index} style={{
                          padding: '8px 0',
                          borderBottom: index < combo.pizzas.length - 1 ? '1px solid #dee2e6' : 'none',
                          fontSize: '1rem',
                          color: '#555'
                        }}>
                          <strong>{pizzaItem.quantity}x</strong> {pizzaItem.pizza.name} 
                          <span style={{ 
                            color: '#ff6b35', 
                            fontWeight: '600',
                            marginLeft: '8px'
                          }}>
                            ({mapSizeForDisplay(pizzaItem.size)})
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
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
