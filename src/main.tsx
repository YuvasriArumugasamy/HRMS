import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./app/store";
import AppRoutes from "./routes/AppRoutes";
import "./index.css";
import { injectStore } from "@/core/api/api";

injectStore(store);

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

createRoot(rootElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate 
        loading={
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh', 
            fontFamily: 'sans-serif' 
          }}>
            Loading application...
          </div>
        } 
        persistor={persistor}
      >
        <AppRoutes />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
