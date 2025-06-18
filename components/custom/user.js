"use client";
import React, { useState, useEffect } from "react";
import WellFoodLayout from "@/layout/WellFoodLayout";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

const UserPage = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeOrder, setActiveOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          "https://backend.circlepizzapizza.co.uk/api/getOrders",
          {
            withCredentials: true,
          }
        );
        if (response.data.success) {
          setOrders(response.data.data);
        } else {
          setError("Failed to fetch orders");
        }
      } catch (err) {
        setError(err.message || "Error fetching your orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
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

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "text-yellow-500";
      case "DELIVERED":
        return "text-green-500";
      case "PROCESSING":
        return "text-blue-500";
      case "CANCELLED":
        return "text-red-500";
      default:
        return "text-gray-500";
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
      <section className="order-history-section py-120">
        <div className="container">
          {/* User Welcome Section */}
          <div className="text-center mb-5">
            <h2 className="title mb-3">
              Hello, {user?.name || "Pizza Lover"} 👋
            </h2>
            <p className="text-muted">
              Track your orders and view your order history
            </p>
          </div>

          {/* Order History Section */}
          <div className="orders-container mt-5">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner"></div>
                <p className="mt-3">Loading your delicious history...</p>
              </div>
            ) : error ? (
              <div className="alert alert-danger text-center" role="alert">
                {error}
              </div>
            ) : orders.length === 0 ? (
              <div className="no-orders text-center py-5">
                <img
                  src="/images/empty-order.png"
                  alt="No orders"
                  className="mb-4"
                  style={{ width: "200px" }}
                />
                <h3>No Orders Yet</h3>
                <p className="text-muted">
                  Time to treat yourself to some delicious pizza!
                </p>
              </div>
            ) : (
              <div className="row g-4">
                {orders.map((order) => (
                  <div key={order.id} className="col-12">
                    <div className="order-card bg-white rounded-4 shadow-sm overflow-hidden">
                      {/* Order Header - Always visible */}
                      <div className="order-header p-4 border-bottom bg-light">
                        <div className="row align-items-center">
                          <div className="col-md-3">
                            <h5 className="mb-1">
                              Order #{order.id.substring(0, 8)}
                            </h5>
                            <p className="text-muted mb-0 small">
                              {formatDate(order.createdAt)}
                            </p>
                          </div>
                          <div className="col-md-3 text-md-center">
                            <span
                              className={`status-pill ${order.status.toLowerCase()}`}
                            >
                              {order.status}
                            </span>
                          </div>
                          <div className="col-md-3 text-md-center">
                            <p className="mb-0">Total Amount</p>
                            <h5 className="mb-0">
                              ${parseFloat(order.totalAmount).toFixed(2)}
                            </h5>
                          </div>
                          <div className="col-md-3 text-md-end">
                            <button
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => toggleOrderDetails(order.id)}
                            >
                              {activeOrder === order.id
                                ? "Hide Details"
                                : "View Details"}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Order Details - Animated expansion */}
                      <AnimatePresence>
                        {activeOrder === order.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="order-details p-4"
                          >
                            {/* Delivery Info */}
                            <div className="delivery-info mb-4">
                              <h6 className="section-title mb-3">
                                Delivery Details
                              </h6>
                              <div className="info-grid">
                                <div className="info-item">
                                  <span className="label">Method:</span>
                                  <span className="value">
                                    {order.deliveryMethod}
                                  </span>
                                </div>
                                {order.deliveryMethod === "DELIVERY" && (
                                  <div className="info-item">
                                    <span className="label">Address:</span>
                                    <span className="value">
                                      {order.deliveryAddress || "N/A"}
                                    </span>
                                  </div>
                                )}
                                {order.deliveryMethod === "PICKUP" && (
                                  <div className="info-item">
                                    <span className="label">Pickup Time:</span>
                                    <span className="value">
                                      {order.pickupTime || "N/A"}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Order Items */}
                            <div className="order-items">
                              <h6 className="section-title mb-3">
                                Order Items
                              </h6>
                              <div className="items-grid">
                                {order.orderItems.map((item) => (
                                  <div
                                    key={item.id}
                                    className="item-card p-3 mb-3 rounded-3 bg-light"
                                  >
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                      <div>
                                        <h6 className="item-name mb-1">
                                          {item.isCombo ? "🔥 Combo: " : "🍕 "}
                                          {item.pizza?.name || "Custom Pizza"}
                                        </h6>
                                        <span className="size-badge">
                                          {item.size}
                                        </span>
                                      </div>
                                      <div className="text-end">
                                        <p className="price mb-0">
                                          ${parseFloat(item.price).toFixed(2)} ×{" "}
                                          {item.quantity}
                                        </p>
                                        <p className="subtotal mb-0">
                                          $
                                          {(
                                            parseFloat(item.price) *
                                            item.quantity
                                          ).toFixed(2)}
                                        </p>
                                      </div>
                                    </div>

                                    {/* Customizations */}
                                    {(item.orderToppings.length > 0 ||
                                      item.orderIngredients.length > 0) && (
                                      <div className="customizations mt-3 pt-2 border-top">
                                        {item.orderToppings.length > 0 && (
                                          <div className="toppings mb-2">
                                            <p className="small mb-1 text-muted">
                                              Added Toppings:
                                            </p>
                                            <div className="topping-tags">
                                              {item.orderToppings.map(
                                                (topping, idx) => (
                                                  <span
                                                    key={idx}
                                                    className="topping-tag"
                                                  >
                                                    {topping.name} ×{" "}
                                                    {topping.quantity}
                                                  </span>
                                                )
                                              )}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Order Summary */}
                            <div className="order-summary mt-4 pt-3 border-top">
                              <div className="row justify-content-end">
                                <div className="col-md-4">
                                  <div className="d-flex justify-content-between mb-2">
                                    <span>Subtotal:</span>
                                    <span>
                                      $
                                      {parseFloat(order.totalAmount).toFixed(2)}
                                    </span>
                                  </div>
                                  <div className="d-flex justify-content-between fw-bold">
                                    <span>Total:</span>
                                    <span className="text-primary">
                                      $
                                      {parseFloat(order.totalAmount).toFixed(2)}
                                    </span>
                                  </div>
                                  <div className="payment-status mt-2 text-end">
                                    <span
                                      className={`payment-badge ${order.paymentStatus.toLowerCase()}`}
                                    >
                                      {order.paymentStatus}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </WellFoodLayout>
  );
};

export default UserPage;
