"use client";
import WellFoodLayout from "@/layout/WellFoodLayout";
import Link from "next/link";
import { useEffect, useState } from "react";
import { API_URL } from "@/services/config";
import PizzaLoader from "@/components/pizzaLoader";

const PeriPeriMenuPage = () => {
  const [periPeriItems, setPeriPeriItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPeriPeriItems();
  }, []);

  const fetchPeriPeriItems = async () => {
    try {
      const response = await fetch(`${API_URL}/getAllPeriPeriItems`);
      const data = await response.json();
      
      if (response.ok) {
        setPeriPeriItems(data);
      } else {
        setError("Failed to load menu items");
      }
    } catch (error) {
      console.error("Error fetching Peri Peri items:", error);
      setError("Failed to load menu items. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <WellFoodLayout>
        <PizzaLoader forceDuration={3000} />
      </WellFoodLayout>
    );
  }

  if (error) {
    return (
      <WellFoodLayout>
        <div className="container">
          <div className="text-center py-5">
            <h2 className="mb-4">{error}</h2>
            <Link href="/menu-pizza">
              <button className="theme-btn">Back to Menu</button>
            </Link>
          </div>
        </div>
      </WellFoodLayout>
    );
  }

  return (
    <WellFoodLayout>
      <section className="menu-area py-130 rel z-1">
        <div className="container">
          <div className="section-title text-center mb-65">
            <span className="sub-title mb-15">Our Menu</span>
            <h2>Peri Peri Chicken</h2>
            <p>Chicken marinated in peri peri sauce, grilled to your favourite spiciness</p>
          </div>
          
          <div className="row justify-content-center">
            {periPeriItems.map((item, index) => (
              <div key={item.id} className="col-xl-6 col-lg-8 col-md-10">
                <div 
                  className="menu-item-two"
                  style={{
                    background: "#fff",
                    padding: "25px",
                    borderRadius: "10px",
                    boxShadow: "0 5px 25px rgba(0,0,0,0.1)",
                    marginBottom: "30px",
                    border: "1px solid #f0f0f0",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 5px 25px rgba(0,0,0,0.1)";
                  }}
                >
                  <div className="menu-item-content">
                    <h4 style={{ 
                      fontSize: "1.4rem", 
                      fontWeight: "700", 
                      color: "#333",
                      marginBottom: "10px"
                    }}>
                      {item.name}
                    </h4>
                    <p style={{ 
                      color: "#666", 
                      marginBottom: "20px",
                      fontSize: "0.95rem",
                      lineHeight: "1.5"
                    }}>
                      {item.description}
                    </p>
                    
                    {/* Pricing Options */}
                    <div className="pricing-options">
                      {/* On its own */}
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "12px 15px",
                        marginBottom: "10px",
                        background: "#f8f9fa",
                        borderRadius: "8px",
                        border: "1px solid #e9ecef"
                      }}>
                        <span style={{ 
                          fontWeight: "500", 
                          color: "#333",
                          fontSize: "0.95rem"
                        }}>
                          {item.name} on its own
                        </span>
                        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                          <span style={{ 
                            fontSize: "1.1rem", 
                            fontWeight: "700", 
                            color: "#ff6b35" 
                          }}>
                            £{item.basePrice}
                          </span>
                          <Link href={`/peri-peri-details?id=${item.id}&mealDeal=false`}>
                            <button 
                              className="theme-btn style-two"
                              style={{
                                padding: "8px 20px",
                                fontSize: "0.85rem",
                                borderRadius: "5px"
                              }}
                            >
                              Order
                            </button>
                          </Link>
                        </div>
                      </div>
                      
                      {/* Meal Deal */}
                      {item.mealDealPrice && (
                        <div style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "12px 15px",
                          background: "#fff5f2",
                          borderRadius: "8px",
                          border: "2px solid #ff6b35",
                          position: "relative"
                        }}>
                          <div>
                            <span style={{ 
                              fontWeight: "600", 
                              color: "#ff6b35",
                              fontSize: "0.95rem",
                              display: "block"
                            }}>
                              with {item.sideCount === 1 ? "one side" : `${item.sideCount} sides`} and {item.drinkCount === 1 ? "a can of drink" : `${item.drinkCount} cans of drink`}
                            </span>
                            <span style={{
                              fontSize: "0.8rem",
                              color: "#ff6b35",
                              fontStyle: "italic"
                            }}>
                              🌟 Meal Deal - Best Value!
                            </span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                            <span style={{ 
                              fontSize: "1.1rem", 
                              fontWeight: "700", 
                              color: "#ff6b35" 
                            }}>
                              £{item.mealDealPrice}
                            </span>
                            <Link href={`/peri-peri-details?id=${item.id}&mealDeal=true`}>
                              <button 
                                className="theme-btn"
                                style={{
                                  padding: "8px 20px",
                                  fontSize: "0.85rem",
                                  borderRadius: "5px",
                                  background: "#ff6b35"
                                }}
                              >
                                Order
                              </button>
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-4">
            <Link href="/menu-pizza">
              <button className="theme-btn style-two">
                <i className="fas fa-arrow-left mr-2"></i>
                Back to Main Menu
              </button>
            </Link>
          </div>
        </div>
      </section>
    </WellFoodLayout>
  );
};

export default PeriPeriMenuPage;
