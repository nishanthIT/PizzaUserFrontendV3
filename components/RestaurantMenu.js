"use client";
import Link from "next/link";
import { Nav, Tab } from "react-bootstrap";
import { useState, useEffect } from "react";
import { API_URL } from "@/services/config";

const calculatePrice = (item) => {
  if (item.type === "other") {
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
  if (item.type === "other") {
    return {
      pathname: "/otherItem-details",
      query: {
        id: item.id,
        title: item.title,
        price: item.price,
        desc: item.decs,
        img: item.img,
      },
    };
  }

  return {
    pathname: "/product-details",
    query: {
      id: item.id,
      title: item.title,
      price: item.price,
      desc: item.decs,
      img: item.img,
      ingredients: JSON.stringify(item.ingredients),
      toppings: JSON.stringify(item.toppings),
    },
  };
};

const Item = ({ item }) => {
  return (
    <div className="food-menu-item style-two custom-food-item">
      <div className="image">
        <img
          src={
            item.type === "other"
              ? `${API_URL}/images/other-${item.id}.png`
              : `${API_URL}/images/pizza-${item.id}.png`
          }
          alt={item.title}
        />
      </div>
      <div className="content">
        <h5>
          <span className="title">{item.title}</span> <span className="dots" />{" "}
          <span className="price">£{calculatePrice(item)}</span>
        </h5>
        <p>{item.decs}</p>
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
                            <Link key={item.id} href={getItemLink(item)}>
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
                            <Link key={item.id} href={getItemLink(item)}>
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
      <div className="testimonials-shapes">
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
