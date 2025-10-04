// "use client";
// import FixedBtn from "@/components/custom/FixedBtn";
// import WellFoodLayout from "@/layout/WellFoodLayout";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useSearchParams } from "next/navigation";
// import { useDispatch } from "react-redux";
// import { addItem } from "../../features/cart/cartSlice.js";
// import React, { useEffect, useState, useRef } from "react";
// import { Nav, Tab } from "react-bootstrap";
// import {
//   fetchPizzaById,
//   fetchAllToppings,
//   fetchAllIngredients,
// } from "@/services/menuPizzaServices";
// import { API_URL } from "@/services/config";
// import PizzaLoader from "@/components/pizzaLoader";

// const page = () => {
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const pizzaId = searchParams.get("id");
//   const [pizza, setPizza] = useState(null);
//   const [allToppings, setAllToppings] = useState([]);
//   const [allIngredients, setAllIngredients] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [pizzaData, toppingsData, ingredientsData] = await Promise.all([
//           fetchPizzaById(pizzaId),
//           fetchAllToppings(),
//           fetchAllIngredients(),
//         ]);

//         if (pizzaData.data) {
//           setPizza(pizzaData.data);
//         }
//         if (toppingsData.data) {
//           setAllToppings(toppingsData.data);
//         }
//         if (ingredientsData.data) {
//           setAllIngredients(ingredientsData.data);
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (pizzaId) {
//       fetchData();
//     }
//   }, [pizzaId]);

//   const [ingredients, setIngredients] = useState([]);
//   const [toppings, setToppings] = useState([]);
//   const [initialBasePrice, setInitialBasePrice] = useState(0);
//   const [tempPrice, setTempPrice] = useState(0);
//   const [finalPrice, setFinalPrice] = useState(0);
//   const [quantity, setQuantity] = useState(1);
//   const hasSetInitialPrice = useRef(false);
//   const [isCombo, setIsCombo] = useState(false);

//   // Initialize ingredients and toppings when pizza data is loaded
//   useEffect(() => {
//     if (pizza && allIngredients.length > 0 && allToppings.length > 0) {
//       // Map all ingredients with default quantities from pizza
//       const mappedIngredients = allIngredients.map((ing) => {
//         const defaultIng = pizza.defaultIngredients?.find(
//           (di) => di.ingredientId === ing.id
//         );
//         return {
//           id: ing.id,
//           name: ing.name,
//           price: Number(ing.price),
//           quantity: defaultIng ? defaultIng.quantity : 0,
//           included: defaultIng ? defaultIng.include : false,
//         };
//       });

//       // Map all toppings with default quantities from pizza
//       const mappedToppings = allToppings.map((top) => {
//         const defaultTop = pizza.defaultToppings?.find(
//           (dt) => dt.toppingId === top.id
//         );
//         return {
//           id: top.id,
//           name: top.name,
//           price: Number(top.price),
//           quantity: defaultTop ? defaultTop.quantity : 0,
//           included: defaultTop ? defaultTop.include : false,
//         };
//       });

//       setIngredients(mappedIngredients);
//       setToppings(mappedToppings);

//       // Calculate initial base price
//       const sizes =
//         typeof pizza.sizes === "string" ? JSON.parse(pizza.sizes) : pizza.sizes;
//       const basePrice = Number(sizes.SMALL);
//       setInitialBasePrice(basePrice);
//       setFinalPrice(basePrice);
//       setTempPrice(basePrice);
//     }
//   }, [pizza, allIngredients, allToppings]);

//   // Update price when ingredients or toppings change
//   useEffect(() => {
//     if (initialBasePrice > 0) {
//       const basePrice = initialBasePrice;
//       let totalAddedPrice = 0;
//       let totalRemovedPrice = 0;

//       // Calculate added and removed prices for ingredients
//       ingredients.forEach((ing) => {
//         const defaultIng = pizza.defaultIngredients?.find(
//           (di) => di.ingredientId === ing.id
//         );
//         const defaultQuantity = defaultIng ? defaultIng.quantity : 0;

//         if (ing.quantity > defaultQuantity) {
//           totalAddedPrice += (ing.quantity - defaultQuantity) * ing.price;
//         } else if (ing.quantity < defaultQuantity) {
//           totalRemovedPrice += (defaultQuantity - ing.quantity) * ing.price;
//         }
//       });

//       // Calculate added and removed prices for toppings
//       toppings.forEach((top) => {
//         const defaultTop = pizza.defaultToppings?.find(
//           (dt) => dt.toppingId === top.id
//         );
//         const defaultQuantity = defaultTop ? defaultTop.quantity : 0;

//         if (top.quantity > defaultQuantity) {
//           totalAddedPrice += (top.quantity - defaultQuantity) * top.price;
//         } else if (top.quantity < defaultQuantity) {
//           totalRemovedPrice += (defaultQuantity - top.quantity) * top.price;
//         }
//       });

//       const newPrice = basePrice - totalRemovedPrice + totalAddedPrice;
//       setTempPrice(newPrice);
//       setFinalPrice(Math.max(newPrice, basePrice));
//     }
//   }, [ingredients, toppings, initialBasePrice, pizza]);

//   const maxQuantity = 5;

//   const updateQuantity = (index, operation) => {
//     setIngredients((prevIngredients) =>
//       prevIngredients.map((ingredient, idx) =>
//         idx === index
//           ? {
//               ...ingredient,
//               quantity:
//                 operation === "add"
//                   ? Math.min(ingredient.quantity + 1, maxQuantity)
//                   : Math.max(ingredient.quantity - 1, 0),
//             }
//           : ingredient
//       )
//     );
//   };

//   const updatedToppingQuantity = (index, operation) => {
//     setToppings((prevToppings) =>
//       prevToppings.map((topping, idx) =>
//         idx === index
//           ? {
//               ...topping,
//               quantity:
//                 operation === "add"
//                   ? Math.min(topping.quantity + 1, maxQuantity)
//                   : Math.max(topping.quantity - 1, 0),
//             }
//           : topping
//       )
//     );
//   };

//   const handleIncrease = (event) => {
//     event.preventDefault();
//     if (quantity < 10) {
//       setQuantity(quantity + 1);
//     }
//   };

//   const handleDecrease = (event) => {
//     event.preventDefault();
//     if (quantity > 1) {
//       setQuantity(quantity - 1);
//     }
//   };

//   const [size, setSize] = useState("Small");

//   const getPrice = () => {
//     const sizes =
//       typeof pizza?.sizes === "string" ? JSON.parse(pizza.sizes) : pizza?.sizes;
//     switch (size) {
//       case "Medium":
//         return Number(
//           finalPrice +
//             (Number(sizes?.MEDIUM || 0) - Number(sizes?.SMALL || 0)) * quantity
//         );
//       case "Large":
//         return Number(
//           finalPrice +
//             (Number(sizes?.LARGE || 0) - Number(sizes?.SMALL || 0)) * quantity
//         );
//       default:
//         return Number(finalPrice * quantity);
//     }
//   };

//   const handleAddToCart = (e) => {
//     if (quantity > 0) {
//       dispatch(
//         addItem({
//           id: pizzaId,
//           title: pizza?.name,
//           img: pizza?.imageUrl,
//           price: Number(getPrice()),
//           eachprice: Number(getPrice() / quantity),
//           ingredients: ingredients,
//           toppings: toppings,
//           quantity: Number(quantity),
//           size: size,
//         })
//       );
//     } else {
//       console.error("Quantity must be greater than 0");
//     }
//   };

//   if (loading && !pizza) {
//     return <PizzaLoader />;
//   }

//   if (!pizza) {
//     return (
//       <WellFoodLayout>
//         <div className="container">
//           <div className="text-center py-5">
//             <h2>Pizza not found</h2>
//           </div>
//         </div>
//       </WellFoodLayout>
//     );
//   }

//   return (
//     <WellFoodLayout>
//       {loading && <PizzaLoader />}
//       <section className="product-details pb-10 pt-130 rpt-100">
//         <div className="container">
//           <div className="row">
//             <div className="col-lg-6">
//               <div
//                 className="product-details-image rmb-55"
//                 data-aos="fade-left"
//                 data-aos-duration={1500}
//                 data-aos-offset={50}
//               >
//                 <div
//                   className="product-image-wrapper"
//                   style={{
//                     display: "flex",
//                     justifyContent: "center",
//                   }}
//                 >
//                   <img
//                     className="product-image"
//                     src={`${API_URL}/images/pizza-${pizza.id}.png`}
//                     alt={pizza.name}
//                     style={{
//                       width: "40%",
//                       height: "auto",
//                       objectFit: "cover",
//                       borderRadius: "12px",
//                       //boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
//                     }}
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="col-lg-6">
//               <div
//                 className="product-details-content"
//                 data-aos="fade-right"
//                 data-aos-duration={1500}
//                 data-aos-offset={50}
//               >
//                 <div className="section-title">
//                   <h2
//                     className="mb-4"
//                     style={{
//                       fontSize: "2.5rem",
//                       fontWeight: "700",
//                       color: "#333",
//                     }}
//                   >
//                     {pizza.name}
//                   </h2>
//                   <p
//                     className="mb-4"
//                     style={{ fontSize: "1.2rem", color: "#666" }}
//                   >
//                     {pizza.description ||
//                       "Delicious pizza with fresh ingredients"}
//                   </p>

//                   {/* Size Selection */}
//                   {!isCombo && (
//                     <div className="size-container mb-4">
//                       <h5
//                         className="mb-3"
//                         style={{ fontSize: "1.2rem", fontWeight: "600" }}
//                       >
//                         Size Selection
//                       </h5>
//                       <div
//                         className="size-options"
//                         style={{ display: "flex", gap: "15px" }}
//                       >
//                         {["Small", "Medium", "Large"].map((sizeOption) => (
//                           <label
//                             key={sizeOption}
//                             style={{
//                               display: "flex",
//                               alignItems: "center",
//                               padding: "10px 15px",
//                               borderRadius: "8px",
//                               border: "2px solid",
//                               borderColor:
//                                 size === sizeOption ? "#ff6b35" : "#ddd",
//                               backgroundColor:
//                                 size === sizeOption ? "#fff4f0" : "#fff",
//                               cursor: "pointer",
//                               transition: "all 0.3s ease",
//                             }}
//                           >
//                             <input
//                               type="radio"
//                               name="size"
//                               value={sizeOption}
//                               checked={size === sizeOption}
//                               onChange={() => setSize(sizeOption)}
//                               style={{ marginRight: "8px" }}
//                             />
//                             <span
//                               style={{
//                                 fontWeight: size === sizeOption ? "600" : "400",
//                               }}
//                             >
//                               {sizeOption}
//                               {sizeOption === "Medium" }
//                               {sizeOption === "Large" }
//                             </span>
//                           </label>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Price Display */}
//                 <div className="price-container mb-4">
//                   <h5 style={{ fontSize: "1.2rem", fontWeight: "600" }}>
//                     Total Price
//                   </h5>
//                   <span
//                     className="price"
//                     style={{
//                       fontSize: "2.2rem",
//                       fontWeight: "700",
//                       color: "#ff6b35",
//                       display: "block",
//                       marginTop: "5px",
//                     }}
//                   >
//                     £{getPrice().toFixed(2)}
//                   </span>
//                 </div>

//                 {/* Quantity Controls */}
//                 <form className="add-to-cart mb-4">
//                   <div className="quantity-controls">
//                     <div
//                       className="custom-quantity"
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: "15px",
//                         marginBottom: "20px",
//                       }}
//                     >
//                       <h5
//                         style={{
//                           margin: "0",
//                           fontSize: "1.2rem",
//                           fontWeight: "600",
//                         }}
//                       >
//                         Quantity
//                       </h5>
//                       <div
//                         style={{
//                           display: "flex",
//                           alignItems: "center",
//                           border: "2px solid #eee",
//                           borderRadius: "8px",
//                           overflow: "hidden",
//                         }}
//                       >
//                         <button
//                           style={{
//                             width: "40px",
//                             height: "40px",
//                             border: "none",
//                             background: "#f5f5f5",
//                             fontSize: "1.2rem",
//                             cursor: quantity <= 1 ? "not-allowed" : "pointer",
//                             opacity: quantity <= 1 ? "0.5" : "1",
//                           }}
//                           disabled={quantity <= 1}
//                           onClick={handleDecrease}
//                         >
//                           -
//                         </button>
//                         <span
//                           style={{
//                             width: "40px",
//                             textAlign: "center",
//                             fontSize: "1.1rem",
//                             fontWeight: "600",
//                           }}
//                         >
//                           {quantity}
//                         </span>
//                         <button
//                           style={{
//                             width: "40px",
//                             height: "40px",
//                             border: "none",
//                             background: "#f5f5f5",
//                             fontSize: "1.2rem",
//                             cursor: quantity >= 10 ? "not-allowed" : "pointer",
//                             opacity: quantity >= 10 ? "0.5" : "1",
//                           }}
//                           disabled={quantity >= 10}
//                           onClick={handleIncrease}
//                         >
//                           +
//                         </button>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Add to Cart Button */}
//                   <Link href="/cart">
//                     <button
//                       type="submit"
//                       className="theme-btn"
//                       onClick={handleAddToCart}
//                       style={{
//                         padding: "14px 30px",
//                         fontSize: "1.1rem",
//                         fontWeight: "600",
//                         borderRadius: "8px",
//                         background: "#ff6b35",
//                         border: "none",
//                         color: "#fff",
//                         display: "flex",
//                         alignItems: "center",
//                         gap: "10px",
//                         transition: "all 0.3s ease",
//                         boxShadow: "0 4px 10px rgba(255, 107, 53, 0.3)",
//                       }}
//                     >
//                       Add to Cart
//                       <i className="far fa-arrow-alt-right" />
//                     </button>
//                   </Link>
//                 </form>

//                 {/* Ingredients Section */}
//                 {!isCombo && (
//                   <div className="ingredients-section mb-4">
//                     {ingredients.length > 0 && (
//                       <h5
//                         className="mb-3"
//                         style={{
//                           fontSize: "1.2rem",
//                           fontWeight: "600",
//                         }}
//                       >
//                         Ingredients
//                       </h5>
//                     )}
//                     {/* <h5
//                       style={{
//                         fontSize: "1.2rem",
//                         fontWeight: "600",
//                         marginBottom: "15px",
//                       }}
//                     >
//                       Ingredients
//                     </h5> */}
//                     <ul
//                       className="ingredients-list"
//                       style={{ listStyle: "none", padding: "0" }}
//                     >
//                       {ingredients.map((ingredient, index) => (
//                         <li
//                           key={index}
//                           className="ingredient-item"
//                           style={{
//                             display: "flex",
//                             justifyContent: "space-between",
//                             alignItems: "center",
//                             padding: "12px 15px",
//                             margin: "8px 0",
//                             borderRadius: "8px",
//                             backgroundColor: "#f9f9f9",
//                             boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
//                           }}
//                         >
//                           <span style={{ fontWeight: "500" }}>
//                             {ingredient.name} - £{ingredient.price.toFixed(1)}
//                           </span>
//                           <div
//                             className="ingredient-controls"
//                             style={{
//                               display: "flex",
//                               alignItems: "center",
//                               gap: "10px",
//                             }}
//                           >
//                             <div
//                               style={{
//                                 display: "flex",
//                                 alignItems: "center",
//                                 border: "1px solid #ddd",
//                                 borderRadius: "6px",
//                                 overflow: "hidden",
//                               }}
//                             >
//                               <button
//                                 style={{
//                                   width: "30px",
//                                   height: "30px",
//                                   border: "none",
//                                   background: "#f0f0f0",
//                                   cursor:
//                                     ingredient.quantity <= 0
//                                       ? "not-allowed"
//                                       : "pointer",
//                                   opacity:
//                                     ingredient.quantity <= 0 ? "0.5" : "1",
//                                 }}
//                                 disabled={ingredient.quantity <= 0}
//                                 onClick={() =>
//                                   updateQuantity(index, "subtract")
//                                 }
//                               >
//                                 -
//                               </button>
//                               <span
//                                 style={{ width: "30px", textAlign: "center" }}
//                               >
//                                 {ingredient.quantity}
//                               </span>
//                               <button
//                                 style={{
//                                   width: "30px",
//                                   height: "30px",
//                                   border: "none",
//                                   background: "#f0f0f0",
//                                   cursor:
//                                     ingredient.quantity >= maxQuantity
//                                       ? "not-allowed"
//                                       : "pointer",
//                                   opacity:
//                                     ingredient.quantity >= maxQuantity
//                                       ? "0.5"
//                                       : "1",
//                                 }}
//                                 disabled={ingredient.quantity >= maxQuantity}
//                                 onClick={() => updateQuantity(index, "add")}
//                               >
//                                 +
//                               </button>
//                             </div>
//                           </div>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}

//                 {/* Toppings Section */}
//                 {!isCombo && (
//                   <div className="toppings-section mb-4">
//                     {toppings.length > 0 && (
//                       <h5
//                         className="mb-3"
//                         style={{
//                           fontSize: "1.2rem",
//                           fontWeight: "600",
//                         }}
//                       >
//                         Toppings
//                       </h5>
//                     )}
//                     {/* <h5
//                       style={{
//                         fontSize: "1.2rem",
//                         fontWeight: "600",
//                         marginBottom: "15px",
//                       }}
//                     >
//                       Toppings
//                     </h5> */}
//                     <ul
//                       className="toppings-list"
//                       style={{ listStyle: "none", padding: "0" }}
//                     >
//                       {toppings.map((topping, index) => (
//                         <li
//                           key={index}
//                           className="topping-item"
//                           style={{
//                             display: "flex",
//                             justifyContent: "space-between",
//                             alignItems: "center",
//                             padding: "12px 15px",
//                             margin: "8px 0",
//                             borderRadius: "8px",
//                             backgroundColor: "#f9f9f9",
//                             boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
//                           }}
//                         >
//                           <span style={{ fontWeight: "500" }}>
//                             {topping.name} - £{topping.price.toFixed(1)}
//                           </span>
//                           <div
//                             className="topping-controls"
//                             style={{
//                               display: "flex",
//                               alignItems: "center",
//                               gap: "10px",
//                             }}
//                           >
//                             <div
//                               style={{
//                                 display: "flex",
//                                 alignItems: "center",
//                                 border: "1px solid #ddd",
//                                 borderRadius: "6px",
//                                 overflow: "hidden",
//                               }}
//                             >
//                               <button
//                                 style={{
//                                   width: "30px",
//                                   height: "30px",
//                                   border: "none",
//                                   background: "#f0f0f0",
//                                   cursor:
//                                     topping.quantity <= 0
//                                       ? "not-allowed"
//                                       : "pointer",
//                                   opacity: topping.quantity <= 0 ? "0.5" : "1",
//                                 }}
//                                 disabled={topping.quantity <= 0}
//                                 onClick={() =>
//                                   updatedToppingQuantity(index, "subtract")
//                                 }
//                               >
//                                 -
//                               </button>
//                               <span
//                                 style={{ width: "30px", textAlign: "center" }}
//                               >
//                                 {topping.quantity}
//                               </span>
//                               <button
//                                 style={{
//                                   width: "30px",
//                                   height: "30px",
//                                   border: "none",
//                                   background: "#f0f0f0",
//                                   cursor:
//                                     topping.quantity >= maxQuantity
//                                       ? "not-allowed"
//                                       : "pointer",
//                                   opacity:
//                                     topping.quantity >= maxQuantity
//                                       ? "0.5"
//                                       : "1",
//                                 }}
//                                 disabled={topping.quantity >= maxQuantity}
//                                 onClick={() =>
//                                   updatedToppingQuantity(index, "add")
//                                 }
//                               >
//                                 +
//                               </button>
//                             </div>
//                           </div>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Fixed Button at bottom */}
//       <FixedBtn
//         price={getPrice()}
//         onAddToCart={handleAddToCart}
//         name={"Add To Cart"}
//         link="/cart"
//       />
//     </WellFoodLayout>
//   );
// };

// export default page;



// "use client";
// import FixedBtn from "@/components/custom/FixedBtn";
// import WellFoodLayout from "@/layout/WellFoodLayout";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useSearchParams } from "next/navigation";
// import { useDispatch } from "react-redux";
// import { addItem } from "../../features/cart/cartSlice.js";
// import React, { useEffect, useState, useRef } from "react";
// import { Nav, Tab } from "react-bootstrap";
// import {
//   fetchPizzaById,
//   fetchAllToppings,
//   fetchAllIngredients,
// } from "@/services/menuPizzaServices";
// import { API_URL } from "@/services/config";
// import PizzaLoader from "@/components/pizzaLoader";

// const page = () => {
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const pizzaId = searchParams.get("id");
//   const [pizza, setPizza] = useState(null);
//   const [allToppings, setAllToppings] = useState([]);
//   const [allIngredients, setAllIngredients] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Move size state declaration before the useEffect that uses it
//   const [size, setSize] = useState("Medium");

//   const [ingredients, setIngredients] = useState([]);
//   const [toppings, setToppings] = useState([]);
//   const [initialBasePrice, setInitialBasePrice] = useState(0);
//   const [tempPrice, setTempPrice] = useState(0);
//   const [finalPrice, setFinalPrice] = useState(0);
//   const [quantity, setQuantity] = useState(1);
//   const hasSetInitialPrice = useRef(false);
//   const [isCombo, setIsCombo] = useState(false);
//   // Add pizza base state
//   const [pizzaBase, setPizzaBase] = useState("Regular Crust");

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [pizzaData, toppingsData, ingredientsData] = await Promise.all([
//           fetchPizzaById(pizzaId),
//           fetchAllToppings(),
//           fetchAllIngredients(),
//         ]);

//         if (pizzaData.data) {
//           setPizza(pizzaData.data);
//         }
//         if (toppingsData.data) {
//           setAllToppings(toppingsData.data);
//         }
//         if (ingredientsData.data) {
//           setAllIngredients(ingredientsData.data);
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (pizzaId) {
//       fetchData();
//     }
//   }, [pizzaId]);

//   // Initialize ingredients and toppings when pizza data is loaded
//   useEffect(() => {
//     if (pizza && allIngredients.length > 0 && allToppings.length > 0) {
//       // Map all ingredients with default quantities from pizza
//       const mappedIngredients = allIngredients.map((ing) => {
//         const defaultIng = pizza.defaultIngredients?.find(
//           (di) => di.ingredientId === ing.id
//         );
//         return {
//           id: ing.id,
//           name: ing.name,
//           price: Number(ing.price),
//           quantity: defaultIng ? defaultIng.quantity : 0,
//           included: defaultIng ? defaultIng.include : false,
//         };
//       });

//       // Map all toppings with default quantities from pizza
//       const mappedToppings = allToppings.map((top) => {
//         const defaultTop = pizza.defaultToppings?.find(
//           (dt) => dt.toppingId === top.id
//         );
//         return {
//           id: top.id,
//           name: top.name,
//           price: Number(top.price),
//           quantity: defaultTop ? defaultTop.quantity : 0,
//           included: defaultTop ? defaultTop.include : false,
//         };
//       });

//       setIngredients(mappedIngredients);
//       setToppings(mappedToppings);

//       // Calculate initial base price using MEDIUM as base
//       const sizes =
//         typeof pizza.sizes === "string" ? JSON.parse(pizza.sizes) : pizza.sizes;
//       const basePrice = Number(sizes.MEDIUM);
//       setInitialBasePrice(basePrice);
//       setFinalPrice(basePrice);
//       setTempPrice(basePrice);
//     }
//   }, [pizza, allIngredients, allToppings]);

//   // Function to get size multiplier for dynamic topping pricing
//   const getSizeMultiplier = () => {
//     switch (size) {
//       case "Large":
//         return 1.5; // 50% extra
//       case "Super Size":
//         return 2; // 100% extra
//       default:
//         return 1; // Medium is base
//     }
//   };

//   // Update price when ingredients or toppings change
//   // useEffect(() => {
//   //   if (initialBasePrice > 0) {
//   //     const basePrice = initialBasePrice;
//   //     let totalAddedPrice = 0;
//   //     let totalRemovedPrice = 0;

//   //     // Calculate size multiplier for dynamic topping pricing
//   //     const sizeMultiplier = getSizeMultiplier();

//   //     // Calculate added and removed prices for toppings with size multiplier
//   //     toppings.forEach((top) => {
//   //       const defaultTop = pizza.defaultToppings?.find(
//   //         (dt) => dt.toppingId === top.id
//   //       );
//   //       const defaultQuantity = defaultTop ? defaultTop.quantity : 0;
//   //       const adjustedPrice = top.price * sizeMultiplier;

//   //       if (top.quantity > defaultQuantity) {
//   //         totalAddedPrice += (top.quantity - defaultQuantity) * adjustedPrice;
//   //       } else if (top.quantity < defaultQuantity) {
//   //         totalRemovedPrice += (defaultQuantity - top.quantity) * adjustedPrice;
//   //       }
//   //     });

//   //     const newPrice = basePrice - totalRemovedPrice + totalAddedPrice;
//   //     setTempPrice(newPrice);
//   //     setFinalPrice(Math.max(newPrice, basePrice));
//   //   }
//   // }, [toppings, initialBasePrice, pizza, size]); // Now size is properly declared

// // Update price when ingredients or toppings change
// useEffect(() => {
//   if (initialBasePrice > 0) {
//     // Get the current size base price
//     const sizes =
//       typeof pizza?.sizes === "string" ? JSON.parse(pizza.sizes) : pizza?.sizes;
    
//     let currentBasePrice;
//     switch (size) {
//       case "Large":
//         currentBasePrice = Number(sizes?.LARGE || 0);
//         break;
//       case "Super Size":
//         currentBasePrice = Number(sizes?.SUPER_SIZE || 0);
//         break;
//       default:
//         currentBasePrice = Number(sizes?.MEDIUM || 0);
//         break;
//     }

//     let totalAddedPrice = 0;
//     let totalRemovedPrice = 0;

//     // Calculate size multiplier for dynamic topping pricing
//     const sizeMultiplier = getSizeMultiplier();

//     // Calculate added and removed prices for toppings with size multiplier
//     toppings.forEach((top) => {
//       const defaultTop = pizza.defaultToppings?.find(
//         (dt) => dt.toppingId === top.id
//       );
//       const defaultQuantity = defaultTop ? defaultTop.quantity : 0;
//       const adjustedPrice = top.price * sizeMultiplier;

//       if (top.quantity > defaultQuantity) {
//         totalAddedPrice += (top.quantity - defaultQuantity) * adjustedPrice;
//       } else if (top.quantity < defaultQuantity) {
//         totalRemovedPrice += (defaultQuantity - top.quantity) * adjustedPrice;
//       }
//     });

//     // Calculate temporary price (can go below base price for tracking)
//     const tempCalculatedPrice = currentBasePrice - totalRemovedPrice + totalAddedPrice;
//     setTempPrice(tempCalculatedPrice);

//     // Final price should NEVER go below base price - this is the absolute floor
//     const finalCalculatedPrice = Math.max(tempCalculatedPrice, currentBasePrice);
//     setFinalPrice(finalCalculatedPrice);

//     console.log('🔧 Price calculation:', {
//       size,
//       currentBasePrice,
//       totalAddedPrice,
//       totalRemovedPrice,
//       tempCalculatedPrice,
//       finalCalculatedPrice,
//       'Price Floor Applied': tempCalculatedPrice < currentBasePrice
//     });
//   }
// }, [toppings, initialBasePrice, pizza, size]);
  
//   const maxQuantity = 5;

//   const updateQuantity = (index, operation) => {
//     setIngredients((prevIngredients) =>
//       prevIngredients.map((ingredient, idx) =>
//         idx === index
//           ? {
//             ...ingredient,
//             quantity:
//               operation === "add"
//                 ? Math.min(ingredient.quantity + 1, maxQuantity)
//                 : Math.max(ingredient.quantity - 1, 0),
//           }
//           : ingredient
//       )
//     );
//   };

//   const updatedToppingQuantity = (index, operation) => {
//     setToppings((prevToppings) =>
//       prevToppings.map((topping, idx) =>
//         idx === index
//           ? {
//             ...topping,
//             quantity:
//               operation === "add"
//                 ? Math.min(topping.quantity + 1, maxQuantity)
//                 : Math.max(topping.quantity - 1, 0),
//           }
//           : topping
//       )
//     );
//   };

//   const handleIncrease = (event) => {
//     event.preventDefault();
//     if (quantity < 10) {
//       setQuantity(quantity + 1);
//     }
//   };

//   const handleDecrease = (event) => {
//     event.preventDefault();
//     if (quantity > 1) {
//       setQuantity(quantity - 1);
//     }
//   };

//   // const getPrice = () => {

//   //   const sizes =
//   //     typeof pizza?.sizes === "string" ? JSON.parse(pizza.sizes) : pizza?.sizes;
//   //   let basePrice = finalPrice
//   //   switch (size) {
//   //     case "Large":
//   //       // Use the actual LARGE price from database
//   //       basePrice = Number(sizes?.LARGE || 0);
//   //       break;
//   //     case "Super Size":
//   //       // Use the actual SUPER_SIZE price from database
//   //       basePrice = Number(sizes?.SUPER_SIZE || 0);
//   //       break;
//   //     default:
//   //       // Medium is base - use the finalPrice which was set to MEDIUM
//   //       basePrice = Number(finalPrice)
//   //       break;
//   //   }

//   //   if (pizzaBase.includes("Stuffed Crust")) {
//   //     // Dynamic stuffed crust pricing based on size
//   //     switch (size) {
//   //       case "Large":
//   //         basePrice += 3; // £3 for large
//   //         break;
//   //       case "Super Size":
//   //         basePrice += 4; // £4 for super size
//   //         break;
//   //       default:
//   //         basePrice += 2; // £2 for medium
//   //         break;
//   //     }
//   //   }
//   //   return Number(basePrice * quantity);
//   // };
// const getPrice = () => {
//   const sizes =
//     typeof pizza?.sizes === "string" ? JSON.parse(pizza.sizes) : pizza?.sizes;
  
//   // Get the base price for the selected size
//   let basePrice;
//   switch (size) {
//     case "Large":
//       basePrice = Number(sizes?.LARGE || 0);
//       break;
//     case "Super Size":
//       basePrice = Number(sizes?.SUPER_SIZE || 0);
//       break;
//     default:
//       basePrice = Number(sizes?.MEDIUM || 0);
//       break;
//   }

//   // Calculate topping modifications with size multiplier
//   let totalAddedPrice = 0;
//   let totalRemovedPrice = 0;
//   const sizeMultiplier = getSizeMultiplier();

//   toppings.forEach((top) => {
//     const defaultTop = pizza.defaultToppings?.find(
//       (dt) => dt.toppingId === top.id
//     );
//     const defaultQuantity = defaultTop ? defaultTop.quantity : 0;
//     const adjustedPrice = top.price * sizeMultiplier;

//     if (top.quantity > defaultQuantity) {
//       totalAddedPrice += (top.quantity - defaultQuantity) * adjustedPrice;
//     } else if (top.quantity < defaultQuantity) {
//       totalRemovedPrice += (defaultQuantity - top.quantity) * adjustedPrice;
//     }
//   });

//   // Calculate the raw price: base price + added toppings - removed toppings
//   let calculatedPrice = basePrice - totalRemovedPrice + totalAddedPrice;

//   // ENFORCE PRICE FLOOR: Never go below base price
//   calculatedPrice = Math.max(calculatedPrice, basePrice);

//   // Add stuffed crust pricing if selected
//   if (pizzaBase.includes("Stuffed Crust")) {
//     switch (size) {
//       case "Large":
//         calculatedPrice += 3; // £3 for large
//         break;
//       case "Super Size":
//         calculatedPrice += 4; // £4 for super size
//         break;
//       default:
//         calculatedPrice += 2; // £2 for medium
//         break;
//     }
//   }

//   // Ensure final price is never negative (additional safety)
//   calculatedPrice = Math.max(calculatedPrice, 0);

//   console.log('🔧 getPrice() calculation:', {
//     basePrice,
//     totalAddedPrice,
//     totalRemovedPrice,
//     rawPrice: basePrice - totalRemovedPrice + totalAddedPrice,
//     finalPrice: calculatedPrice,
//     'Floor Applied': (basePrice - totalRemovedPrice + totalAddedPrice) < basePrice
//   });

//   return Number(calculatedPrice * quantity);
// };

//   const handleAddToCart = (e) => {
//     if (quantity > 0) {
//       dispatch(
//         addItem({
//           id: pizzaId,
//           title: pizza?.name,
//           img: pizza?.imageUrl,
//           price: Number(getPrice()),
//           eachprice: Number(getPrice() / quantity),
//           ingredients: ingredients,
//           toppings: toppings,
//           quantity: Number(quantity),
//           size: size,
//           pizzaBase: pizzaBase, // Add pizza base to cart
//         })
//       );
//     } else {
//       console.error("Quantity must be greater than 0");
//     }
//   };

//   if (loading && !pizza) {
//     return <PizzaLoader />;
//   }

//   if (!pizza) {
//     return (
//       <WellFoodLayout>
//         <div className="container">
//           <div className="text-center py-5">
//             <h2>Pizza not found</h2>
//           </div>
//         </div>
//       </WellFoodLayout>
//     );
//   }

//   return (
//     <WellFoodLayout>
//       {loading && <PizzaLoader />}
//       <section className="product-details pb-10 pt-130 rpt-100">
//         <div className="container">
//           <div className="row">
//             <div className="col-lg-6">
//               <div
//                 className="product-details-image rmb-55"
//                 data-aos="fade-left"
//                 data-aos-duration={1500}
//                 data-aos-offset={50}
//               >
//                 <div
//                   className="product-image-wrapper"
//                   style={{
//                     display: "flex",
//                     justifyContent: "center",
//                   }}
//                 >
//                   <img
//                     className="product-image"
//                     src={`${API_URL}/images/pizza-${pizza.id}.png`}
//                     alt={pizza.name}
//                     style={{
//                       width: "40%",
//                       height: "auto",
//                       objectFit: "cover",
//                       borderRadius: "12px",
//                     }}
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="col-lg-6">
//               <div
//                 className="product-details-content"
//                 data-aos="fade-right"
//                 data-aos-duration={1500}
//                 data-aos-offset={50}
//               >
//                 <div className="section-title">
//                   <h2
//                     className="mb-4"
//                     style={{
//                       fontSize: "2.5rem",
//                       fontWeight: "700",
//                       color: "#333",
//                     }}
//                   >
//                     {pizza.name}
//                   </h2>
//                   <p
//                     className="mb-4"
//                     style={{ fontSize: "1.2rem", color: "#666" }}
//                   >
//                     {pizza.description ||
//                       "Delicious pizza with fresh ingredients"}
//                   </p>

//                   {/* Pizza Base Selection */}
//                   {!isCombo && (
//                     <div className="base-container mb-4">
//                       <h5
//                         className="mb-3"
//                         style={{ fontSize: "1.2rem", fontWeight: "600" }}
//                       >
//                         Pizza Base
//                       </h5>



//                       <div
//                         className="base-options responsive-base-options"
//                         style={{
//                           display: "flex",
//                           gap: "15px",
//                           flexWrap: "wrap",
//                           //justifyContent: "center", // ✅ Center on all screens (esp. mobile)
//                         }}
//                       >
//                         {["Regular Crust", "ThinCrust", (() => {
//                           switch (size) {
//                             case "Large":
//                               return "Stuffed Crust +£3";
//                             case "Super Size":
//                               return "Stuffed Crust +£4";
//                             default:
//                               return "Stuffed Crust +£2";
//                           }
//                         })()].map((baseOption) => (
//                           <label
//                             key={baseOption}
//                             style={{
//                               display: "flex",
//                               alignItems: "center",
//                               padding: "10px 15px",
//                               borderRadius: "8px",
//                               border: "2px solid",
//                               borderColor: baseOption.includes("Stuffed Crust") ? (pizzaBase.includes("Stuffed Crust") ? "#ff6b35" : "#ddd") : (pizzaBase === baseOption ? "#ff6b35" : "#ddd"),
//                               backgroundColor: baseOption.includes("Stuffed Crust") ? (pizzaBase.includes("Stuffed Crust") ? "#fff4f0" : "#fff") : (pizzaBase === baseOption ? "#fff4f0" : "#fff"),
//                               cursor: "pointer",
//                               transition: "all 0.3s ease",
//                             }}
//                           >

//                             <input
//                               type="radio"
//                               name="pizzaBase"
//                               value={baseOption}
//                               checked={baseOption.includes("Stuffed Crust") ? pizzaBase.includes("Stuffed Crust") : pizzaBase === baseOption}
//                               onChange={() => setPizzaBase(baseOption)}
//                               style={{
//                                 display: "none", // ✅ Hide default radio button
//                               }}
//                             />
//                             <span
//                               style={{
//                                 fontWeight: baseOption.includes("Stuffed Crust") ? (pizzaBase.includes("Stuffed Crust") ? "600" : "400") : (pizzaBase === baseOption ? "600" : "400"),
//                                 color: baseOption.includes("Stuffed Crust") ? (pizzaBase.includes("Stuffed Crust") ? "#ff6b35" : "#333") : (pizzaBase === baseOption ? "#ff6b35" : "#333"), // Optional highlight
//                               }}
//                             >
//                               {baseOption}
//                             </span>
//                           </label>
//                         ))}
//                       </div>


//                     </div>
//                   )}

//                   {/* Size Selection */}
//                   {!isCombo && (
//                     <div className="size-container mb-4">
//                       <h5
//                         className="mb-3"
//                         style={{ fontSize: "1.2rem", fontWeight: "600" }}
//                       >
//                         Size Selection
//                       </h5>
//                       <div
//                         className="size-options"
//                         style={{ display: "flex", gap: "15px" }}
//                       >
//                         {["Medium", "Large", "Super Size"].map((sizeOption) => (
//                           <label
//                             key={sizeOption}
//                             style={{
//                               display: "flex",
//                               alignItems: "center",
//                               padding: "10px 15px",
//                               borderRadius: "8px",
//                               border: "2px solid",
//                               borderColor:
//                                 size === sizeOption ? "#ff6b35" : "#ddd",
//                               backgroundColor:
//                                 size === sizeOption ? "#fff4f0" : "#fff",
//                               cursor: "pointer",
//                               transition: "all 0.3s ease",
//                             }}
//                           >
//                             <input
//                               type="radio"
//                               name="size"
//                               value={sizeOption}
//                               checked={size === sizeOption}
//                               onChange={() => setSize(sizeOption)}
//                               style={{ marginRight: "8px" }}
//                             />
//                             <span
//                               style={{
//                                 fontWeight: size === sizeOption ? "600" : "400",
//                               }}
//                             >
//                               {sizeOption}
//                             </span>
//                           </label>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Price Display */}
//                 <div className="price-container mb-4">
//                   <h5 style={{ fontSize: "1.2rem", fontWeight: "600" }}>
//                     Total Price
//                   </h5>
//                   <span
//                     className="price"
//                     style={{
//                       fontSize: "2.2rem",
//                       fontWeight: "700",
//                       color: "#ff6b35",
//                       display: "block",
//                       marginTop: "5px",
//                     }}
//                   >
//                     £{getPrice().toFixed(2)}
//                   </span>
//                 </div>

//                 {/* Quantity Controls */}
//                 <form className="add-to-cart mb-4">
//                   <div className="quantity-controls">
//                     <div
//                       className="custom-quantity"
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: "15px",
//                         marginBottom: "20px",
//                       }}
//                     >
//                       <h5
//                         style={{
//                           margin: "0",
//                           fontSize: "1.2rem",
//                           fontWeight: "600",
//                         }}
//                       >
//                         Quantity
//                       </h5>
//                       <div
//                         style={{
//                           display: "flex",
//                           alignItems: "center",
//                           border: "2px solid #eee",
//                           borderRadius: "8px",
//                           overflow: "hidden",
//                         }}
//                       >
//                         <button
//                           style={{
//                             width: "40px",
//                             height: "40px",
//                             border: "none",
//                             background: "#f5f5f5",
//                             fontSize: "1.2rem",
//                             cursor: quantity <= 1 ? "not-allowed" : "pointer",
//                             opacity: quantity <= 1 ? "0.5" : "1",
//                           }}
//                           disabled={quantity <= 1}
//                           onClick={handleDecrease}
//                         >
//                           -
//                         </button>
//                         <span
//                           style={{
//                             width: "40px",
//                             textAlign: "center",
//                             fontSize: "1.1rem",
//                             fontWeight: "600",
//                           }}
//                         >
//                           {quantity}
//                         </span>
//                         <button
//                           style={{
//                             width: "40px",
//                             height: "40px",
//                             border: "none",
//                             background: "#f5f5f5",
//                             fontSize: "1.2rem",
//                             cursor: quantity >= 10 ? "not-allowed" : "pointer",
//                             opacity: quantity >= 10 ? "0.5" : "1",
//                           }}
//                           disabled={quantity >= 10}
//                           onClick={handleIncrease}
//                         >
//                           +
//                         </button>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Add to Cart Button */}
//                   <Link href="/cart">
//                     <button
//                       type="submit"
//                       className="theme-btn"
//                       onClick={handleAddToCart}
//                       style={{
//                         padding: "14px 30px",
//                         fontSize: "1.1rem",
//                         fontWeight: "600",
//                         borderRadius: "8px",
//                         background: "#ff6b35",
//                         border: "none",
//                         color: "#fff",
//                         display: "flex",
//                         alignItems: "center",
//                         gap: "10px",
//                         transition: "all 0.3s ease",
//                         boxShadow: "0 4px 10px rgba(255, 107, 53, 0.3)",
//                       }}
//                     >
//                       Add to Cart
//                       <i className="far fa-arrow-alt-right" />
//                     </button>
//                   </Link>
//                 </form>

//                 {/* Toppings Section with Dynamic Pricing */}
//                 {!isCombo && (
//                   <div className="toppings-section mb-4">
//                     {toppings.length > 0 && (
//                       <h5
//                         className="mb-3"
//                         style={{
//                           fontSize: "1.2rem",
//                           fontWeight: "600",
//                         }}
//                       >
//                         Toppings
//                       </h5>
//                     )}
//                     <ul
//                       className="toppings-list"
//                       style={{ listStyle: "none", padding: "0" }}
//                     >
//                       {toppings.map((topping, index) => {
//                         const sizeMultiplier = getSizeMultiplier();
//                         const adjustedPrice = topping.price * sizeMultiplier;

//                         return (
//                           <li
//                             key={index}
//                             className="topping-item"
//                             style={{
//                               display: "flex",
//                               justifyContent: "space-between",
//                               alignItems: "center",
//                               padding: "12px 15px",
//                               margin: "8px 0",
//                               borderRadius: "8px",
//                               backgroundColor: "#f9f9f9",
//                               boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
//                             }}
//                           >
//                             <span style={{ fontWeight: "500" }}>
//                               {topping.name} - £{adjustedPrice.toFixed(1)}
//                               {/* {sizeMultiplier > 1 && (
//                                 <span style={{ fontSize: "0.9em", color: "#666" }}>
//                                   {" "}(+{Math.round((sizeMultiplier - 1) * 100)}% for {size})
//                                 </span>
//                               )} */}
//                             </span>
//                             <div
//                               className="topping-controls"
//                               style={{
//                                 display: "flex",
//                                 alignItems: "center",
//                                 gap: "10px",
//                               }}
//                             >
//                               <div
//                                 style={{
//                                   display: "flex",
//                                   alignItems: "center",
//                                   border: "1px solid #ddd",
//                                   borderRadius: "6px",
//                                   overflow: "hidden",
//                                 }}
//                               >
//                                 <button
//                                   style={{
//                                     width: "30px",
//                                     height: "30px",
//                                     border: "none",
//                                     background: "#f0f0f0",
//                                     cursor:
//                                       topping.quantity <= 0
//                                         ? "not-allowed"
//                                         : "pointer",
//                                     opacity: topping.quantity <= 0 ? "0.5" : "1",
//                                   }}
//                                   disabled={topping.quantity <= 0}
//                                   onClick={() =>
//                                     updatedToppingQuantity(index, "subtract")
//                                   }
//                                 >
//                                   -
//                                 </button>
//                                 <span
//                                   style={{ width: "30px", textAlign: "center" }}
//                                 >
//                                   {topping.quantity}
//                                 </span>
//                                 <button
//                                   style={{
//                                     width: "30px",
//                                     height: "30px",
//                                     border: "none",
//                                     background: "#f0f0f0",
//                                     cursor:
//                                       topping.quantity >= maxQuantity
//                                         ? "not-allowed"
//                                         : "pointer",
//                                     opacity:
//                                       topping.quantity >= maxQuantity
//                                         ? "0.5"
//                                         : "1",
//                                   }}
//                                   disabled={topping.quantity >= maxQuantity}
//                                   onClick={() =>
//                                     updatedToppingQuantity(index, "add")
//                                   }
//                                 >
//                                   +
//                                 </button>
//                               </div>
//                             </div>
//                           </li>
//                         );
//                       })}
//                     </ul>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Fixed Button at bottom */}
//       <FixedBtn
//         price={getPrice()}
//         onAddToCart={handleAddToCart}
//         name={"Add To Cart"}
//         link="/cart"
//       />
//     </WellFoodLayout>
//   );
// };

// export default page;

"use client";
import FixedBtn from "@/components/custom/FixedBtn";
import WellFoodLayout from "@/layout/WellFoodLayout";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { addItem } from "../../features/cart/cartSlice.js";
import React, { useEffect, useState, useRef } from "react";
import { Nav, Tab } from "react-bootstrap";
import {
  fetchPizzaById,
  fetchAllToppings,
  fetchAllIngredients,
} from "@/services/menuPizzaServices";
import { API_URL } from "@/services/config";
import PizzaLoader from "@/components/pizzaLoader";

const page = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const pizzaId = searchParams.get("id");
  const [pizza, setPizza] = useState(null);
  const [allToppings, setAllToppings] = useState([]);
  const [allIngredients, setAllIngredients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Move size state declaration before the useEffect that uses it
  const [size, setSize] = useState("Medium");

  const [ingredients, setIngredients] = useState([]);
  const [toppings, setToppings] = useState([]);
  const [initialBasePrice, setInitialBasePrice] = useState(0);
  const [tempPrice, setTempPrice] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const hasSetInitialPrice = useRef(false);
  const [isCombo, setIsCombo] = useState(false);
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
  // Add pizza base state
  const [pizzaBase, setPizzaBase] = useState("Regular Crust");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pizzaData, toppingsData, ingredientsData] = await Promise.all([
          fetchPizzaById(pizzaId),
          fetchAllToppings(),
          fetchAllIngredients(),
        ]);

        if (pizzaData.data) {
          setPizza(pizzaData.data);
        }
        if (toppingsData.data) {
          setAllToppings(toppingsData.data);
        }
        if (ingredientsData.data) {
          setAllIngredients(ingredientsData.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (pizzaId) {
      fetchData();
    }
  }, [pizzaId]);

  // Initialize ingredients and toppings when pizza data is loaded
  useEffect(() => {
    if (pizza && allToppings.length > 0) {
      // Map all ingredients with default quantities from pizza (if ingredients exist)
      const mappedIngredients = allIngredients.map((ing) => {
        const defaultIng = pizza.defaultIngredients?.find(
          (di) => di.ingredientId === ing.id
        );
        return {
          id: ing.id,
          name: ing.name,
          price: Number(ing.price),
          quantity: defaultIng ? defaultIng.quantity : 0,
          included: defaultIng ? defaultIng.include : false,
        };
      });

      // Map all toppings with default quantities from pizza
      const mappedToppings = allToppings.map((top) => {
        const defaultTop = pizza.defaultToppings?.find(
          (dt) => dt.toppingId === top.id
        );
        return {
          id: top.id,
          name: top.name,
          price: Number(top.price),
          quantity: defaultTop ? defaultTop.quantity : 0,
          included: defaultTop ? defaultTop.include : false,
        };
      });
      
      setIngredients(mappedIngredients);
      setToppings(mappedToppings);

      // Calculate initial base price using MEDIUM as base
      const sizes =
        typeof pizza.sizes === "string" ? JSON.parse(pizza.sizes) : pizza.sizes;
      const basePrice = Number(sizes.MEDIUM);
      setInitialBasePrice(basePrice);
      setFinalPrice(basePrice);
      setTempPrice(basePrice);
    }
  }, [pizza, allIngredients, allToppings]);

  // Function to get size multiplier for dynamic topping pricing
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

  // Calculate current base price based on size
  const getCurrentBasePrice = () => {
    if (!pizza) return 0;
    const sizes =
      typeof pizza.sizes === "string" ? JSON.parse(pizza.sizes) : pizza.sizes;
    
    switch (size) {
      case "Large":
        return Number(sizes?.LARGE || 0);
      case "Super Size":
        return Number(sizes?.SUPER_SIZE || 0);
      default:
        return Number(sizes?.MEDIUM || 0);
    }
  };

  // Calculate topping price modifications
  const calculateToppingModifications = () => {
    let totalAddedPrice = 0;
    let totalRemovedPrice = 0;
    const sizeMultiplier = getSizeMultiplier();

    toppings.forEach((top) => {
      const defaultTop = pizza?.defaultToppings?.find(
        (dt) => dt.toppingId === top.id
      );
      const defaultQuantity = defaultTop ? defaultTop.quantity : 0;
      const adjustedPrice = top.price * sizeMultiplier;

      if (top.quantity > defaultQuantity) {
        totalAddedPrice += (top.quantity - defaultQuantity) * adjustedPrice;
      } else if (top.quantity < defaultQuantity) {
        totalRemovedPrice += (defaultQuantity - top.quantity) * adjustedPrice;
      }
    });

    return { totalAddedPrice, totalRemovedPrice };
  };

  // Update price when ingredients or toppings change
  useEffect(() => {
    if (pizza && toppings.length > 0) {
      const currentBasePrice = getCurrentBasePrice();
      const { totalAddedPrice, totalRemovedPrice } = calculateToppingModifications();

      // Calculate temporary price (can go below base price for tracking)
      const tempCalculatedPrice = currentBasePrice - totalRemovedPrice + totalAddedPrice;
      setTempPrice(tempCalculatedPrice);

      // Final price should NEVER go below base price - this is the absolute floor
      const finalCalculatedPrice = Math.max(tempCalculatedPrice, currentBasePrice);
      setFinalPrice(finalCalculatedPrice);

      console.log('🔧 Price calculation:', {
        size,
        currentBasePrice,
        totalAddedPrice,
        totalRemovedPrice,
        tempCalculatedPrice,
        finalCalculatedPrice,
        'Price Floor Applied': tempCalculatedPrice < currentBasePrice
      });
    }
  }, [toppings, pizza, size]);
  
  const maxQuantity = 5;

  const updateQuantity = (index, operation) => {
    setIngredients((prevIngredients) =>
      prevIngredients.map((ingredient, idx) =>
        idx === index
          ? {
            ...ingredient,
            quantity:
              operation === "add"
                ? Math.min(ingredient.quantity + 1, maxQuantity)
                : Math.max(ingredient.quantity - 1, 0),
          }
          : ingredient
      )
    );
  };

  const updatedToppingQuantity = (index, operation) => {
    setToppings((prevToppings) => {
      const newToppings = prevToppings.map((topping, idx) =>
        idx === index
          ? {
            ...topping,
            quantity:
              operation === "add"
                ? Math.min(topping.quantity + 1, maxQuantity)
                : Math.max(topping.quantity - 1, 0),
          }
          : topping
      );
      
      return newToppings;
    });
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

  const getPrice = () => {
    if (!pizza) return 0;

    const currentBasePrice = getCurrentBasePrice();
    const { totalAddedPrice, totalRemovedPrice } = calculateToppingModifications();

    // Calculate the raw price: base price + added toppings - removed toppings
    let calculatedPrice = currentBasePrice - totalRemovedPrice + totalAddedPrice;

    // ENFORCE PRICE FLOOR: Never go below base price
    calculatedPrice = Math.max(calculatedPrice, currentBasePrice);

    // Add stuffed crust pricing if selected
    if (pizzaBase.includes("Stuffed Crust")) {
      switch (size) {
        case "Large":
          calculatedPrice += 3; // £3 for large
          break;
        case "Super Size":
          calculatedPrice += 4; // £4 for super size
          break;
        default:
          calculatedPrice += 2; // £2 for medium
          break;
      }
    }

    // Ensure final price is never negative (additional safety)
    calculatedPrice = Math.max(calculatedPrice, 0);

    console.log('🔧 getPrice() calculation:', {
      basePrice: currentBasePrice,
      totalAddedPrice,
      totalRemovedPrice,
      rawPrice: currentBasePrice - totalRemovedPrice + totalAddedPrice,
      finalPrice: calculatedPrice,
      'Floor Applied': (currentBasePrice - totalRemovedPrice + totalAddedPrice) < currentBasePrice
    });

    return Number(calculatedPrice * quantity);
  };

  const handleAddToCart = (e) => {
    if (quantity > 0) {
      dispatch(
        addItem({
          id: pizzaId,
          title: pizza?.name,
          img: pizza?.imageUrl,
          price: Number(getPrice()),
          eachprice: Number(getPrice() / quantity),
          ingredients: ingredients,
          toppings: toppings,
          quantity: Number(quantity),
          size: size,
          pizzaBase: pizzaBase, // Add pizza base to cart
        })
      );
    } else {
      console.error("Quantity must be greater than 0");
    }
  };

  if (loading && !pizza) {
    return <PizzaLoader />;
  }

  if (!pizza) {
    return (
      <WellFoodLayout>
        <div className="container">
          <div className="text-center py-5">
            <h2>Pizza not found</h2>
          </div>
        </div>
      </WellFoodLayout>
    );
  }

  return (
    <WellFoodLayout>
      {loading && <PizzaLoader />}
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
                    src={`${API_URL}/images/pizza-${pizza.id}.png`}
                    alt={pizza.name}
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
                    {pizza.name}
                  </h2>
                  <p
                    className="mb-4"
                    style={{ fontSize: "1.2rem", color: "#666" }}
                  >
                    {pizza.description ||
                      "Delicious pizza with fresh ingredients"}
                  </p>

                  {/* Pizza Base Selection */}
                  {!isCombo && (
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
                          //justifyContent: "center", // ✅ Center on all screens (esp. mobile)
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
                              borderColor: baseOption.includes("Stuffed Crust") ? (pizzaBase.includes("Stuffed Crust") ? "#ff6b35" : "#ddd") : (pizzaBase === baseOption ? "#ff6b35" : "#ddd"),
                              backgroundColor: baseOption.includes("Stuffed Crust") ? (pizzaBase.includes("Stuffed Crust") ? "#fff4f0" : "#fff") : (pizzaBase === baseOption ? "#fff4f0" : "#fff"),
                              cursor: "pointer",
                              transition: "all 0.3s ease",
                            }}
                          >

                            <input
                              type="radio"
                              name="pizzaBase"
                              value={baseOption}
                              checked={baseOption.includes("Stuffed Crust") ? pizzaBase.includes("Stuffed Crust") : pizzaBase === baseOption}
                              onChange={() => setPizzaBase(baseOption)}
                              style={{
                                display: "none", // ✅ Hide default radio button
                              }}
                            />
                            <span
                              style={{
                                fontWeight: baseOption.includes("Stuffed Crust") ? (pizzaBase.includes("Stuffed Crust") ? "600" : "400") : (pizzaBase === baseOption ? "600" : "400"),
                                color: baseOption.includes("Stuffed Crust") ? (pizzaBase.includes("Stuffed Crust") ? "#ff6b35" : "#333") : (pizzaBase === baseOption ? "#ff6b35" : "#333"), // Optional highlight
                              }}
                            >
                              {baseOption}
                            </span>
                          </label>
                        ))}
                      </div>


                    </div>
                  )}

                  {/* Size Selection */}
                  {!isCombo && (
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
                  )}

                  {/* Price Display */}
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

                  {/* Toppings Section with Dynamic Pricing - MOVED HERE */}
                  {!isCombo && toppings && toppings.length > 0 && (
                    <div className="toppings-section mb-4">
                      <h5
                        className="mb-3"
                        style={{
                          fontSize: "1.2rem",
                          fontWeight: "600",
                        }}
                      >
                        Toppings
                      </h5>
                      <ul
                        className="toppings-list"
                        style={{ listStyle: "none", padding: "0" }}
                      >
                        {toppings.map((topping, index) => {
                          const sizeMultiplier = getSizeMultiplier();
                          const adjustedPrice = topping.price * sizeMultiplier;

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
                                {topping.name} - £{adjustedPrice.toFixed(1)}
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
                                        topping.quantity >= maxQuantity
                                          ? "not-allowed"
                                          : "pointer",
                                      opacity:
                                        topping.quantity >= maxQuantity
                                          ? "0.5"
                                          : "1",
                                    }}
                                    disabled={topping.quantity >= maxQuantity}
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
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fixed Button at bottom */}
      <FixedBtn
        price={getPrice()}
        onAddToCart={handleAddToCart}
        name={"Add To Cart"}
        link="/cart"
      />
    </WellFoodLayout>
  );
};

export default page;