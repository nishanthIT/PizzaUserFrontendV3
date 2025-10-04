import { API_URL } from './config';
import axios from 'axios';

// Get delivery charge by address or postcode
export const calculateDeliveryCharge = async (address, signal = null) => {
  try {
    const response = await axios.post(`${API_URL}/delivery/calculate`, {
      address: address
    }, {
      signal: signal, // Allow request cancellation
      timeout: 15000 // 15 second timeout
    });
    
    return response.data;
  } catch (error) {
    console.error('Error calculating delivery charge:', error);
    throw error;
  }
};

// Get delivery charge by coordinates
export const calculateDeliveryChargeByCoords = async (lat, lng) => {
  try {
    const response = await axios.post(`${API_URL}/delivery/calculate`, {
      lat: lat,
      lng: lng
    });
    
    return response.data;
  } catch (error) {
    console.error('Error calculating delivery charge by coordinates:', error);
    throw error;
  }
};

// Validate delivery charge (for checkout security)
export const validateDeliveryCharge = async (address, postcode, expectedCharge) => {
  try {
    const response = await axios.post(`${API_URL}/delivery/validate`, {
      address: address,
      postcode: postcode,
      expectedCharge: expectedCharge
    });
    
    return response.data;
  } catch (error) {
    console.error('Error validating delivery charge:', error);
    throw error;
  }
};

// Get delivery zones information
export const getDeliveryZones = async () => {
  try {
    const response = await axios.get(`${API_URL}/delivery/zones`);
    
    return response.data;
  } catch (error) {
    console.error('Error fetching delivery zones:', error);
    throw error;
  }
};