// "use client";
// import FixedBtn from "@/components/custom/FixedBtn";
// import PageBanner from "@/components/PageBanner";
// import PlusMinusBtn from "@/components/PlusMinusBtn";
// import WellFoodLayout from "@/layout/WellFoodLayout";
// import Link from "next/link";
// import { useEffect } from "react";
// import axios from "axios";

// import { useSelector, useDispatch } from "react-redux";
// import {
//   selectCartItems,
//   selectCartTotalPrice,
//   selectCartTotalQuantity,
//   incrementQuantity,
//   decrementQuantity,
//   removeItem,
//   clearCart,
//   setCart
// } from "../../features/cart/cartSlice";
// import CartItem from "@/components/custom/cartitem";

// const page = () => {
//   const cartItems = useSelector(selectCartItems);
//   const totalQuantity = useSelector(selectCartTotalQuantity);
//   const totalPrice = useSelector(selectCartTotalPrice);

//   const dispatch = useDispatch();


 
//   useEffect(() => {
//     const checkAuthAndSyncCart = async () => {
//       try {
//         const res = await axios.get("http://localhost:3000/api/check-auth", { withCredentials: true });

//         console.log("User authenticated:", res.data);
        

//         if (res.data?.user) {
//           const syncRes = await axios.post(
//             "http://localhost:3000/api/cart/sync",
//             { cartItems },
//             { withCredentials: true }
//           );
//           console.log("Cart synced with server:", syncRes);
//           dispatch(setCart(syncRes.data)); // backend will return full merged cart
//           console.log("Cart synced with server");
//         }
//       } catch (err) {
//         console.error("Auth check failed:", err);
//         console.log("User not logged in. Using local cart only.");
//       }
//     };

//     checkAuthAndSyncCart();
//   }, []);






//   const handleAddToCart = () => {
//     console.log("Item added to the cart");
//   };

//   return (
//     <WellFoodLayout>
//       <section className="shopping-cart-area py-130 rel z-1">
//         <div className="container">
//           <div className="shopping-cart-container">
//             {cartItems.length === 0 ? (
//               <div className="empty-cart-container">
//                 <h4>
//                   Oops! Looks like your pizza cart is as empty as your stomach
//                   before any meal! 🍕😄
//                 </h4>
//               </div>
//             ) : (
//               cartItems.map((item, index) => (
//                 <CartItem
//                   key={index}
//                   image={item.img || "assets/images/widgets/news1.jpg"} // Default image
//                   title={item.title}
//                   size={item.size}
//                   ingredients={item.ingredients || []}
//                   quantity={item.quantity}
//                   price={Number(item.price).toFixed(2)} // Item price already includes quantity calculation
//                   onIncrement={() => dispatch(incrementQuantity(index))}
//                   onDecrement={() => dispatch(decrementQuantity(index))}
//                   onDelete={() => dispatch(removeItem(index))}
//                 />
//               ))
//             )}
//           </div>
//           <div className="row text-center text-lg-left align-items-center">
//             <div className="col-lg-12">
//               <div className="update-shopping mb-30 d-flex justify-content-between align-items-center wow fadeInRight delay-0-2s">
//                 {/* Continue Shopping and Clear Cart */}
//                 <div className="shopping-actions d-flex align-items-center justify-content-center w-100 ">
//                   <Link href="/menu-pizza" className="theme-btn style-two me-3">
//                     Back to Pizzas <i className="fas fa-angle-double-right" />
//                   </Link>
//                   <Link
//                     href="/cart"
//                     onClick={(e) => {
//                       e.preventDefault(); // Prevent navigation if needed
//                       dispatch(clearCart());
//                     }}
//                     className="theme-btn"
//                   >
//                     Clear Cart <i className="fas fa-angle-double-right" />
//                   </Link>
//                 </div>

//                 {/* Total Price and Checkout (Visible only on desktop) */}
//                 <div className="checkout-actions d-lg-flex align-items-center justify-content-between d-none">
//                   <p className="total-price mb-0 me-3">
//                     Total: £{Number(totalPrice).toFixed(2)}
//                   </p>
//                   <Link href="/checkout" className="theme-btn style-two">
//                     Checkout <i className="fas fa-angle-double-right" />
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//       <FixedBtn
//         price={totalPrice}
//         onAddToCart={handleAddToCart}
//         name={"Checkout"}
//         link={"/checkout"}
//       />
//     </WellFoodLayout>
//   );
// };

// export default page;













// "use client";
// import FixedBtn from "@/components/custom/FixedBtn";
// import PageBanner from "@/components/PageBanner";
// import PlusMinusBtn from "@/components/PlusMinusBtn";
// import WellFoodLayout from "@/layout/WellFoodLayout";
// import Link from "next/link";
// import { useEffect } from "react";
// import axios from "axios";

// import { useSelector, useDispatch } from "react-redux";
// import {
//   selectCartItems,
//   selectCartTotalPrice,
//   selectCartTotalQuantity,
//   incrementQuantity,
//   decrementQuantity,
//   removeItem,
//   clearCart,
//   setCart,
// } from "../../features/cart/cartSlice";
// import CartItem from "@/components/custom/cartitem";

// const page = () => {
//   const cartItems = useSelector(selectCartItems);
//   const totalQuantity = useSelector(selectCartTotalQuantity);
//   const totalPrice = useSelector(selectCartTotalPrice);

//   const dispatch = useDispatch();

//   useEffect(() => {
//     const checkAuthAndSyncCart = async () => {
//       try {
//         const res = await axios.get("http://localhost:3000/api/check-auth", {
//           withCredentials: true,
//         });

//         if (res.data?.user) {
//           const syncRes = await axios.post(
//             "http://localhost:3000/api/cart/sync",
//             { cartItems },
//             { withCredentials: true }
//           );
//           dispatch(setCart(syncRes.data)); // backend will return full merged cart
//           console.log("Cart synced with server: ", syncRes.data);
//         }
//       } catch (err) {
//         console.log("User not logged in. Using local cart only.");
//       }
//     };

//     checkAuthAndSyncCart();
//   }, []);

//   const handleClearCart = async () => {
//     try {
//       const res = await axios.get("http://localhost:3000/api/check-auth", {
//         withCredentials: true,
//       });

//       if (res.data?.user) {
//         // If user is logged in, clear cart on backend
//         await axios.post(
//           "http://localhost:3000/api/cart/clear",
//           {},
//           { withCredentials: true }
//         );
//       }

//       // Always clear local cart
//       dispatch(clearCart());
//     } catch (err) {
//       console.error("Error clearing cart:", err);
//       dispatch(clearCart()); // fallback to clear local cart
//     }
//   };

//   const handleAddToCart = () => {
//     console.log("Item added to the cart");
//   };

//   return (
//     <WellFoodLayout>
//       <section className="shopping-cart-area py-130 rel z-1">
//         <div className="container">
//           <div className="shopping-cart-container">
//             {cartItems.length === 0 ? (
//               <div className="empty-cart-container">
//                 <h4>
//                   Oops! Looks like your pizza cart is as empty as your stomach
//                   before any meal! 🍕😄
//                 </h4>
//               </div>
//             ) : (
//               cartItems.map((item, index) => (
//                 <CartItem
//                   key={index}
//                   image={item.img || "assets/images/widgets/news1.jpg"}
//                   title={item.title}
//                   size={item.size}
//                   ingredients={item.ingredients || []}
//                   quantity={item.quantity}
//                   price={Number(item.price).toFixed(2)}
//                   onIncrement={() => dispatch(incrementQuantity(index))}
//                   onDecrement={() => dispatch(decrementQuantity(index))}
//                   onDelete={() => dispatch(removeItem(index))}
//                 />
//               ))
//             )}
//           </div>
//           <div className="row text-center text-lg-left align-items-center">
//             <div className="col-lg-12">
//               <div className="update-shopping mb-30 d-flex justify-content-between align-items-center wow fadeInRight delay-0-2s">
//                 <div className="shopping-actions d-flex align-items-center justify-content-center w-100">
//                   <Link href="/menu-pizza" className="theme-btn style-two me-3">
//                     Back to Pizzas <i className="fas fa-angle-double-right" />
//                   </Link>
//                   <Link
//                     href="/cart"
//                     onClick={(e) => {
//                       e.preventDefault();
//                       handleClearCart();
//                     }}
//                     className="theme-btn"
//                   >
//                     Clear Cart <i className="fas fa-angle-double-right" />
//                   </Link>
//                 </div>

//                 <div className="checkout-actions d-lg-flex align-items-center justify-content-between d-none">
//                   <p className="total-price mb-0 me-3">
//                     Total: £{Number(totalPrice).toFixed(2)}
//                   </p>
//                   <Link href="/checkout" className="theme-btn style-two">
//                     Checkout <i className="fas fa-angle-double-right" />
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//       <FixedBtn
//         price={totalPrice}
//         onAddToCart={handleAddToCart}
//         name={"Checkout"}
//         link={"/checkout"}
//       />
//     </WellFoodLayout>
//   );
// };

// export default page;



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


  

// useEffect(() => {
//   const checkAuthAndSyncCart = async () => {
//     try {
//       const res = await axios.get("http://localhost:3000/api/check-auth", {
//         withCredentials: true,
//       });

//       if (res.data?.user) {
//         const userId = res.data.user.id;
//         const cartRes = await axios.get(
//           `http://localhost:3000/api/cart?userId=${userId}`,
//           { withCredentials: true }
//         );
//         console.log("Cart fetched from server:", cartRes.data);

//         // 🧼 Clear Redux cart first to avoid duplication
//         dispatch(clearCart());
//         //localStorage.removeItem("cart"); // <-- important
//         localStorage.removeItem("persist:cart");

//         // ✅ Add fresh items from backend
//         cartRes.data.cartItems.forEach((item) => {
//           dispatch(
//             addItem({
//               id: item.pizzaId,
//               title: item.pizza?.name,
//               img: item.pizza?.imageUrl,
//               price: Number(item.finalPrice),
//               eachprice: Number(item.finalPrice) / item.quantity,
//               ingredients: item.cartIngredients,
//               toppings: item.cartToppings,
//               quantity: item.quantity,
//               size: item.size,
//             })
//           );
//         });
//       } else {
//         console.log("User not authenticated.");
//       }
//     } catch (err) {
//       console.error("Auth check or cart fetch failed:", err);
//     }
//   };

//   checkAuthAndSyncCart();
// }, [dispatch]);
  // Clear cart functionality
  const handleClearCart = async () => {
    //  const res = await axios.get("http://localhost:3000/api/check-auth", { withCredentials: true });
    // const userId = res.data?.user?.id;
    // if (!userId) {
    //   console.error("User not authenticated. Cannot clear cart.");
    //   return;
    // }
    // try {
    //   const res = await axios.post("http://localhost:3000/api/cart/clear", {userId}, { withCredentials: true });

    //   if (res.status === 200) {
    //     console.log("Cart cleared successfully");
    //     dispatch(clearCart()); // Dispatch Redux action to clear cart state
    //   }
    // } catch (err) {
    //   console.error("Error clearing cart:", err);
    // }

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
                  ingredients={item.ingredients || []}
                  quantity={item.quantity}
                  price={Number(item.price).toFixed(2)} // Item price already includes quantity calculation


                  onIncrement={async () => {
//     const res = await axios.get("http://localhost:3000/api/check-auth", { withCredentials: true });
//     const userId = res.data?.user?.id;

//     const cleanedItem = {
//   ...cartItems[index],
//   toppings: cartItems[index].toppings.map(t => ({ id: t.toppingId })),       // ✅ Fix here
//   ingredients: cartItems[index].ingredients.map(i => ({ id: i.ingredientId })) // ✅ Fix here
// };

//   if (userId) {
//     await axios.post("http://localhost:3000/api/cart/increment", {
//       userId,
//       item: cleanedItem,
//     }, { withCredentials: true });
//   }
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
