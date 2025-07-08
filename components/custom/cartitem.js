import React from "react";

const CartItem = ({
  image,
  title,
  size,
  ingredients,
  quantity,
  price,
  onIncrement,
  onDecrement,
  onDelete,
}) => {
  // console.log("njnjnjnnj",ingredients)
  return (
    <div className="cart-item">
      {/* <img src={image} alt={title} className="cart-item-image" /> */}
      <img
        src={`http://localhost:3003/api/images/${image}`}
        alt={title}
        className="cart-item-image"
      />
      <div className="cart-item-details">
        <h3 className="cart-item-title">{title}</h3>
        <p className="cart-item-title">{size}</p>
        <p className="cart-item-ingredients">
          {" "}
          Ingredients:{" "}
          {ingredients?.map((ingredient) => ingredient.name).join(", ") ||
            "No ingredients"}
        </p>
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
          <span className="cart-item-price">${price}</span>
        </div>
      </div>
      <button className="delete-btn" onClick={onDelete}>
        ×
      </button>
    </div>
  );
};

export default CartItem;
