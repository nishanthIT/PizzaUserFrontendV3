import React from "react";

const CartItem = ({
  image,
  title,
  size,
  ingredients,
  quantity,
  pizzaBase,
  sauce, // Add sauce prop
  isMealDeal, // Add meal deal prop
  selectedSides, // Add selected sides prop (legacy)
  selectedDrinks, // Add selected drinks prop (legacy)
  sides, // Add sides array prop (new combo style)
  drinks, // Add drinks array prop (new combo style)
  isPeriPeri, // Add Peri Peri flag prop
  isComboStyleItem, // Add combo style flag prop
  type, // Add item type
  price,
  onIncrement,
  onDecrement,
  onDelete,
}) => {
  // Parse sides and drinks if they exist (legacy format)
  let legacySides = [];
  let legacyDrinks = [];
  
  if (selectedSides) {
    try {
      legacySides = JSON.parse(selectedSides);
    } catch (error) {
      console.error("Error parsing selected sides:", error);
    }
  }
  
  if (selectedDrinks) {
    try {
      legacyDrinks = JSON.parse(selectedDrinks);
    } catch (error) {
      console.error("Error parsing selected drinks:", error);
    }
  }

  // Use new format sides/drinks if available, otherwise use legacy format
  const finalSides = sides && sides.length > 0 ? sides : legacySides;
  const finalDrinks = drinks && drinks.length > 0 ? drinks : legacyDrinks;

  return (
    <div className="cart-item">
      <img
        src={`${process.env.NEXT_PUBLIC_API_URL}/api/images/${image}`}
        alt={title}
        className="cart-item-image"
      />
      <div className="cart-item-details">
        <h3 className="cart-item-title">{title}</h3>
        <p className="cart-item-title">{size}</p>
        
        {/* Pizza base for pizzas */}
        {pizzaBase && !isComboStyleItem && (
          <p className="cart-item-ingredients">Base: {pizzaBase}</p>
        )}
        
        {/* Sauce for all items that have it */}
        {sauce && (
          <p className="cart-item-ingredients">Sauce: {sauce}</p>
        )}
        
        {/* Meal deal details for Peri Peri and Combo Style items */}
        {(isPeriPeri || isComboStyleItem || type === 'comboStyleItem') && isMealDeal && (
          <div className="meal-deal-details" style={{ marginBottom: "10px" }}>
            <p className="cart-item-ingredients" style={{ 
              color: "#ff6b35", 
              fontWeight: "600",
              fontSize: "0.85rem"
            }}>
              🌟 Meal Deal
            </p>
            
            {finalSides.length > 0 && (
              <p className="cart-item-ingredients" style={{ fontSize: "0.85rem" }}>
                Sides: {finalSides.map(side => side.name).join(", ")}
              </p>
            )}
            
            {finalDrinks.length > 0 && (
              <p className="cart-item-ingredients" style={{ fontSize: "0.85rem" }}>
                Drinks: {finalDrinks.map(drink => drink.name).join(", ")}
              </p>
            )}
          </div>
        )}
        
        {/* Ingredients for pizzas only */}
        {!isPeriPeri && !isComboStyleItem && type !== 'comboStyleItem' && (
          <p className="cart-item-ingredients">
            Ingredients:{" "}
            {ingredients?.map((ingredient) => ingredient.name).join(", ") ||
              "No ingredients"}
          </p>
        )}
        
        <div className="cart-item-actions">
          <div className="quantity-controls">
            <button className="quantity-btn" onClick={onDecrement}>
              -
            </button>
            <span className="quantity">{quantity}</span>
            <button className="quantity-btn" onClick={onIncrement}>
              +
            </button>
          </div>
          <span className="cart-item-price">£{price}</span>
        </div>
      </div>
      <button className="delete-btn" onClick={onDelete}>
        ×
      </button>
    </div>
  );
};

export default CartItem;




















// import React from "react";
// import { API_URL } from "@/services/config";

// const CartItem = ({
//   image,
//   title,
//   size,
//   pizzaBase, // Add pizzaBase prop
//   ingredients,
//   toppings,
//   quantity,
//   price,
//   onIncrement,
//   onDecrement,
//   onDelete,
// }) => {
//   return (
//     <div className="shopping-cart-item" style={{
//       display: "flex",
//       alignItems: "center",
//       padding: "20px",
//       marginBottom: "15px",
//       backgroundColor: "#fff",
//       borderRadius: "8px",
//       boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//     }}>
//       <div className="cart-item-image" style={{ marginRight: "20px" }}>
//         <img 
//           src={image} 
//           alt={title} 
//           style={{
//             width: "80px",
//             height: "80px",
//             objectFit: "cover",
//             borderRadius: "8px",
//           }}
//         />
//       </div>
      
//       <div className="cart-item-details" style={{ flex: 1 }}>
//         <h4 style={{ margin: "0 0 10px 0", fontSize: "1.2rem", fontWeight: "600" }}>
//           {title}
//         </h4>
        
//         <div className="item-info" style={{ marginBottom: "10px" }}>
//           <p style={{ margin: "0", fontSize: "0.9rem", color: "#666" }}>
//             Size: <span style={{ fontWeight: "500" }}>{size}</span>
//           </p>
//           {pizzaBase && (
//             <p style={{ margin: "0", fontSize: "0.9rem", color: "#666" }}>
//               Base: <span style={{ fontWeight: "500" }}>{pizzaBase}</span>
//             </p>
//           )}
          
//           {ingredients && ingredients.length > 0 && (
//             <div className="ingredients" style={{ marginTop: "8px" }}>
//               <p style={{ margin: "0 0 5px 0", fontSize: "0.9rem", color: "#666" }}>
//                 Ingredients:
//               </p>
//               <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
//                 {ingredients.map((ingredient, index) => (
//                   <span key={index} style={{
//                     fontSize: "0.8rem",
//                     backgroundColor: "#f0f0f0",
//                     padding: "2px 6px",
//                     borderRadius: "4px",
//                     color: "#555",
//                   }}>
//                     {ingredient.name || ingredient.ingredient?.name} (x{ingredient.quantity || ingredient.addedQuantity})
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}
          
//           {toppings && toppings.length > 0 && (
//             <div className="toppings" style={{ marginTop: "8px" }}>
//               <p style={{ margin: "0 0 5px 0", fontSize: "0.9rem", color: "#666" }}>
//                 Toppings:
//               </p>
//               <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
//                 {toppings.map((topping, index) => (
//                   <span key={index} style={{
//                     fontSize: "0.8rem",
//                     backgroundColor: "#fff4f0",
//                     padding: "2px 6px",
//                     borderRadius: "4px",
//                     color: "#ff6b35",
//                   }}>
//                     {topping.name || topping.topping?.name} (x{topping.quantity || topping.addedQuantity})
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
        
//         <div className="quantity-controls" style={{
//           display: "flex",
//           alignItems: "center",
//           gap: "10px",
//           marginTop: "10px",
//         }}>
//           <button 
//             onClick={onDecrement}
//             style={{
//               width: "30px",
//               height: "30px",
//               border: "1px solid #ddd",
//               background: "#f5f5f5",
//               borderRadius: "4px",
//               cursor: "pointer",
//             }}
//           >
//             -
//           </button>
//           <span style={{ 
//             minWidth: "30px", 
//             textAlign: "center", 
//             fontWeight: "600",
//             fontSize: "1rem",
//           }}>
//             {quantity}
//           </span>
//           <button 
//             onClick={onIncrement}
//             style={{
//               width: "30px",
//               height: "30px",
//               border: "1px solid #ddd",
//               background: "#f5f5f5",
//               borderRadius: "4px",
//               cursor: "pointer",
//             }}
//           >
//             +
//           </button>
//         </div>
//       </div>
      
//       <div className="item-actions" style={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "flex-end",
//         gap: "10px",
//       }}>
//         <div className="item-price" style={{
//           fontSize: "1.2rem",
//           fontWeight: "700",
//           color: "#ff6b35",
//         }}>
//           £{price}
//         </div>
        
//         <button 
//           onClick={onDelete} 
//           className="remove-item"
//           style={{
//             padding: "5px 10px",
//             backgroundColor: "#dc3545",
//             color: "#fff",
//             border: "none",
//             borderRadius: "4px",
//             cursor: "pointer",
//             fontSize: "0.8rem",
//           }}
//         >
//           Remove
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CartItem;
