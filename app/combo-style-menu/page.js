// "use client";
// import FixedBtn from "@/components/custom/FixedBtn";
// import WellFoodLayout from "@/layout/WellFoodLayout";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import React, { useEffect, useState } from "react";
// import { API_URL } from "@/services/config";
// import PizzaLoader from "@/components/pizzaLoader";

// const ComboStyleItemsMenu = () => {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchItems = async () => {
//       try {
//         const response = await fetch(`${API_URL}/getComboStyleItems`);
//         const data = await response.json();

//         if (Array.isArray(data)) {
//           setItems(data);
//         } else {
//           setError("Invalid data format received");
//         }
//       } catch (error) {
//         console.error("Error fetching combo style items:", error);
//         setError("Failed to load items. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchItems();
//   }, []);

//   if (loading) {
//     return (
//       <WellFoodLayout>
//         <PizzaLoader forceDuration={4000} />
//       </WellFoodLayout>
//     );
//   }

//   if (error || items.length === 0) {
//     return (
//       <WellFoodLayout>
//         <div className="container">
//           <div className="text-center py-5">
//             <h2 className="mb-4">{error || "No items available"}</h2>
//             <Link href="/menu-pizza">
//               <button
//                 className="theme-btn"
//                 style={{
//                   padding: "14px 30px",
//                   fontSize: "1.1rem",
//                   fontWeight: "600",
//                   borderRadius: "8px",
//                   background: "#ff6b35",
//                   border: "none",
//                   color: "#fff",
//                   display: "inline-flex",
//                   alignItems: "center",
//                   gap: "10px",
//                   transition: "all 0.3s ease",
//                   boxShadow: "0 4px 10px rgba(255, 107, 53, 0.3)",
//                 }}
//               >
//                 Back to Menu
//                 <i className="far fa-arrow-alt-right" />
//               </button>
//             </Link>
//           </div>
//         </div>
//       </WellFoodLayout>
//     );
//   }

//   return (
//     <WellFoodLayout>
//       <div className="product-details-area pt-120 rpt-100 pb-85 rpb-65">
//         <div className="container">
//           <div className="text-center mb-5">
//             <h1 className="mb-4" style={{ fontSize: "2.5rem", fontWeight: "700", color: "#333" }}>
//               Choose Your Perfect Size
//             </h1>
//             <p style={{ fontSize: "1.2rem", color: "#666" }}>
//               All items come with your choice of sauce at no extra charge
//             </p>
//           </div>

//           <div className="row">
//             {items.map((item) => (
//               <div key={item.id} className="col-12 mb-5">
//                 <div
//                   style={{
//                     background: "#fff",
//                     borderRadius: "15px",
//                     padding: "30px",
//                     boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
//                     border: "1px solid #f0f0f0"
//                   }}
//                 >
//                   <div className="row align-items-center">
//                     <div className="col-lg-4 text-center mb-4 mb-lg-0">
//                       <img
//                         src={`${API_URL}/images/${item.imageUrl || 'default-combo.png'}`}
//                         alt={item.name}
//                         style={{
//                           maxWidth: "100%",
//                           height: "250px",
//                           objectFit: "cover",
//                           borderRadius: "10px"
//                         }}
//                       />
//                     </div>
                    
//                     <div className="col-lg-8">
//                       <h2 style={{ fontSize: "2rem", fontWeight: "600", marginBottom: "15px", color: "#333" }}>
//                         {item.name}
//                       </h2>
//                       <p style={{ fontSize: "1.1rem", color: "#666", marginBottom: "30px" }}>
//                         {item.description}
//                       </p>

//                       {/* Available Sauces */}
//                       <div style={{ marginBottom: "30px" }}>
//                         <h5 style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "10px", color: "#333" }}>
//                           Available Sauces (No Extra Charge):
//                         </h5>
//                         <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
//                           {item.availableSauces?.map((sauce, index) => (
//                             <span
//                               key={index}
//                               style={{
//                                 background: "#fff5f2",
//                                 color: "#ff6b35",
//                                 padding: "5px 12px",
//                                 borderRadius: "20px",
//                                 border: "1px solid #ff6b35",
//                                 fontSize: "0.9rem",
//                                 fontWeight: "500"
//                               }}
//                             >
//                               {sauce}
//                             </span>
//                           ))}
//                         </div>
//                       </div>

//                       {/* Size Options */}
//                       <div className="row">
//                         {Object.entries(item.sizePricing).map(([size, pricing]) => (
//                           <div key={size} className="col-md-6 col-lg-3 mb-3">
//                             <div
//                               style={{
//                                 border: "2px solid #f0f0f0",
//                                 borderRadius: "12px",
//                                 padding: "20px",
//                                 textAlign: "center",
//                                 transition: "all 0.3s ease",
//                                 height: "100%",
//                                 display: "flex",
//                                 flexDirection: "column",
//                                 justifyContent: "space-between"
//                               }}
//                               onMouseEnter={(e) => {
//                                 e.target.style.borderColor = "#ff6b35";
//                                 e.target.style.transform = "translateY(-5px)";
//                                 e.target.style.boxShadow = "0 10px 25px rgba(255, 107, 53, 0.15)";
//                               }}
//                               onMouseLeave={(e) => {
//                                 e.target.style.borderColor = "#f0f0f0";
//                                 e.target.style.transform = "translateY(0)";
//                                 e.target.style.boxShadow = "none";
//                               }}
//                             >
//                               <div>
//                                 <h4 style={{ 
//                                   fontSize: "1.3rem", 
//                                   fontWeight: "600", 
//                                   marginBottom: "10px", 
//                                   color: "#333",
//                                   textTransform: "capitalize"
//                                 }}>
//                                   {size === "wings" ? "8 Wings" : size}
//                                 </h4>
                                
//                                 <div style={{ marginBottom: "20px" }}>
//                                   <div style={{ marginBottom: "8px" }}>
//                                     <span style={{ fontSize: "0.9rem", color: "#666" }}>On its own</span>
//                                     <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#333" }}>
//                                       £{parseFloat(pricing.basePrice).toFixed(2)}
//                                     </div>
//                                   </div>
                                  
//                                   <div style={{ 
//                                     background: "#fff5f2", 
//                                     padding: "10px", 
//                                     borderRadius: "8px",
//                                     border: "1px solid #ff6b35"
//                                   }}>
//                                     <span style={{ fontSize: "0.85rem", color: "#ff6b35", fontWeight: "600" }}>
//                                       🌟 Meal Deal - Best Value!
//                                     </span>
//                                     <div style={{ fontSize: "1.3rem", fontWeight: "700", color: "#ff6b35" }}>
//                                       £{parseFloat(pricing.mealDealPrice).toFixed(2)}
//                                     </div>
//                                     <div style={{ fontSize: "0.8rem", color: "#666", marginTop: "5px" }}>
//                                       with {item.mealDealConfig[size]?.sideCount || 1} side{(item.mealDealConfig[size]?.sideCount || 1) > 1 ? 's' : ''} and {item.mealDealConfig[size]?.drinkCount || 1} drink{(item.mealDealConfig[size]?.drinkCount || 1) > 1 ? 's' : ''}
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>

//                               <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
//                                 <Link href={`/combo-style-details?id=${item.id}&size=${size}&mealDeal=false`}>
//                                   <button
//                                     style={{
//                                       width: "100%",
//                                       padding: "12px 16px",
//                                       fontSize: "1rem",
//                                       fontWeight: "600",
//                                       borderRadius: "8px",
//                                       background: "#333",
//                                       border: "none",
//                                       color: "#fff",
//                                       transition: "all 0.3s ease",
//                                       cursor: "pointer"
//                                     }}
//                                     onMouseEnter={(e) => {
//                                       e.target.style.background = "#555";
//                                     }}
//                                     onMouseLeave={(e) => {
//                                       e.target.style.background = "#333";
//                                     }}
//                                   >
//                                     Order
//                                   </button>
//                                 </Link>
                                
//                                 <Link href={`/combo-style-details?id=${item.id}&size=${size}&mealDeal=true`}>
//                                   <button
//                                     style={{
//                                       width: "100%",
//                                       padding: "12px 16px",
//                                       fontSize: "1rem",
//                                       fontWeight: "600",
//                                       borderRadius: "8px",
//                                       background: "#ff6b35",
//                                       border: "none",
//                                       color: "#fff",
//                                       transition: "all 0.3s ease",
//                                       cursor: "pointer"
//                                     }}
//                                     onMouseEnter={(e) => {
//                                       e.target.style.background = "#e55a2b";
//                                     }}
//                                     onMouseLeave={(e) => {
//                                       e.target.style.background = "#ff6b35";
//                                     }}
//                                   >
//                                     Meal Deal
//                                   </button>
//                                 </Link>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </WellFoodLayout>
//   );
// };

// export default ComboStyleItemsMenu;
// "use client";
// import FixedBtn from "@/components/custom/FixedBtn";
// import WellFoodLayout from "@/layout/WellFoodLayout";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import React, { useEffect, useState } from "react";
// import { API_URL } from "@/services/config";
// import PizzaLoader from "@/components/pizzaLoader";

// const ComboStyleItemsMenu = () => {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchItems = async () => {
//       try {
//         console.log('🔧 Fetching combo style items from:', `${API_URL}/getComboStyleItems`);
//         const response = await fetch(`${API_URL}/getComboStyleItems`);
        
//         console.log('🔧 Response status:', response.status);
//         console.log('🔧 Response headers:', response.headers);
        
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
        
//         const contentType = response.headers.get('content-type');
//         if (!contentType || !contentType.includes('application/json')) {
//           const text = await response.text();
//           console.error('🔧 Non-JSON response:', text.substring(0, 200));
//           throw new Error('Server returned non-JSON response');
//         }
        
//         const data = await response.json();
//         console.log('🔧 Received combo style items:', data);

//         if (Array.isArray(data)) {
//           setItems(data);
//         } else {
//           console.error('🔧 Invalid data format:', data);
//           setError("Invalid data format received");
//         }
//       } catch (error) {
//         console.error("🔧 Error loading items:", error);
//         setError(`Failed to load items: ${error.message}`);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchItems();
//   }, []);

//   if (loading) {
//     return (
//       <WellFoodLayout>
//         <PizzaLoader forceDuration={4000} />
//       </WellFoodLayout>
//     );
//   }

//   if (error || items.length === 0) {
//     return (
//       <WellFoodLayout>
//         <div className="container">
//           <div className="text-center py-5">
//             <h2 className="mb-4">{error || "No items available"}</h2>
//             <Link href="/menu-pizza">
//               <button
//                 className="theme-btn"
//                 style={{
//                   padding: "14px 30px",
//                   fontSize: "1.1rem",
//                   fontWeight: "600",
//                   borderRadius: "8px",
//                   background: "#ff6b35",
//                   border: "none",
//                   color: "#fff",
//                   display: "inline-flex",
//                   alignItems: "center",
//                   gap: "10px",
//                   transition: "all 0.3s ease",
//                   boxShadow: "0 4px 10px rgba(255, 107, 53, 0.3)",
//                 }}
//               >
//                 Back to Menu
//                 <i className="far fa-arrow-alt-right" />
//               </button>
//             </Link>
//           </div>
//         </div>
//       </WellFoodLayout>
//     );
//   }

//   return (
//     <WellFoodLayout>
//       <div className="product-details-area pt-120 rpt-100 pb-85 rpb-65">
//         <div className="container">
//           <div className="text-center mb-5">
//             <h1 className="mb-4" style={{ fontSize: "2.5rem", fontWeight: "700", color: "#333" }}>
//               Choose Your Perfect Size
//             </h1>
//             <p style={{ fontSize: "1.2rem", color: "#666" }}>
//               All items come with your choice of sauce at no extra charge
//             </p>
//           </div>

//           <div className="row">
//             {items.map((item) => (
//               <div key={item.id} className="col-12 mb-5">
//                 <div
//                   style={{
//                     background: "#fff",
//                     borderRadius: "15px",
//                     padding: "30px",
//                     boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
//                     border: "1px solid #f0f0f0"
//                   }}
//                 >
//                   <div className="row align-items-center">
//                     <div className="col-lg-4 text-center mb-4 mb-lg-0">
//                       <img
//                         src={`${API_URL}/images/${item.imageUrl || 'default-combo.png'}`}
//                         alt={item.name}
//                         style={{
//                           maxWidth: "100%",
//                           height: "250px",
//                           objectFit: "cover",
//                           borderRadius: "10px"
//                         }}
//                         onError={(e) => {
//                           e.target.src = `${API_URL}/images/default-combo.png`;
//                         }}
//                       />
//                     </div>
                    
//                     <div className="col-lg-8">
//                       <h2 style={{ fontSize: "2rem", fontWeight: "600", marginBottom: "15px", color: "#333" }}>
//                         {item.name}
//                       </h2>
//                       <p style={{ fontSize: "1.1rem", color: "#666", marginBottom: "30px" }}>
//                         {item.description}
//                       </p>

//                       {/* Available Sauces */}
//                       <div style={{ marginBottom: "30px" }}>
//                         <h5 style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "10px", color: "#333" }}>
//                           Available Sauces (No Extra Charge):
//                         </h5>
//                         <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
//                           {item.availableSauces?.map((sauce, index) => (
//                             <span
//                               key={index}
//                               style={{
//                                 background: "#fff5f2",
//                                 color: "#ff6b35",
//                                 padding: "5px 12px",
//                                 borderRadius: "20px",
//                                 border: "1px solid #ff6b35",
//                                 fontSize: "0.9rem",
//                                 fontWeight: "500"
//                               }}
//                             >
//                               {sauce}
//                             </span>
//                           ))}
//                         </div>
//                       </div>

//                       {/* Size Options */}
//                       <div className="row">
//                         {Object.entries(item.sizePricing || {}).map(([size, pricing]) => (
//                           <div key={size} className="col-md-6 col-lg-3 mb-3">
//                             <div
//                               style={{
//                                 border: "2px solid #f0f0f0",
//                                 borderRadius: "12px",
//                                 padding: "20px",
//                                 textAlign: "center",
//                                 transition: "all 0.3s ease",
//                                 height: "100%",
//                                 display: "flex",
//                                 flexDirection: "column",
//                                 justifyContent: "space-between"
//                               }}
//                               onMouseEnter={(e) => {
//                                 e.currentTarget.style.borderColor = "#ff6b35";
//                                 e.currentTarget.style.transform = "translateY(-5px)";
//                                 e.currentTarget.style.boxShadow = "0 10px 25px rgba(255, 107, 53, 0.15)";
//                               }}
//                               onMouseLeave={(e) => {
//                                 e.currentTarget.style.borderColor = "#f0f0f0";
//                                 e.currentTarget.style.transform = "translateY(0)";
//                                 e.currentTarget.style.boxShadow = "none";
//                               }}
//                             >
//                               <div>
//                                 <h4 style={{ 
//                                   fontSize: "1.3rem", 
//                                   fontWeight: "600", 
//                                   marginBottom: "10px", 
//                                   color: "#333",
//                                   textTransform: "capitalize"
//                                 }}>
//                                   {size === "wings" ? "8 Wings" : size}
//                                 </h4>
                                
//                                 <div style={{ marginBottom: "20px" }}>
//                                   <div style={{ marginBottom: "8px" }}>
//                                     <span style={{ fontSize: "0.9rem", color: "#666" }}>On its own</span>
//                                     <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#333" }}>
//                                       £{parseFloat(pricing.basePrice || 0).toFixed(2)}
//                                     </div>
//                                   </div>
                                  
//                                   {pricing.mealDealPrice && (
//                                     <div style={{ 
//                                       background: "#fff5f2", 
//                                       padding: "10px", 
//                                       borderRadius: "8px",
//                                       border: "1px solid #ff6b35"
//                                     }}>
//                                       <span style={{ fontSize: "0.85rem", color: "#ff6b35", fontWeight: "600" }}>
//                                         🌟 Meal Deal - Best Value!
//                                       </span>
//                                       <div style={{ fontSize: "1.3rem", fontWeight: "700", color: "#ff6b35" }}>
//                                         £{parseFloat(pricing.mealDealPrice).toFixed(2)}
//                                       </div>
//                                       <div style={{ fontSize: "0.8rem", color: "#666", marginTop: "5px" }}>
//                                         with {item.mealDealConfig?.[size]?.sideCount || 1} side{(item.mealDealConfig?.[size]?.sideCount || 1) > 1 ? 's' : ''} and {item.mealDealConfig?.[size]?.drinkCount || 1} drink{(item.mealDealConfig?.[size]?.drinkCount || 1) > 1 ? 's' : ''}
//                                       </div>
//                                     </div>
//                                   )}
//                                 </div>
//                               </div>

//                               <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
//                                 <Link href={`/combo-style-details?id=${item.id}&size=${size}&mealDeal=false`}>
//                                   <button
//                                     style={{
//                                       width: "100%",
//                                       padding: "12px 16px",
//                                       fontSize: "1rem",
//                                       fontWeight: "600",
//                                       borderRadius: "8px",
//                                       background: "#333",
//                                       border: "none",
//                                       color: "#fff",
//                                       transition: "all 0.3s ease",
//                                       cursor: "pointer"
//                                     }}
//                                     onMouseEnter={(e) => {
//                                       e.target.style.background = "#555";
//                                     }}
//                                     onMouseLeave={(e) => {
//                                       e.target.style.background = "#333";
//                                     }}
//                                   >
//                                     Order
//                                   </button>
//                                 </Link>
                                
//                                 {pricing.mealDealPrice && (
//                                   <Link href={`/combo-style-details?id=${item.id}&size=${size}&mealDeal=true`}>
//                                     <button
//                                       style={{
//                                         width: "100%",
//                                         padding: "12px 16px",
//                                         fontSize: "1rem",
//                                         fontWeight: "600",
//                                         borderRadius: "8px",
//                                         background: "#ff6b35",
//                                         border: "none",
//                                         color: "#fff",
//                                         transition: "all 0.3s ease",
//                                         cursor: "pointer"
//                                       }}
//                                       onMouseEnter={(e) => {
//                                         e.target.style.background = "#e55a2b";
//                                       }}
//                                       onMouseLeave={(e) => {
//                                         e.target.style.background = "#ff6b35";
//                                       }}
//                                     >
//                                       Meal Deal
//                                     </button>
//                                   </Link>
//                                 )}
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//       <FixedBtn />
//     </WellFoodLayout>
//   );
// };

// export default ComboStyleItemsMenu;


"use client";
import FixedBtn from "@/components/custom/FixedBtn";
import WellFoodLayout from "@/layout/WellFoodLayout";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { API_URL } from "@/services/config";
import PizzaLoader from "@/components/pizzaLoader";

const ComboStyleItemsMenu = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [failedImages, setFailedImages] = useState(new Set());
  const searchParams = useSearchParams();
  const itemId = searchParams.get('itemId'); // Get itemId from URL

  useEffect(() => {
    const fetchItems = async () => {
      try {
        console.log('🔧 Fetching combo style items from:', `${API_URL}/getComboStyleItems`);
        console.log('🔧 Selected item ID from URL:', itemId);
        
        const response = await fetch(`${API_URL}/getComboStyleItems`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          console.error('🔧 Non-JSON response:', text.substring(0, 200));
          throw new Error('Server returned non-JSON response');
        }
        
        const data = await response.json();
        console.log('🔧 Received combo style items:', data);

        if (Array.isArray(data)) {
          // Filter to show only the selected item if itemId is provided
          const filteredItems = itemId 
            ? data.filter(item => item.id === itemId)
            : data;
          
          console.log('🔧 Filtered items:', filteredItems);
          setItems(filteredItems);
        } else {
          console.error('🔧 Invalid data format:', data);
          setError("Invalid data format received");
        }
      } catch (error) {
        console.error("🔧 Error loading items:", error);
        setError(`Failed to load items: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [itemId]); // Add itemId as dependency

  if (loading) {
    return (
      <WellFoodLayout>
        <PizzaLoader forceDuration={4000} />
      </WellFoodLayout>
    );
  }

  if (error) {
    return (
      <WellFoodLayout>
        <div className="container">
          <div className="text-center py-5">
            <h2 className="mb-4">{error}</h2>
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

  // Show message if no items found (either no items at all, or selected item not found)
  if (items.length === 0) {
    return (
      <WellFoodLayout>
        <div className="container">
          <div className="text-center py-5">
            <h2 className="mb-4">
              {itemId ? "Selected item not found" : "No items available"}
            </h2>
            <p className="mb-4 text-muted">
              {itemId 
                ? `The item with ID "${itemId}" could not be found. It may have been removed or is no longer available.`
                : "There are currently no combo style items available."
              }
            </p>
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
      <div className="product-details-area pt-120 rpt-100 pb-85 rpb-65">
        <div className="container">
          <div className="text-center mb-5">
            <h1 className="mb-4" style={{ fontSize: "2.5rem", fontWeight: "700", color: "#333" }}>
              Choose Your Perfect Size
            </h1>
            <p style={{ fontSize: "1.2rem", color: "#666" }}>
              All items come with your choice of sauce at no extra charge
            </p>
            
            {/* Show breadcrumb when showing specific item */}
            {itemId && (
              <div className="mb-4">
                <Link 
                  href="/menu-pizza" 
                  style={{ 
                    color: "#ff6b35", 
                    textDecoration: "none",
                    fontSize: "1rem",
                    fontWeight: "500"
                  }}
                >
                  ← Back to All Items
                </Link>
              </div>
            )}
          </div>

          <div className="row">
            {items.map((item) => {
              if (!item?.id || !item?.sizePricing) {
                return null;
              }

              return (
                <div key={item.id} className="col-12 mb-5">
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: "15px",
                      padding: "30px",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                      border: "1px solid #f0f0f0"
                    }}
                  >
                    <div className="row align-items-center">
                      <div className="col-lg-4 text-center mb-4 mb-lg-0">
                        <img
                          src={failedImages.has(item.id) 
                            ? `${API_URL}/images/default-combo.png` 
                            : `${API_URL}/images/${item.imageUrl || 'default-combo.png'}`}
                          alt={item.name}
                          style={{
                            maxWidth: "100%",
                            height: "250px",
                            objectFit: "cover",
                            borderRadius: "10px"
                          }}
                          onError={(e) => {
                            if (!failedImages.has(item.id)) {
                              setFailedImages(prev => new Set([...prev, item.id]));
                              e.target.src = `${API_URL}/images/default-combo.png`;
                            }
                          }}
                        />
                      </div>
                      
                      <div className="col-lg-8">
                        <h2 style={{ fontSize: "2rem", fontWeight: "600", marginBottom: "15px", color: "#333" }}>
                          {item.name}
                        </h2>
                        <p style={{ fontSize: "1.1rem", color: "#666", marginBottom: "30px" }}>
                          {item.description}
                        </p>

                        {/* Available Sauces */}
                        <div style={{ marginBottom: "30px" }}>
                          <h5 style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "10px", color: "#333" }}>
                            Available Sauces (No Extra Charge):
                          </h5>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                            {item.availableSauces?.map((sauce, index) => (
                              <span
                                key={index}
                                style={{
                                  background: "#fff5f2",
                                  color: "#ff6b35",
                                  padding: "5px 12px",
                                  borderRadius: "20px",
                                  border: "1px solid #ff6b35",
                                  fontSize: "0.9rem",
                                  fontWeight: "500"
                                }}
                              >
                                {sauce}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Size Options - Compact Mobile Layout */}
                        <div className="row">
                          {Object.entries(item.sizePricing || {}).map(([size, pricing]) => {
                            if (!size || !pricing) {
                              return null;
                            }

                            const hasMealDeal = pricing.mealDealPrice;
                            const mealDealConfig = item.mealDealConfig?.[size];
                            const sidesCount = mealDealConfig?.sides?.count || 1;
                            const drinksCount = mealDealConfig?.drinks?.count || 1;

                            return (
                              <div key={`size-${item.id}-${size}`} className="col-12 col-md-6 mb-3">
                                <div style={{
                                  border: "1px solid #e0e0e0",
                                  borderRadius: "8px",
                                  padding: "12px",
                                  background: "#fff",
                                  boxShadow: "0 1px 4px rgba(0,0,0,0.05)"
                                }}>
                                  {/* Size Header */}
                                  <div style={{ 
                                    textAlign: "center", 
                                    marginBottom: "12px",
                                    paddingBottom: "8px",
                                    borderBottom: "1px solid #f0f0f0"
                                  }}>
                                    <h5 style={{ 
                                      fontSize: "1.1rem", 
                                      fontWeight: "600", 
                                      margin: "0", 
                                      color: "#333",
                                      textTransform: "capitalize"
                                    }}>
                                      {size === "wings" ? "8 Wings" : size}
                                    </h5>
                                  </div>

                                  {/* Options Container */}
                                  <div style={{ 
                                    display: "flex", 
                                    flexDirection: hasMealDeal ? "column" : "row",
                                    gap: "8px"
                                  }}>
                                    {/* Regular Order Option */}
                                    <Link 
                                      href={`/combo-style-details?id=${encodeURIComponent(item.id)}&size=${encodeURIComponent(size)}&mealDeal=false`} 
                                      style={{ textDecoration: "none", color: "inherit", flex: "1" }}
                                    >
                                      <div
                                        style={{
                                          border: "1px solid #ddd",
                                          borderRadius: "6px",
                                          padding: "10px",
                                          textAlign: "center",
                                          transition: "all 0.2s ease",
                                          cursor: "pointer",
                                          background: "#fff",
                                          minHeight: "70px",
                                          display: "flex",
                                          flexDirection: "column",
                                          justifyContent: "center"
                                        }}
                                        onMouseEnter={(e) => {
                                          e.currentTarget.style.borderColor = "#333";
                                          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                                        }}
                                        onMouseLeave={(e) => {
                                          e.currentTarget.style.borderColor = "#ddd";
                                          e.currentTarget.style.boxShadow = "none";
                                        }}
                                      >
                                        <div style={{ marginBottom: "4px" }}>
                                          <span style={{ 
                                            fontSize: "0.75rem", 
                                            color: "#666",
                                            fontWeight: "500"
                                          }}>
                                            Regular
                                          </span>
                                        </div>
                                        <div style={{ 
                                          fontSize: "1.3rem", 
                                          fontWeight: "700", 
                                          color: "#333",
                                          marginBottom: "2px"
                                        }}>
                                          £{parseFloat(pricing.basePrice || 0).toFixed(2)}
                                        </div>
                                        <div style={{ 
                                          fontSize: "0.7rem", 
                                          color: "#666"
                                        }}>
                                          Item + sauce
                                        </div>
                                      </div>
                                    </Link>

                                    {/* Meal Deal Option */}
                                    {hasMealDeal && (
                                      <Link 
                                        href={`/combo-style-details?id=${encodeURIComponent(item.id)}&size=${encodeURIComponent(size)}&mealDeal=true`} 
                                        style={{ textDecoration: "none", color: "inherit", flex: "1" }}
                                      >
                                        <div
                                          style={{
                                            border: "1px solid #ff6b35",
                                            borderRadius: "6px",
                                            padding: "10px",
                                            textAlign: "center",
                                            transition: "all 0.2s ease",
                                            cursor: "pointer",
                                            background: "#fff8f5",
                                            position: "relative",
                                            minHeight: "70px",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center"
                                          }}
                                          onMouseEnter={(e) => {
                                            e.currentTarget.style.borderColor = "#e55a2b";
                                            e.currentTarget.style.boxShadow = "0 2px 8px rgba(255, 107, 53, 0.15)";
                                          }}
                                          onMouseLeave={(e) => {
                                            e.currentTarget.style.borderColor = "#ff6b35";
                                            e.currentTarget.style.boxShadow = "none";
                                          }}
                                        >
                                          {/* Save Badge */}
                                          <div style={{
                                            position: "absolute",
                                            top: "-6px",
                                            right: "6px",
                                            background: "#ff6b35",
                                            color: "#fff",
                                            padding: "2px 6px",
                                            borderRadius: "8px",
                                            fontSize: "0.6rem",
                                            fontWeight: "600"
                                          }}>
                                            SAVE
                                          </div>

                                          <div style={{ marginBottom: "4px" }}>
                                            <span style={{ 
                                              fontSize: "0.75rem", 
                                              color: "#ff6b35",
                                              fontWeight: "600"
                                            }}>
                                              Meal Deal
                                            </span>
                                          </div>
                                          <div style={{ 
                                            fontSize: "1.3rem", 
                                            fontWeight: "700", 
                                            color: "#ff6b35",
                                            marginBottom: "2px"
                                          }}>
                                            £{parseFloat(pricing.mealDealPrice).toFixed(2)}
                                          </div>
                                          <div style={{ 
                                            fontSize: "0.65rem", 
                                            color: "#666"
                                          }}>
                                            + {sidesCount} side + {drinksCount} drink
                                          </div>
                                        </div>
                                      </Link>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* Temporarily commented out to test if this is causing the error */}
      {/* <FixedBtn /> */}
    </WellFoodLayout>
  );
};

export default ComboStyleItemsMenu;