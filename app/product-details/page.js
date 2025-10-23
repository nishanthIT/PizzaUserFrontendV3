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
  const pizzaType = searchParams.get("type"); // New: Check if this is a Pizza Builder
  const selectedBase = searchParams.get("selectedBase"); // Pre-selected base from menu
  const selectedSauce = searchParams.get("selectedSauce"); // Pre-selected sauce from menu
  const fourToppingMode = searchParams.get("fourToppingMode") === "true"; // Check if this is 4-topping mode
  const pizzaBuilderMode = searchParams.get("pizzaBuilder") === "true"; // Check if this is pizza builder mode from selection
  const startFromZero = searchParams.get("startFromZero") === "true"; // Check if all toppings should start from 0
  const dealId = searchParams.get("dealId"); // Specific Pizza Builder deal to use
  const urlMaxToppings = searchParams.get("maxToppings"); // Max toppings from menu selection
  
  // Debug logging for URL parameters
  console.log("🍕 URL Parameters Debug:", {
    pizzaId,
    pizzaBuilderMode,
    fourToppingMode,
    startFromZero,
    dealId,
    urlMaxToppings,
    allParams: Object.fromEntries(searchParams.entries())
  });
  
  // Extra debug to see if parameters are being extracted
  console.log("🔍 Raw dealId from URL:", searchParams.get("dealId"));
  console.log("🔍 Raw maxToppings from URL:", searchParams.get("maxToppings"));
  console.log("🔍 Full URL search params:", searchParams.toString());

  // Fetch Pizza Builder Deal settings when in pizza builder mode
  useEffect(() => {
    const fetchPizzaBuilderDeal = async () => {
      if (pizzaBuilderMode || startFromZero) {
        try {
          console.log("🍕 Fetching Pizza Builder Deal settings...");
          
          // Get active pizza builder deals
          const response = await fetch(`${API_URL}/getPizzaBuilderDeals`);
          if (response.ok) {
            const deals = await response.json();
            console.log("🍕 Raw API response:", deals);
            if (deals && deals.length > 0) {
              let selectedDeal;
              
              // If a specific dealId is provided in URL, use that deal
              if (dealId) {
                console.log("🔍 Looking for deal with ID:", dealId);
                console.log("🔍 Available deals:", deals.map(d => ({ id: d.id, name: d.name, maxToppings: d.maxToppings })));
                selectedDeal = deals.find(deal => deal.id === dealId && deal.isActive);
                if (selectedDeal) {
                  console.log("🍕 Using URL-specified deal:", selectedDeal.name, "- maxToppings:", selectedDeal.maxToppings);
                } else {
                  console.warn("🍕 URL-specified deal not found or inactive, falling back to rotation");
                  console.warn("🔍 Searched for ID:", dealId, "in", deals.length, "deals");
                }
              }
              
              // If no specific deal or deal not found, use rotation logic
              if (!selectedDeal) {
                // Filter active deals first
                const activeDeals = deals.filter(deal => deal.isActive);
                
                if (activeDeals.length > 0) {
                  // Automatic deal rotation based on pizza ID hash
                  // This ensures the same pizza always gets the same deal, but different pizzas get different deals
                  const pizzaHash = pizzaId ? pizzaId.split('').reduce((a, b) => {
                    a = ((a << 5) - a) + b.charCodeAt(0);
                    return a & a;
                  }, 0) : 0;
                  
                  const dealIndex = Math.abs(pizzaHash) % activeDeals.length;
                  selectedDeal = activeDeals[dealIndex];
                  
                  console.log("🍕 Auto-selected deal via rotation:", {
                    pizzaId,
                    pizzaHash,
                    dealIndex,
                    selectedDeal: selectedDeal.name,
                    maxToppings: selectedDeal.maxToppings,
                    totalActiveDeals: activeDeals.length
                  });
                } else {
                  // Fallback to first deal if none are active
                  selectedDeal = deals[0];
                  console.log("🍕 No active deals found, using first deal:", selectedDeal?.name);
                }
              }
              
              console.log("🍕 Final selected deal:", selectedDeal);
              console.log("🍕 Deal maxToppings:", selectedDeal?.maxToppings);
              setPizzaBuilderDeal(selectedDeal);
              console.log("🍕 Pizza Builder Deal loaded:", selectedDeal);
            } else {
              console.log("🍕 No deals found in response");
            }
          } else {
            console.log("🍕 API response not ok:", response.status);
          }
        } catch (error) {
          console.error("🍕 Error fetching Pizza Builder Deal:", error);
        }
      }
    };

    fetchPizzaBuilderDeal();
  }, [pizzaBuilderMode, startFromZero, dealId, pizzaId]);

  // Utility function to get max free toppings dynamically
  const getMaxFreeToppings = () => {
    // Priority order: URL maxToppings > Pizza Builder Deal > Other modes
    let finalValue;
    
    if (urlMaxToppings && !isNaN(urlMaxToppings)) {
      // First priority: maxToppings from URL (passed from menu)
      finalValue = parseInt(urlMaxToppings);
    } else if (pizzaBuilderMode && pizzaBuilderDeal?.maxToppings) {
      // Second priority: Deal maxToppings
      finalValue = pizzaBuilderDeal.maxToppings;
    } else if (fourToppingMode) {
      // Third priority: Four topping mode
      finalValue = 4;
    } else {
      // Default fallback
      finalValue = pizza?.maxToppings || 4;
    }
    
    console.log("🍕 getMaxFreeToppings called:", {
      urlMaxToppings,
      pizzaBuilderMode,
      pizzaBuilderDeal: pizzaBuilderDeal?.maxToppings,
      fourToppingMode,
      pizzaMaxToppings: pizza?.maxToppings,
      finalValue
    });
    
    return finalValue;
  };
  const [pizza, setPizza] = useState(null);
  const [allToppings, setAllToppings] = useState([]);
  const [allIngredients, setAllIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showToppingLimitModal, setShowToppingLimitModal] = useState(false);
  const [pendingToppingAdd, setPendingToppingAdd] = useState(null);
  const [hasConfirmedExtraToppings, setHasConfirmedExtraToppings] = useState(false);
  const [pizzaBuilderDeal, setPizzaBuilderDeal] = useState(null);

  // Debug: Monitor pizzaBuilderDeal changes
  useEffect(() => {
    console.log("🍕 pizzaBuilderDeal state changed:", {
      deal: pizzaBuilderDeal,
      maxToppings: pizzaBuilderDeal?.maxToppings,
      name: pizzaBuilderDeal?.name
    });
  }, [pizzaBuilderDeal]);

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
        let pizzaData, toppingsData, ingredientsData;

        if (pizzaType === "pizzaBuilder") {
          // Fetch Pizza Builder deal and convert to pizza format
          console.log("🍕 Fetching Pizza Builder deal:", pizzaId);
          
          const [builderResponse, toppingsResponse, ingredientsResponse] = await Promise.all([
            fetch(`${API_URL}/getPizzaBuilderDeal/${pizzaId}?allowInactive=true`),
            fetchAllToppings(),
            fetchAllIngredients(),
          ]);

          if (builderResponse.ok) {
            const builderDeal = await builderResponse.json();
            console.log("🍕 Pizza Builder deal data:", builderDeal);
            console.log("🍕 Selected base from menu:", selectedBase);
            console.log("🍕 Selected sauce from menu:", selectedSauce);
            
            // Parse available options
            let availableBases = builderDeal.availableBases || [];
            let availableSauces = builderDeal.availableSauces || [];
            
            if (typeof availableBases === 'string') {
              try {
                availableBases = JSON.parse(availableBases);
              } catch (e) {
                availableBases = [];
              }
            }
            
            if (typeof availableSauces === 'string') {
              try {
                availableSauces = JSON.parse(availableSauces);
              } catch (e) {
                availableSauces = [];
              }
            }
            
            // Convert Pizza Builder deal to pizza format
            const convertedPizza = {
              id: builderDeal.id,
              name: builderDeal.name,
              description: builderDeal.description,
              imageUrl: builderDeal.imageUrl || null,
              sizes: {
                "Medium": builderDeal.sizePricing?.MEDIUM || 6,
                "Large": builderDeal.sizePricing?.LARGE || 7,
                "Super Size": builderDeal.sizePricing?.SUPER_SIZE || 8.7
              },
              // Pre-included toppings based on selected base and sauce
              defaultToppings: [],
              // Available toppings for customization (limited by maxToppings)
              maxToppings: builderDeal.maxToppings || 4,
              availableToppings: builderDeal.availableToppings || [],
              availableBases: availableBases,
              availableSauces: availableSauces,
              selectedBase: selectedBase ? JSON.parse(decodeURIComponent(selectedBase)) : null,
              selectedSauce: selectedSauce ? JSON.parse(decodeURIComponent(selectedSauce)) : null,
              isPizzaBuilder: true,
              builderDealId: builderDeal.id
            };
            
            pizzaData = { data: convertedPizza };
            console.log("🍕 Converted pizza data:", convertedPizza);
          } else {
            throw new Error("Pizza Builder deal not found");
          }
          
          toppingsData = toppingsResponse;
          ingredientsData = ingredientsResponse;
        } else {
          // Regular pizza fetch
          [pizzaData, toppingsData, ingredientsData] = await Promise.all([
            fetchPizzaById(pizzaId),
            fetchAllToppings(),
            fetchAllIngredients(),
          ]);
        }

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
  }, [pizzaId, pizzaType]);

  // Initialize ingredients and toppings when pizza data is loaded
  useEffect(() => {
    console.log("🍕 useEffect running with:", { pizza: !!pizza, toppingsLength: allToppings.length, pizzaBuilderMode, startFromZero });
    
    if (pizza && allToppings.length > 0) {
      if (pizza.isPizzaBuilder || pizzaBuilderMode || startFromZero) {
        console.log("🍕 Entering Pizza Builder mode!");
        
        // Check if this is a special Pizza Builder item with specific toppings
        if (pizza.isPizzaBuilder && pizza.availableToppings) {
          console.log("🍕 Using special Pizza Builder toppings:", pizza.availableToppings);
          
          // For special Pizza Builder items, use only the available toppings from the deal
          const builderToppings = pizza.availableToppings.map((topping) => ({
            id: topping.id,
            name: topping.name,
            price: Number(topping.price || 1),
            quantity: 0,
            included: false,
          }));
          
          setToppings(builderToppings);
          setIngredients([]);
        } else {
          console.log("🍕 Using Pizza Builder Deal settings");
          
          // For regular pizzas in builder mode, use only selected toppings from Pizza Builder Deal
          let availableToppingsFromDeal = [];
          
          if (pizzaBuilderDeal && pizzaBuilderDeal.availableToppings) {
            // Extract topping names from Pizza Builder Deal
            const selectedToppingNames = pizzaBuilderDeal.availableToppings;
            
            // Filter allToppings to only include selected ones
            availableToppingsFromDeal = allToppings.filter(topping => 
              selectedToppingNames.includes(topping.name)
            );
            
            console.log("🍕 Filtered toppings from deal:", {
              selectedToppingNames,
              availableToppingsFromDeal: availableToppingsFromDeal.map(t => t.name)
            });
          } else {
            // Fallback: use all toppings if no deal settings
            availableToppingsFromDeal = allToppings;
            console.log("🍕 No Pizza Builder Deal found, using all toppings");
          }
          
          const builderToppings = availableToppingsFromDeal.map((topping) => ({
            id: topping.id,
            name: topping.name,
            price: Number(topping.price),
            quantity: 0, // Start with no toppings selected
            included: false,
          }));
          
          // Also initialize ingredients to 0 if in builder mode
          const builderIngredients = allIngredients.map((ingredient) => ({
            id: ingredient.id,
            name: ingredient.name,
            price: Number(ingredient.price),
            quantity: 0,
            included: false,
          }));
          
          setToppings(builderToppings);
          setIngredients(builderIngredients);
        }
        
        console.log("🍕 Pizza Builder initialization complete");
      } else {
        // Regular pizza logic
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

        const mappedToppings = allToppings.map((top) => {
          // Debug logging
          console.log("🍕 Topping mapping debug:", {
            pizzaBuilderMode,
            fourToppingMode,
            isPizzaBuilder: pizza?.isPizzaBuilder,
            startFromZero,
            toppingName: top.name
          });
          
          // In pizza builder mode, all toppings start at 0
          if (pizzaBuilderMode || fourToppingMode || pizza?.isPizzaBuilder || startFromZero) {
            console.log("🍕 Setting topping to 0:", top.name);
            return {
              id: top.id,
              name: top.name,
              price: Number(top.price),
              quantity: 0, // Always start at 0 in builder modes
              included: false,
            };
          }
          
          // Regular pizza mode - use default toppings
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
      }

      // Calculate initial base price using MEDIUM as base
      const sizes =
        typeof pizza.sizes === "string" ? JSON.parse(pizza.sizes) : pizza.sizes;
      const basePrice = Number(sizes.MEDIUM);
      setInitialBasePrice(basePrice);
      setFinalPrice(basePrice);
      setTempPrice(basePrice);
    }
  }, [pizza, allIngredients, allToppings, pizzaBuilderMode, startFromZero, pizzaBuilderDeal]);

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

    // Special handling for pizza builder modes
    if (pizzaBuilderMode || fourToppingMode || pizza?.isPizzaBuilder) {
      const freeToppings = getMaxFreeToppings();
      
      // Calculate total topping units (considering quantities)
      const totalToppingUnits = toppings.reduce((sum, top) => sum + top.quantity, 0);
      const freeToppingUnits = freeToppings;
      const extraToppingUnits = Math.max(0, totalToppingUnits - freeToppingUnits);
      
      // Charge for extra topping units only
      if (extraToppingUnits > 0) {
        let extraUnitsRemaining = extraToppingUnits;
        
        toppings.forEach((top) => {
          if (top.quantity > 0 && extraUnitsRemaining > 0) {
            const adjustedPrice = top.price * sizeMultiplier;
            const unitsToCharge = Math.min(top.quantity, extraUnitsRemaining);
            totalAddedPrice += unitsToCharge * adjustedPrice;
            extraUnitsRemaining -= unitsToCharge;
          }
        });
      }
      
      console.log('🍕 Builder mode pricing:', {
        totalToppingUnits,
        freeToppingUnits,
        extraToppingUnits,
        totalAddedPrice
      });
    } else {
      // Regular pizza mode - use default topping logic
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
    }

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
    console.log("🍕 updatedToppingQuantity called:", { index, operation });
    setToppings((prevToppings) => {
      // For Pizza Builder modes, allow unlimited toppings but inform about pricing after 4 units
      if ((pizza?.isPizzaBuilder || fourToppingMode || pizzaBuilderMode) && operation === "add") {
        const currentToppingUnits = prevToppings.reduce((sum, t) => sum + t.quantity, 0);
        const maxFree = getMaxFreeToppings();
        
        // If this addition would exceed the free limit and user hasn't confirmed yet
        if (currentToppingUnits >= maxFree && !hasConfirmedExtraToppings) {
          // Show modal instead of immediate confirm
          const toppingDetails = prevToppings[index];
          setPendingToppingAdd({ 
            index, 
            operation, 
            toppingName: toppingDetails.name,
            toppingPrice: toppingDetails.price 
          });
          setShowToppingLimitModal(true);
          return prevToppings; // Don't change anything yet
        }
      }

      const newToppings = prevToppings.map((topping, idx) =>
        idx === index
          ? {
            ...topping,
            quantity:
              operation === "add"
                ? Math.min(topping.quantity + 1, maxQuantity) // Allow multiple quantities even in builder mode
                : Math.max(topping.quantity - 1, 0),
          }
          : topping
      );
      
      // Reset confirmation flag if we go back below the free limit
      if ((pizza?.isPizzaBuilder || fourToppingMode || pizzaBuilderMode)) {
        const newToppingUnits = newToppings.reduce((sum, t) => sum + t.quantity, 0);
        const maxFree = getMaxFreeToppings();
        if (newToppingUnits < maxFree) {
          setHasConfirmedExtraToppings(false);
        }
      }
      
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

  // Handle topping limit modal confirmation
  const handleToppingLimitConfirm = () => {
    console.log("🍕 handleToppingLimitConfirm called", pendingToppingAdd);
    if (pendingToppingAdd) {
      const { index, operation } = pendingToppingAdd;
      console.log("🍕 Processing topping add:", { index, operation });
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
    }
    setHasConfirmedExtraToppings(true); // User has confirmed they're okay with extra charges
    setShowToppingLimitModal(false);
    setPendingToppingAdd(null);
  };

  const handleToppingLimitCancel = () => {
    console.log("🍕 handleToppingLimitCancel called");
    setShowToppingLimitModal(false);
    setPendingToppingAdd(null);
  };

  const handleAddToCart = (e) => {
    if (quantity > 0) {
      const cartItem = {
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
      };

      // Add Pizza Builder specific fields if this is a Pizza Builder item
      if (pizzaBuilderMode || startFromZero || pizza?.isPizzaBuilder) {
        cartItem.isPizzaBuilder = true;
        cartItem.pizzaBuilderDealId = pizzaBuilderDeal?.id;
        cartItem.maxToppings = getMaxFreeToppings();
        
        // Debug cart item creation
        console.log("🛒 Adding Pizza Builder item to cart:", {
          dealName: pizzaBuilderDeal?.name,
          dealId: pizzaBuilderDeal?.id,
          maxToppings: cartItem.maxToppings,
          price: cartItem.price
        });
      }

      dispatch(addItem(cartItem));
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
    <>
      {/* Topping Limit Modal */}
      {showToppingLimitModal && (
        <>
          {console.log("🍕 Modal is rendering!", { showToppingLimitModal, pendingToppingAdd })}
          <style jsx>{`
            @keyframes modalSlideIn {
              from {
                opacity: 0;
                transform: scale(0.9) translateY(-20px);
              }
              to {
                opacity: 1;
                transform: scale(1) translateY(0);
              }
            }
          `}</style>
          <div className="modal-backdrop" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          pointerEvents: 'auto'
        }} onClick={(e) => {
          console.log("🍕 Backdrop clicked", e.target === e.currentTarget);
          if (e.target === e.currentTarget) {
            handleToppingLimitCancel();
          }
        }}>
          <div className="modal-dialog" style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
            transform: 'scale(1)',
            animation: 'modalSlideIn 0.3s ease-out',
            pointerEvents: 'auto',
            position: 'relative'
          }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header mb-3">
              <h4 style={{ 
                color: '#333', 
                fontWeight: '600',
                margin: 0,
                display: 'flex',
                alignItems: 'center'
              }}>
                🍕 Additional Toppings
              </h4>
            </div>
            <div className="modal-body mb-4">
              <p style={{ color: '#666', fontSize: '1.1rem', lineHeight: '1.5', margin: 0 }}>
                You've reached your <strong>{getMaxFreeToppings()} free toppings</strong> limit! 
                <br />
                <br />
                Adding <strong>{pendingToppingAdd?.toppingName || 'this topping'}</strong> will cost an extra{' '}
                <strong style={{ color: '#ff6b35', fontSize: '1.2rem' }}>
                  £{((pendingToppingAdd?.toppingPrice || 0) * getSizeMultiplier()).toFixed(2)}
                </strong>
                {' '}for {size} size
                <br />
                <br />
                Would you like to continue?
              </p>
            </div>
            <div className="modal-footer" style={{ 
              display: 'flex', 
              gap: '1rem',
              justifyContent: 'flex-end'
            }}>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log("🍕 Cancel clicked!");
                  handleToppingLimitCancel();
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '2px solid #ddd',
                  backgroundColor: 'white',
                  color: '#666',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  pointerEvents: 'auto'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#f8f9fa';
                  e.target.style.borderColor = '#adb5bd';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.borderColor = '#ddd';
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  console.log("🍕 Simple button click detected!");
                  console.log("🍕 pendingToppingAdd:", pendingToppingAdd);
                  console.log("🍕 Calling handleToppingLimitConfirm...");
                  try {
                    handleToppingLimitConfirm();
                    console.log("🍕 handleToppingLimitConfirm completed successfully!");
                  } catch (error) {
                    console.error("🍕 Error in handleToppingLimitConfirm:", error);
                  }
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '2px solid #ff6b35',
                  backgroundColor: '#ff6b35',
                  color: 'white',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  pointerEvents: 'auto',
                  position: 'relative',
                  zIndex: 10000
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#e55a2b';
                  e.target.style.borderColor = '#e55a2b';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#ff6b35';
                  e.target.style.borderColor = '#ff6b35';
                }}
              >
                Continue & Add Topping
              </button>
            </div>
          </div>
        </div>
        </>
      )}
      
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
                  
                  {/* Four Topping Mode or Pizza Builder Mode Indicator */}
                  {(fourToppingMode || pizzaBuilderMode) && (
                    <div className="alert alert-info mb-3" style={{
                      backgroundColor: "#e7f3ff",
                      border: "1px solid #b6d7ff",
                      borderRadius: "8px",
                      padding: "12px",
                      fontSize: "1rem",
                      color: "#0066cc"
                    }}>
                      <strong>🍕 Pizza Builder Mode:</strong> Customize this pizza with your choice of size, toppings, and base - up to {getMaxFreeToppings()} toppings!
                    </div>
                  )}
                  
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
    </>
  );
};

export default page;