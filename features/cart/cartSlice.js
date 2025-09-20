// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   items: [], // Cart items
//   totalQuantity: 0, // Total quantity of items in the cart
//   totalPrice: 0, // Total price of all items
// };

// const cartSlice = createSlice({
//   name: "cart",
//   initialState,
//   reducers: {
//     addItem(state, action) {
//       const newItem = action.payload;
//       const existingItem = state.items.find(
//         (item) =>
//           item.title === newItem.title &&
//           JSON.stringify(item.ingredients) === JSON.stringify(newItem.ingredients) &&
//           JSON.stringify(item.toppings) === JSON.stringify(newItem.toppings) &&
//           item.size === newItem.size
//       );

//       if (existingItem) {
//         existingItem.quantity += 1;
//         existingItem.totalPrice += parseFloat(newItem.price);
//       } else {
//         state.items.push({
//           ...newItem,
//           // quantity: 1,
//           totalPrice: parseFloat(newItem.price),
//         });
//       }
//       state.totalQuantity += 1;
//       state.totalPrice += parseFloat(newItem.price);
//     },
//     removeItem(state, action) {
//       const index = action.payload;
//       const existingItem = state.items[index];
//       if (existingItem) {
//         state.totalQuantity -= existingItem.quantity;
//         state.totalPrice -= existingItem.price;
//         state.items.splice(index, 1); // Remove the item
//       }
//     },
//     incrementQuantity(state, action) {
//       const index = action.payload;

//       const existingItem = state.items[index];

//       if (existingItem) {
//         existingItem.quantity += 1;
//         existingItem.price += existingItem.eachprice;
//         // state.totalQuantity += 1;
//         state.totalPrice += existingItem.eachprice;
//       }

//         //console.log(existingItem.quantity)
//         console.log(existingItem.price)

//         console.log(state.totalPrice)

//     },
//     decrementQuantity(state, action) {
//       const index = action.payload;
//       const existingItem = state.items[index];
//       if (existingItem && existingItem.quantity > 1) {
//         existingItem.quantity -= 1;
//         existingItem.price -= existingItem.eachprice;
//        //state.totalQuantity -= 1;
//         state.totalPrice -= existingItem.eachprice;
//       }
//     },
//     clearCart(state) {
//       state.items = [];
//       state.totalQuantity = 0;
//       state.totalPrice = 0;
//     },

//   },
// });

// export const { addItem, removeItem, incrementQuantity, decrementQuantity, clearCart } =
//   cartSlice.actions;
// export default cartSlice.reducer;
// export const selectCartItems = (state) => state.cart.items;
// export const selectCartTotalQuantity = (state) => state.cart.totalQuantity;
// export const selectCartTotalPrice = (state) => state.cart.totalPrice;

// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   items: [], // Cart items
//   totalQuantity: 0, // Total quantity of items in the cart
//   totalPrice: 0, // Total price of all items
// };

// const cartSlice = createSlice({
//   name: "cart",
//   initialState,
//   reducers: {
//     addItem(state, action) {
//       const newItem = action.payload;
//       const existingItem = state.items.find(
//         (item) =>
//           item.title === newItem.title &&
//           JSON.stringify(item.ingredients) === JSON.stringify(newItem.ingredients) &&
//           JSON.stringify(item.toppings) === JSON.stringify(newItem.toppings) &&
//           item.size === newItem.size
//       );

//       if (existingItem) {
//         existingItem.quantity += 1;
//         // Add eachprice field if not exists
//         if (!existingItem.eachprice) {
//           existingItem.eachprice = parseFloat(newItem.price);
//         }
//         existingItem.price = existingItem.eachprice * existingItem.quantity;
//       } else {
//         state.items.push({
//           ...newItem,
//           quantity: newItem.quantity ? parseInt(newItem.quantity) : 1,
//           eachprice: parseFloat(newItem.price),
//           price: parseFloat(newItem.price),
//         });
//       }
//       state.totalQuantity += 1;
//       state.totalPrice += parseFloat(newItem.price);
//     },

//     removeItem(state, action) {
//       const index = action.payload;
//       const existingItem = state.items[index];
//       if (existingItem) {
//         state.totalQuantity -= existingItem.quantity;
//         state.totalPrice -= existingItem.price; // Use the current total price for this item
//         state.items.splice(index, 1); // Remove the item
//       }
//     },

//     incrementQuantity(state, action) {
//       const index = action.payload;
//       const existingItem = state.items[index];

//       // if (existingItem) {
//       //   // Ensure eachprice exists
//       //   if (!existingItem.eachprice) {
//       //     existingItem.eachprice = parseFloat(existingItem.price) / existingItem.quantity;
//       //   }

//       //   existingItem.quantity += 1;
//       //   existingItem.price = existingItem.eachprice * existingItem.quantity;
//       //   state.totalQuantity += 1;
//       //   state.totalPrice += existingItem.eachprice;
//       // }

//        if (existingItem) {
//   const eachprice = existingItem.eachprice;

//   existingItem.quantity += 1;
//   existingItem.price = eachprice * existingItem.quantity;
//   state.totalQuantity += 1;
//   state.totalPrice += eachprice;
// }
//     },

//     decrementQuantity(state, action) {
//       const index = action.payload;
//       const existingItem = state.items[index];

//       if (existingItem && existingItem.quantity > 1) {
//         // Ensure eachprice exists
//         if (!existingItem.eachprice) {
//           existingItem.eachprice = parseFloat(existingItem.price) / existingItem.quantity;
//         }

//         existingItem.quantity -= 1;
//         existingItem.price = existingItem.eachprice * existingItem.quantity;
//         state.totalQuantity -= 1;
//         state.totalPrice -= existingItem.eachprice;
//       }
//     },

//     clearCart(state) {
//       state.items = [];
//       state.totalQuantity = 0;
//       state.totalPrice = 0;
//     },
// setCart(state, action) {
//   const items = action.payload;

//   if (!Array.isArray(items)) {
//     console.error("setCart payload must be an array");
//     return;
//   }

//   const validItems = items.map((item) => {
//     const quantity = parseInt(item.quantity) || 1;
//     const eachprice = parseFloat(item.eachprice || item.price / quantity);

//     return {
//       ...item,
//       quantity,
//       eachprice,
//       price: eachprice * quantity,
//     };
//   });

//   state.items = validItems;
//   state.totalQuantity = validItems.reduce((sum, item) => sum + item.quantity, 0);
//   state.totalPrice = validItems.reduce((sum, item) => sum + item.price, 0);
// }

//   },
// });

// export const { addItem, removeItem, incrementQuantity, decrementQuantity, clearCart,setCart } = cartSlice.actions;
// export default cartSlice.reducer;

// export const selectCartItems = (state) => state.cart.items;
// export const selectCartTotalQuantity = (state) => state.cart.totalQuantity;
// export const selectCartTotalPrice = (state) => state.cart.totalPrice;






// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   items: [],
//   totalQuantity: 0,
//   totalPrice: 0,
// };

// const cartSlice = createSlice({
//   name: "cart",
//   initialState,
//   reducers: {
//     addItem(state, action) {
//       const newItem = action.payload;
//       const quantityToAdd = newItem.quantity ? parseInt(newItem.quantity) : 1;
//       const eachprice = parseFloat(newItem.eachprice ?? newItem.price);

//       const existingItem = state.items.find(
//         (item) =>
//           item.title === newItem.title &&
//           item.size === newItem.size &&
//           JSON.stringify(item.ingredients) ===
//             JSON.stringify(newItem.ingredients) &&
//           JSON.stringify(item.toppings) === JSON.stringify(newItem.toppings)
//       );

//       if (existingItem) {
//         existingItem.quantity += quantityToAdd;
//         existingItem.price = existingItem.eachprice * existingItem.quantity;
//       } else {
//         state.items.push({
//           ...newItem,
//           quantity: quantityToAdd,
//           eachprice,
//           price: eachprice * quantityToAdd,
//         });
//       }

//       state.totalQuantity += quantityToAdd;
//       state.totalPrice += eachprice * quantityToAdd;
//     },

//     removeItem(state, action) {
//       const index = action.payload;
//       const existingItem = state.items[index];

//       if (existingItem) {
//         state.totalQuantity -= existingItem.quantity;
//         state.totalPrice -= existingItem.price;
//         state.items.splice(index, 1);
//       }
//     },

//     incrementQuantity(state, action) {
//       const index = action.payload;
//       const existingItem = state.items[index];

//       if (existingItem) {
//         const eachprice = existingItem.eachprice;
//         existingItem.quantity += 1;
//         existingItem.price = eachprice * existingItem.quantity;

//         state.totalQuantity += 1;
//         state.totalPrice += eachprice;
//       }
//     },

//     decrementQuantity(state, action) {
//       const index = action.payload;
//       const existingItem = state.items[index];

//       if (existingItem && existingItem.quantity > 1) {
//         const eachprice = existingItem.eachprice;
//         existingItem.quantity -= 1;
//         existingItem.price = eachprice * existingItem.quantity;

//         state.totalQuantity -= 1;
//         state.totalPrice -= eachprice;
//       }
//     },

//     clearCart(state) {
//       state.items = [];
//       state.totalQuantity = 0;
//       state.totalPrice = 0;
//     },

//     setCart(state, action) {
//       const items = action.payload;

//       if (!Array.isArray(items)) {
//         console.error("setCart payload must be an array");
//         return;
//       }

//       const validItems = items.map((item) => {
//         const quantity = parseInt(item.quantity) || 1;
//         const eachprice = parseFloat(item.eachprice ?? item.price / quantity);

//         return {
//           ...item,
//           quantity,
//           eachprice,
//           price: eachprice * quantity,
//         };
//       });

//       state.items = validItems;
//       state.totalQuantity = validItems.reduce(
//         (sum, item) => sum + item.quantity,
//         0
//       );
//       state.totalPrice = validItems.reduce((sum, item) => sum + item.price, 0);
//     },
//   },
// });

// export const {
//   addItem,
//   removeItem,
//   incrementQuantity,
//   decrementQuantity,
//   clearCart,
//   setCart,
// } = cartSlice.actions;

// export default cartSlice.reducer;

// export const selectCartItems = (state) => state.cart.items;
// export const selectCartTotalQuantity = (state) => state.cart.totalQuantity;
// export const selectCartTotalPrice = (state) => state.cart.totalPrice;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action) {
      const newItem = action.payload;
      console.log("Adding item to cart in reducer:", newItem); // Debug log
      const quantityToAdd = newItem.quantity ? parseInt(newItem.quantity) : 1;
      const eachprice = parseFloat(newItem.eachprice ?? newItem.price);

      // Updated to include pizzaBase, sauce, combo style specific fields, and Peri Peri specific fields in the comparison
      const existingItem = state.items.find(
        (item) =>
          item.title === newItem.title &&
          item.size === newItem.size &&
          item.pizzaBase === newItem.pizzaBase && // Add pizzaBase comparison
          item.sauce === newItem.sauce && // Add sauce comparison for other items
          item.isMealDeal === newItem.isMealDeal && // Add meal deal comparison for Peri Peri and Combo Style
          item.selectedSides === newItem.selectedSides && // Add sides comparison
          item.selectedDrinks === newItem.selectedDrinks && // Add drinks comparison
          item.type === newItem.type && // Add type comparison for different item types
          item.itemId === newItem.itemId && // Add itemId comparison for combo style items
          JSON.stringify(item.ingredients) ===
            JSON.stringify(newItem.ingredients) &&
          JSON.stringify(item.toppings) === JSON.stringify(newItem.toppings) &&
          JSON.stringify(item.sides) === JSON.stringify(newItem.sides) && // Compare sides arrays for combo style
          JSON.stringify(item.drinks) === JSON.stringify(newItem.drinks) // Compare drinks arrays for combo style
      );

      if (existingItem) {
        existingItem.quantity += quantityToAdd;
        existingItem.price = existingItem.eachprice * existingItem.quantity;
      } else {
        state.items.push({
          ...newItem,
          quantity: quantityToAdd,
          eachprice,
          price: eachprice * quantityToAdd,
          pizzaBase: newItem.pizzaBase || "Thin Crust", // Add pizzaBase with default
          sauce: newItem.sauce || null, // Add sauce field
          isMealDeal: newItem.isMealDeal || false, // Add meal deal flag
          selectedSides: newItem.selectedSides || null, // Add selected sides (for peri peri legacy)
          selectedDrinks: newItem.selectedDrinks || null, // Add selected drinks (for peri peri legacy)
          sides: newItem.sides || [], // Add sides array (for combo style)
          drinks: newItem.drinks || [], // Add drinks array (for combo style)
          type: newItem.type || 'pizza', // Add type field
          itemId: newItem.itemId || null, // Add itemId for combo style items
          isPeriPeri: newItem.isPeriPeri || false, // Add Peri Peri flag
          isComboStyleItem: newItem.type === 'comboStyleItem', // Add combo style flag
          
        });
      }

      state.totalQuantity += quantityToAdd;
      state.totalPrice += eachprice * quantityToAdd;
    },

    // Add a specific action for cart operations (alias to addItem)
    addToCart(state, action) {
      // This is just an alias to addItem for consistency with the frontend
      cartSlice.caseReducers.addItem(state, action);
    },

    removeItem(state, action) {
      const index = action.payload;
      const existingItem = state.items[index];

      if (existingItem) {
        state.totalQuantity -= existingItem.quantity;
        state.totalPrice -= existingItem.price;
        state.items.splice(index, 1);
      }
    },

    incrementQuantity(state, action) {
      const index = action.payload;
      const existingItem = state.items[index];

      if (existingItem) {
        const eachprice = existingItem.eachprice;
        existingItem.quantity += 1;
        existingItem.price = eachprice * existingItem.quantity;

        state.totalQuantity += 1;
        state.totalPrice += eachprice;
      }
    },

    decrementQuantity(state, action) {
      const index = action.payload;
      const existingItem = state.items[index];

      if (existingItem && existingItem.quantity > 1) {
        const eachprice = existingItem.eachprice;
        existingItem.quantity -= 1;
        existingItem.price = eachprice * existingItem.quantity;

        state.totalQuantity -= 1;
        state.totalPrice -= eachprice;
      }
    },

    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    },

    setCart(state, action) {
      const items = action.payload;

      if (!Array.isArray(items)) {
        console.error("setCart payload must be an array");
        return;
      }

      const validItems = items.map((item) => {
        const quantity = parseInt(item.quantity) || 1;
        const eachprice = parseFloat(item.eachprice ?? item.price / quantity);

        return {
          ...item,
          quantity,
          eachprice,
          price: eachprice * quantity,
          pizzaBase: item.pizzaBase || "Thin Crust", // Ensure pizzaBase is included
          sauce: item.sauce || null, // Ensure sauce is included
          isMealDeal: item.isMealDeal || false, // Ensure meal deal flag is included
          selectedSides: item.selectedSides || null, // Ensure selected sides are included
          selectedDrinks: item.selectedDrinks || null, // Ensure selected drinks are included
          isPeriPeri: item.isPeriPeri || false, // Ensure Peri Peri flag is included
        };
      });

      state.items = validItems;
      state.totalQuantity = validItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      state.totalPrice = validItems.reduce((sum, item) => sum + item.price, 0);
    },
  },
});

export const {
  addItem,
  addToCart,
  removeItem,
  incrementQuantity,
  decrementQuantity,
  clearCart,
  setCart,
} = cartSlice.actions;

export default cartSlice.reducer;

export const selectCartItems = (state) => state.cart.items;
export const selectCartTotalQuantity = (state) => state.cart.totalQuantity;
export const selectCartTotalPrice = (state) => state.cart.totalPrice;