import axios from "axios";
import { API_URL } from "./config";

export const fetchPizzasByCategory = async (categoryId) => {
  try {
    const response = await axios.get(
      `${API_URL}/getPizzabyCategory?categoryId=${categoryId}`
    );
    console.log("FHIII");
    console.log("Fetched pizzas by category:", response.data);

    return response.data;
  } catch (error) {
    console.error("Error fetching pizzas by category:", error);
    throw error;
  }
};

export const fetchAllCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/getAllCategories`);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const fetchPizzaById = async (pizzaId) => {
  try {
    const response = await axios.get(`${API_URL}/getPizzaById/${pizzaId}`);
    return response.data;

  } catch (error) {
    console.error("Error fetching pizza details:", error);
    throw error;
  }
};

export const fetchAllToppings = async () => {
  try {
    const response = await axios.get(`${API_URL}/getAllToppings`);
    console.log('🔧 All toppings fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching toppings:", error);
    throw error;
  }
};

export const fetchAllIngredients = async () => {
  try {
    const response = await axios.get(`${API_URL}/getAllIngredients`);
    return response.data;
  } catch (error) {
    console.error("Error fetching ingredients:", error);
    throw error;
  }
};

export const getComboByIdUser = async () => {
  try {
    const response = await axios.get(`${API_URL}/getComboByIdUser`);
    return response.data;
  } catch (error) {
    console.error("Error fetching combo by ID:", error);
    throw error;
  }
};

export const getComboById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/getAllcomboList/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching combo by ID:", error);
    throw error;
  }
};
