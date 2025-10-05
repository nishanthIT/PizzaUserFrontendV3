
"use client";
import React, { useState, useEffect } from "react";
import WellFoodLayout from "@/layout/WellFoodLayout";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL } from "@/services/config";

const UserPage = ({ user }) => {
  console.log("User data:", user);
  const [orders, setOrders] = useState([]);
  const [mealsData, setMealsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeOrder, setActiveOrder] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch orders
        const ordersResponse = await axios.get(
          `${API_URL}/getOrders`,
          {
            withCredentials: true,
          }
        );
        // Fetch meals donated data
        const mealsResponse = await axios.get(
          `${API_URL}/user/meals-donated`,
          {
            withCredentials: true,
          }
        );

        if (ordersResponse.data.success) {
          setOrders(ordersResponse.data.data);
        } else {
          setError("Failed to fetch orders");
        }

        if (mealsResponse.data.success) {
          setMealsData(mealsResponse.data.data);
        }
      } catch (err) {
        setError(err.message || "Error fetching your data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Helper function to format date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (e) {
      return "Invalid date";
    }
  };

  // Helper function to get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "PENDING":
        return "badge-warning";
      case "DELIVERED":
        return "badge-success";
      case "PROCESSING":
        return "badge-primary";
      case "CANCELLED":
        return "badge-danger";
      default:
        return "badge-secondary";
    }
  };

  // Helper function to get payment badge class  
  const getPaymentBadgeClass = (status) => {
    switch (status) {
      case "PAID":
        return "badge-success";
      case "PENDING":
        return "badge-warning";
      case "FAILED":
        return "badge-danger";
      default:
        return "badge-secondary";
    }
  };

  // Helper function to get item name and type
  const getItemDetails = (item) => {
    let itemName = '';
    let itemType = '';
    let itemImage = '';
    console.log('🔍 Order item details:', item)
    
    // Check for UserChoice items first
    if (item.userChoiceId) {
      if (item.userChoice) {
        itemName = item.userChoice.name;
        itemImage = item.userChoice.imageUrl;
      } else {
        itemName = 'User Choice Meal Deal';
        itemImage = '';
      }
      itemType = 'User Choice';
    }
    // Check if this might be a user choice item without proper ID (fallback)
    else if (item.userChoiceSelections && !item.pizzaId && !item.comboId && !item.otherItemId && !item.comboStyleItemId && !item.periPeriId) {
      itemName = 'User Choice Meal Deal';
      itemType = 'User Choice';
      itemImage = '';
    }
    else if (item.comboStyleItemId && item.comboStyleItem) {
      // Combo Style Item (new flexible system)
      itemName = item.comboStyleItem.name;
      itemType = 'Combo Style';
      itemImage = item.comboStyleItem.imageUrl;
    } else if (item.periPeriId && item.periPeri) {
      // Peri Peri Item (deprecated but still supported)
      itemName = item.periPeri.name;
      itemType = 'Peri Peri';
      itemImage = item.periPeri.imageUrl;
    } else if (item.comboId && item.combo) {
      // Combo Offer
      itemName = item.combo.name;
      itemType = 'Combo';
      itemImage = item.combo.imageUrl;
    } else if (item.pizzaId && item.pizza) {
      // Pizza
      itemName = item.pizza.name;
      itemType = 'Pizza';
      itemImage = item.pizza.imageUrl;
    } else if (item.otherItemId && item.otherItem) {
      // Other Item
      itemName = item.otherItem.name;
      itemType = 'Other';
      itemImage = item.otherItem.imageUrl;
    } else {
      // Fallback for items without proper relations
      itemName = 'Unknown Item';
      itemType = 'Unknown';
      itemImage = '';
    }

    return { itemName, itemType, itemImage };
  };

  // Helper function to parse user choice selections
  const parseUserChoiceSelections = (userChoiceSelections) => {
    if (!userChoiceSelections) return [];
    
    try {
      const selections = JSON.parse(userChoiceSelections);
      const allItems = [];
      
      // Iterate through each category's selections
      Object.values(selections).forEach(categoryItems => {
        if (Array.isArray(categoryItems)) {
          categoryItems.forEach(item => {
            allItems.push({
              name: item.name,
              quantity: item.quantity || 1,
              description: item.description
            });
          });
        }
      });
      
      return allItems;
    } catch (error) {
      console.error('Error parsing user choice selections:', error);
      return [];
    }
  };

  // Toggle order details
  const toggleOrderDetails = (orderId) => {
    if (activeOrder === orderId) {
      setActiveOrder(null);
    } else {
      setActiveOrder(orderId);
    }
  };

  return (
    <WellFoodLayout>
      <section className="py-120">
        <div className="container">
          {/* Page Title */}
          <div className="text-center mb-5">
            <h2 className="title mb-3">My Dashboard</h2>
            <p className="text-muted">Welcome back, {user?.name || "Pizza Lover"}!</p>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <p className="mt-3">Loading your dashboard...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          ) : (
            <>
              {/* Stats Section */}
              {mealsData && (
                <div className="row mb-5">
                  <div className="col-md-3 col-6 mb-4">
                    <div className="card text-center h-100">
                      <div className="card-body">
                        <i className="fas fa-dollar-sign fa-2x text-success mb-3"></i>
                        <h4>£{mealsData.totalSpent.toFixed(2)}</h4>
                        <p className="text-muted mb-0">Total Spent</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 col-6 mb-4">
                    <div className="card text-center h-100">
                      <div className="card-body">
                        <i className="fas fa-star fa-2x text-warning mb-3"></i>
                        <h4>{user?.points ? Number(user.points).toFixed(2) : '0.00'}</h4>
                        <p className="text-muted mb-0">Points</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 col-6 mb-4">
                    <div className="card text-center h-100">
                      <div className="card-body">
                        <i className="fas fa-heart fa-2x text-danger mb-3"></i>
                        <h4>{mealsData.mealsDonatted}</h4>
                        <p className="text-muted mb-0">Meals Donated</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 col-6 mb-4">
                    <div className="card text-center h-100">
                      <div className="card-body">
                        <i className="fas fa-target fa-2x text-info mb-3"></i>
                        <h4>£{mealsData.nextMealAt.toFixed(2)}</h4>
                        <p className="text-muted mb-0">Next Meal Goal</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Order History */}
              <div className="row">
                <div className="col-12">
                  <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">Order History</h5>
                      <span className="badge badge-primary">{orders.length} Orders</span>
                    </div>
                    <div className="card-body">
                      {orders.length === 0 ? (
                        <div className="text-center py-5">
                          <i className="fas fa-pizza-slice fa-4x text-muted mb-3"></i>
                          <h5>No Orders Yet</h5>
                          <p className="text-muted">Time to order some delicious pizza!</p>
                        </div>
                      ) : (
                        <div className="table-responsive">
                          {orders.map((order, index) => (
                            <div key={order.id} className="order-item border-bottom pb-3 mb-3">
                              {/* Order Header */}
                              <div className="row align-items-center">
                                <div className="col-lg-2 col-md-3 col-sm-6">
                                  <strong>#{order.id.substring(0, 8)}</strong>
                                  <br />
                                  <small className="text-muted">{formatDate(order.createdAt)}</small>
                                </div>
                                <div className="col-lg-2 col-md-3 col-sm-6">
                                  <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                                    {order.status}
                                  </span>
                                </div>
                                <div className="col-lg-2 col-md-3 col-sm-6">
                                  <strong className="text-success">£{parseFloat(order.totalAmount).toFixed(2)}</strong>
                                </div>
                                <div className="col-lg-2 col-md-3 col-sm-6">
                                  <span className={`badge ${getPaymentBadgeClass(order.paymentStatus)}`}>
                                    {order.paymentStatus}
                                  </span>
                                </div>
                                <div className="col-lg-4 col-md-12 text-lg-right mt-2 mt-lg-0">
                                  <button
                                    className="btn btn-outline-primary btn-sm"
                                    onClick={() => toggleOrderDetails(order.id)}
                                  >
                                    {activeOrder === order.id ? 'Hide Details' : 'View Details'}
                                  </button>
                                </div>
                              </div>

                              {/* Order Details */}
                              <AnimatePresence>
                                {activeOrder === order.id && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="order-details mt-3 pt-3 border-top"
                                  >
                                    {/* Delivery Info */}
                                    <div className="row mb-4">
                                      <div className="col-md-6">
                                        <h6>Delivery Information</h6>
                                        <table className="table table-sm">
                                          <tbody>
                                            <tr>
                                              <td><strong>Method:</strong></td>
                                              <td>{order.deliveryMethod}</td>
                                            </tr>
                                            {order.deliveryMethod === "delivery" && order.deliveryAddress && (
                                              <tr>
                                                <td><strong>Address:</strong></td>
                                                <td>{order.deliveryAddress}</td>
                                              </tr>
                                            )}
                                            {order.deliveryMethod === "pickup" && order.pickupTime && (
                                              <tr>
                                                <td><strong>Pickup Time:</strong></td>
                                                <td>{order.pickupTime}</td>
                                              </tr>
                                            )}
                                          </tbody>
                                        </table>
                                      </div>
                                      <div className="col-md-6">
                                        <h6>Order Summary</h6>
                                        <table className="table table-sm">
                                          <tbody>
                                            <tr>
                                              <td><strong>Items:</strong></td>
                                              <td>{order.orderItems.length}</td>
                                            </tr>
                                            <tr>
                                              <td><strong>Total Amount:</strong></td>
                                              <td className="text-success"><strong>£{parseFloat(order.totalAmount).toFixed(2)}</strong></td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>

                                    {/* Order Items */}
                                    <div className="mb-3">
                                      <h6>Order Items ({order.orderItems.length})</h6>
                                      {order.orderItems.map((item, itemIndex) => {
                                        const { itemName, itemType, itemImage } = getItemDetails(item);
                                        
                                        return (
                                          <div key={item.id} className="card mb-3">
                                            <div className="card-body">
                                              <div className="row">
                                                <div className="col-md-8">
                                                  <div className="d-flex align-items-start">
                                                    {/* Item Image */}
                                                    {itemImage && (
                                                      <img
                                                        src={`${API_URL}/images/${itemImage}`}
                                                        alt={itemName}
                                                        style={{
                                                          width: '60px',
                                                          height: '60px',
                                                          objectFit: 'cover',
                                                          borderRadius: '8px',
                                                          marginRight: '15px'
                                                        }}
                                                        onError={(e) => {
                                                          e.target.style.display = 'none';
                                                        }}
                                                      />
                                                    )}
                                                    
                                                    <div className="flex-grow-1">
                                                     <h6 className="card-title">
                                                     <span 
                                                         className="badge mr-2" 
                                                             style={{  color: '#8c8c8c' }}
                                                           >
                                                             {itemType}
                                                           </span>
                                                            {" "}{itemName}
                                                      </h6>
                                                      
                                                      <div className="row mb-2">
                                                        <div className="col-md-6 col-12">
  <span 
    className="badge mr-2 mb-1"
    style={{ backgroundColor: '#6c757d', color: '#fff' }}
  >
    Size: {item.size === "wings" ? "8 Wings" : item.size}
  </span>
</div>
                                                        <div className="col-md-6 col-12">
                                                          <span className="badge badge-secondary mb-1">Qty: {item.quantity}</span>
                                                        </div>
                                                      </div>

                                                      {/* Sauce for combo style items and peri peri */}
                                                      {item.sauce && (
                                                        <div className="mb-2">
                                                          <strong className="d-block mb-1">Sauce:</strong>
                                                          <span className="badge badge-warning" style={{ backgroundColor: '#d6f5d6', color: '#1e7b1e' }}>{item.sauce}</span>
                                                        </div>
                                                      )}

                                                      {/* Meal Deal Information */}
                                                      {item.isMealDeal && (
                                                        <div className="mb-2">
                                                          <span className="badge badge-success mb-2 "style={{ backgroundColor: ' #ff704d', color: '#fff' }}>Meal Deal</span>
                                                          
                                                          {/* Selected Sides */}
                                                          {item.selectedSidesNames && item.selectedSidesNames.length > 0 && (
                                                            <div className="mb-2">
                                                              <strong className="d-block mb-1">Sides ({item.selectedSidesNames.length}):</strong>
                                                              <div className="row">
                                                                {item.selectedSidesNames.map((sideName, sideIndex) => (
                                                                  <div key={sideIndex} className="col-auto mb-1">
                                                                    <span className="badge badge-outline-secondary" style={{ 
                                                                      backgroundColor: '#f8f9fa', 
                                                                      color: '#495057', 
                                                                      border: '1px solid #dee2e6',
                                                                      fontSize: '0.75rem' 
                                                                    }}>
                                                                      {sideName}
                                                                    </span>
                                                                  </div>
                                                                ))}
                                                              </div>
                                                            </div>
                                                          )}

                                                          {/* Selected Drinks */}
                                                          {item.selectedDrinksNames && item.selectedDrinksNames.length > 0 && (
                                                            <div className="mb-2">
                                                              <strong className="d-block mb-1">Drinks ({item.selectedDrinksNames.length}):</strong>
                                                              <div className="row">
                                                                {item.selectedDrinksNames.map((drinkName, drinkIndex) => (
                                                                  <div key={drinkIndex} className="col-auto mb-1">
                                                                    <span className="badge badge-outline-secondary" style={{ 
                                                                      backgroundColor: '#f8f9fa', 
                                                                      color: '#495057', 
                                                                      border: '1px solid #dee2e6',
                                                                      fontSize: '0.75rem' 
                                                                    }}>
                                                                      {drinkName}
                                                                    </span>
                                                                  </div>
                                                                ))}
                                                              </div>
                                                            </div>
                                                          )}
                                                        </div>
                                                      )}

                                                      {/* Show toppings for pizzas */}
                                                      {item.orderToppings && item.orderToppings.filter(topping => topping.quantity > 0).length > 0 && (
                                                        <div className="mb-2">
                                                          <strong className="d-block mb-1">Toppings:</strong>
                                                          <div className="row">
                                                            {item.orderToppings
                                                              .filter(topping => topping.quantity > 0)
                                                              .map((topping, toppingIndex) => (
                                                                <div key={toppingIndex} className="col-auto mb-1">
                                                                  <span className="badge badge-secondary" style={{ backgroundColor: '#333', color: '#8c8c8c', fontSize: '0.75rem' }}>
                                                                    {topping.name} × {topping.quantity}
                                                                  </span>
                                                                </div>
                                                              ))}
                                                          </div>
                                                        </div>
                                                      )}

                                                      {/* Show ingredients for pizzas */}
                                                      {item.orderIngredients && item.orderIngredients.filter(ingredient => ingredient.quantity > 0).length > 0 && (
                                                        <div className="mb-2">
                                                          <strong className="d-block mb-1">Ingredients:</strong>
                                                          <div className="row">
                                                            {item.orderIngredients
                                                              .filter(ingredient => ingredient.quantity > 0)
                                                              .map((ingredient, ingredientIndex) => (
                                                                <div key={ingredientIndex} className="col-auto mb-1">
                                                                  <span className="badge badge-secondary" style={{ backgroundColor: '#333', color: '#8c8c8c', fontSize: '0.75rem' }}>
                                                                    {ingredient.name} × {ingredient.quantity}
                                                                  </span>
                                                                </div>
                                                              ))}
                                                          </div>
                                                        </div>
                                                      )}

                                                      {/* Show user choice selections */}
                                                      {((item.userChoiceId && item.userChoiceSelections) || (!item.pizzaId && !item.comboId && !item.otherItemId && !item.comboStyleItemId && !item.periPeriId && item.userChoiceSelections)) && (
                                                        <div className="mb-2">
                                                          <strong className="d-block mb-1">Your Selections:</strong>
                                                          <div className="row">
                                                            {parseUserChoiceSelections(item.userChoiceSelections).map((selection, selectionIndex) => (
                                                              <div key={selectionIndex} className="col-auto mb-1">
                                                                <span className="badge badge-info" style={{ 
                                                                  backgroundColor: '#17a2b8', 
                                                                  color: '#fff', 
                                                                  fontSize: '0.75rem' 
                                                                }}>
                                                                  {selection.quantity > 1 ? `${selection.quantity}x ` : ''}{selection.name}
                                                                </span>
                                                              </div>
                                                            ))}
                                                          </div>
                                                        </div>
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>
                                                <div className="col-md-4 text-md-right">
                                                  <p className="mb-1">
                                                    <small className="text-muted">£{parseFloat(item.price).toFixed(2)} each</small>
                                                  </p>
                                                  <h5 className="text-success mb-0">
                                                    Total: £{(parseFloat(item.price) * parseInt(item.quantity)).toFixed(2)}
                                                  </h5>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Logout Button */}
          <div className="row mt-5">
            <div className="col-12 text-center">
              <button
                className="btn btn-outline-danger btn-lg"
                onClick={() => {
                  // Clear any stored auth data
                  localStorage.removeItem('authToken');
                  sessionStorage.removeItem('authToken');
                  // Redirect to login or home page
                  window.location.href = '/login';
                }}
                style={{
                  padding: '12px 30px',
                  fontSize: '1.1rem',
                  borderRadius: '8px',
                  border: '2px solid #dc3545',
                  backgroundColor: 'transparent',
                  color: '#dc3545',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#dc3545';
                  e.target.style.color = 'white';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#dc3545';
                }}
              >
                <i className="fas fa-sign-out-alt mr-2"></i>
                Logout
              </button>
            </div>
          </div>
        </div>
      </section>
    </WellFoodLayout>
  );
};

export default UserPage;