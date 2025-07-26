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
import { CupSoda, Pizza, Dessert, Hamburger, UtensilsCrossed } from "lucide-react"; // Import Lucide icons
import { API_URL } from "@/services/config";

// Helper function to get icon based on category name
const getCategoryIcon = (categoryName) => {
  const name = categoryName?.toLowerCase().trim();
  
  // Check for starters/appetizers
  if (name?.includes('starter') || name?.includes('appetizer')) {
    return <UtensilsCrossed size={40} color="#ff0000" />;
  }
  
  // Check for desserts
  if (name?.includes('dessert')) {
    return <Dessert size={40} color="#ff0000" />;
  }
  
  // Check for pizza
  if (name?.includes('pizza')) {
    return <Pizza size={40} color="#ff0000" />;
  }
  
  // Check for burgers
  if (name?.includes('burger')) {
    return <Hamburger size={40} color="#ff0000" />;
  }
  
  // Check for drinks/beverages
  if (name?.includes('drink') || name?.includes('beverage')) {
    return <CupSoda size={40} color="#ff0000" />;
  }
  
  // Default fallback
  return <Pizza size={40} color="#ff0000" />;
};

// Helper function to get base price from sizes
const getBasePrice = (sizes) => {
  try {
    const sizeObj = typeof sizes === "string" ? JSON.parse(sizes) : sizes || {};
    console.log("Parsed sizessssssssssssssss:", sizeObj);
    return sizeObj.SMALL || sizeObj.small || "10";
  } catch (e) {
    return "10";
  }
};

const MenuPizzaPage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [pizzas, setPizzas] = useState([]);
  const [otherItems, setOtherItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingItems, setLoadingItems] = useState(false);
  const [error, setError] = useState(null);


  // Helper function to sort categories by predefined order
  const sortCategoriesByOrder = (categories) => {
    console.log("Raw categories from API:", categories.map(cat => cat.name));
    
    // Create a mapping function to get priority
    const getCategoryPriority = (categoryName) => {
      const name = categoryName?.toLowerCase().trim();
      
      // Starters/Appetizers get highest priority (0)
      if (name?.includes('starter') || name?.includes('appetizer')) return 0;
      
      // Pizza gets second priority (1)
      if (name?.includes('pizza')) return 1;
      
      // Burgers get third priority (2)
      if (name?.includes('burger')) return 2;
      
      // Drinks/Beverages get fourth priority (3)
      if (name?.includes('drink') || name?.includes('beverage')) return 3;
      
      // Desserts get fifth priority (4)
      if (name?.includes('dessert')) return 4;
      
      // Everything else goes to the end (5)
      return 5;
    };
    
    return categories.sort((a, b) => {
      const priorityA = getCategoryPriority(a.name);
      const priorityB = getCategoryPriority(b.name);
      
      console.log(`Sorting: ${a.name} (priority: ${priorityA}) vs ${b.name} (priority: ${priorityB})`);
      
      return priorityA - priorityB;
    });
  };

  // Fetch all categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const response = await fetchAllCategories();
        console.log("Categories API Response:", response);

        if (response?.data) {
          // Sort categories by predefined order
          const sortedCategories = sortCategoriesByOrder(response.data);
          setCategories(sortedCategories);
          
          // Set the first category as selected if available (now it will be Starters first)
          if (sortedCategories.length > 0) {
            const firstCategoryId = String(sortedCategories[0].id);
            console.log("Setting initial category:", firstCategoryId);
            setSelectedCategory(firstCategoryId);
          }
        }
      } catch (err) {
        console.error("Error loading categories:", err);
        setError("Failed to load categories. Please try again later.");
      } finally {
        // Don't set loading to false here - wait for items to load
        console.log("Categories loaded, waiting for items...");
      }
    };
    loadCategories();
  }, []);

  // Fetch pizzas and other items when selectedCategory changes
  useEffect(() => {
    const loadItems = async () => {
      if (!selectedCategory) {
        console.log("No category selected, skipping items load");
        return;
      }

      try {
        setLoadingItems(true);
        console.log("Loading items for category:", selectedCategory);

        // Fetch both pizzas and other items in parallel
        const [pizzaResponse, otherItemsResponse] = await Promise.all([
          fetchPizzasByCategory(selectedCategory),
          fetch(
            `${API_URL}/getOtherItemByCategory?categoryId=${selectedCategory}`
          ).then((res) => res.json()),
        ]);

        console.log("Pizza API Response:", pizzaResponse);
        console.log("Other Items API Response:", otherItemsResponse);

        // Handle pizza data
        let pizzasData = [];
        if (pizzaResponse?.data) {
          if (Array.isArray(pizzaResponse.data)) {
            pizzasData = pizzaResponse.data;
          } else if (
            pizzaResponse.data.pizzas &&
            Array.isArray(pizzaResponse.data.pizzas)
          ) {
            pizzasData = pizzaResponse.data.pizzas;
          }
        }
        console.log("Processed pizzas data:", pizzasData);
        setPizzas(pizzasData);

        // Handle other items data
        if (otherItemsResponse) {
          setOtherItems(otherItemsResponse);
        }
      } catch (err) {
        console.error("Error loading items:", err);
        setError("Failed to load items. Please try again later.");
      } finally {
        setLoadingItems(false);
        // Now set main loading to false since both categories and items are loaded
        setLoading(false);
      }
    };

    loadItems();
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

  // Format pizzas for menu
  const formatPizzasForMenu = (pizzas) => {
    if (!Array.isArray(pizzas)) return [];

    return pizzas.map((pizza) => {
      const sizes = pizza?.sizes
        ? typeof pizza.sizes === "string"
          ? JSON.parse(pizza.sizes)
          : pizza.sizes
        : {};

      return {
        id: pizza?.id || Math.random().toString(),
        title: pizza?.name || "Unnamed Pizza",
        prices: getBasePrice(sizes),
        price: pizza?.price ,
        decs: pizza?.description || "Delicious pizza with fresh ingredients",
        img: pizza?.imageUrl
          ? (pizza.imageUrl.startsWith('http') 
              ? pizza.imageUrl 
              : `/uploads/${pizza.imageUrl}`)
          : "/assets/images/food/pm-food1.png",
        type: "pizza",
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
  };

  // Format other items for menu with improved image handling
  const formatOtherItemsForMenu = (items) => {
    if (!Array.isArray(items)) return [];

    return items.map((item) => ({
      id: item?.id || Math.random().toString(),
      title: item?.name || "Unnamed Item",
      price: item?.price || 0,
      decs: item?.description || "Delicious item",
      img: item?.imageUrl 
        ? (item.imageUrl.startsWith('http') 
            ? item.imageUrl 
            : `/uploads/${item.imageUrl}`)
        : "/assets/images/food/pm-food1.png",
      type: "other",
      isOtherItem: true, // Add this flag for better identification
      otherItemId: item?.id, // Keep reference to original ID
    }));
  };

  // Create menu items with proper fallbacks
  const menuItems = formattedCategories.map((category) => {
    const categoryPizzas =
      category.id === selectedCategory ? formatPizzasForMenu(pizzas) : [];
    const categoryOtherItems =
      category.id === selectedCategory
        ? formatOtherItemsForMenu(otherItems)
        : [];
    const items = [...categoryPizzas, ...categoryOtherItems];

    console.log(`Menu items for category ${category.id}:`, items);
    return {
      ...category,
      items,
    };
  });

  return (
    <WellFoodLayout>
      {(loading || loadingItems) && <PizzaLoader />}
      {/* <PageBanner pageTitle={"Menu pizza"} /> */}
      {/* <Headline /> */}
      <RestaurantMenu
        menus={menuItems}
        loading={loading || loadingItems}
        error={error}
        onCategorySelect={(id) => {
          setSelectedCategory(String(id));
          setLoadingItems(true); // Show loading when switching categories
        }}
        selectedCategory={selectedCategory}
      />
      {/* <OfferCard /> */}
    </WellFoodLayout>
  );
};

export default MenuPizzaPage;
