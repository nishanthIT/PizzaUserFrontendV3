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
import { CupSoda, Pizza, Dessert, Beef, UtensilsCrossed } from "lucide-react"; // Import Lucide icons
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
  
  // Check for chicken - combo style items are here
  if (name?.includes('chicken')) {
    return <Beef size={40} color="#ff0000" />;
  }
  
  // Check for burgers
  if (name?.includes('burger')) {
    return <Beef size={40} color="#ff0000" />;
  }
  
  // Check for sides
  if (name?.includes('side')) {
    return <UtensilsCrossed size={40} color="#ff0000" />;
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
    return sizeObj.MEDIUM || sizeObj.medium || "10";
  } catch (e) {
    return "10";
  }
};

const MenuPizzaPage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [pizzas, setPizzas] = useState([]);
  const [allPizzas, setAllPizzas] = useState([]); // For "Choose Your Toppings" section
  const [otherItems, setOtherItems] = useState([]);
  const [comboStyleItems, setComboStyleItems] = useState([]);
  const [userChoiceItems, setUserChoiceItems] = useState([]);
  const [pizzaBuilderItems, setPizzaBuilderItems] = useState([]);
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
      
      // Pizza gets second priority (1) - but we don't have pizza category
      if (name?.includes('pizza')) return 1;
      
      // Chicken gets priority (2) - this is where our combo style items are
      if (name?.includes('chicken')) return 2;
      
      // Burgers get third priority (3)
      if (name?.includes('burger')) return 3;
      
      // Sides get fourth priority (4) 
      if (name?.includes('side')) return 4;
      
      // Drinks/Beverages get fifth priority (5)
      if (name?.includes('drink') || name?.includes('beverage')) return 5;
      
      // Desserts get sixth priority (6)
      if (name?.includes('dessert')) return 6;
      
      // Everything else goes to the end (7)
      return 7;
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

  // Fetch all pizzas for "Choose Your Toppings" section
  useEffect(() => {
    const loadAllPizzas = async () => {
      try {
        console.log("🍕 Loading all pizzas for Choose Your Toppings section");
        const response = await fetch(`${API_URL}/getAllPizzaList`);
        if (response.ok) {
          const data = await response.json();
          console.log("🍕 All pizzas loaded:", data);
          if (data?.data) {
            setAllPizzas(data.data);
          }
        }
      } catch (error) {
        console.error("Error loading all pizzas:", error);
      }
    };
    loadAllPizzas();
  }, []);

  // Fetch pizzas and other items when selectedCategory changes
  useEffect(() => {
    const loadItems = async () => {
      if (!selectedCategory) {
        console.log("No category selected, skipping items load");
        return;
      }

      console.log("🚀 STARTING loadItems for category:", selectedCategory);

      try {
        setLoadingItems(true);
        console.log("Loading items for category:", selectedCategory);

        // Test basic fetch first
        console.log("🧪 Testing API URL:", API_URL);
        
        // Fetch pizzas, other items, and user choices
        const [pizzaResponse, otherItemsResponse] = await Promise.all([
          fetchPizzasByCategory(selectedCategory),
          fetch(
            `${API_URL}/getOtherItemByCategory?categoryId=${selectedCategory}`
          ).then((res) => res.json()),
        ]);

        console.log("Pizza API Response:", pizzaResponse);
        console.log("Other Items API Response:", otherItemsResponse);
        
        // CRITICAL DEBUG POINT - IF YOU DON'T SEE THIS LOG, THERE'S A CACHING ISSUE!
       

        // Fetch combo style items separately to avoid Promise.all issues
       
        let comboStyleResponse = [];
        try {
          const comboStyleUrl = `${API_URL}/getComboStyleItems?categoryId=${selectedCategory}`;
          console.log("🔍 Combo style URL:", comboStyleUrl);
          
          const response = await fetch(comboStyleUrl);
          console.log("🔍 Combo style response status:", response.status);
          
          if (response.ok) {
            comboStyleResponse = await response.json();
            console.log("🔍 Combo style response data:", comboStyleResponse);
          } else {
            console.error("❌ Combo style fetch failed with status:", response.status);
          }
        } catch (comboError) {
          console.error("❌ Error fetching combo style items:", comboError);
        }

        console.log("Final Combo Style Response:", comboStyleResponse);

        // Fetch user choice items for this category
        let userChoiceResponse = [];
        try {
          const userChoiceUrl = `${API_URL}/getUserChoices?showInactive=true`;
          console.log("🔍 User Choice URL:", userChoiceUrl);
          console.log("🔍 Selected Category ID:", selectedCategory);
          
          const response = await fetch(userChoiceUrl);
          console.log("🔍 User choice response status:", response.status);
          
          if (response.ok) {
            const data = await response.json();
            console.log("🔍 User choice response data:", data);
            
            // Public endpoint returns array directly, not wrapped in success object
            if (Array.isArray(data)) {
              console.log("🔍 All user choices:", data.map(choice => ({
                id: choice.id,
                name: choice.name,
                displayCategoryId: choice.displayCategoryId,
                isActive: choice.isActive
              })));
              
              userChoiceResponse = data.filter(choice => {
                const matches = choice.displayCategoryId === selectedCategory;
                console.log(`🔍 Choice "${choice.name}" - displayCategoryId: ${choice.displayCategoryId}, selectedCategory: ${selectedCategory}, isActive: ${choice.isActive}, matches: ${matches}`);
                return matches;
              });
              console.log(`🔍 Filtered ${userChoiceResponse.length} user choices for category ${selectedCategory}`);
            }
          } else {
            console.error("❌ User choice fetch failed with status:", response.status);
          }
        } catch (userChoiceError) {
          console.error("❌ Error fetching user choice items:", userChoiceError);
        }

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

        // Handle combo style items data
        if (Array.isArray(comboStyleResponse) && comboStyleResponse.length > 0) {
          console.log(`✅ Found ${comboStyleResponse.length} combo style items`);
          setComboStyleItems(comboStyleResponse);
        } else {
          console.log("❌ No combo style items found");
          setComboStyleItems([]);
        }

        // Handle user choice items data
        if (Array.isArray(userChoiceResponse) && userChoiceResponse.length > 0) {
          console.log(`✅ Found ${userChoiceResponse.length} user choice items`);
          setUserChoiceItems(userChoiceResponse);
        } else {
          console.log("❌ No user choice items found");
          setUserChoiceItems([]);
        }

        // Fetch pizza builder items for this category
        console.log("🚀 ABOUT TO FETCH PIZZA BUILDER ITEMS");
        console.log("🚀 API_URL:", API_URL);
        console.log("🚀 selectedCategory:", selectedCategory);
        let pizzaBuilderResponse = [];
        try {
          const pizzaBuilderUrl = `${API_URL}/getPizzaBuilderDeals?categoryId=${selectedCategory}&showInactive=true`;
          console.log("🔍 Pizza Builder URL:", pizzaBuilderUrl);
          
          const response = await fetch(pizzaBuilderUrl);
          console.log("🔍 Pizza builder response status:", response.status);
          
          if (response.ok) {
            const data = await response.json();
            console.log("🔍 Pizza builder response data:", data);
            
            if (Array.isArray(data)) {
              pizzaBuilderResponse = data.filter(deal => deal.displayCategoryId === selectedCategory);
              console.log(`🔍 Filtered ${pizzaBuilderResponse.length} pizza builder deals for category ${selectedCategory}`);
            }
          } else {
            console.error("❌ Pizza builder fetch failed with status:", response.status);
          }
        } catch (pizzaBuilderError) {
          console.error("❌ Error fetching pizza builder items:", pizzaBuilderError);
        }

        // Handle pizza builder items data
        if (Array.isArray(pizzaBuilderResponse) && pizzaBuilderResponse.length > 0) {
          console.log(`✅ Found ${pizzaBuilderResponse.length} pizza builder items`);
          setPizzaBuilderItems(pizzaBuilderResponse);
        } else {
          console.log("❌ No pizza builder items found");
          setPizzaBuilderItems([]);
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
              : `/${pizza.imageUrl}`)
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
            : `${item.imageUrl}`)
        : "/assets/images/food/pm-food1.png",
      type: "other",
      isOtherItem: true, // Add this flag for better identification
      otherItemId: item?.id, // Keep reference to original ID
    }));
  };

  // Format user choice items for menu
  const formatUserChoiceItemsForMenu = (items) => {
    if (!Array.isArray(items)) return [];

    return items.map((item) => ({
      id: item?.id || Math.random().toString(),
      title: item?.name || "Unnamed Meal Deal",
      price: parseFloat(item?.basePrice || 0),
      decs: item?.description || "Customizable meal deal with your choice of items",
      img: item?.imageUrl 
        ? (item.imageUrl.startsWith('http') 
            ? item.imageUrl 
            : `${API_URL}/images/${item.imageUrl}`)
        : "/assets/images/food/pm-food1.png",
      type: "userChoice",
      isUserChoice: true,
      userChoiceId: item?.id,
      categoryConfigs: item?.categoryConfigs || [],
      showPriceFrom: true, // Show "from" prefix like combo items
    }));
  };

  // Format Pizza Builder items for menu - Show each deal individually
  const formatPizzaBuilderItemsForMenu = (items) => {
    if (!Array.isArray(items) || items.length === 0) return [];

    // Return each Pizza Builder Deal as a separate menu item
    return items.map((deal) => ({
      id: deal.id,
      title: deal.name, // Just the name, no price
      price: "", // No price display
      decs: deal.description || "Customize this pizza with your choice of toppings, base, and size",
      img: deal.imageUrl || "/assets/images/food/pm-food1.png",
      type: "pizzaBuilderDeals",
      isPizzaBuilderDeals: true,
      showPriceFrom: false, // Don't show price
      dealData: deal // Include the full deal data for reference
    }));
  };

  // Format all pizzas for "Choose Your Toppings" section
  const formatAllPizzasForToppings = (allPizzas) => {
    if (!Array.isArray(allPizzas)) return [];

    return allPizzas.map((pizza) => {
      const basePrice = getBasePrice(pizza.sizes);
      return {
        id: pizza.id,
        title: pizza.name,
        price: basePrice,
        decs: `${pizza.description || 'Delicious pizza'} - Customize with up to 4 toppings`,
        img: `${API_URL}/images/pizza-${pizza.id}.png`,
        type: "pizza",
        isPizza: true,
        fourToppingMode: true, // Special flag to indicate 4-topping customization
      };
    });
  };

  // Format Combo Style items for menu
  const formatComboStyleItemsForMenu = (items) => {
    if (!Array.isArray(items)) return [];

    return items.map((item) => {
      // Get the smallest size price as the display price
      const sizePricing = item?.sizePricing || {};
      const prices = Object.values(sizePricing).map(p => parseFloat(p.basePrice || 0));
      const minPrice = prices.length > 0 ? Math.min(...prices) : 0;

      return {
        id: item?.id || Math.random().toString(),
        title: item?.name || "Unnamed Combo Item",
        price: minPrice,
        decs: item?.description || "Delicious combo style item with choice of sauce",
        img: item?.imageUrl 
          ? (item.imageUrl.startsWith('http') 
              ? item.imageUrl 
              : `${item.imageUrl}`)
          : "/assets/images/food/pm-food1.png",
        type: "comboStyle", // Special type for Combo Style items
        isComboStyleItem: true,
        itemId: item?.id, // Add itemId for linking
        comboStyleItemId: item?.id,
        sizePricing: item?.sizePricing,
        availableSauces: item?.availableSauces,
        mealDealConfig: item?.mealDealConfig,
        showPriceFrom: true, // Indicate that this is a "from" price
      };
    });
  };

  // Create menu items with proper fallbacks
  const menuItems = formattedCategories.map((category) => {
    const categoryPizzas =
      category.id === selectedCategory ? formatPizzasForMenu(pizzas) : [];
    const categoryOtherItems =
      category.id === selectedCategory
        ? formatOtherItemsForMenu(otherItems)
        : [];
    
    // Show combo style items in the selected category if they belong to it
    // Since all combo style items are in "chicken" category, they'll show there
    const categoryComboStyleItems = (category.id === selectedCategory) 
      ? formatComboStyleItemsForMenu(comboStyleItems) 
      : [];
    
    // Show user choice items in the selected category if they belong to it
    const categoryUserChoiceItems = (category.id === selectedCategory) 
      ? formatUserChoiceItemsForMenu(userChoiceItems) 
      : [];
    
    // Show pizza builder items in the selected category if they belong to it
    const categoryPizzaBuilderItems = (category.id === selectedCategory) 
      ? formatPizzaBuilderItemsForMenu(pizzaBuilderItems) 
      : [];
    
    console.log(`🔍 Category ${category.id} (${category.title}) - Selected: ${selectedCategory}:`, {
      userChoiceItemsCount: userChoiceItems.length,
      formattedUserChoiceItems: categoryUserChoiceItems.length,
      pizzaBuilderItemsCount: pizzaBuilderItems.length,
      formattedPizzaBuilderItems: categoryPizzaBuilderItems.length,
      categoryUserChoiceItems: categoryUserChoiceItems.map(item => ({
        id: item.id,
        title: item.title,
        type: item.type
      })),
      categoryPizzaBuilderItems: categoryPizzaBuilderItems.map(item => ({
        id: item.id,
        title: item.title,
        type: item.type
      }))
    });
    
    const items = [...categoryPizzas, ...categoryOtherItems, ...categoryComboStyleItems, ...categoryUserChoiceItems, ...categoryPizzaBuilderItems];

    console.log(`📋 Menu items for category ${category.id} (${category.title}):`, {
      pizzas: categoryPizzas.length,
      otherItems: categoryOtherItems.length,
      comboStyleItems: categoryComboStyleItems.length,
      userChoiceItems: categoryUserChoiceItems.length,
      pizzaBuilderItems: categoryPizzaBuilderItems.length,
      total: items.length,
      itemTitles: items.map(item => item.title)
    });
    
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
