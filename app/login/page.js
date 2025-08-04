// "use client";
// import { useState } from 'react';
// import WellFoodLayout from "@/layout/WellFoodLayout";
// import Link from "next/link";
// // import { useDispatch } from "react-redux";
// // import { setUser } from "@/store/auth/authSlice"; // adjust path

// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { setUser, selectAuth } from "@/features/auth/authslice"; // adjust path
// import UserPage from '@/components/custom/user';
// import axios from 'axios';


// import {
//   selectCartItems,
//   selectCartTotalPrice,
//   selectCartTotalQuantity,
//   incrementQuantity,
//   decrementQuantity,
//   removeItem,
//   clearCart,
//   setCart
// } from "../../features/cart/cartSlice";


// const LoginPage = () => {
//   const [mobile, setMobile] = useState('');
//   const [otp, setOtp] = useState('');
//   const [showOtpScreen, setShowOtpScreen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const dispatch = useDispatch();
//   const [authenticatedUser, setAuthenticatedUser] = useState(null); // Add this
//    const cartItems = useSelector(selectCartItems) || []; // Default to empty array

//   useEffect(() => {
//     const checkLogin = async () => {
//       try {
//         const res = await fetch('https://backend.addiscombepizza.co.uk/api/check-auth', {
//           credentials: 'include',
//         });
//         if (!res.ok) return;
  
//         const data = await res.json();
//         if (data.isAuthenticated) {
//           dispatch(setUser(data.user));
//           setAuthenticatedUser(data.user); // Track user locally



//       const checkAuthAndSyncCart = async () => {
//       try {
//         console.log("Checking auth and syncing cart...");
//         const res = await axios.get("https://backend.addiscombepizza.co.uk/api/check-auth", { withCredentials: true });
        
//          if (res.data?.user) {
//            const clearRes = await axios.post(
//         "https://backend.addiscombepizza.co.uk/api/cart/clear",
//         {},
//         { withCredentials: true }
//       );
//           const syncRes = await axios.post(
//             "https://backend.addiscombepizza.co.uk/api/cart/sync",
//             { cartItems },
//             { withCredentials: true }
//           );
//           console.log("Cart synced with server:", syncRes);
//          // dispatch(setCart(syncRes.data.cartItems)); // backend will return full merged cart
//           console.log("Cart synced with server");
//         }

       
//       } catch (err) {
//         console.error("Auth check failed or cart fetch failed:", err);
//       }
//     };

//     checkAuthAndSyncCart();
//         }
//       } catch (err) {
//         console.error("Auth check failed:", err);
//       }
//     };
  
//     checkLogin();
//   }, []);

//   const handleSendOtp = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       // Basic cleaning for UK numbers
//       const cleaned = mobile.replace(/\D/g, '');
//       const finalNumber = cleaned.startsWith('') ? cleaned : `${cleaned}`;
      
//       const response = await fetch('https://backend.addiscombepizza.co.uk/api/otp', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ mobile: finalNumber }),
//       });
//       if (!response.ok) throw new Error('Failed to send OTP');
      
//       setShowOtpScreen(true);
//     } catch (err) {
//         console.error(err);
//         console.log("hi i am error")
//       setError('Please enter a valid UK number');
//     } finally {
//       setLoading(false);
//     }
//   };

// //   const handleVerifyOtp = async (e) => {
// //     e.preventDefault();
// //     setLoading(true);
// //     setError('');

// //     try {
// //       const response = await fetch('https://backend.addiscombepizza.co.uk/api/verify-otp', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify({
// //           mobile: mobile.replace(/\D/g, ''),
// //           otp: otp
// //         }),
// //       });

// //       if (!response.ok) throw new Error('Invalid OTP');
// //       console.log('Verified successfully!');
      
// //     } catch (err) {
// //       setError('Invalid OTP entered');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };
// const handleVerifyOtp = async (e) => {
//   e.preventDefault();
//   setLoading(true);
//   setError('');

//   try {
//     const response = await fetch('https://backend.addiscombepizza.co.uk/api/verify-otp', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         mobile: mobile.replace(/\D/g, ''),
//         otp: otp
//       }),
//       credentials: 'include'
//     });

//     if (!response.ok) throw new Error('Invalid OTP');
    
//     const data = await response.json();

//     // ✅ Set user globally
//     dispatch(setUser(data.user)); // assuming { user } is returned from backend
//     setAuthenticatedUser(data.user); // After dispatch


//       console.log("Response from OTP API:", response);
// if(data.success === true){
//   console.log("hitted login true")
//     const checkAuthAndSyncCart = async () => {
//       try {
//         console.log("Checking auth and syncing cart...");
//         const res = await axios.get("https://backend.addiscombepizza.co.uk/api/check-auth", { withCredentials: true });
        
//          if (res.data?.user) {

//           const clearRes = await axios.post(
//                  "https://backend.addiscombepizza.co.uk/api/cart/clear",
//                  {},
//                  { withCredentials: true }
//                );

//           const syncRes = await axios.post(
//             "https://backend.addiscombepizza.co.uk/api/cart/sync",
//             { cartItems },
//             { withCredentials: true }
//           );
//           console.log("Cart synced with server:", syncRes);
//          dispatch(setCart(syncRes.data.cartItems)); // backend will return full merged cart
//           console.log("Cart synced with server");
//         }

       
//       } catch (err) {
//         console.error("Auth check failed or cart fetch failed:", err);
//       }
//     };

//     checkAuthAndSyncCart();

//       }




//     console.log('Login successful:', data);
//   } catch (err) {
//     setError('Invalid OTP entered');
//   } finally {
//     setLoading(false);
//   }
// };
// if (authenticatedUser) {
//   return <UserPage user={authenticatedUser} />

// }

//   return (
//     <WellFoodLayout>
//       <section className="login-area py-130 rel z-1">
//         <div className="container"> 
//           <div className="login-container">
//             <div className="row justify-content-center">
//               <div className="col-lg-6 col-md-8">
//                 <div className="auth-card bg-white p-40 rounded-10">
//                   <h3 className="mb-25 text-center">
//                     {showOtpScreen ? 'Enter OTP Sent' : 'UK Mobile Login'}
//                   </h3>
                  
//                   <form onSubmit={showOtpScreen ? handleVerifyOtp : handleSendOtp}>
//                     {!showOtpScreen ? (
//                       <div className="form-group">
//                         <label>UK Mobile Number</label>
//                         <input
//                           type="tel"
//                           value={mobile}
//                           onChange={(e) => setMobile(e.target.value)}
//                           className="form-control"
//                           placeholder="+447911123456 or 07911123456"
//                           required
//                         />
//                         <small className="form-text text-muted">
//                           We'll send a 6-digit code
//                         </small>
//                       </div>
//                     ) : (
//                       <div className="form-group">
//                         <label>6-digit Code</label>
//                         <input
//                           type="tel"
//                           maxLength="6"
//                           value={otp}
//                           onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
//                           className="form-control text-center"
//                           placeholder="------"
//                           required
//                         />
//                       </div>
//                     )}

//                     {error && <div className="alert alert-danger mt-20">{error}</div>}

//                     <div className="mt-30 text-center">
//                       <button
//                         type="submit"
//                         className="theme-btn w-100"
//                         disabled={loading}
//                       >
//                         {loading ? (
//                           <span>Processing...</span>
//                         ) : showOtpScreen ? (
//                           <>Verify Now <i className="fas fa-angle-double-right"/></>
//                         ) : (
//                           <>Get OTP <i className="fas fa-angle-double-right"/></>
//                         )}
//                       </button>
//                     </div>

//                     {showOtpScreen && (
//                       <div className="mt-20 text-center">
//                         <button
//                           type="button"
//                           onClick={handleSendOtp}
//                           className="text-primary btn btn-link"
//                         >
//                           Resend Code
//                         </button>
//                       </div>
//                     )}
//                   </form>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </WellFoodLayout>
//   );
// };

// export default LoginPage;








// "use client";
// import { useState, useEffect } from 'react';
// import WellFoodLayout from "@/layout/WellFoodLayout";
// import Link from "next/link";
// import { useDispatch, useSelector } from "react-redux";
// import { setUser, selectAuth } from "@/features/auth/authslice";
// import UserPage from '@/components/custom/user';
// import axios from 'axios';
// import { useSearchParams } from 'next/navigation';

// // Import cart selectors and actions
// import {
//   selectCartItems,
//   selectCartTotalPrice,
//   selectCartTotalQuantity,
//   incrementQuantity,
//   decrementQuantity,
//   removeItem,
//   clearCart,
//   setCart
// } from "../../features/cart/cartSlice";
// import PizzaLoader from '@/components/pizzaLoader';

// const LoginPage = () => {
//   const [mobile, setMobile] = useState('');
//   const [otp, setOtp] = useState('');
//   const [showOtpScreen, setShowOtpScreen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [authenticatedUser, setAuthenticatedUser] = useState(null);
//   const [paymentSuccess, setPaymentSuccess] = useState(false);
//   const dispatch = useDispatch();
//   const cartItems = useSelector(selectCartItems) || []; 
//   const searchParams = useSearchParams();
//   const [lol,setlol]= useState(true)
  
//   // Check for successful payment on component mount
//   useEffect(() => {
//     const sessionId = searchParams.get('session_id');
    
//     if (sessionId) {
//       // Payment was successful, clear cart and show success message
//       dispatch(clearCart());
      
//       // Clear the cart on the server side as well
//       axios.post(
//         'https://backend.addiscombepizza.co.uk/api/cart/clear',
//         {},
//         { withCredentials: true }
//       ).catch(err => console.error("Error clearing cart:", err));
      
//       // Show success animation
//       setPaymentSuccess(true);
//     }
//   }, [searchParams, dispatch]);

//   useEffect(() => {
//     const checkLogin = async () => {
//      // setisLoading(true);
//       try {
//         const res = await fetch('https://backend.addiscombepizza.co.uk/api/check-auth', {
//           credentials: 'include',
//         });
//         if (!res.ok) return;
//         setlol(false)
       
  
//         const data = await res.json();
//         if (data.isAuthenticated) {
//           dispatch(setUser(data.user));
//           setAuthenticatedUser(data.user); // Track user locally

//           const checkAuthAndSyncCart = async () => {
//             try {
//               console.log("Checking auth and syncing cart...");
//               const res = await axios.get("https://backend.addiscombepizza.co.uk/api/check-auth", { withCredentials: true });
              
//               if (res.data?.user) {
//                 const clearRes = await axios.post(
//                   "https://backend.addiscombepizza.co.uk/api/cart/clear",
//                   {},
//                   { withCredentials: true }
//                 );
//                 const syncRes = await axios.post(
//                   "https://backend.addiscombepizza.co.uk/api/cart/sync",
//                   { cartItems },
//                   { withCredentials: true }
//                 );
//                 console.log("Cart synced with server:", syncRes);
//                 // dispatch(setCart(syncRes.data.cartItems)); // backend will return full merged cart
//                 console.log("Cart synced with server");
//               }
//             } catch (err) {
//               console.error("Auth check failed or cart fetch failed:", err);
//             }
//           };

//           checkAuthAndSyncCart();
//         }
//       } catch (err) {
//         console.error("Auth check failed:", err);
//       }
//     };
  
//     checkLogin();
//   }, [dispatch]);

//   const handleSendOtp = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       // Basic cleaning for UK numbers
//       const cleaned = mobile.replace(/\D/g, '');
//       const finalNumber = cleaned.startsWith('') ? cleaned : `${cleaned}`;
      
//       const response = await fetch('https://backend.addiscombepizza.co.uk/api/otp', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ mobile: finalNumber }),
//       });
//       if (!response.ok) throw new Error('Failed to send OTP');
      
//       setShowOtpScreen(true);
//     } catch (err) {
//         console.error(err);
//         console.log("hi i am error")
//       setError('Please enter a valid UK number');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVerifyOtp = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       const response = await fetch('https://backend.addiscombepizza.co.uk/api/verify-otp', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           mobile: mobile.replace(/\D/g, ''),
//           otp: otp
//         }),
//         credentials: 'include'
//       });

//       if (!response.ok) throw new Error('Invalid OTP');
      
//       const data = await response.json();

//       // ✅ Set user globally
//       dispatch(setUser(data.user)); // assuming { user } is returned from backend
//       setAuthenticatedUser(data.user); // After dispatch

//       console.log("Response from OTP API:", response);
//       if(data.success === true){
//         console.log("hitted login true")
//         const checkAuthAndSyncCart = async () => {
//           try {
//             console.log("Checking auth and syncing cart...");
//             const res = await axios.get("https://backend.addiscombepizza.co.uk/api/check-auth", { withCredentials: true });
            
//             if (res.data?.user) {
//               const clearRes = await axios.post(
//                 "https://backend.addiscombepizza.co.uk/api/cart/clear",
//                 {},
//                 { withCredentials: true }
//               );

//               const syncRes = await axios.post(
//                 "https://backend.addiscombepizza.co.uk/api/cart/sync",
//                 { cartItems },
//                 { withCredentials: true }
//               );
//               console.log("Cart synced with server:", syncRes);
//               dispatch(setCart(syncRes.data.cartItems)); // backend will return full merged cart
//               console.log("Cart synced with server");
//             }
//           } catch (err) {
//             console.error("Auth check failed or cart fetch failed:", err);
//           }
//         };

//         checkAuthAndSyncCart();
//       }

//       console.log('Login successful:', data);
//     } catch (err) {
//       setError('Invalid OTP entered');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (paymentSuccess) {
//     return (
//       <WellFoodLayout>
      
//         <div className="py-130 text-center">
//           <div className="container">
//             <div className="row justify-content-center">
//               <div className="col-lg-6">
//                 <div className="success-container bg-white p-40 rounded-10 shadow">
//                   <div className="checkmark-circle">
//                     <div className="checkmark-circle-bg">
//                       <div className="checkmark draw"></div>
//                     </div>
//                   </div>
//                   <h2 className="mt-20 text-success">Payment Successful!</h2>
//                   <p className="mb-30">Your order has been placed successfully.</p>
//                   <Link href="/login" className="theme-btn" onClick={() => setPaymentSuccess(false)}>
//                     View Your Orders
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <style jsx>{`
//           .checkmark-circle {
//             width: 150px;
//             height: 150px;
//             position: relative;
//             display: inline-block;
//             margin: 20px auto;
//           }
//           .checkmark-circle-bg {
//             width: 150px;
//             height: 150px;
//             border-radius: 50%;
//             background-color: #f6fdf9;
//             position: absolute;
//           }
//           .checkmark {
//             transform: rotate(45deg);
//             height: 75px;
//             width: 35px;
//             border-bottom: 10px solid #4BB543;
//             border-right: 10px solid #4BB543;
//             position: absolute;
//             top: 30px;
//             left: 55px;
//           }
//           .draw {
//             animation-name: draw-check;
//             animation-duration: 0.8s;
//             animation-timing-function: ease;
//             animation-fill-mode: forwards;
//             animation-delay: 0.2s;
//             stroke-dasharray: 100;
//             stroke-dashoffset: 100;
//             opacity: 0;
//           }
//           @keyframes draw-check {
//             0% { opacity: 0; }
//             100% { opacity: 1; }
//           }
//         `}</style>
//       </WellFoodLayout>
//     );
//   }

//   if (authenticatedUser) {
//     return <UserPage user={authenticatedUser} />
//   }

//   return (
//     <WellFoodLayout>
//       <section className="login-area py-130 rel z-1">
//         <div className="container"> 
//           <div className="login-container">
//             <div className="row justify-content-center">
//               <div className="col-lg-6 col-md-8">
//                 <div className="auth-card bg-white p-40 rounded-10">
//                   <h3 className="mb-25 text-center">
//                     {showOtpScreen ? 'Enter OTP Sent' : 'UK Mobile Login'}
//                   </h3>
                  
//                   <form onSubmit={showOtpScreen ? handleVerifyOtp : handleSendOtp}>
//                     {!showOtpScreen ? (
//                       <div className="form-group">
//                         <label>UK Mobile Number</label>
//                         <input
//                           type="tel"
//                           value={mobile}
//                           onChange={(e) => setMobile(e.target.value)}
//                           className="form-control"
//                           placeholder="+447911123456 or 07911123456"
//                           required
//                         />
//                         <small className="form-text text-muted">
//                           We'll send a 6-digit code
//                         </small>
//                       </div>
//                     ) : (
//                       <div className="form-group">
//                         <label>6-digit Code</label>
//                         <input
//                           type="tel"
//                           maxLength="6"
//                           value={otp}
//                           onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
//                           className="form-control text-center"
//                           placeholder="------"
//                           required
//                         />
//                       </div>
//                     )}

//                     {error && <div className="alert alert-danger mt-20">{error}</div>}

//                     <div className="mt-30 text-center">
//                       <button
//                         type="submit"
//                         className="theme-btn w-100"
//                         disabled={loading}
//                       >
//                         {loading ? (
//                           <span>Processing...</span>
//                         ) : showOtpScreen ? (
//                           <>Verify Now <i className="fas fa-angle-double-right"/></>
//                         ) : (
//                           <>Get OTP <i className="fas fa-angle-double-right"/></>
//                         )}
//                       </button>
//                     </div>

//                     {showOtpScreen && (
//                       <div className="mt-20 text-center">
//                         <button
//                           type="button"
//                           onClick={handleSendOtp}
//                           className="text-primary btn btn-link"
//                         >
//                           Resend Code
//                         </button>
//                       </div>
//                     )}
//                   </form>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </WellFoodLayout>
//   );
// };

// export default LoginPage;









"use client";
import { useState, useEffect } from 'react';
import WellFoodLayout from "@/layout/WellFoodLayout";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { setUser, selectAuth } from "@/features/auth/authslice";
import UserPage from '@/components/custom/user';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';

// Import cart selectors and actions
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
import PizzaLoader from '@/components/pizzaLoader';

const LoginPage = () => {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  // New user registration fields
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: '',
    address: ''
  });
  
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems) || []; 
  const searchParams = useSearchParams();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  // Check for successful payment on component mount
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (sessionId) {
      dispatch(clearCart());
      
      axios.post(
        'https://backend.addiscombepizza.co.uk/api/cart/clear',
        {},
        { withCredentials: true }
      ).catch(err => console.error("Error clearing cart:", err));
      
      setPaymentSuccess(true);
    }
  }, [searchParams, dispatch]);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch('https://backend.addiscombepizza.co.uk/api/check-auth', {
          credentials: 'include',
        });
        
        if (res.ok) {
          const data = await res.json();
          if (data.isAuthenticated) {
            dispatch(setUser(data.user));
            setAuthenticatedUser(data.user);
          }
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      } finally {
        setIsCheckingAuth(false);
      }
    };
  
    checkLogin();
  }, [dispatch]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const cleaned = mobile.replace(/\D/g, '');
      const finalNumber = cleaned.startsWith('') ? cleaned : `${cleaned}`;
      
      const response = await fetch('https://backend.addiscombepizza.co.uk/api/otp', {
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
      setError('Please enter a valid UK number');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://backend.addiscombepizza.co.uk/api/verify-otp', {
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

      // Check if this is a new user
      if (data.isNewUser) {
        setShowRegistrationForm(true);
        setLoading(false);
        return;
      }

      // Existing user flow - no cart sync here
      dispatch(setUser(data.user));
      setAuthenticatedUser(data.user);

      console.log('Login successful:', data);
    } catch (err) {
      setError('Invalid OTP entered');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteRegistration = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://backend.addiscombepizza.co.uk/api/complete-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobile: mobile.replace(/\D/g, ''),
          name: newUserData.name,
          address: newUserData.address
        }),
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Registration failed');
      
      const data = await response.json();

      dispatch(setUser(data.user));
      setAuthenticatedUser(data.user);

      console.log('Registration completed:', data);
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (paymentSuccess) {
    return (
      <WellFoodLayout>
        <div className="py-130 text-center">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-6">
                <div className="success-container bg-white p-40 rounded-10 shadow">
                  <div className="checkmark-circle">
                    <div className="checkmark-circle-bg">
                      <div className="checkmark draw"></div>
                    </div>
                  </div>
                  <h2 className="mt-20 text-success">Payment Successful!</h2>
                  <p className="mb-30">Your order has been placed successfully.</p>
                  <Link href="/login" className="theme-btn" onClick={() => setPaymentSuccess(false)}>
                    View Your Orders
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <style jsx>{`
          .checkmark-circle {
            width: 150px;
            height: 150px;
            position: relative;
            display: inline-block;
            margin: 20px auto;
          }
          .checkmark-circle-bg {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            background-color: #f6fdf9;
            position: absolute;
          }
          .checkmark {
            transform: rotate(45deg);
            height: 75px;
            width: 35px;
            border-bottom: 10px solid #4BB543;
            border-right: 10px solid #4BB543;
            position: absolute;
            top: 30px;
            left: 55px;
          }
          .draw {
            animation-name: draw-check;
            animation-duration: 0.8s;
            animation-timing-function: ease;
            animation-fill-mode: forwards;
            animation-delay: 0.2s;
            stroke-dasharray: 100;
            stroke-dashoffset: 100;
            opacity: 0;
          }
          @keyframes draw-check {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
        `}</style>
      </WellFoodLayout>
    );
  }

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <WellFoodLayout>
        <div className="py-130 text-center">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-6">
                <div className="bg-white p-40 rounded-10 shadow">
                  <PizzaLoader />
                  <p className="mt-3">Checking your login status...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </WellFoodLayout>
    );
  }

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
                    {showRegistrationForm ? 'Complete Your Profile' : 
                     showOtpScreen ? 'Enter OTP Sent' : 'UK Mobile Login'}
                  </h3>
                  
                  {showRegistrationForm ? (
                    <form onSubmit={handleCompleteRegistration}>
                      <div className="form-group mb-3">
                        <label>Full Name</label>
                        <input
                          type="text"
                          value={newUserData.name}
                          onChange={(e) => setNewUserData({...newUserData, name: e.target.value})}
                          className="form-control"
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      
                      <div className="form-group mb-3">
                        <label>Address</label>
                        <textarea
                          value={newUserData.address}
                          onChange={(e) => setNewUserData({...newUserData, address: e.target.value})}
                          className="form-control"
                          placeholder="Enter your complete address"
                          rows={3}
                          required
                        />
                      </div>

                      {error && <div className="alert alert-danger mt-20">{error}</div>}

                      <div className="mt-30 text-center">
                        <button
                          type="submit"
                          className="theme-btn w-100"
                          disabled={loading}
                        >
                          {loading ? (
                            <span>Processing...</span>
                          ) : (
                            <>Complete Registration <i className="fas fa-angle-double-right"/></>
                          )}
                        </button>
                      </div>
                    </form>
                  ) : (
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
                  )}
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