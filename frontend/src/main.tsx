import React from "react";
import ReactDOM from "react-dom/client.js";
import App from "./App.js";
import "./index.scss";
import { Provider } from "react-redux";
import { setupStore } from "./store/index.js";

const store = setupStore();

ReactDOM.createRoot(document.getElementById("root")!).render(
   <Provider store={store}>
      <React.StrictMode>
         <App />
      </React.StrictMode>
   </Provider>
);
