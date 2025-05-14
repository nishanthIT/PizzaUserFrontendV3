"use client";
import { useState } from 'react';
import WellFoodLayout from "@/layout/WellFoodLayout";
import Link from "next/link";
// import { useDispatch } from "react-redux";
// import { setUser } from "@/store/auth/authSlice"; // adjust path

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, selectAuth } from "@/features/auth/authslice"; // adjust path
import UserPage from '@/components/custom/user';
import axios from 'axios';


import {
  selectCartItems,
  selectCartTotalPrice,
  selectCartTotalQuantity,
  incrementQuantity,
  decrementQuantity,
  removeItem,
  clearCart,
  setCart
} from "../../features/cart/cartSlice";


const LoginPage = () => {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const [authenticatedUser, setAuthenticatedUser] = useState(null); // Add this
   const cartItems = useSelector(selectCartItems) || []; // Default to empty array

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/check-auth', {
          credentials: 'include',
        });
        if (!res.ok) return;
  
        const data = await res.json();
        if (data.isAuthenticated) {
          dispatch(setUser(data.user));
          setAuthenticatedUser(data.user); // Track user locally



      const checkAuthAndSyncCart = async () => {
      try {
        console.log("Checking auth and syncing cart...");
        const res = await axios.get("http://localhost:3000/api/check-auth", { withCredentials: true });
        
         if (res.data?.user) {
           const clearRes = await axios.post(
        "http://localhost:3000/api/cart/clear",
        {},
        { withCredentials: true }
      );
          const syncRes = await axios.post(
            "http://localhost:3000/api/cart/sync",
            { cartItems },
            { withCredentials: true }
          );
          console.log("Cart synced with server:", syncRes);
         // dispatch(setCart(syncRes.data.cartItems)); // backend will return full merged cart
          console.log("Cart synced with server");
        }

       
      } catch (err) {
        console.error("Auth check failed or cart fetch failed:", err);
      }
    };

    checkAuthAndSyncCart();
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      }
    };
  
    checkLogin();
  }, []);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Basic cleaning for UK numbers
      const cleaned = mobile.replace(/\D/g, '');
      const finalNumber = cleaned.startsWith('') ? cleaned : `${cleaned}`;
      
      const response = await fetch('http://localhost:3000/api/otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile: finalNumber }),
      });
      if (!response.ok) throw new Error('Failed to send OTP');
      
      setShowOtpScreen(true);
    } catch (err) {
        console.error(err);
        console.log("hi i am error")
      setError('Please enter a valid UK number');
    } finally {
      setLoading(false);
    }
  };

//   const handleVerifyOtp = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       const response = await fetch('http://localhost:3000/api/verify-otp', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           mobile: mobile.replace(/\D/g, ''),
//           otp: otp
//         }),
//       });

//       if (!response.ok) throw new Error('Invalid OTP');
//       console.log('Verified successfully!');
      
//     } catch (err) {
//       setError('Invalid OTP entered');
//     } finally {
//       setLoading(false);
//     }
//   };
const handleVerifyOtp = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const response = await fetch('http://localhost:3000/api/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mobile: mobile.replace(/\D/g, ''),
        otp: otp
      }),
      credentials: 'include'
    });

    if (!response.ok) throw new Error('Invalid OTP');
    
    const data = await response.json();

    // ✅ Set user globally
    dispatch(setUser(data.user)); // assuming { user } is returned from backend
    setAuthenticatedUser(data.user); // After dispatch


      console.log("Response from OTP API:", response);
if(data.success === true){
  console.log("hitted login true")
    const checkAuthAndSyncCart = async () => {
      try {
        console.log("Checking auth and syncing cart...");
        const res = await axios.get("http://localhost:3000/api/check-auth", { withCredentials: true });
        
         if (res.data?.user) {

          const clearRes = await axios.post(
                 "http://localhost:3000/api/cart/clear",
                 {},
                 { withCredentials: true }
               );

          const syncRes = await axios.post(
            "http://localhost:3000/api/cart/sync",
            { cartItems },
            { withCredentials: true }
          );
          console.log("Cart synced with server:", syncRes);
         dispatch(setCart(syncRes.data.cartItems)); // backend will return full merged cart
          console.log("Cart synced with server");
        }

       
      } catch (err) {
        console.error("Auth check failed or cart fetch failed:", err);
      }
    };

    checkAuthAndSyncCart();

      }




    console.log('Login successful:', data);
  } catch (err) {
    setError('Invalid OTP entered');
  } finally {
    setLoading(false);
  }
};
if (authenticatedUser) {
  return <UserPage user={authenticatedUser} />

}

  return (
    <WellFoodLayout>
      <section className="login-area py-130 rel z-1">
        <div className="container"> 
          <div className="login-container">
            <div className="row justify-content-center">
              <div className="col-lg-6 col-md-8">
                <div className="auth-card bg-white p-40 rounded-10">
                  <h3 className="mb-25 text-center">
                    {showOtpScreen ? 'Enter OTP Sent' : 'UK Mobile Login'}
                  </h3>
                  
                  <form onSubmit={showOtpScreen ? handleVerifyOtp : handleSendOtp}>
                    {!showOtpScreen ? (
                      <div className="form-group">
                        <label>UK Mobile Number</label>
                        <input
                          type="tel"
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value)}
                          className="form-control"
                          placeholder="+447911123456 or 07911123456"
                          required
                        />
                        <small className="form-text text-muted">
                          We'll send a 6-digit code
                        </small>
                      </div>
                    ) : (
                      <div className="form-group">
                        <label>6-digit Code</label>
                        <input
                          type="tel"
                          maxLength="6"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                          className="form-control text-center"
                          placeholder="------"
                          required
                        />
                      </div>
                    )}

                    {error && <div className="alert alert-danger mt-20">{error}</div>}

                    <div className="mt-30 text-center">
                      <button
                        type="submit"
                        className="theme-btn w-100"
                        disabled={loading}
                      >
                        {loading ? (
                          <span>Processing...</span>
                        ) : showOtpScreen ? (
                          <>Verify Now <i className="fas fa-angle-double-right"/></>
                        ) : (
                          <>Get OTP <i className="fas fa-angle-double-right"/></>
                        )}
                      </button>
                    </div>

                    {showOtpScreen && (
                      <div className="mt-20 text-center">
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          className="text-primary btn btn-link"
                        >
                          Resend Code
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </WellFoodLayout>
  );
};

export default LoginPage;