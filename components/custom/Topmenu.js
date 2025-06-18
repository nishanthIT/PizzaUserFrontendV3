// FoodMenuItem.jsx
import React from "react";

const TopMenuItem = ({ item}) => (
  <div className="food-menu-item style-two">
    <div className="image">
      <img src={item.img} alt={item.title} />
    </div>
    <div className="content">
      <h5>
        <span className="title">{item.title}</span>
        <span className="dots" />
        <span className="price">£{item.price}</span>
      </h5>
      <p>{item.decs}</p>
    </div>
  </div>
);

export default TopMenuItem;
