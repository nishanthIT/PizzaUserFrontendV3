// "use client";
// import FixedBtn from "@/components/custom/FixedBtn";
// import WellFoodLayout from "@/layout/WellFoodLayout";
// import Link from "next/link";
// import { useRouter, useSearchParams } from "next/navigation";
// import React, { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
// import { addToCart } from "@/features/cart/cartSlice";
// import { API_URL } from "@/services/config";
// import PizzaLoader from "@/components/pizzaLoader";

// const ComboStyleDetails = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const dispatch = useDispatch();

//   // URL parameters
//   const itemId = searchParams.get("id");
//   const selectedSize = searchParams.get("size");
//   const isMealDeal = searchParams.get("mealDeal") === "true";

//   // State
//   const [item, setItem] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedSauce, setSelectedSauce] = useState("");
//   const [selectedSides, setSelectedSides] = useState([]);
//   const [selectedDrinks, setSelectedDrinks] = useState([]);
//   const [availableSides, setAvailableSides] = useState([]);
//   const [availableDrinks, setAvailableDrinks] = useState([]);
//   const [quantity, setQuantity] = useState(1);

//   useEffect(() => {
//     if (!itemId || !selectedSize) {
//       setError("Missing required parameters");
//       setLoading(false);
//       return;
//     }

//     const fetchData = async () => {
//       try {
//         // Fetch the specific item
//         const itemResponse = await fetch(`${API_URL}/getComboStyleItems`);
//         const itemsData = await itemResponse.json();
//         console.log("Items data:", itemsData);
//         console.log("Looking for item ID:", itemId, "Type:", typeof itemId);
//         const currentItem = Array.isArray(itemsData) ? 
//           itemsData.find(i => i.id == itemId || i.id === parseInt(itemId)) : null;

//         if (!currentItem) {
//           setError("Item not found");
//           setLoading(false);
//           return;
//         }

//         console.log("Found item:", currentItem);
//         console.log("Selected size:", selectedSize);
//         console.log("Size pricing:", currentItem.sizePricing);

//         // Check if the selected size exists in pricing
//         if (!currentItem.sizePricing || !currentItem.sizePricing[selectedSize]) {
//           setError(`Size "${selectedSize}" not available for this item`);
//           setLoading(false);
//           return;
//         }

//         setItem(currentItem);

//         // Set default sauce
//         if (currentItem.availableSauces && currentItem.availableSauces.length > 0) {
//           setSelectedSauce(currentItem.availableSauces[0]);
//         }

//         // If meal deal, fetch sides and drinks
//         if (isMealDeal) {
//           const [sidesResponse, drinksResponse] = await Promise.all([
//             fetch(`${API_URL}/getComboStyleItemSides?itemId=${itemId}`),
//             fetch(`${API_URL}/getComboStyleItemDrinks?itemId=${itemId}`)
//           ]);

//           const sidesData = await sidesResponse.json();
//           const drinksData = await drinksResponse.json();

//           setAvailableSides(Array.isArray(sidesData) ? sidesData : []);
//           setAvailableDrinks(Array.isArray(drinksData) ? drinksData : []);
//         }

//       } catch (error) {
//         console.error("Error fetching data:", error);
//         console.error("API URL:", API_URL);
//         console.error("Item ID:", itemId);
//         console.error("Selected Size:", selectedSize);
//         console.error("Is Meal Deal:", isMealDeal);
//         setError(`Failed to load item details: ${error.message}`);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [itemId, selectedSize, isMealDeal]);

//   // Handle side selection
//   const handleSideSelection = (sideId) => {
//     const maxSides = item?.mealDealConfig?.[selectedSize]?.sideCount || 1;
    
//     if (selectedSides.includes(sideId)) {
//       setSelectedSides(selectedSides.filter(id => id !== sideId));
//     } else if (selectedSides.length < maxSides) {
//       setSelectedSides([...selectedSides, sideId]);
//     }
//   };

//   // Handle drink selection
//   const handleDrinkSelection = (drinkId) => {
//     const maxDrinks = item?.mealDealConfig?.[selectedSize]?.drinkCount || 1;
    
//     if (selectedDrinks.includes(drinkId)) {
//       setSelectedDrinks(selectedDrinks.filter(id => id !== drinkId));
//     } else if (selectedDrinks.length < maxDrinks) {
//       setSelectedDrinks([...selectedDrinks, drinkId]);
//     }
//   };

//   const handleAddToCart = () => {
//     if (!selectedSauce) {
//       alert("Please select a sauce");
//       return;
//     }

//     if (isMealDeal) {
//       const requiredSides = item?.mealDealConfig?.[selectedSize]?.sideCount || 1;
//       const requiredDrinks = item?.mealDealConfig?.[selectedSize]?.drinkCount || 1;

//       if (selectedSides.length !== requiredSides) {
//         alert(`Please select ${requiredSides} side${requiredSides > 1 ? 's' : ''}`);
//         return;
//       }

//       if (selectedDrinks.length !== requiredDrinks) {
//         alert(`Please select ${requiredDrinks} drink${requiredDrinks > 1 ? 's' : ''}`);
//         return;
//       }
//     }

//     const pricing = item.sizePricing[selectedSize];
//     const price = isMealDeal ? pricing.mealDealPrice : pricing.basePrice;

//     const cartItem = {
//       id: `${item.id}-${selectedSize}-${isMealDeal ? 'meal' : 'normal'}-${Date.now()}`,
//       type: 'comboStyleItem',
//       itemId: item.id,
//       name: item.name,
//       size: selectedSize,
//       sauce: selectedSauce,
//       price: parseFloat(price),
//       quantity: quantity,
//       isMealDeal: isMealDeal,
//       sides: isMealDeal ? selectedSides.map(sideId => 
//         availableSides.find(s => s.id === sideId)
//       ).filter(Boolean) : [],
//       drinks: isMealDeal ? selectedDrinks.map(drinkId => 
//         availableDrinks.find(d => d.id === drinkId)
//       ).filter(Boolean) : [],
//       image: item.imageUrl || 'default-combo.png'
//     };

//     dispatch(addToCart(cartItem));
//     router.push("/cart");
//   };

//   if (loading) {
//     return (
//       <WellFoodLayout>
//         <PizzaLoader forceDuration={4000} />
//       </WellFoodLayout>
//     );
//   }

//   if (error || !item) {
//     return (
//       <WellFoodLayout>
//         <div className="container">
//           <div className="text-center py-5">
//             <h2 className="mb-4">{error || "Item not found"}</h2>
//             <Link href="/combo-style-menu">
//               <button className="theme-btn">Back to Menu</button>
//             </Link>
//           </div>
//         </div>
//       </WellFoodLayout>
//     );
//   }

//   const pricing = item.sizePricing?.[selectedSize];
//   if (!pricing) {
//     return (
//       <WellFoodLayout>
//         <div className="container">
//           <div className="text-center py-5">
//             <h2 className="mb-4">Invalid size selection</h2>
//             <Link href="/combo-style-menu">
//               <button className="theme-btn">Back to Menu</button>
//             </Link>
//           </div>
//         </div>
//       </WellFoodLayout>
//     );
//   }
//   const price = isMealDeal ? pricing.mealDealPrice : pricing.basePrice;

//   return (
//     <WellFoodLayout>
//       <div className="product-details-area pt-120 rpt-100 pb-85 rpb-65">
//         <div className="container">
//           <div className="row">
//             <div className="col-lg-6">
//               <div className="product-details-images mb-30">
//                 <img
//                   src={`${API_URL}/images/${item.imageUrl || 'default-combo.png'}`}
//                   alt={item.name}
//                   style={{
//                     width: "100%",
//                     height: "400px",
//                     objectFit: "cover",
//                     borderRadius: "15px"
//                   }}
//                 />
//               </div>
//             </div>

//             <div className="col-lg-6">
//               <div className="product-details-content">
//                 <h1 style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "20px" }}>
//                   {item.name}
//                 </h1>
                
//                 <div style={{ 
//                   background: "#fff5f2", 
//                   padding: "20px", 
//                   borderRadius: "12px",
//                   border: "1px solid #ff6b35",
//                   marginBottom: "30px"
//                 }}>
//                   <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                     <div>
//                       <h3 style={{ fontSize: "1.5rem", fontWeight: "600", textTransform: "capitalize" }}>
//                         {selectedSize === "wings" ? "8 Wings" : selectedSize}
//                       </h3>
//                       {isMealDeal && (
//                         <p style={{ color: "#ff6b35", fontWeight: "600", margin: "5px 0" }}>
//                           🌟 Meal Deal - with {item.mealDealConfig[selectedSize]?.sideCount || 1} side{(item.mealDealConfig[selectedSize]?.sideCount || 1) > 1 ? 's' : ''} and {item.mealDealConfig[selectedSize]?.drinkCount || 1} drink{(item.mealDealConfig[selectedSize]?.drinkCount || 1) > 1 ? 's' : ''}
//                         </p>
//                       )}
//                     </div>
//                     <div style={{ textAlign: "right" }}>
//                       <div style={{ fontSize: "2rem", fontWeight: "700", color: "#ff6b35" }}>
//                         £{parseFloat(price).toFixed(2)}
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <p style={{ fontSize: "1.1rem", color: "#666", marginBottom: "30px" }}>
//                   {item.description}
//                 </p>

//                 {/* Sauce Selection */}
//                 <div style={{ marginBottom: "30px" }}>
//                   <h4 style={{ fontSize: "1.3rem", fontWeight: "600", marginBottom: "15px" }}>
//                     Choose Your Sauce (No Extra Charge):
//                   </h4>
//                   <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "10px" }}>
//                     {item.availableSauces?.map((sauce, index) => (
//                       <button
//                         key={index}
//                         onClick={() => setSelectedSauce(sauce)}
//                         style={{
//                           padding: "12px 16px",
//                           borderRadius: "8px",
//                           border: selectedSauce === sauce ? "2px solid #ff6b35" : "2px solid #f0f0f0",
//                           background: selectedSauce === sauce ? "#fff5f2" : "#fff",
//                           color: selectedSauce === sauce ? "#ff6b35" : "#333",
//                           fontWeight: selectedSauce === sauce ? "600" : "400",
//                           cursor: "pointer",
//                           transition: "all 0.3s ease"
//                         }}
//                       >
//                         {sauce}
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Meal Deal Selections */}
//                 {isMealDeal && (
//                   <>
//                     {/* Sides Selection */}
//                     <div style={{ marginBottom: "30px" }}>
//                       <h4 style={{ fontSize: "1.3rem", fontWeight: "600", marginBottom: "15px" }}>
//                         Choose {item.mealDealConfig[selectedSize]?.sideCount || 1} Side{(item.mealDealConfig[selectedSize]?.sideCount || 1) > 1 ? 's' : ''}:
//                       </h4>
//                       <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px" }}>
//                         {availableSides.map((side) => (
//                           <button
//                             key={side.id}
//                             onClick={() => handleSideSelection(side.id)}
//                             style={{
//                               padding: "12px 16px",
//                               borderRadius: "8px",
//                               border: selectedSides.includes(side.id) ? "2px solid #ff6b35" : "2px solid #f0f0f0",
//                               background: selectedSides.includes(side.id) ? "#fff5f2" : "#fff",
//                               color: selectedSides.includes(side.id) ? "#ff6b35" : "#333",
//                               fontWeight: selectedSides.includes(side.id) ? "600" : "400",
//                               cursor: "pointer",
//                               transition: "all 0.3s ease",
//                               textAlign: "left"
//                             }}
//                           >
//                             <div>{side.name}</div>
//                             {side.price > 0 && (
//                               <small style={{ color: "#666" }}>+£{parseFloat(side.price).toFixed(2)}</small>
//                             )}
//                           </button>
//                         ))}
//                       </div>
//                       <small style={{ color: "#666", marginTop: "10px", display: "block" }}>
//                         Selected: {selectedSides.length} / {item.mealDealConfig[selectedSize]?.sideCount || 1}
//                       </small>
//                     </div>

//                     {/* Drinks Selection */}
//                     <div style={{ marginBottom: "30px" }}>
//                       <h4 style={{ fontSize: "1.3rem", fontWeight: "600", marginBottom: "15px" }}>
//                         Choose {item.mealDealConfig[selectedSize]?.drinkCount || 1} Drink{(item.mealDealConfig[selectedSize]?.drinkCount || 1) > 1 ? 's' : ''}:
//                       </h4>
//                       <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px" }}>
//                         {availableDrinks.map((drink) => (
//                           <button
//                             key={drink.id}
//                             onClick={() => handleDrinkSelection(drink.id)}
//                             style={{
//                               padding: "12px 16px",
//                               borderRadius: "8px",
//                               border: selectedDrinks.includes(drink.id) ? "2px solid #ff6b35" : "2px solid #f0f0f0",
//                               background: selectedDrinks.includes(drink.id) ? "#fff5f2" : "#fff",
//                               color: selectedDrinks.includes(drink.id) ? "#ff6b35" : "#333",
//                               fontWeight: selectedDrinks.includes(drink.id) ? "600" : "400",
//                               cursor: "pointer",
//                               transition: "all 0.3s ease",
//                               textAlign: "left"
//                             }}
//                           >
//                             <div>{drink.name}</div>
//                             {drink.price > 0 && (
//                               <small style={{ color: "#666" }}>+£{parseFloat(drink.price).toFixed(2)}</small>
//                             )}
//                           </button>
//                         ))}
//                       </div>
//                       <small style={{ color: "#666", marginTop: "10px", display: "block" }}>
//                         Selected: {selectedDrinks.length} / {item.mealDealConfig[selectedSize]?.drinkCount || 1}
//                       </small>
//                     </div>
//                   </>
//                 )}

//                 {/* Quantity and Add to Cart */}
//                 <div style={{ display: "flex", alignItems: "center", gap: "20px", marginTop: "40px" }}>
//                   <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//                     <button
//                       onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                       style={{
//                         width: "40px",
//                         height: "40px",
//                         borderRadius: "50%",
//                         border: "2px solid #ff6b35",
//                         background: "#fff",
//                         color: "#ff6b35",
//                         fontSize: "1.2rem",
//                         fontWeight: "600",
//                         cursor: "pointer"
//                       }}
//                     >
//                       -
//                     </button>
//                     <span style={{ fontSize: "1.3rem", fontWeight: "600", minWidth: "40px", textAlign: "center" }}>
//                       {quantity}
//                     </span>
//                     <button
//                       onClick={() => setQuantity(quantity + 1)}
//                       style={{
//                         width: "40px",
//                         height: "40px",
//                         borderRadius: "50%",
//                         border: "2px solid #ff6b35",
//                         background: "#fff",
//                         color: "#ff6b35",
//                         fontSize: "1.2rem",
//                         fontWeight: "600",
//                         cursor: "pointer"
//                       }}
//                     >
//                       +
//                     </button>
//                   </div>

//                   <button
//                     onClick={handleAddToCart}
//                     style={{
//                       flex: 1,
//                       padding: "15px 30px",
//                       fontSize: "1.2rem",
//                       fontWeight: "600",
//                       borderRadius: "8px",
//                       background: "#ff6b35",
//                       border: "none",
//                       color: "#fff",
//                       cursor: "pointer",
//                       transition: "all 0.3s ease"
//                     }}
//                     onMouseEnter={(e) => {
//                       e.target.style.background = "#e55a2b";
//                     }}
//                     onMouseLeave={(e) => {
//                       e.target.style.background = "#ff6b35";
//                     }}
//                   >
//                     Add to Cart - £{(parseFloat(price) * quantity).toFixed(2)}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </WellFoodLayout>
//   );
// };

// export default ComboStyleDetails;
















// "use client";
// import FixedBtn from "@/components/custom/FixedBtn";
// import WellFoodLayout from "@/layout/WellFoodLayout";
// import Link from "next/link";
// import { useRouter, useSearchParams } from "next/navigation";
// import React, { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
// import { addToCart } from "@/features/cart/cartSlice";
// import { API_URL } from "@/services/config";
// import PizzaLoader from "@/components/pizzaLoader";

// const ComboStyleDetails = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const dispatch = useDispatch();

//   // URL parameters
//   const itemId = searchParams.get("id");
//   const selectedSize = searchParams.get("size");
//   const isMealDeal = searchParams.get("mealDeal") === "true";

//   // State
//   const [item, setItem] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedSauce, setSelectedSauce] = useState("");
//   const [selectedSides, setSelectedSides] = useState([]);
//   const [selectedDrinks, setSelectedDrinks] = useState([]);
//   const [availableSides, setAvailableSides] = useState([]);
//   const [availableDrinks, setAvailableDrinks] = useState([]);
//   const [quantity, setQuantity] = useState(1);

//   useEffect(() => {
//     if (!itemId || !selectedSize) {
//       setError("Missing required parameters");
//       setLoading(false);
//       return;
//     }

//     const fetchData = async () => {
//       try {
//         console.log('🔧 Fetching combo style item details...');
        
//         // Fetch the specific item
//         const itemResponse = await fetch(`${API_URL}/getComboStyleItems`);
//         if (!itemResponse.ok) {
//           throw new Error(`Failed to fetch items: ${itemResponse.status}`);
//         }
//         const itemsData = await itemResponse.json();
        
//         const currentItem = Array.isArray(itemsData) ? 
//           itemsData.find(i => i.id == itemId || i.id === parseInt(itemId)) : null;

//         if (!currentItem) {
//           setError("Item not found");
//           setLoading(false);
//           return;
//         }

//         console.log('🔧 Found item:', currentItem);
//         console.log('🔧 Selected size:', selectedSize);
//         console.log('🔧 Size pricing:', currentItem.sizePricing);

//         // Check if the selected size exists in pricing
//         if (!currentItem.sizePricing || !currentItem.sizePricing[selectedSize]) {
//           setError(`Size "${selectedSize}" not available for this item`);
//           setLoading(false);
//           return;
//         }

//         setItem(currentItem);

//         // Set default sauce
//         if (currentItem.availableSauces && currentItem.availableSauces.length > 0) {
//           setSelectedSauce(currentItem.availableSauces[0]);
//         }

//         // If meal deal, fetch sides and drinks based on the item's configured categories
//         if (isMealDeal) {
//           console.log('🔧 Fetching meal deal options...');
          
//           try {
//             // Fetch sides if item has sides category configured
//             if (currentItem.sidesCategoryId) {
//               console.log('🔧 Fetching sides for category:', currentItem.sidesCategoryId);
//               const sidesResponse = await fetch(`${API_URL}/getComboStyleItemSides?itemId=${itemId}`);
//               if (sidesResponse.ok) {
//                 const sidesData = await sidesResponse.json();
//                 console.log('🔧 Fetched sides:', sidesData);
//                 setAvailableSides(Array.isArray(sidesData) ? sidesData : []);
//               } else {
//                 console.warn('🔧 Failed to fetch sides:', sidesResponse.status);
//                 setAvailableSides([]);
//               }
//             } else {
//               console.log('🔧 No sides category configured for this item');
//               setAvailableSides([]);
//             }

//             // Fetch drinks if item has drinks category configured
//             if (currentItem.drinksCategoryId) {
//               console.log('🔧 Fetching drinks for category:', currentItem.drinksCategoryId);
//               const drinksResponse = await fetch(`${API_URL}/getComboStyleItemDrinks?itemId=${itemId}`);
//               if (drinksResponse.ok) {
//                 const drinksData = await drinksResponse.json();
//                 console.log('🔧 Fetched drinks:', drinksData);
//                 setAvailableDrinks(Array.isArray(drinksData) ? drinksData : []);
//               } else {
//                 console.warn('🔧 Failed to fetch drinks:', drinksResponse.status);
//                 setAvailableDrinks([]);
//               }
//             } else {
//               console.log('🔧 No drinks category configured for this item');
//               setAvailableDrinks([]);
//             }
//           } catch (mealDealError) {
//             console.error('🔧 Error fetching meal deal options:', mealDealError);
//             // Don't fail the whole page if meal deal options fail
//             setAvailableSides([]);
//             setAvailableDrinks([]);
//           }
//         }

//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setError(`Failed to load item details: ${error.message}`);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [itemId, selectedSize, isMealDeal]);

//   // Handle side selection
//   const handleSideSelection = (sideId) => {
//     const maxSides = item?.mealDealConfig?.[selectedSize]?.sideCount || 1;
    
//     if (selectedSides.includes(sideId)) {
//       setSelectedSides(selectedSides.filter(id => id !== sideId));
//     } else if (selectedSides.length < maxSides) {
//       setSelectedSides([...selectedSides, sideId]);
//     } else {
//       // Replace first selected side if at maximum
//       const newSides = [...selectedSides];
//       newSides[0] = sideId;
//       setSelectedSides(newSides);
//     }
//   };

//   // Handle drink selection
//   const handleDrinkSelection = (drinkId) => {
//     const maxDrinks = item?.mealDealConfig?.[selectedSize]?.drinkCount || 1;
    
//     if (selectedDrinks.includes(drinkId)) {
//       setSelectedDrinks(selectedDrinks.filter(id => id !== drinkId));
//     } else if (selectedDrinks.length < maxDrinks) {
//       setSelectedDrinks([...selectedDrinks, drinkId]);
//     } else {
//       // Replace first selected drink if at maximum
//       const newDrinks = [...selectedDrinks];
//       newDrinks[0] = drinkId;
//       setSelectedDrinks(newDrinks);
//     }
//   };

//   const handleAddToCart = () => {
//     if (!selectedSauce) {
//       alert("Please select a sauce");
//       return;
//     }

//     if (isMealDeal) {
//       const requiredSides = item?.mealDealConfig?.[selectedSize]?.sideCount || 0;
//       const requiredDrinks = item?.mealDealConfig?.[selectedSize]?.drinkCount || 0;

//       if (requiredSides > 0 && selectedSides.length !== requiredSides) {
//         alert(`Please select ${requiredSides} side${requiredSides > 1 ? 's' : ''}`);
//         return;
//       }

//       if (requiredDrinks > 0 && selectedDrinks.length !== requiredDrinks) {
//         alert(`Please select ${requiredDrinks} drink${requiredDrinks > 1 ? 's' : ''}`);
//         return;
//       }
//     }

//     const pricing = item.sizePricing[selectedSize];
//     const price = isMealDeal ? pricing.mealDealPrice : pricing.basePrice;

//     const cartItem = {
//       id: `${item.id}-${selectedSize}-${isMealDeal ? 'meal' : 'normal'}-${Date.now()}`,
//       type: 'comboStyleItem',
//       itemId: item.id,
//       name: item.name,
//       size: selectedSize,
//       sauce: selectedSauce,
//       price: parseFloat(price),
//       quantity: quantity,
//       isMealDeal: isMealDeal,
//       sides: isMealDeal ? selectedSides.map(sideId => 
//         availableSides.find(s => s.id === sideId)
//       ).filter(Boolean) : [],
//       drinks: isMealDeal ? selectedDrinks.map(drinkId => 
//         availableDrinks.find(d => d.id === drinkId)
//       ).filter(Boolean) : [],
//       image: item.imageUrl || 'default-combo.png'
//     };

//     console.log('🔧 Adding to cart:', cartItem);
//     dispatch(addToCart(cartItem));
//     router.push("/cart");
//   };

//   if (loading) {
//     return (
//       <WellFoodLayout>
//         <PizzaLoader forceDuration={4000} />
//       </WellFoodLayout>
//     );
//   }

//   if (error || !item) {
//     return (
//       <WellFoodLayout>
//         <div className="container">
//           <div className="text-center py-5">
//             <h2 className="mb-4">{error || "Item not found"}</h2>
//             <Link href="/combo-style-menu">
//               <button className="theme-btn">Back to Menu</button>
//             </Link>
//           </div>
//         </div>
//       </WellFoodLayout>
//     );
//   }

//   const pricing = item.sizePricing?.[selectedSize];
//   if (!pricing) {
//     return (
//       <WellFoodLayout>
//         <div className="container">
//           <div className="text-center py-5">
//             <h2 className="mb-4">Invalid size selection</h2>
//             <Link href="/combo-style-menu">
//               <button className="theme-btn">Back to Menu</button>
//             </Link>
//           </div>
//         </div>
//       </WellFoodLayout>
//     );
//   }

//   const price = isMealDeal ? pricing.mealDealPrice : pricing.basePrice;
//   const requiredSides = item?.mealDealConfig?.[selectedSize]?.sideCount || 0;
//   const requiredDrinks = item?.mealDealConfig?.[selectedSize]?.drinkCount || 0;

//   return (
//     <WellFoodLayout>
//       <div className="product-details-area pt-120 rpt-100 pb-85 rpb-65">
//         <div className="container">
//           <div className="row">
//             <div className="col-lg-6">
//               <div className="product-details-images mb-30">
//                 <img
//                   src={`${API_URL}/images/${item.imageUrl || 'default-combo.png'}`}
//                   alt={item.name}
//                   style={{
//                     width: "100%",
//                     height: "400px",
//                     objectFit: "cover",
//                     borderRadius: "15px"
//                   }}
//                   onError={(e) => {
//                     e.target.src = `${API_URL}/images/default-combo.png`;
//                   }}
//                 />
//               </div>
//             </div>

//             <div className="col-lg-6">
//               <div className="product-details-content">
//                 <h1 style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "20px" }}>
//                   {item.name}
//                 </h1>
                
//                 <div style={{ 
//                   background: "#fff5f2", 
//                   padding: "20px", 
//                   borderRadius: "12px",
//                   border: "1px solid #ff6b35",
//                   marginBottom: "30px"
//                 }}>
//                   <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                     <div>
//                       <h3 style={{ fontSize: "1.5rem", fontWeight: "600", textTransform: "capitalize" }}>
//                         {selectedSize === "wings" ? "8 Wings" : selectedSize}
//                       </h3>
//                       {isMealDeal && (
//                         <p style={{ color: "#ff6b35", fontWeight: "600", margin: "5px 0" }}>
//                           🌟 Meal Deal - with {requiredSides} side{requiredSides > 1 ? 's' : ''} and {requiredDrinks} drink{requiredDrinks > 1 ? 's' : ''}
//                         </p>
//                       )}
//                     </div>
//                     <div style={{ textAlign: "right" }}>
//                       <div style={{ fontSize: "2rem", fontWeight: "700", color: "#ff6b35" }}>
//                         £{parseFloat(price).toFixed(2)}
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <p style={{ fontSize: "1.1rem", color: "#666", marginBottom: "30px" }}>
//                   {item.description}
//                 </p>

//                 {/* Sauce Selection */}
//                 <div style={{ marginBottom: "30px" }}>
//                   <h4 style={{ fontSize: "1.3rem", fontWeight: "600", marginBottom: "15px" }}>
//                     Choose Your Sauce (No Extra Charge):
//                   </h4>
//                   <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "10px" }}>
//                     {item.availableSauces?.map((sauce, index) => (
//                       <button
//                         key={index}
//                         onClick={() => setSelectedSauce(sauce)}
//                         style={{
//                           padding: "12px 16px",
//                           borderRadius: "8px",
//                           border: selectedSauce === sauce ? "2px solid #ff6b35" : "2px solid #f0f0f0",
//                           background: selectedSauce === sauce ? "#fff5f2" : "#fff",
//                           color: selectedSauce === sauce ? "#ff6b35" : "#333",
//                           fontWeight: selectedSauce === sauce ? "600" : "400",
//                           cursor: "pointer",
//                           transition: "all 0.3s ease"
//                         }}
//                       >
//                         {sauce}
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Meal Deal Selections */}
//                 {isMealDeal && (
//                   <>
//                     {/* Sides Selection */}
//                     {requiredSides > 0 && (
//                       <div style={{ marginBottom: "30px" }}>
//                         <h4 style={{ fontSize: "1.3rem", fontWeight: "600", marginBottom: "15px" }}>
//                           Choose {requiredSides} Side{requiredSides > 1 ? 's' : ''}:
//                         </h4>
//                         {availableSides.length > 0 ? (
//                           <>
//                             <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px" }}>
//                               {availableSides.map((side) => (
//                                 <button
//                                   key={side.id}
//                                   onClick={() => handleSideSelection(side.id)}
//                                   style={{
//                                     padding: "12px 16px",
//                                     borderRadius: "8px",
//                                     border: selectedSides.includes(side.id) ? "2px solid #ff6b35" : "2px solid #f0f0f0",
//                                     background: selectedSides.includes(side.id) ? "#fff5f2" : "#fff",
//                                     color: selectedSides.includes(side.id) ? "#ff6b35" : "#333",
//                                     fontWeight: selectedSides.includes(side.id) ? "600" : "400",
//                                     cursor: "pointer",
//                                     transition: "all 0.3s ease",
//                                     textAlign: "left"
//                                   }}
//                                 >
//                                   <div>{side.name}</div>
//                                   {side.price > 0 && (
//                                     <small style={{ color: "#666" }}>+£{parseFloat(side.price).toFixed(2)}</small>
//                                   )}
//                                 </button>
//                               ))}
//                             </div>
//                             <small style={{ color: "#666", marginTop: "10px", display: "block" }}>
//                               Selected: {selectedSides.length} / {requiredSides}
//                             </small>
//                           </>
//                         ) : (
//                           <div style={{ 
//                             padding: "20px", 
//                             background: "#f8f9fa", 
//                             borderRadius: "8px", 
//                             textAlign: "center",
//                             color: "#666"
//                           }}>
//                             No sides available for this item
//                           </div>
//                         )}
//                       </div>
//                     )}

//                     {/* Drinks Selection */}
//                     {requiredDrinks > 0 && (
//                       <div style={{ marginBottom: "30px" }}>
//                         <h4 style={{ fontSize: "1.3rem", fontWeight: "600", marginBottom: "15px" }}>
//                           Choose {requiredDrinks} Drink{requiredDrinks > 1 ? 's' : ''}:
//                         </h4>
//                         {availableDrinks.length > 0 ? (
//                           <>
//                             <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px" }}>
//                               {availableDrinks.map((drink) => (
//                                 <button
//                                   key={drink.id}
//                                   onClick={() => handleDrinkSelection(drink.id)}
//                                   style={{
//                                     padding: "12px 16px",
//                                     borderRadius: "8px",
//                                     border: selectedDrinks.includes(drink.id) ? "2px solid #ff6b35" : "2px solid #f0f0f0",
//                                     background: selectedDrinks.includes(drink.id) ? "#fff5f2" : "#fff",
//                                     color: selectedDrinks.includes(drink.id) ? "#ff6b35" : "#333",
//                                     fontWeight: selectedDrinks.includes(drink.id) ? "600" : "400",
//                                     cursor: "pointer",
//                                     transition: "all 0.3s ease",
//                                     textAlign: "left"
//                                   }}
//                                 >
//                                   <div>{drink.name}</div>
//                                   {drink.price > 0 && (
//                                     <small style={{ color: "#666" }}>+£{parseFloat(drink.price).toFixed(2)}</small>
//                                   )}
//                                 </button>
//                               ))}
//                             </div>
//                             <small style={{ color: "#666", marginTop: "10px", display: "block" }}>
//                               Selected: {selectedDrinks.length} / {requiredDrinks}
//                             </small>
//                           </>
//                         ) : (
//                           <div style={{ 
//                             padding: "20px", 
//                             background: "#f8f9fa", 
//                             borderRadius: "8px", 
//                             textAlign: "center",
//                             color: "#666"
//                           }}>
//                             No drinks available for this item
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </>
//                 )}

//                 {/* Quantity and Add to Cart */}
//                 <div style={{ display: "flex", alignItems: "center", gap: "20px", marginTop: "40px" }}>
//                   <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//                     <button
//                       onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                       style={{
//                         width: "40px",
//                         height: "40px",
//                         borderRadius: "50%",
//                         border: "2px solid #ff6b35",
//                         background: "#fff",
//                         color: "#ff6b35",
//                         fontSize: "1.2rem",
//                         fontWeight: "600",
//                         cursor: "pointer"
//                       }}
//                     >
//                       -
//                     </button>
//                     <span style={{ fontSize: "1.3rem", fontWeight: "600", minWidth: "40px", textAlign: "center" }}>
//                       {quantity}
//                     </span>
//                     <button
//                       onClick={() => setQuantity(quantity + 1)}
//                       style={{
//                         width: "40px",
//                         height: "40px",
//                         borderRadius: "50%",
//                         border: "2px solid #ff6b35",
//                         background: "#fff",
//                         color: "#ff6b35",
//                         fontSize: "1.2rem",
//                         fontWeight: "600",
//                         cursor: "pointer"
//                       }}
//                     >
//                       +
//                     </button>
//                   </div>

//                   <button
//                     onClick={handleAddToCart}
//                     style={{
//                       flex: 1,
//                       padding: "15px 30px",
//                       fontSize: "1.2rem",
//                       fontWeight: "600",
//                       borderRadius: "8px",
//                       background: "#ff6b35",
//                       border: "none",
//                       color: "#fff",
//                       cursor: "pointer",
//                       transition: "all 0.3s ease"
//                     }}
//                     onMouseEnter={(e) => {
//                       e.target.style.background = "#e55a2b";
//                     }}
//                     onMouseLeave={(e) => {
//                       e.target.style.background = "#ff6b35";
//                     }}
//                   >
//                     Add to Cart - £{(parseFloat(price) * quantity).toFixed(2)}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       {/* <FixedBtn /> */}
//     </WellFoodLayout>
//   );
// };

// export default ComboStyleDetails;




"use client";
import FixedBtn from "@/components/custom/FixedBtn";
import WellFoodLayout from "@/layout/WellFoodLayout";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "@/features/cart/cartSlice";
import { API_URL } from "@/services/config";
import PizzaLoader from "@/components/pizzaLoader";

const ComboStyleDetails = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  // URL parameters
  const itemId = searchParams.get("id");
  const selectedSize = searchParams.get("size");
  const isMealDeal = searchParams.get("mealDeal") === "true";

  // State
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSauce, setSelectedSauce] = useState("");
  const [selectedSides, setSelectedSides] = useState([]);
  const [selectedDrinks, setSelectedDrinks] = useState([]);
  const [availableSides, setAvailableSides] = useState([]);
  const [availableDrinks, setAvailableDrinks] = useState([]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!itemId || !selectedSize) {
      setError("Missing required parameters");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        console.log('🔧 Fetching combo style item details...');
        
        // Fetch the specific item
        const itemResponse = await fetch(`${API_URL}/getComboStyleItems`);
        if (!itemResponse.ok) {
          throw new Error(`Failed to fetch items: ${itemResponse.status}`);
        }
        const itemsData = await itemResponse.json();
        
        const currentItem = Array.isArray(itemsData) ? 
          itemsData.find(i => i.id == itemId || i.id === parseInt(itemId)) : null;

        if (!currentItem) {
          setError("Item not found");
          setLoading(false);
          return;
        }

        console.log('🔧 Found item:', currentItem);
        console.log('🔧 Selected size:', selectedSize);
        console.log('🔧 Size pricing:', currentItem.sizePricing);
        console.log('🔧 Meal deal config:', currentItem.mealDealConfig);

        // Check if the selected size exists in pricing
        if (!currentItem.sizePricing || !currentItem.sizePricing[selectedSize]) {
          setError(`Size "${selectedSize}" not available for this item`);
          setLoading(false);
          return;
        }

        setItem(currentItem);

        // Set default sauce
        if (currentItem.availableSauces && currentItem.availableSauces.length > 0) {
          setSelectedSauce(currentItem.availableSauces[0]);
        }

        // If meal deal, fetch sides and drinks based on the mealDealConfig
        if (isMealDeal) {
          console.log('🔧 Fetching meal deal options for size:', selectedSize);
          
          const mealDealInfo = currentItem.mealDealConfig?.[selectedSize];
          console.log('🔧 Meal deal info for size:', mealDealInfo);
          
          if (mealDealInfo) {
            // Fetch sides if configured
            if (mealDealInfo.sides && mealDealInfo.sides.categoryId) {
              try {
                console.log('🔧 Fetching sides for category:', mealDealInfo.sides.categoryId);
                const sidesResponse = await fetch(`${API_URL}/getComboStyleItemSides?itemId=${itemId}&size=${selectedSize}`);
                if (sidesResponse.ok) {
                  const sidesData = await sidesResponse.json();
                  console.log('🔧 Fetched sides:', sidesData);
                  setAvailableSides(Array.isArray(sidesData) ? sidesData : []);
                } else {
                  console.warn('🔧 Failed to fetch sides:', sidesResponse.status);
                  setAvailableSides([]);
                }
              } catch (sidesError) {
                console.error('🔧 Error fetching sides:', sidesError);
                setAvailableSides([]);
              }
            }

            // Fetch drinks if configured
            if (mealDealInfo.drinks && mealDealInfo.drinks.categoryId) {
              try {
                console.log('🔧 Fetching drinks for category:', mealDealInfo.drinks.categoryId);
                const drinksResponse = await fetch(`${API_URL}/getComboStyleItemDrinks?itemId=${itemId}&size=${selectedSize}`);
                if (drinksResponse.ok) {
                  const drinksData = await drinksResponse.json();
                  console.log('🔧 Fetched drinks:', drinksData);
                  setAvailableDrinks(Array.isArray(drinksData) ? drinksData : []);
                } else {
                  console.warn('🔧 Failed to fetch drinks:', drinksResponse.status);
                  setAvailableDrinks([]);
                }
              } catch (drinksError) {
                console.error('🔧 Error fetching drinks:', drinksError);
                setAvailableDrinks([]);
              }
            }
          }
        }

      } catch (error) {
        console.error("Error fetching data:", error);
        setError(`Failed to load item details: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [itemId, selectedSize, isMealDeal]);

  // Handle side selection
  const handleSideSelection = (sideId) => {
    const mealDealInfo = item?.mealDealConfig?.[selectedSize];
    const maxSides = mealDealInfo?.sides?.count || 1;
    
    if (selectedSides.includes(sideId)) {
      setSelectedSides(selectedSides.filter(id => id !== sideId));
    } else if (selectedSides.length < maxSides) {
      setSelectedSides([...selectedSides, sideId]);
    } else {
      // Replace first selected side if at maximum
      const newSides = [...selectedSides];
      newSides[0] = sideId;
      setSelectedSides(newSides);
    }
  };

  // Handle drink selection
  const handleDrinkSelection = (drinkId) => {
    const mealDealInfo = item?.mealDealConfig?.[selectedSize];
    const maxDrinks = mealDealInfo?.drinks?.count || 1;
    
    if (selectedDrinks.includes(drinkId)) {
      setSelectedDrinks(selectedDrinks.filter(id => id !== drinkId));
    } else if (selectedDrinks.length < maxDrinks) {
      setSelectedDrinks([...selectedDrinks, drinkId]);
    } else {
      // Replace first selected drink if at maximum
      const newDrinks = [...selectedDrinks];
      newDrinks[0] = drinkId;
      setSelectedDrinks(newDrinks);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSauce) {
      alert("Please select a sauce");
      return;
    }

    if (isMealDeal) {
      const mealDealInfo = item?.mealDealConfig?.[selectedSize];
      const requiredSides = mealDealInfo?.sides?.count || 0;
      const requiredDrinks = mealDealInfo?.drinks?.count || 0;

      if (requiredSides > 0 && selectedSides.length !== requiredSides) {
        alert(`Please select ${requiredSides} side${requiredSides > 1 ? 's' : ''}`);
        return;
      }

      if (requiredDrinks > 0 && selectedDrinks.length !== requiredDrinks) {
        alert(`Please select ${requiredDrinks} drink${requiredDrinks > 1 ? 's' : ''}`);
        return;
      }
    }

    const pricing = item.sizePricing[selectedSize];
    const price = isMealDeal ? pricing.mealDealPrice : pricing.basePrice;

    const cartItem = {
      id: `${item.id}-${selectedSize}-${isMealDeal ? 'meal' : 'normal'}-${Date.now()}`,
      type: 'comboStyleItem',
      itemId: item.id,
      name: item.name,
      size: selectedSize,
      sauce: selectedSauce,
      price: parseFloat(price),
      quantity: quantity,
      isMealDeal: isMealDeal,
      selectedSides: selectedSides, // Store just the IDs
      selectedDrinks: selectedDrinks, // Store just the IDs
      // Also store the full objects for display purposes
      sidesDetails: selectedSides.map(sideId => 
        availableSides.find(s => s.id === sideId)
      ).filter(Boolean),
      drinksDetails: selectedDrinks.map(drinkId => 
        availableDrinks.find(d => d.id === drinkId)
      ).filter(Boolean),
      image: item.imageUrl || 'default-combo.png'
    };

    console.log('🔧 Adding to cart:', cartItem);
    dispatch(addToCart(cartItem));
    router.push("/cart");
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
            <Link href="/combo-style-menu">
              <button className="theme-btn">Back to Menu</button>
            </Link>
          </div>
        </div>
      </WellFoodLayout>
    );
  }

  const pricing = item.sizePricing?.[selectedSize];
  if (!pricing) {
    return (
      <WellFoodLayout>
        <div className="container">
          <div className="text-center py-5">
            <h2 className="mb-4">Invalid size selection</h2>
            <Link href="/combo-style-menu">
              <button className="theme-btn">Back to Menu</button>
            </Link>
          </div>
        </div>
      </WellFoodLayout>
    );
  }

  const price = isMealDeal ? pricing.mealDealPrice : pricing.basePrice;
  const mealDealInfo = item?.mealDealConfig?.[selectedSize];
  const requiredSides = mealDealInfo?.sides?.count || 0;
  const requiredDrinks = mealDealInfo?.drinks?.count || 0;

  return (
    <WellFoodLayout>
      <div className="product-details-area pt-120 rpt-100 pb-85 rpb-65">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="product-details-images mb-30">
                <img
                  src={`${API_URL}/images/${item.imageUrl || 'default-combo.png'}`}
                  alt={item.name}
                  style={{
                    width: "100%",
                    height: "400px",
                    objectFit: "cover",
                    borderRadius: "15px"
                  }}
                  onError={(e) => {
                    e.target.src = `${API_URL}/images/default-combo.png`;
                  }}
                />
              </div>
            </div>

            <div className="col-lg-6">
              <div className="product-details-content">
                <h1 style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "20px" }}>
                  {item.name}
                </h1>
                
                <div style={{ 
                  background: "#fff5f2", 
                  padding: "20px", 
                  borderRadius: "12px",
                  border: "1px solid #ff6b35",
                  marginBottom: "30px"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h3 style={{ fontSize: "1.5rem", fontWeight: "600", textTransform: "capitalize" }}>
                        {selectedSize === "wings" ? "8 Wings" : selectedSize}
                      </h3>
                      {isMealDeal && (
                        <p style={{ color: "#ff6b35", fontWeight: "600", margin: "5px 0" }}>
                          🌟 Meal Deal - with {requiredSides} side{requiredSides > 1 ? 's' : ''} and {requiredDrinks} drink{requiredDrinks > 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "2rem", fontWeight: "700", color: "#ff6b35" }}>
                        £{parseFloat(price).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: "1.1rem", color: "#666", marginBottom: "30px" }}>
                  {item.description}
                </p>

                {/* Sauce Selection */}
                <div style={{ marginBottom: "30px" }}>
                  <h4 style={{ fontSize: "1.3rem", fontWeight: "600", marginBottom: "15px" }}>
                    Choose Your Sauce (No Extra Charge):
                  </h4>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "10px" }}>
                    {item.availableSauces?.map((sauce, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedSauce(sauce)}
                        style={{
                          padding: "12px 16px",
                          borderRadius: "8px",
                          border: selectedSauce === sauce ? "2px solid #ff6b35" : "2px solid #f0f0f0",
                          background: selectedSauce === sauce ? "#fff5f2" : "#fff",
                          color: selectedSauce === sauce ? "#ff6b35" : "#333",
                          fontWeight: selectedSauce === sauce ? "600" : "400",
                          cursor: "pointer",
                          transition: "all 0.3s ease"
                        }}
                      >
                        {sauce}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Meal Deal Selections */}
                {isMealDeal && (
                  <>
                    {/* Sides Selection */}
                    {requiredSides > 0 && (
                      <div style={{ marginBottom: "30px" }}>
                        <h4 style={{ fontSize: "1.3rem", fontWeight: "600", marginBottom: "15px" }}>
                          Choose {requiredSides} Side{requiredSides > 1 ? 's' : ''}:
                        </h4>
                        {availableSides.length > 0 ? (
                          <>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px" }}>
                              {availableSides.map((side) => (
                                <button
                                  key={side.id}
                                  onClick={() => handleSideSelection(side.id)}
                                  style={{
                                    padding: "12px 16px",
                                    borderRadius: "8px",
                                    border: selectedSides.includes(side.id) ? "2px solid #ff6b35" : "2px solid #f0f0f0",
                                    background: selectedSides.includes(side.id) ? "#fff5f2" : "#fff",
                                    color: selectedSides.includes(side.id) ? "#ff6b35" : "#333",
                                    fontWeight: selectedSides.includes(side.id) ? "600" : "400",
                                    cursor: "pointer",
                                    transition: "all 0.3s ease",
                                    textAlign: "left"
                                  }}
                                >
                                  <div>{side.name}</div>
                                  {side.price > 0 && (
                                    <small style={{ color: "#666" }}>+£{parseFloat(side.price).toFixed(2)}</small>
                                  )}
                                </button>
                              ))}
                            </div>
                            <small style={{ color: "#666", marginTop: "10px", display: "block" }}>
                              Selected: {selectedSides.length} / {requiredSides}
                            </small>
                          </>
                        ) : (
                          <div style={{ 
                            padding: "20px", 
                            background: "#f8f9fa", 
                            borderRadius: "8px", 
                            textAlign: "center",
                            color: "#666"
                          }}>
                            No sides available for this item
                          </div>
                        )}
                      </div>
                    )}

                    {/* Drinks Selection */}
                    {requiredDrinks > 0 && (
                      <div style={{ marginBottom: "30px" }}>
                        <h4 style={{ fontSize: "1.3rem", fontWeight: "600", marginBottom: "15px" }}>
                          Choose {requiredDrinks} Drink{requiredDrinks > 1 ? 's' : ''}:
                        </h4>
                        {availableDrinks.length > 0 ? (
                          <>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px" }}>
                              {availableDrinks.map((drink) => (
                                <button
                                  key={drink.id}
                                  onClick={() => handleDrinkSelection(drink.id)}
                                  style={{
                                    padding: "12px 16px",
                                    borderRadius: "8px",
                                    border: selectedDrinks.includes(drink.id) ? "2px solid #ff6b35" : "2px solid #f0f0f0",
                                    background: selectedDrinks.includes(drink.id) ? "#fff5f2" : "#fff",
                                    color: selectedDrinks.includes(drink.id) ? "#ff6b35" : "#333",
                                    fontWeight: selectedDrinks.includes(drink.id) ? "600" : "400",
                                    cursor: "pointer",
                                    transition: "all 0.3s ease",
                                    textAlign: "left"
                                  }}
                                >
                                  <div>{drink.name}</div>
                                  {drink.price > 0 && (
                                    <small style={{ color: "#666" }}>+£{parseFloat(drink.price).toFixed(2)}</small>
                                  )}
                                </button>
                              ))}
                            </div>
                            <small style={{ color: "#666", marginTop: "10px", display: "block" }}>
                              Selected: {selectedDrinks.length} / {requiredDrinks}
                            </small>
                          </>
                        ) : (
                          <div style={{ 
                            padding: "20px", 
                            background: "#f8f9fa", 
                            borderRadius: "8px", 
                            textAlign: "center",
                            color: "#666"
                          }}>
                            No drinks available for this item
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}

                {/* Quantity and Add to Cart */}
                <div style={{ display: "flex", alignItems: "center", gap: "20px", marginTop: "40px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        border: "2px solid #ff6b35",
                        background: "#fff",
                        color: "#ff6b35",
                        fontSize: "1.2rem",
                        fontWeight: "600",
                        cursor: "pointer"
                      }}
                    >
                      -
                    </button>
                    <span style={{ fontSize: "1.3rem", fontWeight: "600", minWidth: "40px", textAlign: "center" }}>
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        border: "2px solid #ff6b35",
                        background: "#fff",
                        color: "#ff6b35",
                        fontSize: "1.2rem",
                        fontWeight: "600",
                        cursor: "pointer"
                      }}
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    style={{
                      flex: 1,
                      padding: "15px 30px",
                      fontSize: "1.2rem",
                      fontWeight: "600",
                      borderRadius: "8px",
                      background: "#ff6b35",
                      border: "none",
                      color: "#fff",
                      cursor: "pointer",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "#e55a2b";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "#ff6b35";
                    }}
                  >
                    Add to Cart - £{(parseFloat(price) * quantity).toFixed(2)}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WellFoodLayout>
  );
};

export default ComboStyleDetails;