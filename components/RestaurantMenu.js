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

  if (item.type === "pizzaBuilder") {
    // For Pizza Builder items, treat them as special pizzas and go to product-details
    const pizzaBuilderDealId = item.pizzaBuilderDealId || item.id;
    console.log("PizzaBuilder link generation:", { item, pizzaBuilderDealId });
    
    if (!pizzaBuilderDealId) {
      console.error("No pizzaBuilderDealId found for item:", item);
      return "#"; // Fallback to prevent undefined href
    }
    
    // Build URL with selected base and sauce
    let link = `/product-details?id=${pizzaBuilderDealId}&title=${encodeURIComponent(item.title || "Pizza Builder")}&price=${item.price}&desc=${encodeURIComponent(item.decs || "")}&img=${encodeURIComponent(item.img || "")}&type=pizzaBuilder`;
    
    // Add selected base and sauce if available
    if (item.selectedBase) {
      link += `&selectedBase=${encodeURIComponent(JSON.stringify(item.selectedBase))}`;
    }
    if (item.selectedSauce) {
      link += `&selectedSauce=${encodeURIComponent(JSON.stringify(item.selectedSauce))}`;
    }
    
    console.log("PizzaBuilder product-details link:", link);
    return link;
  }

  if (item.type === "pizzaBuilderDeals") {
    // For Pizza Builder Deals, go to pizza selection page with the deal ID and maxToppings
    const dealId = item.dealData?.id || item.id;
    const maxToppings = item.dealData?.maxToppings || item.maxToppings || 4;
    const link = `/pizza-selection?dealId=${dealId}&maxToppings=${maxToppings}`;
    console.log("Pizza Builder Deals link:", link, { dealId, maxToppings });
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
      // Add fourToppingMode if this is from "Choose Your Toppings" section
      ...(item.fourToppingMode && { fourToppingMode: "true" }),
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

// Helper function to get item image source for the new layout
const getItemImageSrc = (item) => {
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
  if (item.type === "pizzaBuilderDeals") {
    return item.img || "/assets/images/food/pm-food1.png";
  }
  return `${API_URL}/images/pizza-${item.id}.png`;
};

// Helper function to format item price for the new layout
const formatItemPrice = (item) => {
  // Special handling for Pizza Builder Deals - don't show price
  if (item.type === "pizzaBuilderDeals" && !item.showPriceFrom) {
    return ""; // No price display
  }
  
  const price = calculatePrice(item);
  if ((item.type === "comboStyle" || item.type === "userChoice" || item.type === "pizzaBuilder") && item.showPriceFrom) {
    return `from £${price}`;
  }
  return `£${price}`;
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
    if ((item.type === "comboStyle" || item.type === "userChoice" || item.type === "pizzaBuilder") && item.showPriceFrom) {
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
      <style jsx>{`
        .menu-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem;
          padding-top: 100px;
        }
        
        @media (max-width: 768px) {
          .menu-container {
            padding-top: 80px;
            padding-left: 0.5rem;
            padding-right: 0.5rem;
          }
        }
      `}</style>
      <div className="menu-container">


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
                  <div style={{ 
                    display: "grid", 
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
                    gap: "1rem",
                    padding: "0 1rem",
                    marginTop: "2rem"
                  }}>
                    {menu.items.map((item) => (
                      <Link key={item.id} href={getSafeItemLink(item)} style={{ textDecoration: "none" }}>
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          padding: "1rem",
                          backgroundColor: "white",
                          borderRadius: "8px",
                          border: "1px solid #e0e0e0",
                          transition: "all 0.2s ease",
                          cursor: "pointer",
                          minHeight: "100px"
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                        >
                          {/* Item Image */}
                          <div style={{ 
                            flexShrink: 0,
                            marginRight: "1rem"
                          }}>
                            <img
                              src={getItemImageSrc(item)}
                              alt={item.title}
                              style={{ 
                                width: "80px", 
                                height: "80px", 
                                borderRadius: "8px",
                                objectFit: "cover"
                              }}
                              onError={(e) => {
                                e.target.src = "/assets/images/food/pm-food1.png";
                              }}
                            />
                          </div>

                          {/* Item Details */}
                          <div style={{ 
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center"
                          }}>
                            <h5 style={{ 
                              margin: "0 0 0.25rem 0",
                              fontSize: "1.1rem",
                              fontWeight: "600",
                              color: "#333",
                              lineHeight: "1.3"
                            }}>
                              {item.title}
                            </h5>
                            {item.decs && (
                              <p style={{
                                margin: "0 0 0.5rem 0",
                                fontSize: "0.9rem",
                                color: "#666",
                                lineHeight: "1.3"
                              }}>
                                {item.decs.length > 60 ? item.decs.substring(0, 60) + "..." : item.decs}
                              </p>
                            )}
                            {formatItemPrice(item) && (
                              <div style={{
                                fontSize: "1.1rem",
                                fontWeight: "700",
                                color: "#ff6b35"
                              }}>
                                {formatItemPrice(item)}
                              </div>
                            )}
                          </div>

                          {/* Arrow Icon */}
                          <div style={{ 
                            flexShrink: 0,
                            marginLeft: "1rem",
                            color: "#999",
                            fontSize: "1.2rem"
                          }}>
                            →
                          </div>
                        </div>
                      </Link>
                    ))}
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
