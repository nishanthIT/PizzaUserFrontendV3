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

  return (
    <WellFoodLayout>
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
                <p className="price">£ {combo?.price}</p>
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

                {combo?.pizzas && combo.pizzas.length > 0 && (
                  <div className="combo-pizzas mt-4">
                    <h4>Combo Includes:</h4>
                    <ul className="list-unstyled">
                      {combo.pizzas.map((pizzaItem, index) => (
                        <li key={index}>
                          {pizzaItem.quantity}x {pizzaItem.pizza.name} (
                          {pizzaItem.size})
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
