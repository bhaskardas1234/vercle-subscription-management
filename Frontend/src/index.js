// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { CookiesProvider } from "react-cookie";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  // </React.StrictMode>
    <CookiesProvider>
      <App />
    </CookiesProvider>
);

  export const SERVER_URL = "https://vercle-subscription-management-nuap.vercel.app:5000"
    //  export const SERVER_URL = "http://localhost:5000" 
// export const SERVER_URL = "https://staging.mbiapis.setucodeverse.net"
// export const SERVER_URL = "http://54.235.10.201:5000"

