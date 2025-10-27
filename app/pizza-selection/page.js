"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import WellFoodLayout from "@/layout/WellFoodLayout";
import { API_URL } from "@/services/config";
import PizzaLoader from "@/components/pizzaLoader";

const PizzaSelectionPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Get dealId and maxToppings from URL parameters
  const dealId = searchParams.get("dealId");
  const maxToppings = searchParams.get("maxToppings");
  
  console.log("🍕 Pizza Selection - URL params:", { dealId, maxToppings });

  useEffect(() => {
    const redirectToPizzaBuilder = async () => {
      try {
        if (!dealId) {
          setError("Deal ID is required");
          setLoading(false);
          return;
        }

        console.log("🍕 Redirecting to Pizza Builder for dealId:", dealId);
        
        // Redirect directly to pizza builder details page with the deal ID
        let pizzaBuilderLink = `/pizza-builder-details?id=${dealId}`;
        
        // Add maxToppings if available from URL parameters
        if (maxToppings) {
          pizzaBuilderLink += `&maxToppings=${maxToppings}`;
        }
        
        console.log("🍕 Redirecting to:", pizzaBuilderLink);
        router.push(pizzaBuilderLink);
        
      } catch (error) {
        console.error("Error redirecting to pizza builder:", error);
        setError("Failed to load pizza builder. Please try again later.");
        setLoading(false);
      }
    };

    redirectToPizzaBuilder();
  }, [dealId, maxToppings, router]);

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
            <button 
              className="btn btn-primary mt-3"
              onClick={() => router.push("/")}
            >
              Return to Home
            </button>
          </div>
        </div>
      </WellFoodLayout>
    );
  }

  // This component should not render anything visible since it redirects immediately
  return (
    <WellFoodLayout>
      <PizzaLoader />
    </WellFoodLayout>
  );
};

export default PizzaSelectionPage;