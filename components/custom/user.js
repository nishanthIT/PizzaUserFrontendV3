"use client";
import React, { useState, useEffect } from "react";
import WellFoodLayout from "@/layout/WellFoodLayout";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

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
          "https://backend.addiscombepizza.co.uk/api/getOrders",
          {
            withCredentials: true,
          }
        );
        
        // Fetch meals donated data
        const mealsResponse = await axios.get(
          "https://backend.addiscombepizza.co.uk/api/user/meals-donated",
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
                                    {/* Debug logging for the expanded order */}
                                    {console.log('Expanded Order Details:', {
                                      orderId: order.id,
                                      orderItems: order.orderItems,
                                      fullOrder: order
                                    })}
                                    
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
                                            {order.deliveryMethod === "DELIVERY" && order.deliveryAddress && (
                                              <tr>
                                                <td><strong>Address:</strong></td>
                                                <td>{order.deliveryAddress}</td>
                                              </tr>
                                            )}
                                            {order.deliveryMethod === "PICKUP" && order.pickupTime && (
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
                                        // Debug logging for each order item
                                        console.log(`Order Item ${itemIndex}:`, {
                                          id: item.id,
                                          isCombo: item.isCombo,
                                          isOtherItem: item.isOtherItem,
                                          pizza: item.pizza,
                                          otherItem: item.otherItem,
                                          combo: item.combo,
                                          title: item.title,
                                          name: item.name,
                                          fullItem: item
                                        });
                                        
                                        return (
                                        <div key={item.id} className="card mb-3">
                                          <div className="card-body">
                                            <div className="row">
                                              <div className="col-md-8">
                                                <h6 className="card-title">
                                                  {item.isCombo ? 'Combo: ' : 
                                                   item.isOtherItem ? '' : 'Pizza: '}
                                                  {item.isCombo ? 
                                                    (item.combo?.name || 'Combo Item') :
                                                   item.isOtherItem ? 
                                                    (item.otherItem?.name || item.otherItem?.title || item.title || item.name || 'Other Item') :
                                                    (item.pizza?.name || 'Custom Pizza')}
                                                </h6>
                                                <div className="row">
                                                  <div className="col-md-6 col-12">
                                                    <span className="badge badge-primary mr-2 mb-1">{item.size}</span>
                                                  </div>
                                                  <div className="col-md-6 col-12">
                                                    <span className="badge badge-secondary mb-1">Qty: {item.quantity}</span>
                                                  </div>
                                                </div>
                                                
                                                {/* Show toppings and ingredients for all items */}
                                                {item.orderToppings && item.orderToppings.filter(topping => topping.quantity > 0).length > 0 && (
                                                  <div className="mb-2">
                                                    <strong className="d-block mb-1">Toppings:</strong>
                                                    <div className="row">
                                                      {item.orderToppings
                                                        .filter(topping => topping.quantity > 0)
                                                        .map((topping, toppingIndex) => (
                                                          <div key={toppingIndex} className="col-auto mb-1">
                                                            <span className="badge badge-secondary" style={{ backgroundColor: '#333', color: '#fff', fontSize: '0.75rem' }}>
                                                              {topping.name} × {topping.quantity}
                                                            </span>
                                                          </div>
                                                        ))}
                                                    </div>
                                                  </div>
                                                )}

                                                {item.orderIngredients && item.orderIngredients.filter(ingredient => ingredient.quantity > 0).length > 0 && (
                                                  <div className="mb-2">
                                                    <strong className="d-block mb-1">Ingredients:</strong>
                                                    <div className="row">
                                                      {item.orderIngredients
                                                        .filter(ingredient => ingredient.quantity > 0)
                                                        .map((ingredient, ingredientIndex) => (
                                                          <div key={ingredientIndex} className="col-auto mb-1">
                                                            <span className="badge badge-secondary" style={{ backgroundColor: '#333', color: '#fff', fontSize: '0.75rem' }}>
                                                              {ingredient.name} × {ingredient.quantity}
                                                            </span>
                                                          </div>
                                                        ))}
                                                    </div>
                                                  </div>
                                                )}
                                              </div>
                                              <div className="col-md-4 text-md-right">
                                                <p className="mb-1">
                                                  <small className="text-muted">£{parseFloat(item.price).toFixed(2)} </small>
                                                </p>
                                                <h5 className="text-success mb-0">
                                                  X {parseFloat(item.quantity).toFixed(0)}
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
        </div>
      </section>
    </WellFoodLayout>
  );
};

export default UserPage;
