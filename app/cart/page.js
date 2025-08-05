



"use client";
import FixedBtn from "@/components/custom/FixedBtn";
import WellFoodLayout from "@/layout/WellFoodLayout";
import Link from "next/link";
import { useEffect } from "react";
import axios from "axios";

import { useSelector, useDispatch } from "react-redux";
import {
  selectCartItems,
  selectCartTotalPrice,
  selectCartTotalQuantity,
  incrementQuantity,
  decrementQuantity,
  removeItem,
  clearCart,
  setCart,
  addItem,
} from "../../features/cart/cartSlice";
import CartItem from "@/components/custom/cartitem";

const page = () => {
  const cartItems = useSelector(selectCartItems) || []; // Default to empty array
  const totalQuantity = useSelector(selectCartTotalQuantity);
  const totalPrice = useSelector(selectCartTotalPrice);
  const dispatch = useDispatch();


  


  const handleClearCart = async () => {

     dispatch(clearCart()); // Dispatch Redux action to clear cart state
  };

  const handleAddToCart = () => {
    console.log("Item added to the cart");
  };

  return (
    <WellFoodLayout>
      <section className="shopping-cart-area py-130 rel z-1">
        <div className="container">
          <div className="shopping-cart-container">
            {cartItems.length === 0 ? (
              <div className="empty-cart-container">
                <h4>
                  Oops! Looks like your pizza cart is as empty as your stomach
                  before any meal! 🍕😄
                </h4>
              </div>
            ) : (
              cartItems.map((item, index) => (
                <CartItem
                  key={index}
                  image={item.img || "assets/images/widgets/news1.jpg"} // Default image
                  title={item.title}
                  size={item.size}
                  pizzaBase={item.pizzaBase}
                  ingredients={item.ingredients || []}
                  quantity={item.quantity}
                  price={Number(item.price).toFixed(2)} // Item price already includes quantity calculation


                  onIncrement={async () => {

  dispatch(incrementQuantity(index));
}}


                  onDecrement={() => dispatch(decrementQuantity(index))}
                  onDelete={() => dispatch(removeItem(index))}
                />
              ))
            )}
          </div>
          <div className="row text-center text-lg-left align-items-center">
            <div className="col-lg-12">
              <div className="update-shopping mb-30 d-flex justify-content-between align-items-center wow fadeInRight delay-0-2s">
                {/* Continue Shopping and Clear Cart */}
                <div className="shopping-actions d-flex align-items-center justify-content-center w-100 ">
                  <Link href="/menu-pizza" className="theme-btn style-two me-3">
                    Back to Pizzas <i className="fas fa-angle-double-right" />
                  </Link>
                  <Link
                    href="/cart"
                    onClick={(e) => {
                      e.preventDefault(); // Prevent navigation if needed
                      handleClearCart(); // Trigger the clear cart function
                    }}
                    className="theme-btn"
                  >
                    Clear Cart <i className="fas fa-angle-double-right" />
                  </Link>
                </div>

                {/* Total Price and Checkout (Visible only on desktop) */}
                <div className="checkout-actions d-lg-flex align-items-center justify-content-between d-none">
                  <p className="total-price mb-0 me-3">
                    Total: £{Number(totalPrice).toFixed(2)}
                  </p>
                  <Link href="/checkout" className="theme-btn style-two">
                    Checkout <i className="fas fa-angle-double-right" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <FixedBtn
        price={totalPrice}
        onAddToCart={handleAddToCart}
        name={"Checkout"}
        link={"/checkout"}
      />
    </WellFoodLayout>
  );
};

export default page;



