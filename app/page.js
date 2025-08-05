
"use client";


import WellFoodLayout from "@/layout/WellFoodLayout";
import Link from "next/link";
import TopMenuItem from "@/components/custom/Topmenu";
import { useState, useEffect } from "react";
import { API_URL } from "@/services/config";

const banners = [
  {
    id: 1,
    title: "SPECIALTY PIZZA",
    img: "assets/images/banner/category-banner-three1.jpg",
    style: "style-three",
    delay: 0,
    desc: "A selection of our most popular specialty pizzas.",
    price: 399,
    showSub: false,
  },
  {
    id: 2,
    title: "buy 1",
    subtitle: "get free 1",
    img: "assets/images/banner/category-banner-three2.jpg",
    style: "style-four",
    delay: 50,
    desc: "Buy one and get one free combo offer.",
    price: 499,
    showSub: true,
  },
  {
    id: 3,
    title: "delicious fast foods",
    img: "assets/images/banner/category-banner-three3.jpg",
    style: "style-three",
    delay: 100,
    desc: "Enjoy our fast food combos at best prices.",
    price: 299,
    showSub: false,
  },
];

// Utility function to parse time string (e.g., "17:00" -> {hour: 17, minute: 0})
const parseTime = (timeString) => {
  const [hour, minute] = timeString.split(':').map(Number);
  return { hour, minute };
};

// Function to check if shop is open
const isShopOpen = () => {
  const now = new Date();
  const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinute;

  // Get environment variables with fallbacks
  const shopName = process.env.NEXT_PUBLIC_SHOP_NAME || "addiscombepizza";
  const mondayToThursdayHours = process.env.NEXT_PUBLIC_MONDAY_TO_THURSDAY_HOURS || "17:00-22:30";
  const fridayToSaturdayHours = process.env.NEXT_PUBLIC_FRIDAY_TO_SATURDAY_HOURS || "17:00-23:00";
  const sundayHours = process.env.NEXT_PUBLIC_SUNDAY_HOURS || "17:00-22:30";

  let todayHours;
  
  // Determine today's hours based on day of week
  if (currentDay === 0) { // Sunday
    todayHours = sundayHours;
  } else if (currentDay >= 1 && currentDay <= 4) { // Monday to Thursday
    todayHours = mondayToThursdayHours;
  } else { // Friday to Saturday
    todayHours = fridayToSaturdayHours;
  }

  // Parse opening and closing times
  const [openTime, closeTime] = todayHours.split('-');
  const openTimeObj = parseTime(openTime);
  const closeTimeObj = parseTime(closeTime);
  
  const openTimeInMinutes = openTimeObj.hour * 60 + openTimeObj.minute;
  const closeTimeInMinutes = closeTimeObj.hour * 60 + closeTimeObj.minute;

  // Check if current time is within opening hours
  const isOpen = currentTimeInMinutes >= openTimeInMinutes && currentTimeInMinutes <= closeTimeInMinutes;

  return {
    isOpen,
    todayHours,
    shopName
  };
};

const page = () => {
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pizzas, setPizzas] = useState([]);
  const [pizzaLoading, setPizzaLoading] = useState(true);
  const [shopStatus, setShopStatus] = useState({ isOpen: false, todayHours: "", shopName: "" });

  useEffect(() => {
    // Update shop status
    setShopStatus(isShopOpen());

    // Update shop status every minute
    const interval = setInterval(() => {
      setShopStatus(isShopOpen());
    }, 60000); // Update every minute

    const fetchCombos = async () => {
      try {
        const response = await fetch(
          `${API_URL}/getAllcomboList`
        );
        const data = await response.json();
        // Take only first 3 combos
        setCombos(data.slice(0, 3));
      } catch (error) {
        console.error("Error fetching combos:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchPizzas = async () => {
      try {
        const response = await fetch(
          `${API_URL}/getAllPizzaList`
        );
        const data = await response.json();
        // Take only first 8 pizzas
        setPizzas(data.data.slice(0, 8));
      } catch (error) {
        console.error("Error fetching pizzas:", error);
      } finally {
        setPizzaLoading(false);
      }
    };

    fetchCombos();
    fetchPizzas();

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Map database combos to banner format while keeping the same images
  const bannerCombos = combos.map((combo, index) => ({
    id: combo.id,
    title: combo.name.toUpperCase(),
    img:
      banners[index]?.img || "assets/images/banner/category-banner-three1.jpg",
    style: banners[index]?.style || "style-three",
    delay: index * 50,
    desc: combo.description,
    price: combo.price,
    showSub: false,
  }));

  return (
    <WellFoodLayout bgBlack={true}>
      {/* Hero Area Start */}
      <section
        className="hero-area-four bgs-cover pt-185 rpt-145 pb-120 rpb-110 rel z-1"
        style={{
          backgroundImage: "url(assets/images/background/hero-four.jpg)",
        }}
      >
        <div className="container">
          <div
            className="hero-content-four text-center text-white"
            data-aos="zoom-in"
            data-aos-duration={1500}
            data-aos-offset={50}
          >
            <span className="sub-title">Love at first bite.</span>
            <div className="opening-hours-status" style={{ 
              color: 'rgba(255, 255, 255, 0.8)', 
              fontSize: '14px', 
              marginTop: '10px',
              marginBottom: '20px'
            }}>
              <div>
                <span id="shop-status" style={{ 
                  fontWeight: 'bold',
                  color: shopStatus.isOpen ? '#28a745' : '#dc3545'
                }}>
                  {shopStatus.isOpen ? 'OPEN' : 'CLOSED'}
                </span>
                {' '}• Today: {shopStatus.todayHours}
              </div>
            </div>
            <h1>{shopStatus.shopName}</h1>
            
            <img
              className="custom-hero-pizza"
              src="assets/images/hero/pizza-2-min.png"
              alt="Hero"
            />

            <Link href="menu-pizza" className="theme-btn order-button">
              O R D E R - N O W <i className="far fa-arrow-alt-right" />
            </Link>
          </div>
        </div>

        <div className="hero-shapes">
          <div className="shape one">
            <img src="assets/images/shapes/hero-shape1.png" alt="Hero Shape" />
          </div>
          <div className="shape two">
            <img src="assets/images/shapes/hero-shape2.png" alt="Hero Shape" />
          </div>
          <div className="shape five">
            <img src="assets/images/shapes/hero-shape5.png" alt="Hero Shape" />
          </div>
        </div>
      </section>
      {/* Hero Area End */}

    

      {/* Combo Banner start */}
      <div className="category-banner-area-two pb-85 rpb-65">
        <div className="container-fluid">
          <div className="row row-cols-lg-3 row-cols-sm-2 row-cols-1 justify-content-center">
            {loading ? (
              <div className="col-12 text-center">
                <div className="spinner-border text-light" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              combos.slice(0, 3).map((combo, index) => (
                <div
                  key={combo.id}
                  className="col"
                  data-aos="fade-up"
                  data-aos-delay={index * 50}
                  data-aos-duration={1500}
                  data-aos-offset={50}
                >
                  <div
                    className={`category-banner-item ${
                      index === 1 ? "style-four" : "style-three"
                    }`}
                    style={{
                      backgroundImage: `url(${API_URL}/images/combo-${combo.id}.png)`,
                    }}
                  >
                    <h3>{combo.name.toUpperCase()}</h3>
                    {index === 1 && <span className="get-one">get free 1</span>}
                    <Link
                      href={{
                        pathname: "/combo-details",
                        query: { id: combo.id },
                      }}
                      className="theme-btn"
                    >
                      Shop now <i className="far fa-arrow-alt-right" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      {/* Combo Banner end */}

   

      {/* Headline area start */}
      <div className="headline-area mb-105 rmb-85 rel z-1">
        <span className="marquee-wrap white-text">
          <span className="marquee-inner left">
            <span className="marquee-item">Italian pizza</span>
            <span className="marquee-item">
              <i className="flaticon-star" />
            </span>
            <span className="marquee-item">delicious foods</span>
            <span className="marquee-item">
              <i className="flaticon-star" />
            </span>
            <span className="marquee-item">fresh ingredients</span>
            <span className="marquee-item">
              <i className="flaticon-star" />
            </span>
          </span>
          <span className="marquee-inner left">
            <span className="marquee-item">Italian pizza</span>
            <span className="marquee-item">
              <i className="flaticon-star" />
            </span>
            <span className="marquee-item">delicious foods</span>
            <span className="marquee-item">
              <i className="flaticon-star" />
            </span>
            <span className="marquee-item">fresh ingredients</span>
            <span className="marquee-item">
              <i className="flaticon-star" />
            </span>
          </span>
          <span className="marquee-inner left">
            <span className="marquee-item">Italian pizza</span>
            <span className="marquee-item">
              <i className="flaticon-star" />
            </span>
            <span className="marquee-item">delicious foods</span>
            <span className="marquee-item">
              <i className="flaticon-star" />
            </span>
            <span className="marquee-item">fresh ingredients</span>
            <span className="marquee-item">
              <i className="flaticon-star" />
            </span>
          </span>
        </span>
        <div className="headline-shapes">
          <div className="shape one">
            <img src="assets/images/shapes/tomato.png" alt="Shape" />
          </div>
          <div className="shape two">
            <img src="assets/images/shapes/burger.png" alt="Shape" />
          </div>
        </div>
      </div>
      {/* Headline Area end */}

      {/* Popular Menu Area start */}
      <section className="popular-menu-area-three pb-130 rpb-100 rel z-1">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-7 col-lg-8 col-md-9">
              <div
                className="section-title text-white text-center mb-50"
                data-aos="fade-up"
                data-aos-duration={1500}
                data-aos-offset={50}
              >
                <span className="sub-title mb-5">popular menu</span>
                <h2>
                  we provide exclusive food based on authentic recipes explore our popular food
                </h2>
              </div>
            </div>
          </div>
          <div className="row no-gap">
            <div className="col-lg-6">
              <div
                className="popular-menu-wrap bgc-black"
                data-aos="fade-left"
                data-aos-duration={1500}
                data-aos-offset={50}
              >
                {pizzaLoading ? (
                  <div className="text-center text-white">Loading...</div>
                ) : (
                  pizzas.map(
                    (item, i) =>
                      i < 4 && (
                        <Link
                          key={item.id}
                          href={{
                            pathname: "/product-details",
                            query: {
                              id: item.id,
                            },
                          }}
                        >
                          <TopMenuItem
                            item={{
                              id: item.id,
                              title: item.name,
                              price: item.sizes
                                ? JSON.parse(item.sizes).SMALL
                                : "0",
                              decs:
                                item.description || "No description available",
                              img: `${API_URL}/images/pizza-${item.id}.png`,
                              ingredients: item.defaultIngredients || [],
                              toppings: item.defaultToppings || [],
                            }}
                          />
                        </Link>
                      )
                  )
                )}
              </div>
            </div>
            <div className="col-lg-6">
              <div
                className="popular-menu-wrap bgc-black"
                data-aos="fade-right"
                data-aos-duration={1500}
                data-aos-offset={50}
              >
                {pizzaLoading ? (
                  <div className="text-center text-white">Loading...</div>
                ) : (
                  pizzas.map(
                    (item, i) =>
                      i >= 4 && (
                        <Link
                          key={item.id}
                          href={{
                            pathname: "/product-details",
                            query: {
                              id: item.id,
                            },
                          }}
                        >
                          <TopMenuItem
                            item={{
                              id: item.id,
                              title: item.name,
                              price: item.sizes
                                ? JSON.parse(item.sizes).SMALL
                                : "0",
                              decs:
                                item.description || "No description available",
                              img: `${API_URL}/images/pizza-${item.id}.png`,
                              ingredients: item.defaultIngredients || [],
                              toppings: item.defaultToppings || [],
                            }}
                          />
                        </Link>
                      )
                  )
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="testimonials-shapes">
          <div className="shape one">
            <img src="assets/images/shapes/chicken-menu1.png" alt="Shape" />
          </div>
          <div className="shape two">
            <img src="assets/images/shapes/chicken-menu2.png" alt="Shape" />
          </div>
        </div>

        <div className="custom-button-container">
          <Link href="menu-pizza" className="order-now-btn">
            SEE MORE <i className="far fa-arrow-alt-right" />
          </Link>
        </div>
      </section>
      {/* Popular Menu Area end */}

     

      {/* Headline area start */}
      <div className="headline-area bgc-black pt-120 rpt-90 rel z-2">
        <span className="marquee-wrap white-text">
          <span className="marquee-inner left">
            <span className="marquee-item">Italian pizza</span>
            <span className="marquee-item">
              <i className="flaticon-star" />
            </span>
            <span className="marquee-item">delicious foods</span>
            <span className="marquee-item">
              <i className="flaticon-star" />
            </span>
            <span className="marquee-item">fresh ingredients</span>
            <span className="marquee-item">
              <i className="flaticon-star" />
            </span>
          </span>
          <span className="marquee-inner left">
            <span className="marquee-item">Italian pizza</span>
            <span className="marquee-item">
              <i className="flaticon-star" />
            </span>
            <span className="marquee-item">delicious foods</span>
            <span className="marquee-item">
              <i className="flaticon-star" />
            </span>
            <span className="marquee-item">fresh ingredients</span>
            <span className="marquee-item">
              <i className="flaticon-star" />
            </span>
          </span>
          <span className="marquee-inner left">
            <span className="marquee-item">Italian pizza</span>
            <span className="marquee-item">
              <i className="flaticon-star" />
            </span>
            <span className="marquee-item">delicious foods</span>
            <span className="marquee-item">
              <i className="flaticon-star" />
            </span>
            <span className="marquee-item">fresh ingredients</span>
            <span className="marquee-item">
              <i className="flaticon-star" />
            </span>
          </span>
        </span>
        <div className="headline-shapes">
          <div className="shape one">
            <img src="assets/images/shapes/tomato.png" alt="Shape" />
          </div>
          <div className="shape two">
            <img src="assets/images/shapes/burger.png" alt="Shape" />
          </div>
        </div>
      </div>
      {/* Headline Area end */}

      {/* Special Offer Area start */}
      <section className="special-offer-area-two bgc-black pt-105 rpt-85 pb-130 rpb-100 rel z-1">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-5">
              <div
                className="offer-content-two text-white rmb-55"
                data-aos="fade-right"
                data-aos-duration={1500}
                data-aos-offset={50}
              >
                <img
                  src="assets/images/offer/special-food.png"
                  alt="Special Food"
                />
                <div className="section-title mt-45 mb-25">
                  <h2>Buy Any 2 Pizzas</h2>
                </div>
                <p className="ms-0">
                 comming soon...
                </p>
                <Link href="menu-pizza" className="theme-btn mt-15">
                  order now <i className="far fa-arrow-alt-right" />
                </Link>
              </div>
            </div>
            <div className="col-lg-7">
              <div
                className="offer-image style-two style-three"
                data-aos="fade-left"
                data-aos-duration={1500}
                data-aos-offset={50}
              >
                <img
                  src="assets/images/offer/offer-pizza-min.png"
                  alt="Pizza Image"
                />
                <div
                  className="offer-badge"
                  style={{
                    backgroundImage: "url(assets/images/shapes/about-star.png)",
                  }}
                >
                  <span>
                    Buy Any 2 
                    <br />
                    <span className="price">£15.95</span>
                  </span>
                </div>
                <span className="marquee-wrap style-two text-white">
                  <span className="marquee-inner left">pizza combo deal</span>
                  <span className="marquee-inner left">pizza combo deal</span>
                  <span className="marquee-inner left">pizza combo deal</span>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="testimonials-shapes">
          <div className="shape one">
            <img src="assets/images/shapes/hero-shape5.png" alt="Shape" />
          </div>
          <div className="shape two">
            <img src="assets/images/shapes/hero-shape3.png" alt="Shape" />
          </div>
        </div>
      </section>
      {/* Special Offer Area end */}

      {/* Testimonials Area start */}
      {/* <Testimonial /> */}
      {/* Testimonials Area end */}

  

   
    </WellFoodLayout>
  );
};

export default page;
