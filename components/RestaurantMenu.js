"use client";
import Link from "next/link";
import { Nav, Tab } from "react-bootstrap";
import { useState, useEffect } from "react";
import { API_URL } from "@/services/config";

const calculatePrice = (item) => {
  if (item.type === "other") {
    return item.price;
  }

  if (item.type === "comboStyle") {
    // For combo style items, show "from" price
    return item.price;
  }

  if (item.type === "userChoice") {
    // For user choice items, show base price
    return item.price;
  }

  // const ingredientCost = (item.ingredients || []).reduce(
  //   (sum, ingredient) =>
  //     ingredient.quantity > 0
  //       ? sum + ingredient.price * ingredient.quantity
  //       : sum,
  //   0
  // );

  // const toppingCost = (item.toppings || []).reduce(
  //   (sum, topping) =>
  //     topping.quantity > 0 ? sum + topping.price * topping.quantity : sum,
  //   0
  // );
  // const total =
  //   Number(item.price) + Number(ingredientCost) + Number(toppingCost);

  // return total.toFixed(1);
    return Number(item.prices);
};

const getItemLink = (item) => {
  // Add debugging for all items
  console.log("getItemLink called with item:", item);
  
  // Safety check for item
  if (!item) {
    console.error("getItemLink called with null/undefined item");
    return "#";
  }

  if (item.type === "comboStyle") {
    // For Combo Style items, go to the combo style menu with specific item ID
    const link = `/combo-style-menu?itemId=${item.itemId || item.id}`;
    console.log("ComboStyle link:", link);
    return link;
  }
  
  if (item.type === "userChoice") {
    // For UserChoice items, go to the user choice details page
    const userChoiceId = item.userChoiceId || item.id;
    console.log("UserChoice link generation:", { item, userChoiceId });
    
    if (!userChoiceId) {
      console.error("No userChoiceId found for item:", item);
      return "#"; // Fallback to prevent undefined href
    }
    
    // Add fromMenu=true parameter to allow access to inactive items
    const link = `/user-choice-details?id=${userChoiceId}&fromMenu=true`;
    console.log("UserChoice link:", link);
    return link;
  }
  
  if (item.type === "other") {
    // Check if this is a chicken item that should use combo style
    const itemName = item.title?.toLowerCase() || "";
    const isChickenItem = itemName.includes("peri") || 
                         itemName.includes("chicken wings") || 
                         itemName.includes("grilled chicken") ||
                         itemName.includes("quarter") ||
                         itemName.includes("half") ||
                         itemName.includes("whole");
    
    if (isChickenItem) {
      // Redirect chicken items to combo style menu
      const link = "/combo-style-menu";
      console.log("Chicken item link:", link);
      return link;
    }
    
    const otherLink = {
      pathname: "/otherItem-details",
      query: {
        id: item.id,
        title: item.title,
        price: item.price,
        desc: item.decs,
        img: item.img,
      },
    };
    console.log("Other item link:", otherLink);
    return otherLink;
  }

  // Default case for regular pizza items
  const defaultLink = {
    pathname: "/product-details",
    query: {
      id: item.id,
      title: item.title,
      price: item.price,
      desc: item.decs,
      img: item.img,
      ingredients: JSON.stringify(item.ingredients || []),
      toppings: JSON.stringify(item.toppings || []),
    },
  };
  console.log("Default item link:", defaultLink);
  return defaultLink;
};

// Safe wrapper for getItemLink to ensure no undefined href
const getSafeItemLink = (item) => {
  try {
    const link = getItemLink(item);
    if (!link) {
      console.error("getItemLink returned falsy value for item:", item);
      return "#";
    }
    return link;
  } catch (error) {
    console.error("Error in getItemLink:", error, "Item:", item);
    return "#";
  }
};

const Item = ({ item }) => {
  const getImageSrc = () => {
    if (item.type === "comboStyle") {
      return `${API_URL}/images/${item.img}`;
    }
    if (item.type === "userChoice") {
      // UserChoice items need proper API URL formatting
      if (item.img && item.img.startsWith('http')) {
        return item.img; // Already a full URL
      }
      return `${API_URL}/images/${item.img}`;
    }
    if (item.type === "other") {
      return `${API_URL}/images/other-${item.id}.png`;
    }
    return `${API_URL}/images/pizza-${item.id}.png`;
  };

  const formatPrice = () => {
    const price = calculatePrice(item);
    if ((item.type === "comboStyle" || item.type === "userChoice") && item.showPriceFrom) {
      return `from £${price}`;
    }
    return `£${price}`;
  };

  return (
    <div className="food-menu-item style-two custom-food-item">
      <div className="image">
        <img
          src={getImageSrc()}
          alt={item.title}
        />
      </div>
      <div className="content">
        <h5>
          <span className="title">{item.title}</span> <span className="dots" />{" "}
          <span className="price">{formatPrice()}</span>
        </h5>
        <p>{item.decs}</p>
        {item.type === "comboStyle" && (
          <small style={{ color: "#ff6b35", fontWeight: "600" }}>
            Multiple sizes available • Choice of sauce included
          </small>
        )}
        {item.type === "userChoice" && (
          <small style={{ color: "#ff6b35", fontWeight: "600" }}>
            Customizable meal deal • Choose your favorites
          </small>
        )}
      </div>
    </div>
  );
};

const RestaurantMenu = ({
  menus,
  loading,
  error,
  onCategorySelect,
  selectedCategory,
}) => {
  const [activeTab, setActiveTab] = useState(
    menus.length > 0 ? menus[0].event : ""
  );

  // Update activeTab when selectedCategory changes
  useEffect(() => {
    if (selectedCategory && menus.length > 0) {
      const matchingMenu = menus.find((menu) => menu.id === selectedCategory);
      if (matchingMenu) {
        setActiveTab(matchingMenu.event);
      }
    }
  }, [selectedCategory, menus]);

  // Handle tab change
  const handleTabChange = (eventKey) => {
    console.log("Tab changed to:", eventKey);
    setActiveTab(eventKey);
    // Extract category ID from event key (format: food-tab-{categoryId})
    const categoryId = eventKey.replace("food-tab-", "");
    console.log("Selected category ID:", categoryId);
    if (onCategorySelect) {
      onCategorySelect(categoryId);
    }
  };

  console.log("Current menus:", menus);
  console.log("Active tab:", activeTab);
  console.log("Selected category:", selectedCategory);

  return (
    <section className="restaurant-menu-area pb-100 rpb-70 rel z-1">
      <div className="container container-1050">
        <div className="row justify-content-center">
          <div className="col-xl-8 col-lg-9">
            <div
              className="section-title text-center mb-50"
              data-aos="fade-up"
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <h2>Explore Our Delicious Menu</h2>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        )}

        <Tab.Container
          activeKey={activeTab}
          onSelect={handleTabChange}
          defaultActiveKey={menus.length > 0 ? menus[0].event : ""}
        >
          <Nav
            as={"ul"}
            className="nav food-menu-tab mb-40"
            data-aos="fade-up"
            data-aos-delay={50}
            data-aos-duration={1500}
            data-aos-offset={50}
          >
            {menus.map((menu) => (
              <Nav.Item as={"li"} key={menu.id}>
                <Nav.Link
                  as={"button"}
                  className="nav-link"
                  eventKey={menu.event}
                >
                  <span>{menu.title}</span>
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
          <Tab.Content className="food-menu-tab-content tab-content">
            {menus.map((menu) => (
              <Tab.Pane
                className="tab-pane fade"
                eventKey={menu.event}
                key={menu.id}
              >
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3">Loading delicious items...</p>
                  </div>
                ) : menu.items && menu.items.length > 0 ? (
                  <div className="row gap-90">
                    <div
                      className="col-lg-6 pb-30"
                      data-aos="fade-right"
                      data-aos-duration={1500}
                      data-aos-offset={50}
                    >
                      {menu.items.map(
                        (item, i) =>
                          i < Math.ceil(menu.items.length / 2) && (
                            <Link key={item.id} href={getSafeItemLink(item)}>
                              <Item item={item} />
                            </Link>
                          )
                      )}
                    </div>
                    <div
                      className="col-lg-6 pb-30"
                      data-aos="fade-left"
                      data-aos-duration={1500}
                      data-aos-offset={50}
                    >
                      {menu.items.map(
                        (item, i) =>
                          i >= Math.ceil(menu.items.length / 2) && (
                            <Link key={item.id} href={getSafeItemLink(item)}>
                              <Item item={item} />
                            </Link>
                          )
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <p>No items available in this category</p>
                  </div>
                )}
              </Tab.Pane>
            ))}
          </Tab.Content>
        </Tab.Container>
      </div>
      <div className="testimonials-shapes d-none d-md-block">
        <div className="shape one">
          <img src="assets/images/shapes/chicken-menu1.png" alt="Shape" />
        </div>
        <div className="shape two">
          <img src="assets/images/shapes/chicken-menu2.png" alt="Shape" />
        </div>
      </div>
    </section>
  );
};

export default RestaurantMenu;
