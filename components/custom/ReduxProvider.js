// components/ReduxProvider.js
"use client";

import { Provider } from "react-redux";
//import { store } from "../../features/store";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../../features/store"; // Adjust the path if necessary

export default function ReduxProvider({ children }) {
  return <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
    {children}
    </PersistGate>
    </Provider>;
}
