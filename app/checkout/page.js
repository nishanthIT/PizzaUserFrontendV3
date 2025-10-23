
"use client";
import { useState } from "react";
import WellFoodLayout from "@/layout/WellFoodLayout";
import { useSelector } from "react-redux";
import {
  selectCartItems,
  selectCartTotalPrice,
} from "../../features/cart/cartSlice";
import { useEffect, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PizzaLoader from "@/components/pizzaLoader";
import PostcodeAutocomplete from "@/components/PostcodeAutocomplete";
import SimplePostcodeInput from "@/components/SimplePostcodeInput";
import { calculateDeliveryCharge, validateDeliveryCharge } from "@/services/deliveryService";

const Page = () => {
  const cartItems = useSelector(selectCartItems);
  const totalPrice = useSelector(selectCartTotalPrice);

  // Form states - REORDERED: name first, then address
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [postcode, setPostcode] = useState(""); // Changed from selectedZipcode
  const [postcodeValidation, setPostcodeValidation] = useState({ isValid: false, message: '' });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  
  // Add ref for delivery request cancellation
  const deliveryAbortController = useRef(null);
  const [verified, setVerified] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // New state to track if user is authenticated
  const [isSyncing, setIsSyncing] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Delivery/pickup related states
  const [deliveryMethod, setDeliveryMethod] = useState("delivery");
  const [pickupTime, setPickupTime] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // NEW: Order timing states
  const [orderTiming, setOrderTiming] = useState("asap"); // "asap" or "preorder"
  const [preorderDate, setPreorderDate] = useState("");
  const [preorderTime, setPreorderTime] = useState("");

  // NEW: Delivery charge states
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [canDeliver, setCanDeliver] = useState(true);
  const [deliveryPostcode, setDeliveryPostcode] = useState("");
  const [deliveryZone, setDeliveryZone] = useState("");
  const [deliveryDistance, setDeliveryDistance] = useState(0);

  // Customer notes state
  const [customerNotes, setCustomerNotes] = useState("");

  // Handle postcode validation result
  const handlePostcodeValidation = async (validationResult) => {
    setPostcodeValidation(validationResult);
    if (validationResult.isValid) {
      // Update postcode state with validated postcode
      const validatedPostcode = validationResult.postcode || postcode;
      if (validatedPostcode !== postcode) {
        setPostcode(validatedPostcode);
      }
      
      // Remove the validation success toast - too frequent
      
      // Cancel any existing delivery request
      if (deliveryAbortController.current) {
        deliveryAbortController.current.abort();
      }
      
      // Add a delay to ensure validation is complete and prevent rapid API calls
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Automatically calculate delivery charge when postcode is valid
      let retries = 2;
      let deliveryResult = null;
      
      while (retries > 0 && !deliveryResult) {
        try {
          const validatedPostcode = validationResult.postcode || postcode;
          console.log('Calculating delivery charge for postcode:', validatedPostcode);
          
          // Create new abort controller for this request
          deliveryAbortController.current = new AbortController();
          
          deliveryResult = await calculateDeliveryCharge(validatedPostcode, deliveryAbortController.current.signal);
          break; // Success, exit retry loop
          
        } catch (error) {
          // Ignore aborted requests
          if (error.name === 'AbortError' || error.code === 'ERR_CANCELED') {
            return;
          }
          
          console.warn(`Delivery calculation attempt failed (${3-retries}/2):`, error.message);
          retries--;
          
          if (retries > 0) {
            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, 1000));
          } else {
            // Final retry failed
            throw error;
          }
        }
      }
      
      try {
        
        if (deliveryResult.success) {
          const deliveryInfo = {
            charge: deliveryResult.data.charge,
            canDeliver: deliveryResult.data.canDeliver,
            postcode: validatedPostcode,
            zone: deliveryResult.data.zone,
            distance: deliveryResult.data.distance
          };
          
          handleDeliveryChargeChange(deliveryInfo);
          
          // Remove the delivery charge success toast - too frequent and annoying
        } else {
          // Handle delivery calculation failure
          setDeliveryCharge(0);
          setCanDeliver(false);
          toast.error(`❌ Unable to calculate delivery charge. Please try a different postcode.`, {
            position: "top-right",
            autoClose: 5000,
          });
        }
      } catch (error) {
        // Ignore aborted requests
        if (error.name === 'AbortError' || error.code === 'ERR_CANCELED') {
          return;
        }
        
        console.error('Error calculating delivery charge:', error);
        setDeliveryCharge(0);
        setCanDeliver(false);
        
        // Show user-friendly error message
        toast.error('❌ Unable to calculate delivery charge at the moment. Please try again.', {
          position: "top-right",
          autoClose: 5000,
        });
      } finally {
        deliveryAbortController.current = null;
      }
    } else if (validationResult.message) {
      // Reset delivery charge for invalid postcodes
      setDeliveryCharge(0);
      setCanDeliver(false);
      setDeliveryPostcode("");
      setDeliveryZone("");
      setDeliveryDistance(0);
      
      // Only show error toast for serious validation issues, not for incomplete typing
      if (validationResult.message && !validationResult.message.includes('typing')) {
        toast.error(`❌ ${validationResult.message}`, {
          position: "top-right",
          autoClose: 4000,
        });
      }
    }
  };

  // Handle delivery charge calculation result
  const handleDeliveryChargeChange = (deliveryInfo) => {
    console.log('Delivery charge updated:', deliveryInfo);
    
    setDeliveryCharge(deliveryInfo.charge || 0);
    setCanDeliver(deliveryInfo.canDeliver || false);
    setDeliveryPostcode(deliveryInfo.postcode || "");
    setDeliveryZone(deliveryInfo.zone || "");
    setDeliveryDistance(deliveryInfo.distance || 0);
    
    if (deliveryInfo.error) {
      toast.error(`❌ ${deliveryInfo.error}`, {
        position: "top-right",
        autoClose: 5000,
      });
    }
    // Remove the delivery success toast from handleDeliveryChargeChange - too frequent
  };

  const renderCount = useRef(0);
  useEffect(() => {
    renderCount.current += 1;
    console.log("🔁 Component rendered", renderCount.current, "times");
  }, []);

  // Check if user is already authenticated and auto-fill their info
  useEffect(() => {
    const checkAuthAndFillUserInfo = async () => {
      try {
        console.log("Checking if user is already authenticated...");

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/check-auth`, {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();

          if (data.user) {
            console.log("User is already authenticated:", data.user);

            // Auto-fill user information (name and address only)
            if (data.user.name) {
              setName(data.user.name);
              console.log("Name auto-filled:", data.user.name);
            }
            if (data.user.address && data.user.address !== 'Address not specified') {
              setAddress(data.user.address);

              console.log("Address auto-filled:", data.user.address);
            }

            // Set as authenticated but still need OTP verification for cart sync
            setIsAuthenticated(true);

            console.log("User info auto-filled successfully");
          }
        } else {
          console.log("User not authenticated");
        }
      } catch (error) {
        console.log("Auth check failed:", error);
        // Don't show error to user as this is just a background check
      }
    };

    checkAuthAndFillUserInfo();
  }, []); // Run once on component mount

  // Shipping and tax calculations
  // Calculate totals with dynamic delivery charge
  const deliveryFee = deliveryMethod === "delivery" ? deliveryCharge : 0;
  const taxRate = 0.08; // 8% tax
  const taxAmount = totalPrice;
  const finalTotal = totalPrice + deliveryFee;

  // Generate date options (4 months from now)
  const generateDateOptions = () => {
    const options = [];
    const today = new Date();
    const endDate = new Date();
    endDate.setMonth(today.getMonth() + 4);

    for (let d = new Date(today); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const displayDate = d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
      options.push({ value: dateStr, label: displayDate });
    }
    return options;
  };

  // Generate time options for preorder
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 10; hour <= 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayTime = new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });
        options.push({ value: time, label: displayTime });
      }
    }
    return options;
  };

  const dateOptions = generateDateOptions();
  const timeOptions = generateTimeOptions();

  // Handle send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const cleaned = mobileNumber.replace(/\D/g, "");
      const finalNumber = cleaned.startsWith("") ? cleaned : `${cleaned}`;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mobile: finalNumber }),
      });
      if (!response.ok) throw new Error("Failed to send OTP");

      setOtpSent(true);
      toast.success("OTP sent successfully!");
    } catch (err) {
      console.error(err);
      setError("Please enter a valid UK number");
      toast.error("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Handle verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setIsSyncing(true);
    console.log("clicked otp");
    setError("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobile: mobileNumber.replace(/\D/g, ""),
          otp: otp,
          name: name.trim() || null,
          address: address.trim() || null, // Pass address if provided, otherwise null
        }),
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) throw new Error("Invalid OTP");

      setVerified(true);
      if (data.success === true) {
        if (data.user) {
          if (data.user.name) {
            setName(data.user.name);
          }
          if (data.user.address && data.user.address !== 'Address not specified') {
            setAddress(data.user.address);
          }
        }

        try {
          console.log("Checking auth and syncing cart...");

          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/check-auth`, {
            withCredentials: true,
          });

          if (res.data?.user) {
            console.log("User authenticated:", res.data.user);

            const clearRes = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/api/cart/clear`,
              {},
              { withCredentials: true }
            );
            console.log("Cart cleared on server:", clearRes);

            const syncRes = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/api/cart/sync`,
              { cartItems },
              { withCredentials: true }
            );

            if (data.isNewUser) {
              toast.success("🎉 Registration completed successfully!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
            } else {
              toast.success("🎉 Welcome back! OTP verified successfully!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
            }
          }
        } catch (err) {
          console.error("Auth check failed or cart fetch failed:", err);
          throw err;
        }
      }
    } catch (err) {
      setError("Invalid OTP or cart sync failed");
      setVerified(false);

      toast.error("❌ OTP verification failed", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setLoading(false);
      setIsSyncing(false);
    }
  };

  // Handle place order
  const handlePlaceOrder = async () => {
    if (!verified) return;

    if (deliveryMethod === "delivery" && !address) {
      toast.error("Please enter your delivery address");
      return;
    }

    if (deliveryMethod === "delivery" && (!postcode || !postcodeValidation.isValid)) {
      toast.error("Please enter a valid postcode within our delivery area");
      return;
    }

    if (deliveryMethod === "delivery" && !canDeliver) {
      toast.error("We cannot deliver to this postcode. Please choose collection instead.");
      return;
    }

    if (deliveryMethod === "delivery" && deliveryCharge === 0) {
      toast.error("Please calculate delivery charge first");
      return;
    }

    if (orderTiming === "preorder" && (!preorderDate || !preorderTime)) {
      toast.error("Please select preorder date and time");
      return;
    }

    try {
      setIsProcessing(true);

      // Validate delivery charge on server before proceeding
      if (deliveryMethod === "delivery") {
        console.log("Validating delivery charge on server...");
        try {
          const validationResponse = await validateDeliveryCharge(
            address, 
            deliveryPostcode, 
            deliveryCharge
          );
          
          if (!validationResponse.success || !validationResponse.data.isValid) {
            toast.error("Delivery charge validation failed. Please recalculate delivery charge.");
            setIsProcessing(false);
            return;
          }
          
          console.log("✅ Delivery charge validated successfully");
        } catch (validationError) {
          console.error("Delivery validation error:", validationError);
          toast.error("Unable to validate delivery charge. Please try again.");
          setIsProcessing(false);
          return;
        }
      }

      console.log(
        "Cart items being sent:",
        cartItems.map((item) => ({
          isOtherItem: item.isOtherItem,
          otherItemId: item.otherItemId,
          title: item.title,
          price: item.price,
        }))
      );

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/create-checkout-session`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cartItems,
            finalTotal,
            deliveryFee,
            taxAmount,
            deliveryMethod,
            name,
            address,
            postcode: deliveryMethod === "delivery" ? postcode : "", // Include validated postcode
            deliveryAddress: deliveryMethod === "delivery" ? `${address}, ${postcode}` : address, // Combined address
            pickupTime,
            orderTiming,
            preorderDate,
            preorderTime,
            customerNotes, // Add customer notes to order data
          }),
        }
      );

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Payment initiation failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while processing your order");
    } finally {
      setIsProcessing(false);
    }
  };

  // Generate pickup time options based on store operating hours
  const generatePickupTimeOptions = () => {
    const options = [];
    const now = new Date();
    const today = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    // Define store hours
    let storeOpenHour, storeOpenMinute, storeCloseHour, storeCloseMinute;

    if (today >= 0 && today <= 4) { // Sunday - Thursday
      storeOpenHour = 17;
      storeOpenMinute = 0;
      storeCloseHour = 22;
      storeCloseMinute = 30;
    } else { // Friday - Saturday
      storeOpenHour = 17;
      storeOpenMinute = 0;
      storeCloseHour = 23;
      storeCloseMinute = 0;
    }

    // Create store opening and closing times for today
    const storeOpen = new Date(now);
    storeOpen.setHours(storeOpenHour, storeOpenMinute, 0, 0);

    const storeClose = new Date(now);
    storeClose.setHours(storeCloseHour, storeCloseMinute, 0, 0);

    // Start time is either now (rounded up to next 30min) or store opening, whichever is later
    let startTime = new Date(now);
    const minutes = startTime.getMinutes();
    startTime.setMinutes(minutes + (30 - (minutes % 30)), 0, 0);

    if (startTime < storeOpen) {
      startTime = new Date(storeOpen);
    }

    // Generate 30-minute intervals from start time until store closes
    let currentTime = new Date(startTime);

    while (currentTime < storeClose) {
      const formattedTime = currentTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      options.push(formattedTime);
      currentTime.setMinutes(currentTime.getMinutes() + 30);
    }

    return options;
  };

  const pickupTimeOptions = generatePickupTimeOptions();

  return (
    <WellFoodLayout>
      {isProcessing && <PizzaLoader />}
      <ToastContainer />
      <div className="checkout-form-area py-5 py-md-5">
        <style jsx>{`
          @media (min-width: 992px) {
            .checkout-form-area {
              margin-top: 80px;
            }
          }
          .delivery-option, .timing-option {
            border: 1px solid #dee2e6;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
            transition: all 0.3s ease;
            cursor: pointer;
          }
          .delivery-option.selected, .timing-option.selected {
            border-color: #28a745;
            background-color: rgba(40, 167, 69, 0.1);
            box-shadow: 0 0 0 1px #28a745;
          }
          .delivery-option:hover, .timing-option:hover {
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          }
          .radio-custom {
            margin-right: 10px;
          }
          #customerNotes::placeholder {
            opacity: 0.4 !important;
            color: #999 !important;
          }
        `}</style>
        <div className="container">
          <div className="row">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div className="checkout-form-container p-4 bg-light rounded shadow-sm">
                <h4 className="mb-4">Order Details</h4>

                {/* Name Input - FIRST */}
                <div className="form-group mb-3">
                  <label htmlFor="name" className="mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="form-control"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={verified}
                    required
                  />
                  <small className="text-muted">
                    {!verified && "Enter your name before verifying OTP"}
                  </small>
                </div>

                {/* Address Input - SECOND */}
                <div className="form-group mb-3">
                  <label htmlFor="address" className="mb-2">
                    Address
                  </label>
                  <textarea
                    id="address"
                    className="form-control"
                    placeholder="Enter your complete address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                    required
                  />
                  {isAuthenticated && address && (
                    <small className="text-success mt-1">
                      ✓ Auto-filled from your account
                    </small>
                  )}
                </div>

                {/* Mobile Number with Send OTP button */}
                <div className="form-group mb-3">
                  <label htmlFor="mobile" className="mb-2">
                    Mobile Number
                  </label>
                  <div className="input-group">
                    <input
                      type="tel"
                      id="mobile"
                      className="form-control"
                      placeholder="Enter your mobile number"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      disabled={otpSent && verified}
                      required
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={handleSendOTP}
                      disabled={otpSent && verified}
                    >
                      Send OTP
                    </button>
                  </div>
                  {/* {isAuthenticated && !verified && (
                    <small className="text-info mt-1 d-block">
                      ℹ️ Please verify with OTP to sync your cart and complete order
                    </small>
                  )} */}
                </div>

                {/* OTP Input */}
                {otpSent && !verified && (
                  <div className="form-group mb-3">
                    <label htmlFor="otp" className="mb-2">
                      Enter OTP
                    </label>
                    <div className="input-group">
                      <input
                        type="text"
                        id="otp"
                        className="form-control"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={6}
                      />
                      <button
                        className="btn btn-outline-success"
                        type="button"
                        onClick={handleVerifyOTP}
                      >
                        Verify
                      </button>
                    </div>
                  </div>
                )}

                {/* NEW: Order Timing Selection */}
                <div className="form-group mb-4">
                  <label className="mb-3">Order Timing</label>
                  <div className="row">
                    <div className="col-md-6 mb-3 mb-md-0">
                      <div
                        className={`timing-option ${orderTiming === "asap" ? "selected" : ""
                          }`}
                        onClick={() => setOrderTiming("asap")}
                      >
                        <div className="d-flex align-items-center">
                          <input
                            type="radio"
                            name="orderTiming"
                            id="asapOption"
                            className="radio-custom"
                            checked={orderTiming === "asap"}
                            onChange={() => setOrderTiming("asap")}
                          />
                          <div>
                            <label
                              htmlFor="asapOption"
                              className="mb-0 fw-bold"
                            >
                              ASAP
                            </label>
                            <p className="mb-0 small text-muted">
                              As soon as possible
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div
                        className={`timing-option ${orderTiming === "preorder" ? "selected" : ""
                          }`}
                        onClick={() => setOrderTiming("preorder")}
                      >
                        <div className="d-flex align-items-center">
                          <input
                            type="radio"
                            name="orderTiming"
                            id="preorderOption"
                            className="radio-custom"
                            checked={orderTiming === "preorder"}
                            onChange={() => setOrderTiming("preorder")}
                          />
                          <div>
                            <label
                              htmlFor="preorderOption"
                              className="mb-0 fw-bold"
                            >
                              Pre-order
                            </label>
                            <p className="mb-0 small text-muted">
                              Schedule for later
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preorder Date and Time Selection */}
                {orderTiming === "preorder" && (
                  <div className="form-group mb-4">
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="preorderDate" className="mb-2">
                          Select Date
                        </label>
                        <select
                          id="preorderDate"
                          className="form-select"
                          value={preorderDate}
                          onChange={(e) => setPreorderDate(e.target.value)}
                          required
                        >
                          <option value="">Choose date</option>
                          {dateOptions.map((date) => (
                            <option key={date.value} value={date.value}>
                              {date.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="preorderTime" className="mb-2">
                          Select Time
                        </label>
                        <select
                          id="preorderTime"
                          className="form-select"
                          value={preorderTime}
                          onChange={(e) => setPreorderTime(e.target.value)}
                          required
                        >
                          <option value="">Choose time</option>
                          {timeOptions.map((time) => (
                            <option key={time.value} value={time.value}>
                              {time.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <small className="text-muted">
                      Store hours: 10:00 AM to 10:00 PM
                    </small>
                  </div>
                )}

                {/* Delivery Method Selection */}
                <div className="form-group mb-4">
                  <label className="mb-3">Choose Delivery Method</label>
                  <div className="row">
                    <div className="col-md-6 mb-3 mb-md-0">
                      <div
                        className={`delivery-option ${deliveryMethod === "delivery" ? "selected" : ""
                          }`}
                        onClick={() => setDeliveryMethod("delivery")}
                      >
                        <div className="d-flex align-items-center">
                          <input
                            type="radio"
                            name="deliveryMethod"
                            id="deliveryOption"
                            className="radio-custom"
                            checked={deliveryMethod === "delivery"}
                            onChange={() => setDeliveryMethod("delivery")}
                          />
                          <div>
                            <label
                              htmlFor="deliveryOption"
                              className="mb-0 fw-bold"
                            >
                              Home Delivery
                            </label>
                            <p className="mb-0 small text-muted">
                              {deliveryCharge > 0 ? `£${deliveryCharge.toFixed(2)} delivery fee` : 'Enter postcode below to calculate delivery fee'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div
                        className={`delivery-option ${deliveryMethod === "pickup" ? "selected" : ""
                          }`}
                        onClick={() => setDeliveryMethod("pickup")}
                      >
                        <div className="d-flex align-items-center">
                          <input
                            type="radio"
                            name="deliveryMethod"
                            id="pickupOption"
                            className="radio-custom"
                            checked={deliveryMethod === "pickup"}
                            onChange={() => setDeliveryMethod("pickup")}
                          />
                          <div>
                            <label
                              htmlFor="pickupOption"
                              className="mb-0 fw-bold"
                            >
                              Store Pickup
                            </label>
                            <p className="mb-0 small text-muted">
                              No additional fee
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Conditional fields based on delivery method */}
                {deliveryMethod === "delivery" && (
                  <div className="form-group mb-3">
                    <label htmlFor="postcode" className="mb-2">
                      Delivery Postcode <span className="text-danger">*</span>
                    </label>
                    <PostcodeAutocomplete
                      value={postcode}
                      onChange={setPostcode}
                      onValidationResult={handlePostcodeValidation}
                      placeholder="Start typing your UK postcode (e.g., SW1A 1AA)"
                      disabled={false}
                    />
                    <small className="text-muted mt-1 d-block">
                      We deliver up to 4 miles from our restaurant (274 Lower Addiscombe Road, CR0 7AE)
                    </small>
                    
                    {/* Delivery Charge Display */}
                    {deliveryCharge > 0 && canDeliver && (
                      <div className="alert alert-success mt-3 mb-0">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <strong>✅ Delivery Available</strong>
                            <br />
                            <small className="text-muted">
                              {deliveryZone && `${deliveryZone} • `}
                              {deliveryDistance > 0 && `${deliveryDistance.toFixed(1)} miles away`}
                            </small>
                          </div>
                          <div className="text-end">
                            <h5 className="mb-0 text-success">£{deliveryCharge.toFixed(2)}</h5>
                            <small className="text-muted">Delivery Fee</small>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {deliveryCharge === 0 && !canDeliver && postcode && postcodeValidation.isValid === false && (
                      <div className="alert alert-danger mt-3 mb-0">
                        <strong>❌ Delivery Not Available</strong>
                        <br />
                        <small>We cannot deliver to this postcode. Please choose store pickup instead.</small>
                      </div>
                    )}
                  </div>
                )}

                {deliveryMethod === "pickup" && orderTiming === "asap" && (
                  <div className="form-group mb-3">
                    <label htmlFor="pickupTime" className="mb-2">
                      Select Pickup Time
                    </label>
                    <select
                      id="pickupTime"
                      className="form-select"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      required
                    >
                      <option value="">
                        Choose when you'll pick up your order
                      </option>
                      {pickupTimeOptions.map((time, index) => (
                        <option key={index} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                    <small className="text-muted mt-2 d-block">
                      Sunday - Thursday: 5:00 PM - 10:30 PM | Friday - Saturday: 5:00 PM - 11:00 PM
                    </small>
                  </div>
                )}

                {/* Customer Notes - Optional */}
                <div className="form-group mb-4">
                  <label htmlFor="customerNotes" className="mb-2">
                    Special Instructions <span className="text-muted">(Optional)</span>
                  </label>
                  <textarea
                    id="customerNotes"
                    className="form-control"
                    placeholder="Any special requests or delivery instructions? (e.g., ring doorbell, leave at door, allergies, etc.)"
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    rows={3}
                    maxLength={500}
                  />
                  <small className="text-muted mt-1 d-block">
                    {customerNotes.length}/500 characters
                  </small>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="cart-summary p-4 bg-light rounded shadow-sm">
                <h4 className="mb-4">Order Summary</h4>

                {cartItems.length === 0 ? (
                  <div className="text-center py-4">
                    <p>Your cart is empty</p>
                  </div>
                ) : (
                  <>
                    <div
                      className="cart-items mb-4"
                      style={{ maxHeight: "300px", overflowY: "auto" }}
                    >
                      {cartItems.map((item, index) => (
                        <div
                          key={index}
                          className="cart-item d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom"
                        >
                          <div>
                            <h6 className="mb-1">{item.title|| item.name}</h6>
                            <p className="text-muted small mb-0">
                                 {(item.isMealDeal || (item.type === 'pizza' && item.toppings)) && item.size && `Size: ${item.size}`}
                              {item.quantity > 1 && ` × ${item.quantity}`}
                            </p>
                          </div>
                          <div className="text-end">
                            <p className="mb-0 fw-bold">
                              £{Number(item.price).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="cart-totals">
                      <div className="d-flex justify-content-between mb-2">
                        <span>Subtotal</span>
                        <span>£{Number(totalPrice).toFixed(2)}</span>
                      </div>
                      {deliveryMethod === "delivery" && (
                        <div className="d-flex justify-content-between mb-2">
                          <span>Delivery Fee</span>
                          <span>£{deliveryFee.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="d-flex justify-content-between border-top pt-3 mb-4">
                        <span className="fw-bold">Total</span>
                        <span className="fw-bold">
                          £{finalTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="theme-btn w-100"
                      disabled={
                        !verified ||
                        !name ||
                        !address ||
                        (deliveryMethod === "delivery" && (!postcode || !postcodeValidation.isValid)) ||
                        (deliveryMethod === "pickup" && orderTiming === "asap" && !pickupTime) ||
                        (orderTiming === "preorder" && (!preorderDate || !preorderTime)) ||
                        isSyncing ||
                        isProcessing
                      }
                      onClick={handlePlaceOrder}
                    >
                      {isProcessing ? (
                        "Processing Order..."
                      ) : isSyncing ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Syncing Cart...
                        </>
                      ) : verified ? (
                        <>
                          Place Order
                          <i className="fas fa-angle-double-right ms-2"></i>
                        </>
                      ) : (
                        "Verify OTP to Continue"
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </WellFoodLayout>
  );
};

export default Page;