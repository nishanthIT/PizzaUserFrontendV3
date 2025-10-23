"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import WellFoodLayout from "@/layout/WellFoodLayout";
import { API_URL } from "@/services/config";
import PizzaLoader from "@/components/pizzaLoader";
import Link from "next/link";

const PizzaSelectionPage = () => {
  const [allPizzas, setAllPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  
  // Get dealId and maxToppings from URL parameters
  const dealId = searchParams.get("dealId");
  const maxToppings = searchParams.get("maxToppings");
  
  console.log("🍕 Pizza Selection - URL params:", { dealId, maxToppings });

  useEffect(() => {
    const loadAllPizzas = async () => {
      try {
        console.log("🍕 Loading all pizzas for selection");
        const response = await fetch(`${API_URL}/getAllPizzaList`);
        if (response.ok) {
          const data = await response.json();
          console.log("🍕 All pizzas loaded:", data);
          if (data?.data) {
            setAllPizzas(data.data);
          }
        } else {
          setError("Failed to load pizzas");
        }
      } catch (error) {
        console.error("Error loading all pizzas:", error);
        setError("Error loading pizzas");
      } finally {
        setLoading(false);
      }
    };
    loadAllPizzas();
  }, []);

  const getBasePrice = (sizes) => {
    try {
      const sizeObj = typeof sizes === "string" ? JSON.parse(sizes) : sizes || {};
      return sizeObj.MEDIUM || sizeObj.medium || "10";
    } catch (e) {
      return "10";
    }
  };

  if (loading) {
    return (
      <WellFoodLayout>
        <PizzaLoader />
      </WellFoodLayout>
    );
  }

  if (error) {
    return (
      <WellFoodLayout>
        <div className="container mt-5">
          <div className="alert alert-danger">
            <h4>Error</h4>
            <p>{error}</p>
          </div>
        </div>
      </WellFoodLayout>
    );
  }

  return (
    <WellFoodLayout>
      <div style={{ 
        maxWidth: "1200px", 
        margin: "0 auto", 
        padding: "2rem 1rem",
        paddingTop: "120px" 
      }}>
        <div className="text-center mb-4">
          <h1 style={{ 
            fontSize: "2rem", 
            fontWeight: "700", 
            color: "#333",
            marginBottom: "0.5rem"
          }}>
            🍕 Choose Your Pizza
          </h1>
          <p style={{ 
            color: "#666",
            fontSize: "1rem",
            margin: 0
          }}>
            Select a pizza to customize with your favorite toppings
          </p>
        </div>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
          gap: "1rem",
          padding: "0 1rem"
        }}>
          {allPizzas.map((pizza) => {
            const basePrice = getBasePrice(pizza.sizes);
            let pizzaBuilderLink = `/product-details?id=${pizza.id}&title=${encodeURIComponent(pizza.name)}&price=${basePrice}&desc=${encodeURIComponent(pizza.description || "Delicious pizza")}&img=${encodeURIComponent(`${API_URL}/images/pizza-${pizza.id}.png`)}&pizzaBuilder=true&startFromZero=true`;
            
            // Add dealId and maxToppings if available from URL parameters
            if (dealId) {
              pizzaBuilderLink += `&dealId=${dealId}`;
            }
            if (maxToppings) {
              pizzaBuilderLink += `&maxToppings=${maxToppings}`;
            }
            
            console.log("🍕 Generated pizza builder link:", pizzaBuilderLink);

            return (
              <Link key={pizza.id} href={pizzaBuilderLink} style={{ textDecoration: "none" }}>
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
                  {/* Pizza Image */}
                  <div style={{ 
                    flexShrink: 0,
                    marginRight: "1rem"
                  }}>
                    <img
                      src={`${API_URL}/images/pizza-${pizza.id}.png`}
                      alt={pizza.name}
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

                  {/* Pizza Details */}
                  <div style={{ 
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center"
                  }}>
                    <h5 style={{ 
                      margin: "0 0 0.5rem 0",
                      fontSize: "1.1rem",
                      fontWeight: "600",
                      color: "#333",
                      lineHeight: "1.3"
                    }}>
                      {pizza.name}
                    </h5>
                    <div style={{
                      fontSize: "1.1rem",
                      fontWeight: "700",
                      color: "#ff6b35"
                    }}>
                      from £{basePrice}
                    </div>
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
            );
          })}
        </div>

        {allPizzas.length === 0 && !loading && (
          <div className="text-center mt-5">
            <h3 style={{ color: "#666" }}>No pizzas available</h3>
            <p style={{ color: "#999" }}>Please try again later</p>
          </div>
        )}
      </div>
    </WellFoodLayout>
  );
};

export default PizzaSelectionPage;