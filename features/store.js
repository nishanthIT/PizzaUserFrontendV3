// // // store.js
// // import { configureStore } from "@reduxjs/toolkit";
// // import cartReducer from "./cart/cartSlice"; // Adjust the path if necessary

// // export const store = configureStore({
// //   reducer: {
// //     cart: cartReducer,
// //   },
// // });
// import { configureStore } from "@reduxjs/toolkit";
// import { persistStore, persistReducer } from "redux-persist";
// import storage from "redux-persist/lib/storage"; // Defaults to localStorage for web
// import cartReducer from "./cart/cartSlice"; // Adjust the path if necessary

// // Configuration for redux-persist
// const persistConfig = {
//   key: "root", // The key in localStorage where the state will be stored
//   storage, // Use localStorage as the default storage
// };

// // Wrap the cart reducer with persistReducer
// const persistedReducer = persistReducer(persistConfig, cartReducer);

// // Create the store
// export const store = configureStore({
//   reducer: {
//     cart: persistedReducer,
//   },
// });

// // Create the persistor
// export const persistor = persistStore(store);





import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import cartReducer from "./cart/cartSlice";
import authReducer from "./auth/authslice";

const persistConfig = {
  key: "root",
  storage,
};

const persistedCart = persistReducer(persistConfig, cartReducer);
const persistedAuth = persistReducer({ key: "auth", storage }, authReducer);

export const store = configureStore({
  reducer: {
    cart: persistedCart,
    auth: persistedAuth,
  },
});

export const persistor = persistStore(store);
