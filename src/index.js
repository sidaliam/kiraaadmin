import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { DarkModeContextProvider } from "./context/darkModeContext";
import { AuthContextProvider } from "./context/Authcontext";
import { NotificationProvider } from "./context/Notificationcontext";

ReactDOM.render(
  <React.StrictMode>
    <AuthContextProvider>
      <NotificationProvider>
        <DarkModeContextProvider>
          <App />
        </DarkModeContextProvider>
      </NotificationProvider>
    </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
