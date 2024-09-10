// import React, { useEffect, useState } from "react";
// import { SERVER_URL } from "../index.js";
// import { useNavigate } from "react-router-dom";
// import cssClass from "./Home.module.css";
// import { useCookies } from "react-cookie";
// import Alert from "./Alert.jsx";

// const Home = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [error, setError] = useState(null);
//   const [showToast, setShowToast] = useState(null);
//   const [cookie, setCookie, removeCookie] = useCookies([]);
//   const [pageReload, setPageReload] = useState(false);

//   const navigate = useNavigate();
//   const handleLogOut = async () => {
//     if(!localStorage.getItem("uid") || !localStorage.getItem("sid")) {
//       setShowToast({message: "Somthing went wrong", type: "error"});
//       return;
//     }
//     const data = {
//       session_id: localStorage.getItem("sid"),
//       user_id: localStorage.getItem("uid")
//     };
//     const response = await fetch(`${SERVER_URL}/remove-user-session`, {
//       method: "POST",
//       mode: "cors",
//       cache: "no-cache",
//       credentials: "include",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     });
//     if (response.status === 200) {
//       // alert("Logged out successfully");
//       setShowToast({ message: "Logged out successfully", type: "success" });
//       // localStorage.removeItem("loginMode");
//       // localStorage.removeItem("uid");
//       // localStorage.removeItem("sid");
//       // localStorage.removeItem("userinfo");
//       localStorage.clear();
//       setIsLoggedIn(false);
//       removeCookie("session_id", {domain: ".setucodeverse.net", path: "/"});
//       // removeCookie("session_id", {domain: ".setucodeverse.net", path: "/"});
//       removeCookie("user_id", {domain: ".setucodeverse.net", path: "/"});
//       // removeCookie("user_id", {domain: ".setucodeverse.net", path: "/"});
//       // removeCookie("user_id");
//       navigate("/home");
//     } else {
//       navigate("/404");
//     }
//   };
//   const checkSessionStatus = async () => {
//     const response = await fetch(`${SERVER_URL}/check-session-status`, {
//       method: "GET",
//       mode: "cors",
//       cache: "no-cache",
//       credentials: "include",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     const responseData = await response.json();
//     if (response.status === 200) {
//       setIsLoggedIn(true);
//       setPageReload(!pageReload);
//     }
//     else {
//       // setError(responseData.error);
//       // setShowToast({message: responseData.error, type: "error"});
//       // setTimeout(() => {
//       //   // setError(null);
//       //   navigate("/home");
//       // }, 1000);
//       localStorage.removeItem("uid");
//       localStorage.removeItem("sid");
//       localStorage.removeItem("userinfo");
//     }
//   };
//   useEffect(() => {
//     checkSessionStatus()
//   }, []);
//   return (
//     <>
//       <div className={cssClass["home-container"]}>
//         {isLoggedIn ? (
//           <>
//             <button onClick={handleLogOut}>Logout</button>
//             <button onClick={() => navigate("/dashboard")}>Dashboard</button>
//           </>
//         ) : (
//           <button onClick={() => navigate("/login")}>Login</button>
//         )}
//       </div>
//       {/* {error && (
//         <div className={cssClass["alert"]}>
//           <div className={cssClass["alert-inner"]}>{error}</div>
//         </div>
//       )} */}
//       {showToast != null && (
//         <Alert
//           message={showToast.message}
//           type={showToast.type}
//           setShowToast={setShowToast}
//         />
//       )}
//     </>
//   );
// };

// export default Home;