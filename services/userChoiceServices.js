import axios from "axios";
import { API_URL } from "./config";

export const fetchAllUserChoices = async () => {
  try {
    const response = await axios.get(`${API_URL}/getUserChoices`);
    console.log("Fetched user choices:", response.data);
    // Public endpoint returns data directly, wrap it for consistency
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching user choices:", error);
    throw error;
  }
};

export const fetchUserChoiceById = async (userChoiceId, allowInactive = false) => {
  try {
    const url = allowInactive 
      ? `${API_URL}/getUserChoice/${userChoiceId}?allowInactive=true`
      : `${API_URL}/getUserChoice/${userChoiceId}`;
    
    const response = await axios.get(url);
    console.log("Fetched user choice details:", response.data);
    // Public endpoint returns data directly, wrap it for consistency
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching user choice details:", error);
    throw error;
  }
};

export const fetchCategoryItems = async (userChoiceId, categoryConfig, allowInactive = false) => {
  try {
    const url = `${API_URL}/getUserChoiceItems?userChoiceId=${userChoiceId}&categoryType=${categoryConfig.type}&categoryId=${categoryConfig.categoryId}${allowInactive ? '&allowInactive=true' : ''}`;
    const response = await axios.get(url);
    console.log("Fetched category items:", response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching category items:", error);
    throw error;
  }
};