

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

  // Log cart items whenever they change
  useEffect(() => {
    console.log('🛒 Cart Items Updated:', {
      totalItems: cartItems.length,
      totalQuantity: totalQuantity,
      totalPrice: totalPrice,
      items: cartItems.map((item, index) => ({
        index,
        id: item.id,
        title: item.title,
        size: item.size,
        pizzaBase: item.pizzaBase,
        quantity: item.quantity,
        price: item.price,
        eachPrice: item.eachprice,
        isComboStyleItem: item.isComboStyleItem,
        isMealDeal: item.isMealDeal,
        type: item.type,
        ingredients: item.ingredients,
        toppings: item.toppings,
        sides: item.sides,
        drinks: item.drinks
      }))
    });
  }, [cartItems, totalQuantity, totalPrice]);

  const handleClearCart = async () => {
    console.log('🗑️ Clearing Cart:', {
      itemsBeforeClear: cartItems.length,
      totalPriceBeforeClear: totalPrice
    });
    
    dispatch(clearCart()); // Dispatch Redux action to clear cart state
    
    console.log('✅ Cart Cleared Successfully');
  };

  const handleAddToCart = () => {
    console.log("Item added to the cart");
  };

  // Log when component mounts
  useEffect(() => {
    console.log('🛒 Cart Page Loaded:', {
      initialCartItems: cartItems.length,
      initialTotalPrice: totalPrice,
      initialTotalQuantity: totalQuantity
    });
  }, []);

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
              cartItems.map((item, index) => {
                console.log(`📦 Rendering Cart Item ${index + 1}:`, {
                  // title: item.title,
                  // quantity: item.quantity,
                  // price: item.price,
                  // size: item.size
                  item
                });
                
                return (
                  <CartItem
                    key={index}
                    image={item.img || `${item.image}`} // Default image
                    title={item.title || `${item.name}`}
                    size={item.size}
                    toppings={item.toppings}
                    pizzaBase={item.pizzaBase}
                    sauce={item.sauce} // Add sauce prop
                    isMealDeal={item.isMealDeal} // Add meal deal prop
                    selectedSides={item.selectedSides} // Add selected sides prop (legacy)
                    selectedDrinks={item.selectedDrinks} // Add selected drinks prop (legacy)
                    sides={item.sidesDetails} // Add sides array prop (new combo style)
                    drinks={item.drinksDetails} // Add drinks array prop (new combo style)
                    isPeriPeri={item.isPeriPeri} // Add Peri Peri flag prop
                    isComboStyleItem={item.isComboStyleItem} // Add combo style flag prop
                    type={item.type} // Add item type
                    hasPizzaCategory={item.hasPizzaCategory} // Add flag for UserChoice with pizza category
                    hasComboStyleCategory={item.hasComboStyleCategory} // Add flag for UserChoice with combo style category
                    ingredients={item.ingredients || []}
                    quantity={item.quantity}
                    price={Number(item.price).toFixed(2)} // Item price already includes quantity calculation

                    onIncrement={async () => {
                      console.log(`➕ Incrementing quantity for item ${index}:`, {
                        itemTitle: item.title,
                        currentQuantity: item.quantity,
                        newQuantity: item.quantity + 1
                      });
                      dispatch(incrementQuantity(index));
                    }}

                    onDecrement={() => {
                      console.log(`➖ Decrementing quantity for item ${index}:`, {
                        itemTitle: item.title,
                        currentQuantity: item.quantity,
                        newQuantity: item.quantity - 1
                      });
                      dispatch(decrementQuantity(index));
                    }}
                    
                    onDelete={() => {
                      console.log(`🗑️ Deleting item ${index}:`, {
                        itemTitle: item.title,
                        quantity: item.quantity,
                        price: item.price
                      });
                      dispatch(removeItem(index));
                    }}
                  />
                );
              })
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