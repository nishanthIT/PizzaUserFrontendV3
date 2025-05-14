"use client";
import { useState, useEffect } from "react";
import Headline from "@/components/Headline";
import OfferCard from "@/components/OfferCard";
import PageBanner from "@/components/PageBanner";
import RestaurantMenu from "@/components/RestaurantMenu";
import WellFoodLayout from "@/layout/WellFoodLayout";
import PizzaLoader from "@/components/pizzaLoader";
import {
  fetchAllCategories,
  fetchPizzasByCategory,
} from "@/services/menuPizzaServices";

// Helper function to get icon based on category name
const getCategoryIcon = (categoryName) => {
  const iconMap = {
    "Non-Vegetarian": "flaticon-cupcake",
    Vegetarian: "flaticon-broccoli",
    Seafood: "flaticon-crab",
    Drinks: "flaticon-poinsettia",
  };
  return iconMap[categoryName] || "flaticon-cupcake";
};

// Helper function to get base price from sizes
const getBasePrice = (sizes) => {
  try {
    const sizeObj = typeof sizes === "string" ? JSON.parse(sizes) : sizes || {};
    return sizeObj.SMALL || sizeObj.small || "10";
  } catch (e) {
    return "10";
  }
};

const MenuPizzaPage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const response = await fetchAllCategories();
        console.log("Categories API Response:", response);

        if (response?.data) {
          setCategories(response.data);
          // Set the first category as selected if available
          if (response.data.length > 0) {
            const firstCategoryId = String(response.data[0].id);
            console.log("Setting initial category:", firstCategoryId);
            setSelectedCategory(firstCategoryId);
          }
        }
      } catch (err) {
        console.error("Error loading categories:", err);
        setError("Failed to load categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  // Fetch pizzas when selectedCategory changes
  useEffect(() => {
    const loadPizzas = async () => {
      if (!selectedCategory) {
        console.log("No category selected, skipping pizza load");
        return;
      }

      try {
        setLoading(true);
        console.log("Loading pizzas for category:", selectedCategory);
        const response = await fetchPizzasByCategory(selectedCategory);
        console.log("Pizza API Response:", response);

        // Handle different possible response structures
        let pizzasData = [];
        if (response?.data) {
          if (Array.isArray(response.data)) {
            pizzasData = response.data;
          } else if (
            response.data.pizzas &&
            Array.isArray(response.data.pizzas)
          ) {
            pizzasData = response.data.pizzas;
          }
        }
        console.log("Processed pizzas data:", pizzasData);
        setPizzas(pizzasData);
      } catch (err) {
        console.error("Error loading pizzas:", err);
        setError("Failed to load pizzas. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadPizzas();
  }, [selectedCategory]);

  // Safely format categories
  const formattedCategories = Array.isArray(categories)
    ? categories.map((category) => ({
        id: String(category?.id || Math.random().toString()),
        title: category?.name || "Unnamed Category",
        icon: getCategoryIcon(category?.name),
        event: `food-tab-${category?.id || ""}`,
        items: [],
      }))
    : [];

  // Safely format pizzas
  const formatPizzasForMenu = (pizzas) => {
    console.log("Formatting pizzas:", pizzas);
    if (!Array.isArray(pizzas)) {
      console.log("Pizzas is not an array, returning empty array");
      return [];
    }

    const formattedPizzas = pizzas.map((pizza) => {
      console.log("Processing pizza:", pizza);
      const sizes = pizza?.sizes
        ? typeof pizza.sizes === "string"
          ? JSON.parse(pizza.sizes)
          : pizza.sizes
        : {};

      return {
        id: pizza?.id || Math.random().toString(),
        title: pizza?.name || "Unnamed Pizza",
        price: getBasePrice(sizes),
        decs: pizza?.description || "Delicious pizza with fresh ingredients",
        img: pizza?.imageUrl
          ? `/uploads/${pizza.imageUrl}`
          : "/assets/images/food/pm-food1.png",
        ingredients: Array.isArray(pizza?.defaultIngredients)
          ? pizza.defaultIngredients.map((ing) => ({
              id: ing?.ingredientId || Math.random().toString(),
              name: ing?.name || "",
              price: ing?.price || 0,
              quantity: ing?.quantity || 0,
              included: ing?.include !== false,
            }))
          : [],
        toppings: Array.isArray(pizza?.defaultToppings)
          ? pizza.defaultToppings.map((top) => ({
              id: top?.toppingId || Math.random().toString(),
              name: top?.name || "",
              price: top?.price || 0,
              quantity: top?.quantity || 0,
              included: top?.include !== false,
            }))
          : [],
      };
    });

    console.log("Formatted pizzas:", formattedPizzas);
    return formattedPizzas;
  };

  // Create menu items with proper fallbacks
  const menuItems = formattedCategories.map((category) => {
    const items =
      category.id === selectedCategory ? formatPizzasForMenu(pizzas) : [];
    console.log(`Menu items for category ${category.id}:`, items);
    return {
      ...category,
      items,
    };
  });

  return (
    <WellFoodLayout>
      {loading && <PizzaLoader />}
      {/* <PageBanner pageTitle={"Menu pizza"} /> */}
      {/* <Headline /> */}
      <RestaurantMenu
        menus={menuItems}
        loading={loading}
        error={error}
        onCategorySelect={(id) => setSelectedCategory(String(id))}
        selectedCategory={selectedCategory}
      />
      {/* <OfferCard /> */}
    </WellFoodLayout>
  );
};

export default MenuPizzaPage;
