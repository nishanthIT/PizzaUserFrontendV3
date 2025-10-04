import React from "react";

const CartItem = ({
  image,
  title,
  size,
  ingredients,
  toppings,
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
  hasPizzaCategory, // Add flag for UserChoice with pizza category
  hasComboStyleCategory, // Add flag for UserChoice with combo style category
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
        {(isMealDeal || (type ==="pizza" && toppings)&&(
 <p className="cart-item-title">{size}</p>
        ))}
       
        
        {/* Pizza base for pizzas */}
        {console.log("type "+type)}
        {pizzaBase && !isComboStyleItem && type !== 'userChoice' && toppings &&  (
          <p className="cart-item-ingredients">Base: {pizzaBase}</p>
        )}
        
        {/* UserChoice specific display */}
        {type === 'userChoice' && (
          <div className="user-choice-details" style={{ marginBottom: "10px" }}>
            {/* Debug info - remove later */}
            {console.log('UserChoice Item Debug:', { 
              type, 
              hasPizzaCategory, 
              hasComboStyleCategory, 
              pizzaBase, 
              sauce,
              title 
            })}

            {console.log("its logging")}
            
            {/* Only show base for UserChoice items that have pizza categories */}
            {/* {hasPizzaCategory && pizzaBase && (
              <p className="cart-item-ingredients">Base: {pizzaBase}</p>
            )} */}
            
            {/* Only show sauce for UserChoice items that have combo style categories and valid sauce */}
            {hasComboStyleCategory && sauce && sauce !== "No sauce" && (
              <p className="cart-item-ingredients">Sauce: {sauce}</p>
            )}
            
            {/* For other categories (sides, drinks, etc.) - show nothing extra, just name and price */}
          </div>
        )}
        
        {/* Sauce for non-UserChoice items that have it (but not "No sauce") */}
        {sauce && sauce !== "No sauce" && type !== 'userChoice' && (
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
        
        {/* Ingredients for pizzas only (not UserChoice or other special types) */}
        {/* {!isPeriPeri && !isComboStyleItem && type !== 'comboStyleItem' && type !== 'userChoice' && (
          <p className="cart-item-ingredients">
            Ingredients:{" "}
            {ingredients?.map((ingredient) => ingredient.name).join(", ") ||
              "No ingredients"}
          </p>
        )} */}
        
        {/* Don't show ingredients for UserChoice items at all */}
        
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












