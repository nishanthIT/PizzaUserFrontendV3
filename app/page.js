"use client";

import Counter from "@/components/Counter";
import Testimonial from "@/components/Testimonial";
import WellFoodLayout from "@/layout/WellFoodLayout";
import Link from "next/link";
// import { topItems } from "@/features/topItem";
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

const page = () => {
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pizzas, setPizzas] = useState([]);
  const [pizzaLoading, setPizzaLoading] = useState(true);

  useEffect(() => {
    const fetchCombos = async () => {
      try {
        const response = await fetch(
          "http://localhost:3003/api/getAllcomboList"
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
          "http://localhost:3003/api/getAllPizzaList"
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
      {" "}
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
                  color: (() => {
                    const now = new Date();
                    const day = now.getDay();
                    const hour = now.getHours();
                    const minute = now.getMinutes();
                    
                    if (day === 0 || (day >= 1 && day <= 4)) {
                      // Sunday-Thursday: 17:00-22:30
                      if ((hour === 17 && minute >= 0) || (hour > 17 && hour < 22) || (hour === 22 && minute <= 30)) {
                        return '#28a745';
                      }
                    } else if (day === 5 || day === 6) {
                      // Friday-Saturday: 17:00-23:00
                      if ((hour === 17 && minute >= 0) || (hour > 17 && hour < 23)) {
                        return '#28a745';
                      }
                    }
                    return '#dc3545';
                  })()
                }}>
                  {(() => {
                    const now = new Date();
                    const day = now.getDay();
                    const hour = now.getHours();
                    const minute = now.getMinutes();
                    
                    if (day === 0 || (day >= 1 && day <= 4)) {
                      // Sunday-Thursday: 17:00-22:30
                      if ((hour === 17 && minute >= 0) || (hour > 17 && hour < 22) || (hour === 22 && minute <= 30)) {
                        return 'OPEN';
                      }
                    } else if (day === 5 || day === 6) {
                      // Friday-Saturday: 17:00-23:00
                      if ((hour === 17 && minute >= 0) || (hour > 17 && hour < 23)) {
                        return 'OPEN';
                      }
                    }
                    return 'CLOSED';
                  })()}
                </span>
                {' '}• Today: {(() => {
                  const day = new Date().getDay();
                  if (day === 5 || day === 6) {
                    return '17:00-23:00';
                  }
                  return '17:00-22:30';
                })()}
              </div>
            </div>
            <h1>addiscombepizza</h1>
            

            <img
              className="custom-hero-pizza"
              src="assets/images/hero/pizza-2-min.png"
              alt="Hero"
            />

            {/* Yellow Button */}

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
      {/* Headline area start */}
      {/* <div className="headline-area pt-110 rpt-90 mb-105 rmb-85 rel z-1">
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
            <span className="marquee-item">burger king</span>
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
            <span className="marquee-item">burger king</span>
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
            <span className="marquee-item">burger king</span>
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
      </div> */}
      {/* Headline Area end */}
      {/* About Us Area start */}
      {/* <section className="about-us-area-four pb-95 rpb-65 rel z-1">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div
                className="about-us-content text-white ms-0 rmb-25"
                data-aos="fade-left"
                data-aos-duration={1500}
                data-aos-offset={50}
              >
                <div className="section-title mb-25">
                  <span className="sub-title mb-5">learn About wellfood</span>
                  <h2>we provide best Quality food for your health</h2>
                </div>
                <p>
                  Welcome too restaurant, where culinary excellence meets warm
                  hospitality in every dish we serve. Nestled in the heart of
                  City Name our eatery invites you on a journey
                </p>
                <Link href="about" className="theme-btn mt-25 mb-60">
                  learn more us <i className="far fa-arrow-alt-right" />
                </Link>
                <div className="row">
                  <div className="col-sm-4 col-6">
                    <div className="counter-item style-two counter-text-wrap">
                      <span
                        className="count-text k-plus"
                        data-speed={3000}
                        data-stop={34}
                      >
                        <Counter end={34} />
                      </span>
                      <span className="counter-title">Organic Planting</span>
                    </div>
                  </div>
                  <div className="col-sm-4 col-6">
                    <div className="counter-item style-two counter-text-wrap">
                      <span
                        className="count-text plus"
                        data-speed={3000}
                        data-stop={356}
                      >
                        <Counter end={356} />
                      </span>
                      <span className="counter-title">Passionate Chef's</span>
                    </div>
                  </div>
                  <div className="col-sm-4 col-6">
                    <div className="counter-item style-two counter-text-wrap">
                      <span
                        className="count-text plus"
                        data-speed={3000}
                        data-stop={8534}
                      >
                        <Counter end={8534} />
                      </span>
                      <span className="counter-title">Favourite Dishes</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div
                className="about-image-four mb-30"
                data-aos="fade-right"
                data-aos-duration={1500}
                data-aos-offset={50}
              >
                <div className="row">
                  <div className="col">
                    <img
                      src="assets/images/about/about-four1.jpg"
                      alt="About"
                    />
                  </div>
                  <div className="col mt-80">
                    <img
                      src="assets/images/about/about-four2.jpg"
                      alt="About"
                    />
                  </div>
                </div>
                <div className="badge">
                  <img
                    src="assets/images/about/about-four-badge.jpg"
                    alt="Badge"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}
      {/* About Us Area end */}
      {/* Category Banner area start */}
      {/* <div className="category-banner-area-two pb-85 rpb-65">
        <div className="container-fluid">
          <div className="row row-cols-lg-3 row-cols-sm-2 row-cols-1 justify-content-center">
            {loading ? (
              <div className="col-12 text-center">
                <div className="spinner-border text-light" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              bannerCombos.map((banner) => (
                <div
                  key={banner.id}
                  className="col"
                  data-aos="fade-up"
                  data-aos-delay={banner.delay}
                  data-aos-duration={1500}
                  data-aos-offset={50}
                >
                  <div
                    className={`category-banner-item ${banner.style}`}
                    style={{
                      backgroundImage: `url(${banner.img})`,
                    }}
                  >
                    <h3>{banner.title}</h3>
                    {banner.showSub && <h4>{banner.subtitle}</h4>}
                    <Link
                      href={{
                        pathname: "/combo-details",
                        query: {
                          id: banner.id,
                        },
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
      </div> */}
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
                      backgroundImage: `url(http://localhost:3003/api/images/combo-${combo.id}.png)`,
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
      {/* Video Area start */}
      {/* <div className="video-area pb-120 rpb-90 rel z-1">
        <div className="container">
          <div className="video-title-wrap">
            <span
              className="video-title"
              data-aos="fade-left"
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              Fried Chicken
            </span>
            <span
              className="video-title text-end"
              data-aos="fade-right"
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              quality food
            </span>
          </div>
          <div
            className="video-wrap overlay"
            data-aos="zoom-in"
            data-aos-delay={50}
            data-aos-duration={1500}
            data-aos-offset={50}
          >
            <img src="assets/images/background/video.jpg" alt="Video" />
            <a
              href="https://www.youtube.com/watch?v=9Y7ma241N8k"
              className="mfp-iframe video-play"
            >
              <i className="fas fa-play" />
            </a>
          </div>
        </div>
        <div className="testimonials-shapes">
          <div className="shape three">
            <img src="assets/images/shapes/video1.png" alt="Shape" />
          </div>
          <div className="shape two">
            <img src="assets/images/shapes/video2.png" alt="Shape" />
          </div>
        </div>
      </div> */}
      {/* Video Area End */}
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
            <span className="marquee-item">burger king</span>
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
            <span className="marquee-item">burger king</span>
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
            <span className="marquee-item">burger king</span>
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
                  we provide exclusive food based on UK explore our popular food
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
      {/* Gallery Area Start */}
      {/* <div className="gallery-area-two pb-100 rpb-70 rel z-1">
        <div className="container-fluid">
          <div className="row">
            <div
              className="col-xl-5 col-md-8"
              data-aos="fade-up"
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div className="gallery-item-two">
                <img
                  src="assets/images/gallery/gallery-two2.jpg"
                  alt="Gallery"
                />
              </div>
            </div>
            <div
              className="col-xl-4 col-md-6 gallery-order"
              data-aos="fade-up"
              data-aos-delay={100}
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div className="gallery-item-two">
                <img
                  src="assets/images/gallery/gallery-two3.jpg"
                  alt="Gallery"
                />
              </div>
            </div>
            <div
              className="col-xl-3 col-md-4 col-sm-6"
              data-aos="fade-up"
              data-aos-delay={50}
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div className="gallery-item-two">
                <img
                  src="assets/images/gallery/gallery-two1.jpg"
                  alt="Gallery"
                />
              </div>
            </div>
            <div
              className="col-xl-3 col-md-4 col-sm-6"
              data-aos="fade-up"
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div className="gallery-item-two text-end">
                <img
                  src="assets/images/gallery/gallery-two5.jpg"
                  alt="Gallery"
                />
              </div>
            </div>
            <div
              className="col-xl-4 col-md-6 gallery-order"
              data-aos="fade-up"
              data-aos-delay={50}
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div className="gallery-item-two">
                <img
                  src="assets/images/gallery/gallery-two4.jpg"
                  alt="Gallery"
                />
              </div>
            </div>
            <div
              className="col-xl-5 col-md-8"
              data-aos="fade-up"
              data-aos-delay={100}
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div className="gallery-item-two">
                <img
                  src="assets/images/gallery/gallery-two6.jpg"
                  alt="Gallery"
                />
              </div>
            </div>
          </div>
        </div>
      </div> */}
      {/* Gallery Area End */}
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
            <span className="marquee-item">burger king</span>
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
            <span className="marquee-item">burger king</span>
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
            <span className="marquee-item">burger king</span>
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
                  <h2>Buy Any 2</h2>
                </div>
                <p className="ms-0">
             Comming soon...
                </p>
                <a href="menu-pizza" className="theme-btn mt-15">
                  order now <i className="far fa-arrow-alt-right" />
                </a>
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
                  alt="Burger Image"
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
                  <span className="marquee-inner left">mix food meal</span>
                  <span className="marquee-inner left">mix food meal</span>
                  <span className="marquee-inner left">mix food meal</span>
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
      {/* Testimonials Two Area start */}
      {/* <Testimonial /> */}
      {/* Testimonials Two Area end */}
      {/* Blog Area start */}
      {/*  */}
      {/* Blog Area end */}
    </WellFoodLayout>
  );
};
export default page;
