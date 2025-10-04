"use client";
import FixedBtn from "@/components/custom/FixedBtn";
import WellFoodLayout from "@/layout/WellFoodLayout";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { API_URL } from "@/services/config";
import PizzaLoader from "@/components/pizzaLoader";
import { fetchAllUserChoices } from "@/services/userChoiceServices";

const UserChoiceMenu = () => {
  const [userChoices, setUserChoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserChoices = async () => {
      try {
        setLoading(true);
        const data = await fetchAllUserChoices();
        
        if (data.success && Array.isArray(data.data)) {
          setUserChoices(data.data);
        } else {
          setError("Invalid data format received");
        }
      } catch (error) {
        console.error("Error fetching user choices:", error);
        setError("Failed to load meal deals. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserChoices();
  }, []);

  const formatPrice = (price) => {
    const numPrice = parseFloat(price) || 0;
    return `£${numPrice.toFixed(2)}`;
  };

  const getImageSrc = (userChoice) => {
    if (userChoice.imageUrl) {
      return userChoice.imageUrl.startsWith('http') 
        ? userChoice.imageUrl 
        : `${API_URL.replace('/api', '')}/uploads/${userChoice.imageUrl}`;
    }
    return "/assets/images/placeholder.svg"; // Default placeholder
  };

  if (loading) {
    return (
      <WellFoodLayout>
        <div className="container">
          <PizzaLoader />
        </div>
      </WellFoodLayout>
    );
  }

  if (error) {
    return (
      <WellFoodLayout>
        <div className="container pt-100 pb-100 text-center">
          <h3 className="text-danger">{error}</h3>
          <button 
            className="btn btn-primary mt-3" 
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </WellFoodLayout>
    );
  }

  return (
    <WellFoodLayout>
      {/* Page Banner */}
      <section
        className="page-banner-area pt-50 pb-35 rel z-1 bgs-cover"
        style={{
          backgroundImage: "url(/assets/images/backgrounds/banner.jpg)",
        }}
      >
        <div className="container">
          <div className="banner-inner text-white">
            <h2 className="page-title mb-10">Meal Deals</h2>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb justify-content-center mb-20">
                <li className="breadcrumb-item">
                  <Link href="/">Home</Link>
                </li>
                <li className="breadcrumb-item active">Meal Deals</li>
              </ol>
            </nav>
          </div>
        </div>
      </section>

      {/* User Choice Menu Area */}
      <section className="food-menu-area pt-130 rpt-100 pb-100 rpb-70">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <div className="section-title text-center mb-60">
                <span className="sub-title mb-5">Choose Your Favorites</span>
                <h2>Meal Deals</h2>
                <p>
                  Create your perfect meal combination with our specially curated meal deals
                </p>
              </div>
            </div>
          </div>

          <div className="row">
            {userChoices.length === 0 ? (
              <div className="col-12 text-center">
                <h4>No meal deals available at the moment</h4>
                <p>Please check back later or explore our other menu items.</p>
              </div>
            ) : (
              userChoices.map((userChoice) => (
                <div key={userChoice.id} className="col-xl-4 col-lg-6 col-md-8">
                  <div className="food-menu-item wow fadeInUp delay-0-2s">
                    <div className="image">
                      <img
                        src={getImageSrc(userChoice)}
                        alt={userChoice.name}
                        style={{ height: "250px", objectFit: "cover" }}
                      />
                    </div>
                    <div className="content">
                      <h4>
                        <Link href={`/user-choice-details?id=${userChoice.id}`}>
                          {userChoice.name}
                        </Link>
                      </h4>
                      <div className="price-area">
                        <span className="price">{formatPrice(userChoice.basePrice)}</span>
                        <span className="category-tag">{userChoice.displayCategory?.name}</span>
                      </div>
                      <p>{userChoice.description}</p>
                      
                      {/* Category Configuration Preview */}
                      <div className="category-preview mb-3">
                        <small className="text-muted">
                          Includes: {userChoice.categoryConfigs?.map((config, index) => (
                            <span key={config.categoryId}>
                              {config.itemCount} {config.categoryName.toLowerCase()}
                              {index < userChoice.categoryConfigs.length - 1 ? ", " : ""}
                            </span>
                          ))}
                        </small>
                      </div>

                      <div className="d-flex justify-content-between align-items-center">
                        <Link 
                          href={`/user-choice-details?id=${userChoice.id}`}
                          className="btn btn-primary btn-sm"
                        >
                          Customize
                        </Link>
                        <span className="badge badge-success">
                          {userChoice.categoryConfigs?.length || 0} Categories
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Fixed Button */}
      <FixedBtn />
    </WellFoodLayout>
  );
};

export default UserChoiceMenu;