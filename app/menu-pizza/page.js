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
import { CupSoda, Pizza, Dessert, Hamburger } from "lucide-react"; // Import Lucide icons
import { API_URL } from "@/services/config";

// Helper function to get icon based on category name
const getCategoryIcon = (categoryName) => {
  // const iconMap = {
  //   DESSERTS: "flaticon-cupcake",
  //   Vegetarian: "flaticon-broccoli",
  //   Pizza: "flaticon-pizza",
  //   Drinks: "flaticon-poinsettia",
  // };
  const iconMap = {
    DESSERTS: <Dessert size={40} color="#ff0000" />,
    //Vegetarian: <Broccoli size={20} />,
    Pizza: <Pizza size={40} color="#ff0000" />,
    //BURGERS:  <Hamburger />,
    Drinks: <CupSoda size={40} color="#ff0000" />,
  };

  return iconMap[categoryName] || <Pizza size={20} />;
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

  // Fetch pizzas and other items when selectedCategory changes
  useEffect(() => {
    const loadItems = async () => {
      if (!selectedCategory) {
        console.log("No category selected, skipping items load");
        return;
      }

      try {
        setLoading(true);
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
          ? `/uploads/${pizza.imageUrl}`
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

  // Format other items for menu
  const formatOtherItemsForMenu = (items) => {
    if (!Array.isArray(items)) return [];

    return items.map((item) => ({
      id: item?.id || Math.random().toString(),
      title: item?.name || "Unnamed Item",
      price: item?.price || 0,
      decs: item?.description || "Delicious item",
      img: item?.imageUrl || "/assets/images/food/pm-food1.png",
      type: "other",
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
