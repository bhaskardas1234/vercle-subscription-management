// import classes from "./Dashboard.module.css";
// import Modal from "react-modal";
// import backIcon from "../asset/back.svg";
// import editIcon from "../asset/edit.svg";
// import maleIcon from "../asset/male.svg";
// import phoneIcon from "../asset/phone.svg";
// import mailIcon from "../asset/mail.svg";
// import balanceIcon from "../asset/balance.svg";
// import rupeeIcon from "../asset/rupee.svg";
// import profileIcon from "../asset/profile.svg";
// import { useNavigate } from "react-router-dom";
// import { useDarkMode } from "./DarkModeContext";
// import { SERVER_URL } from "../index.js";
// import React, { useEffect, useRef, useState } from 'react';
// import { getDeviceInfo, getNetworkInfo } from "../helper/userFingerprint.js";
// import { useCookies } from "react-cookie";
// import { getParsedUA } from "../helper/parseUA.js";
// import cssClass from "./Dashboard.module.css";
// import Alert from "./Alert.jsx";
// import payAsReadIcom from '../asset/pay-as-you-read.png';
// import SubscriptionIcon from '../asset/subscription.png';
// import Cookies from 'js-cookie';

// const Dashboard = () => {
//     //change

//     const [payPerContentPrice,setPayPerContentPrice]=useState(0);//each content price will set according to handelchange
//     const [articles, setArticles] = useState([]);//to store all articals values
//     const [showPopup, setShowPopup] = useState(false);//this is for content show pop pup function
//     const [contentId,setContentId]=useState(0);//to set content id for each content
//     const [subscriptionValidity,setSubscriptionValidity]=useState()
//     const [subscriberExistence, setSubscriberExistence] = useState(true);
//     const [paymentStatus,setPaymentStatus]=useState(false)
//     const [walletBalance, setWalletBalance] = useState(0);



// //change
//   const languages = ["English", "മലയാളം", "हिंदी"];
//   const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
//   const [uid, setUid] = useState(localStorage.getItem("uid"));
//   const [modalIsOpen, setModalIsOpen] = useState(false);
//   // const [isDarkMode, setIsDarkMode] = useState(false);
//   const { isDarkMode, toggleDarkMode } = useDarkMode();
//   const navigate = useNavigate();

//   const handleLanguageClick = (language) => {
//     setSelectedLanguage(language);
//     setModalIsOpen(false);
//   };

//   const openModal = () => {
//     setModalIsOpen(true);
//   };

//   const closeModal = () => {
//     setModalIsOpen(false);
//   };

  

//   const handleImageClick = () => {
//     navigate("/edit-profile");
//   };

//   const dateRef = useRef();

//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [isPopupOpen, setIsPopupOpen] = useState(false);
//   const [activeSessions, setActiveSessions] = useState(null);
//   const [error, setError] = useState(null);
//   const [cookie, setCookie, removeCookie] = useCookies([
//     "user_id",
//     "session_id",
//   ]);
//   const [userDetails, setUserDetails] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     dob: "",
//     honorific: "Mr",
//   });
//   const [showToast, setShowToast] = useState(null);
//   const [pageReload, setPageReload] = useState(false);
//   const [userUAInfo, setUserUAInfo] = useState(null);
//   const [activeSessionId, setActiveSessionId] = useState(null);
//   const [userData, setUserData] = useState(null);
//   const [userInfo, setUserInfo] = useState(null);
//   const [isCollapsed, setIsCollapsed] = useState(true);

//   const [subscriptionButtonHandler,setSubscriptionButtonHandler]=useState(false)

//   const toggleDeviceDropdown = (session) => {
   
//     console.log(session.device_info.userAgent);
//     formatUAInfo(session.device_info.userAgent);
//     setActiveSessionId((prev) =>
//       prev === session.session_id ? null : session.session_id
//     );
//   };

//   const toggleDeviceDropdown1 = () => {
//     setIsCollapsed(!isCollapsed);
//     // console.log(session.device_info.userAgent);
//     // formatUAInfo(session.device_info.userAgent);
//     // setActiveSessionId((prev) =>
//     //   prev === session.session_id ? null : session.session_id
//     // );
//   };

//   useEffect(() => {
//     console.log(uid);
//     checkSessionStatus();
//     fetchWalletBalance();
//   }, []);

//   useEffect(() => {
//     if (localStorage.getItem("userInfo")) {
//       setUserInfo(JSON.parse(localStorage.getItem("userInfo")));
//     }
//     console.log(userInfo);
//   }, [userDetails]);

//   const init = async () => {
//     await checkSessionStatus();
//     if (!localStorage.getItem("uid") || !localStorage.getItem("sid")) {
//       setShowToast({ message: "Somthing went wrong", type: "error" });
//       return;
//     }
//   };


//   const formatUAInfo = (uaInfo) => {
//     const parsedUA = getParsedUA(uaInfo);
//     setUserUAInfo(parsedUA);
//     console.log(parsedUA);
//   };

//   const fetchUserDetails = async () => {
//     const response = await fetch(`${SERVER_URL}/get-user`, {
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
//       setUserDetails(responseData);
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
//     try {
//       if (response.status === 200) {
//         await fetchUserDetails();
//         await getAllUserSessions();
//       } else if (response.status === 404) {
//         // setError(responseData.error);
//         console.log(showToast);
//         setShowToast({ message: responseData.message, type: "error" });
//         setTimeout(() => {
//           setError(null);
//           navigate("/");
//           return;
//         }, 2000);
//       }
//     } catch (error) {
//       setShowToast({ message: String(error), type: "error" });
//     }
    
//   };

//   const toggleDropdown = () => {
//     setIsDropdownOpen(!isDropdownOpen);
//   };

//   const openPopup = () => {
//     setIsPopupOpen(true);
//     setIsDropdownOpen(false);
//   };

//   const closePopup = () => {
//     setIsPopupOpen(false);
//   };

//   const getAllUserSessions = async () => {
//     // setPageReload(!pageReload);
//     setIsPopupOpen(true);
//     setIsDropdownOpen(false);
//     console.log(cookie.user_id);
//     const response = await fetch(`${SERVER_URL}/get-all-sessions`, {
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
//       setActiveSessions(responseData.active_sessions);
//     } else {
//       // alert("Server error");
//       setShowToast({ message: "Server error", type: "error" });
//     }
//   };

//   const logoutFromDevice = async (session_id, user_id) => {
//     const data = {
//       session_id: session_id,
//       user_id: user_id
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
//       setShowToast({ message: "Logged out successfully", type: "error" });
      
//       setTimeout(async() => {
//         if (userDetails.session_info.session_id === session_id) {
//           removeCookie("session_id");
//           removeCookie("user_id");
//           localStorage.clear();
//           navigate("/home");
//         } else { 
//             await getAllUserSessions();
//             navigate("/dashboard");
          
//         }
//         closePopup();
//       }, 2000);
//     } else {
//       navigate("/404");
//     }
//   };

//   // function setBackendCookie(name, value, days, domain) {
//   //   let expires = "";
//   //   if (days) {
//   //     const date = new Date();
//   //     date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
//   //     expires = "; expires=" + date.toUTCString();
//   //   }
//   //   document.cookie = name + "=" + (value || "")  + expires + "; path=/; domain=" + domain + "; samesite=Lax";
//   // }

//   const logoutFromAllDevice = async () => {
//     const response = await fetch(`${SERVER_URL}/logout-from-all-device`, {
//       method: "POST",
//       mode: "cors",
//       cache: "no-cache",
//       credentials: "include",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     if (response.status === 200) {
//       // alert("Logged out successfully");
//       setShowToast({ message: "Logged out successfully", type: "success" });
//       // localStorage.removeItem("loginMode");
//       localStorage.clear();
//       removeCookie("session_id");
//       removeCookie("user_id");
//       setTimeout(() => {
//         navigate("/home");
//         closePopup();
//       }, 2000);
//     } else {
//       navigate("/404");
//     }
//   };

//   const handelChange = (e) => {
//     const { name, value } = e.target;
//     console.log(name, "  ", value);
//     setUserDetails((data) => ({
//       ...data,
//       [name]: value,
//     }));
//   };

//   const handelUpdateUserDetails = async(e) => {
//     e.preventDefault()
//     const networkInfo = await getNetworkInfo();
//     const deviceInfo = getDeviceInfo();
//     const user_id = localStorage.getItem("uid");
//     const session_id = localStorage.getItem("sid");
//     const data = {
//       phoneNumber: userDetails.phone,
//       email: userDetails.email,
//       name: userDetails.name,
//       dob: userDetails.dob,
//       // honorific: userDetails.honorific,
//       status: "SUCCESS",
//       fingerprint: {
//         network: networkInfo,
//         deviceInfo: deviceInfo,
//         medium: localStorage.getItem("loginMode")
//       },
//       uid: user_id,
//       sid: session_id
//     };

//     try {
//       const response = await fetch(`${SERVER_URL}/update_user`, {
//         method: "POST",
//         mode: "cors",
//         cache: "no-cache",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       });
//       const responseData = await response.json();
//       if(response.status === 200) {
//         console.log(showToast);
//         setShowToast({message : "details updated successfully", type: "success"});
//         localStorage.setItem("uid", responseData.id );
//         // console.log("hdvydevf :: ", responseData.session_id);
//         console.log("mini :: ", responseData.session_info.session_id);
//         localStorage.setItem("sid", responseData.session_info.session_id);
//         console.log(responseData);
//         setUserDetails(responseData);
//         await fetchUserDetails();
//         await getAllUserSessions();
//         localStorage.setItem("userInfo", JSON.stringify(responseData));
//         setTimeout(() => {
//           setShowToast(null)
//         }, 5000);
//       }
//     } catch(error) {
//       setShowToast({message : "Error in updating user", type: "error"});
//     }
//   }

//   const getDeviceImage = (browser, isAndroid) => {
//     let deviceImage = require('../asset/browser.png');
//     if (isAndroid) {
//       deviceImage = require('../asset/smartphone.png');
//     }
//     else {
//       if(browser === "Chrome") {
//         deviceImage = require('../asset/chrome.png');
//       }
//       else if(browser === "Firefox") {
//         deviceImage = require('../asset/firefox.png');
//       }
//       else if(browser === "Edge") {
//         deviceImage = require('../asset/microsoft.png');
//       }
//     }
//     console.log(deviceImage);
    
//     return deviceImage;

//   }

//   const handleButtonClick = () => {
//     navigate('/email');
//   };

//   const handleButtonClick1 = () => {
//     navigate('/walletscreen');
//   };

//   const handleSubscriptionButton = () => {
//     // navigate('/subscription');
//     setSubscriptionButtonHandler(true)
//   };
//   const closeSubscriptionButtonPopup=()=>{
//     setSubscriptionButtonHandler(false)
//   }

//   const checkSubscriberExistence = async () => {
//     try {
//       const response = await fetch(`${SERVER_URL}/get_subscriber_by_id`, {
//       method: 'POST',
//          headers: {
//            'Content-Type': 'application/json',
//          },
//           body: JSON.stringify({user_id: uid }),
//         });
   
//       if (!response.ok) {
//          throw new Error(`HTTP error! status: ${response.status}`);
//       }
   
//         const data = await response.json();
//        if (data.success === 'exist') {
//          // alert("subscriber already exist")
//            setSubscriberExistence(false);
        
//        }
//     } catch (error) {
//        console.error('Error fetching subscriber:', error);
//        throw error;
//      }
//    };
 
 



// // this function for whether the user have valid subscription or not
// const checkSubscriptionValidity = async () => {
//  try {
//    const response = await fetch(`${SERVER_URL}/subscriptionValidity`, {
//      method: 'POST',
//      headers: {
//        'Content-Type': 'application/json',
//      },
//      body: JSON.stringify({ user_id: uid }),
//    });

//    // Ensure the response is valid
//    if (!response.ok) {
//      throw new Error('Network response was not ok');
//    }

//    // Parse JSON response
//    const data = await response.json();

//    // Handle the response data
//    setSubscriptionValidity(data.access);
//    // setDetails(data.details);
//    console.log(data);
//    console.log('Subscription validity response:', data.access);

//  } catch (error) {
//    console.error('There was a problem with the fetch operation:', error);
//  }
// };

// // this is for razor pay 

// const loadScript = (src) => {
//  return new Promise((resolve) => {
//   //  console.log("user id of the user is",uid)
//    const script = document.createElement('script');
//    script.src = src;
//    script.onload = () => {
//      resolve(true);
//    };
//    script.onerror = () => {
//      resolve(false);
//    };
//    document.body.appendChild(script);
//  });
// };

// const displayRazorpay = async (amount,duration) => {
//  const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

//  if (!res) {
//    alert('Razorpay SDK failed to load. Are you online?');
//    return;
//  }
//  console.log("amount",amount)
//  makePayment(amount,duration);
// };

// const makePayment = async (amount,duration) => {
//    console.log("make payment",amount)
//  try {
//    // Fetch order ID from your backend
//    const response= await fetch(`${SERVER_URL}/create_order`, {
//      method: 'POST',
//        headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ courseAmount:amount}),
//   });
//    const data = await response.json();
//    const newOrderId = data.order_id;
//    var self=amount*100
//    console.log("order ID------>"+newOrderId);

//    const options = {
//      key:'rzp_test_XIKIRmwuryqbiu', // Replace with your actual Razorpay API key
//      amount: self,  // 1 INR = 100 paisa
//      currency: 'INR',
//      name: 'MBI',
//      description: 'Test Transaction',
//      image: 'https://example.com/your_logo',
//      order_id: newOrderId.toString(),
//      handler: (response) => {
//        const handlePaymentSuccess = async () => {

//          const paymentData = {
//            razorpay_payment_id: response.razorpay_payment_id,
//            razorpay_order_id: response.razorpay_order_id,
//            razorpay_signature: response.razorpay_signature,
//            uid:uid,
//            money:self/100,
//            duration:duration,
//            contentId:null,
//            rechargeType:"subscription"

           
//          };

//          try {
//            // Call backend to handle payment success
           
//            const verifyResponse = await fetch(`${SERVER_URL}/verify_payment`, {
//              mode: "cors",
//              cache: "no-cache",
//              credentials: "include",
//                     method: 'POST',
//                       headers: {
//                        'Content-Type': 'application/json',
//                      },
//                      body: JSON.stringify(paymentData),
//                  });
//                  const data = await verifyResponse.json();
//                  if (data.message=='wallet recharge successful and content price deducted') {
//                   setShowToast({
//                     message:data.message,
//                     type: "success",
//                   });
//                   setTimeout(()=>{setPaymentStatus(true)
                    
//                     navigate('/contents')
//                     navigate(`/contents/article/${contentId}`);
                    
//                   },3000)
                  
//                 }else if(data.message=='Low wallet balance'){
//                   setShowToast({
//                     message:data.message,
//                     type: "success",
//                   });
//                   setTimeout(()=>{setPaymentStatus(true)
//                     setPaymentStatus(true)
//                     alert(data.status)
//                     navigate('/contents')
                    
//                   },3000)
                  
  
//                 }else if(data.message=='Wallet recharged successfully'){
//                   setShowToast({
//                     message:data.message,
//                     type: "success",
//                   });
//                   setTimeout(()=>{setPaymentStatus(true)
//                     setPaymentStatus(true)
                    
//                     navigate('/dashboard')
                    
//                   },3000)
                  
                 
  
//                 }
  
//                 else{
//                   console.log(paymentStatus);
//                   alert('Payment successful');
//                   navigate("/contents");
//                 }
  
//            setSubscriptionButtonHandler(false);

//            // Redirect to content page page or do further actions
//             navigate('/dashboard') 
//          } catch (error) {
//            console.error('Payment verification failed:', error);
//            alert('Payment verification failed');
//            // Redirect to home or error page
//            navigate('/dashboard');
//          }
//        };

//        handlePaymentSuccess();
//      },
//      prefill: {
//        name: "mbi_testing",  // Replace with actual user details
//        email: "test@gmail.com",
//        contact: "9635766141",
//      },
//      notes: {
//        address: 'Kolkata',  // Replace with actual user address or additional notes
//      },
//      theme: {
//        color: '#005792',  // Navy blue color
//      },
//      modal: {
//        ondismiss: async () => {
//          const failureData = {
//            razorpay_payment_id: '',
//            razorpay_order_id: newOrderId,
//          };

//        },
//      },
//    };

//    const rzp = new window.Razorpay(options);

//    // Handle payment failure
//    rzp.on('payment.failed', async (response) => {
//      const failureData = {
//        razorpay_payment_id: response.error.metadata.payment_id,
//        razorpay_order_id: response.error.metadata.order_id,
//        uid:uid,
//        money:self/100

//      };

//      try {
     
//        const verifyResponse = await fetch(`${SERVER_URL}/record_payment_failure`, {
//          method: 'POST',
//            headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(failureData),
//       });
//        console.log("Failed paymentData----->"+JSON.stringify (failureData));
//        alert('Payment failed and recorded.');
//        navigate('/');
//      } catch (error) {
//        console.error('Failed to record payment failure:', error);
//        alert('Failed to record payment failure.');
//        navigate('/');
//      }
//    });

//    rzp.open();
//  } catch (error) {
//    console.error('Error making payment:', error);
//    alert('Error making payment. Please try again later.');
//  }
// };//razor pay code end

// const fetchWalletBalance = async () => {
//   try {
//       const response = await fetch(`${SERVER_URL}/wallet/${uid}`);
//       if (!response.ok) {
//           throw new Error('Network response was not ok');
//       }
//       const data = await response.json();
//       setWalletBalance(data.balance);
//   } catch (error) {
//       console.error('Error fetching wallet balance:', error);
//   }
// };
// // const handlePay = async () => {
// // if (walletBalance < payPerContentPrice) {
// //     alert('Insufficient balance');
// //     navigate(`/payment-option?amt=${payPerContentPrice}&contentId=${contentId}`)
// // }
// // else{
// //   try {
// //   const walletPamyemtData={
     
// //      uid:uid,
// //      money:payPerContentPrice,
// //      duration:1,
// //      contentId:contentId
     
// //    };
 
// // const response = await fetch(`${SERVER_URL}/pay_article`, {
// //      method: 'POST',
// //      headers: {
// //          'Content-Type': 'application/json'
// //      },
// //      body: JSON.stringify(walletPamyemtData)
// //  });

// //  const data = await response.json();

// //  if (data.status === 'success') {
// //      alert('Article Purchased Successfully now you can  access your Articale');

// //      setShowPopup(false)
// //      setPaymentStatus(true)
// //      // setWalletBalance(walletBalance - articleAmount); // Deduct amount from local state
// //      // redirectToWallet(); // Redirect to wallet page
// //      navigate(`article/${contentId}`);//all navigation will redirct to content page

// //  } else {
// //      alert('Payment Failed');
// //  }
// // } catch (error) {
// //  console.error('Error paying for article:', error);
// //  // alert('Payment Failed');
// // }

// // }


// // };

//   return (
//     <>
//       <div
//         className={`${classes["dashboard-container"]} ${
//           isDarkMode ? classes["dark-mode"] : ""
//         }`}
//       >
//         <div className={classes["dashboard-profile"]}>
//           <div className={classes["head"]}>
//             <div>
//               <img src={backIcon} alt="" />
//             </div>
//             <div>
//               <p>Profile</p>
//             </div>
//             <div>
//               <img
//                 src={editIcon}
//                 alt=""
//                 onClick={handleImageClick}
//                 className={classes["edit-details"]}
//               />
//             </div>
//           </div>
//           <div className={classes["bottom"]}>
//             <div className={classes["left"]}>
//               <img src={profileIcon} alt="" />
//             </div>
//             <div className={classes["right"]}>
//               <div className={classes["name"]}>
//                 <p className={classes["name-p"]}>
//                   {userDetails ? userDetails.name : ""}
//                 </p>
//               </div>
//               <div className={classes["gender"]}>
//                 <img src={maleIcon} alt="" />
//                 <p className={classes["gender-p"]}>
//                   {userDetails ? userDetails.gender : ""}
//                 </p>
//               </div>
//               <div className={classes["phone"]}>
//                 <img src={phoneIcon} alt="" />
//                 <p className={classes["phone-p"]}>
//                   {userDetails ? userDetails.phone : ""}
//                 </p>
//               </div>
//               <div className={classes["email"]}>
//                 <img src={mailIcon} alt="" />
//                 <p className={classes["email-p"]}>
//                   {userDetails ? userDetails.email : ""}
//                 </p>
//               </div>
//               <div className={classes["balance"]}>
//                 <img src={balanceIcon} alt="" />
//                 <p className={classes["balance-p"]}>Balance :</p>
//                 <img src={rupeeIcon} alt="" />
//                 <p className={classes["balance-p"]}>{walletBalance}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className={classes["first"]}>
//           <div className={classes["subscription"]} onClick={handleSubscriptionButton}>
//             <p className={classes["subscription-p"]} >Subscription</p>
//             <div className={classes["right-arrow-light"]}>
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="14"
//                 height="14"
//                 viewBox="0 0 14 14"
//                 fill="none"
//               >
//                 <g opacity="0.65">
//                   <path
//                     d="M4.10948 12.2459C4.24073 12.2459 4.37335 12.2021 4.48409 12.1146L10.2782 7.45386C10.419 7.34039 10.5011 7.16949 10.5011 6.98765C10.5011 6.80718 10.419 6.63492 10.2782 6.52281L4.5087 1.88668C4.25167 1.68023 3.87569 1.72125 3.66924 1.97828C3.4628 2.23531 3.50381 2.61129 3.76085 2.81773L8.95069 6.98902L3.73487 11.1836C3.47784 11.39 3.43682 11.766 3.64327 12.023C3.76221 12.1693 3.93448 12.2459 4.10948 12.2459Z"
//                     fill="#666666"
//                     stroke="#666666"
//                   />
//                 </g>
//               </svg>
//             </div>
//           </div>

          

//           <div className={classes["device-management"]} onClick={() => toggleDeviceDropdown1()}>
//             <p className={classes["device-management-p"]}>Device Management</p>
//             <div className={classes["right-arrow-light"]}>
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="14"
//                 height="14"
//                 viewBox="0 0 14 14"
//                 fill="none"
//               >
//                 <g opacity="0.65">
//                   <path
//                     d="M4.10948 12.2459C4.24073 12.2459 4.37335 12.2021 4.48409 12.1146L10.2782 7.45386C10.419 7.34039 10.5011 7.16949 10.5011 6.98765C10.5011 6.80718 10.419 6.63492 10.2782 6.52281L4.5087 1.88668C4.25167 1.68023 3.87569 1.72125 3.66924 1.97828C3.4628 2.23531 3.50381 2.61129 3.76085 2.81773L8.95069 6.98902L3.73487 11.1836C3.47784 11.39 3.43682 11.766 3.64327 12.023C3.76221 12.1693 3.93448 12.2459 4.10948 12.2459Z"
//                     fill="#666666"
//                     stroke="#666666"
//                   />
//                 </g>
//               </svg>
//             </div>
//           </div>

//             {!isCollapsed && (
//                 <div>
//                     <div className={cssClass["popup-content"]}>
//                         {activeSessions &&
//                           activeSessions.map((session) => (
//                             <div className={cssClass["device-container"]} key={session.session_id}>
//                               <div
//                                 className={
//                                   activeSessionId === session.session_id
//                                     ? cssClass["device-num-expand"]
//                                     : cssClass["device-num"]
//                                 }

//                                 onClick={() => toggleDeviceDropdown(session)}
//                               >
//                                 <div className={cssClass["remove-part"]}>
//                                 <img src={getDeviceImage(session.device_info.browser, session.device_info.isAndroid)} alt="" />
//                           <div>
//                             <p className={cssClass["browser"]}>
//                               {session.device_info.isAndroid
//                                 ? "Android"
//                                 : session.device_info.browser}
//                             </p>
//                             {userDetails.session_info.session_id ===
//                               session.session_id && (
//                               <p className={cssClass["point"]}>
//                                 &#8226;This device
//                               </p>
//                             )}
//                           </div>
//                                 </div>
//                                 <div
//                                   className={cssClass["this-device"]}
//                                    onClick={(e) =>{
//                                     e.stopPropagation();
//                                     logoutFromDevice(session.session_id, session.user_info.id)
//                                   }
//                                   }
//                                 >
//                                   remove
//                                 </div>
//                               </div>
//                               <div
//                                 className={cssClass["device-info-container"]}
//                               >
//                                 {activeSessionId === session.session_id && (
//                                   <div className={cssClass["device-info"]}>
//                                     <div
//                                       className={cssClass["device-info-child"]}
//                                     >
//                                       <div
//                                         className={
//                                           cssClass["device-info-child-head"]
//                                         }
//                                       >
//                                         User
//                                       </div>
//                                       <p>
//                                         Name :
//                                         {session.user_info.name !== ""
//                                           ? session.user_info.name
//                                           : "None"}
//                                       </p>
//                                       <p>
//                                         Email :
//                                         {session.user_info.email !==
//                                         ""
//                                           ? session.user_info.email
//                                           : "None"}
//                                       </p>
//                                       <p>
//                                         Phone :
//                                         {session.user_info.phone !== ""
//                                           ? session.user_info.phone
//                                           : "None"}
//                                       </p>
//                                     </div>
//                                     <div
//                                       className={cssClass["device-info-child"]}
//                                     >
//                                       <div
//                                         className={
//                                           cssClass["device-info-child-head"]
//                                         }
//                                       >
//                                         Browser
//                                       </div>
//                                       <p>
//                                         Name :
//                                         {userUAInfo.browser.name !== undefined
//                                           ? userUAInfo.browser.name
//                                           : "None"}
//                                       </p>
//                                       <p>
//                                         Major :
//                                         {userUAInfo.browser.version !==
//                                         undefined
//                                           ? userUAInfo.browser.version
//                                           : "None"}
//                                       </p>
//                                       <p>
//                                         Version :
//                                         {userUAInfo.browser.major !== undefined
//                                           ? userUAInfo.browser.major
//                                           : "None"}
//                                       </p>
//                                     </div>
//                                     {}
//                                     <div
//                                       className={cssClass["device-info-child"]}
//                                     >
//                                       <div
//                                         className={
//                                           cssClass["device-info-child-head"]
//                                         }
//                                       >
//                                         OS
//                                       </div>
//                                       <p>
//                                         Name :{" "}
//                                         {userUAInfo.os.name !== undefined
//                                           ? userUAInfo.os.name
//                                           : "None"}
//                                       </p>
//                                       <p>
//                                         Version :{" "}
//                                         {userUAInfo.os.version !== undefined
//                                           ? userUAInfo.os.version
//                                           : "None"}
//                                       </p>
//                                     </div>
//                                     {}
//                                   </div>
//                                 )}
//                               </div>
//                             </div>
//                           ))}
//                           </div>

//                         <div
//                           className={cssClass["log-out"]}
//                           onClick={logoutFromAllDevice}
//                         >
//                           <button>Log out from all devices</button>
//                         </div>
                     
//                 </div>
//             )}

//           <div className={classes["e-Paper"]}  onClick={handleButtonClick}>
//             <p className={classes["e-Paper-p"]}>e-Paper</p>
//             <div className={classes["right-arrow-light"]}>
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="14"
//                 height="14"
//                 viewBox="0 0 14 14"
//                 fill="none"
//               >
//                 <g opacity="0.65">
//                   <path
//                     d="M4.10948 12.2459C4.24073 12.2459 4.37335 12.2021 4.48409 12.1146L10.2782 7.45386C10.419 7.34039 10.5011 7.16949 10.5011 6.98765C10.5011 6.80718 10.419 6.63492 10.2782 6.52281L4.5087 1.88668C4.25167 1.68023 3.87569 1.72125 3.66924 1.97828C3.4628 2.23531 3.50381 2.61129 3.76085 2.81773L8.95069 6.98902L3.73487 11.1836C3.47784 11.39 3.43682 11.766 3.64327 12.023C3.76221 12.1693 3.93448 12.2459 4.10948 12.2459Z"
//                     fill="#666666"
//                     stroke="#666666"
//                   />
//                 </g>
//               </svg>
//             </div>
//           </div>
//         </div>

//         { subscriptionButtonHandler && (
//                         <div className={classes['popup']}>
//                             <div className={`${classes['popup-content']} ${isDarkMode ? classes['dark-mode'] : ''}`}>
//                                 <div className={classes['close']}>
//                                     <button className={classes['close-btn']} onClick={closeSubscriptionButtonPopup}>X</button>
//                                 </div>
//                                 <div className={classes['subscription-container']}>
//                                     <div className={classes['heading']}>
//                                         <p className={classes['heading-read']}>To read this article subscribe</p>
//                                     </div>

//                                     <div className={classes['cards']}>

//                                         <div className={classes['left']}>
//                                             <div className={classes['image']}>
//                                                 <img src={payAsReadIcom} alt="" />
//                                             </div>
//                                             <h2>Monthly</h2>
//                                             <div className={classes['monthly-description']}>
//                                                 <div className={classes['lines']}>
//                                                     <p>&#8226; Perfect for the dynamic reader</p>
//                                                 </div>
//                                                 <div className={classes['lines']}>
//                                                     <p>&#8226; Immediate access to Exclusive Content</p>
//                                                 </div>
//                                                 <div className={classes['lines']}>
//                                                     <p>&#8226; Premium Features:ad-free interface,......</p>
//                                                 </div>
//                                                 <div className={classes['lines']}>
//                                                     <p>&#8226; Renews each month</p>
//                                                 </div>
//                                             </div>
//                                             <div className={classes['submit-button']}>
//                                                 <button className={classes['suscribe-button']} onClick={() => displayRazorpay(199,30)}>Choose monthly Subscription</button>
//                                             </div>
//                                         </div>

//                                         <div className={classes['middle']}>
//                                             <div className={classes['image']}>
//                                                 <img src={SubscriptionIcon} alt="" />
//                                             </div>
//                                             <h2>Yearly</h2>
//                                             <div className={classes['yearly-description']}>
//                                                 <div className={classes['lines']}>
//                                                     <p>&#8226; Exceptional Value: Unlimited access at a reduced cost (12 months for the cost of 10)</p>
//                                                 </div>
//                                                 <div className={classes['lines']}>
//                                                     <p>&#8226; Comprehensive Archive Access for research, nostalgia, or simply satisfying your curiosity</p>
//                                                 </div>
//                                                 <div className={classes['lines']}>
//                                                     <p>&#8226; Immediate Access to Exclusive Content</p>
//                                                 </div>
//                                                 <div className={classes['lines']}>
//                                                     <p>&#8226; Renews Annually</p>
//                                                 </div>
//                                             </div>
//                                             <div className={classes['submit-button']}>
//                                                 <button className={classes['suscribe-button']} onClick={() => displayRazorpay(999,365)}>Choose yearly Subscription</button>
//                                             </div>
//                                         </div>

                                        
//                                     </div>
//                                 </div>
                                
//                             </div>
//                         </div>
//                     )}


//         <div className={classes["second"]}>
//           <div className={classes["content"]}>
//             <p className={classes["content-p"]}>Content</p>
//           </div>
//           <div className={classes["favourite"]}>
//             <p className={classes["favourite-p"]}>Favourite</p>
//             <div className={classes["right-arrow-light"]}>
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="14"
//                 height="14"
//                 viewBox="0 0 14 14"
//                 fill="none"
//               >
//                 <g opacity="0.65">
//                   <path
//                     d="M4.10948 12.2459C4.24073 12.2459 4.37335 12.2021 4.48409 12.1146L10.2782 7.45386C10.419 7.34039 10.5011 7.16949 10.5011 6.98765C10.5011 6.80718 10.419 6.63492 10.2782 6.52281L4.5087 1.88668C4.25167 1.68023 3.87569 1.72125 3.66924 1.97828C3.4628 2.23531 3.50381 2.61129 3.76085 2.81773L8.95069 6.98902L3.73487 11.1836C3.47784 11.39 3.43682 11.766 3.64327 12.023C3.76221 12.1693 3.93448 12.2459 4.10948 12.2459Z"
//                     fill="#666666"
//                     stroke="#666666"
//                   />
//                 </g>
//               </svg>
//             </div>
//           </div>
//           <div className={classes["download"]}>
//             <p className={classes["download-p"]}>Download</p>
//             <div className={classes["right-arrow-dark"]}>
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="14"
//                 height="14"
//                 viewBox="0 0 14 14"
//                 fill="none"
//               >
//                 <g opacity="0.65">
//                   <path
//                     d="M4.10948 12.2459C4.24073 12.2459 4.37335 12.2021 4.48409 12.1146L10.2782 7.45386C10.419 7.34039 10.5011 7.16949 10.5011 6.98765C10.5011 6.80718 10.419 6.63492 10.2782 6.52281L4.5087 1.88668C4.25167 1.68023 3.87569 1.72125 3.66924 1.97828C3.4628 2.23531 3.50381 2.61129 3.76085 2.81773L8.95069 6.98902L3.73487 11.1836C3.47784 11.39 3.43682 11.766 3.64327 12.023C3.76221 12.1693 3.93448 12.2459 4.10948 12.2459Z"
//                     fill="black"
//                     stroke="black"
//                   />
//                 </g>
//               </svg>
//             </div>
//           </div>
//         </div>

//         <div className={classes["third"]} >
//           <div className={classes["wallet"]} onClick={handleButtonClick1}>
//             <p className={classes["wallet-p"]} >Digital Wallet</p>
//             <div className={classes["right-arrow-dark"]}>
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="14"
//                 height="14"
//                 viewBox="0 0 14 14"
//                 fill="none"
//               >
//                 <g opacity="0.65">
//                   <path
//                     d="M4.10948 12.2459C4.24073 12.2459 4.37335 12.2021 4.48409 12.1146L10.2782 7.45386C10.419 7.34039 10.5011 7.16949 10.5011 6.98765C10.5011 6.80718 10.419 6.63492 10.2782 6.52281L4.5087 1.88668C4.25167 1.68023 3.87569 1.72125 3.66924 1.97828C3.4628 2.23531 3.50381 2.61129 3.76085 2.81773L8.95069 6.98902L3.73487 11.1836C3.47784 11.39 3.43682 11.766 3.64327 12.023C3.76221 12.1693 3.93448 12.2459 4.10948 12.2459Z"
//                     fill="black"
//                     stroke="black"
//                   />
//                 </g>
//               </svg>
//             </div>
//           </div>
//         </div>

//         <div className={classes["fourth"]}>
//           <div className={classes["general"]}>
//             <p className={classes["general-p"]}>General</p>
//           </div>
//           <div className={classes["language-picker"]} onClick={openModal}>
//             <div className={classes["language"]}>
//               <p className={classes["news-language"]}>News Language</p>
//               <p className={classes["selected-language"]}>{selectedLanguage}</p>
//             </div>

//             <div className={classes["right-arrow-dark"]}>
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="14"
//                 height="14"
//                 viewBox="0 0 14 14"
//                 fill="none"
//               >
//                 <g opacity="0.65">
//                   <path
//                     d="M4.10948 12.2459C4.24073 12.2459 4.37335 12.2021 4.48409 12.1146L10.2782 7.45386C10.419 7.34039 10.5011 7.16949 10.5011 6.98765C10.5011 6.80718 10.419 6.63492 10.2782 6.52281L4.5087 1.88668C4.25167 1.68023 3.87569 1.72125 3.66924 1.97828C3.4628 2.23531 3.50381 2.61129 3.76085 2.81773L8.95069 6.98902L3.73487 11.1836C3.47784 11.39 3.43682 11.766 3.64327 12.023C3.76221 12.1693 3.93448 12.2459 4.10948 12.2459Z"
//                     fill="black"
//                     stroke="black"
//                   />
//                 </g>
//               </svg>
//             </div>
//           </div>
//           <Modal
//             isOpen={modalIsOpen}
//             onRequestClose={closeModal}
//             contentLabel="Language Picker"
//             ariaHideApp={false}
//             className={`${classes["modalContent"]} ${
//               isDarkMode ? classes["dark-mode-modal"] : ""
//             }`}
//           >
//             <div className={classes["select-heading"]}>
//               <h2>Select Language</h2>
//               <div className={classes["close"]}>
//                 <button onClick={closeModal} className={classes["close-btn"]}>
//                   x
//                 </button>
//               </div>
//             </div>

//             <ul className={classes.languageList}>
//               {languages.map((language) => (
//                 <li
//                   key={language}
//                   className={classes["languageItem"]}
//                   onClick={() => handleLanguageClick(language)}
//                 >
//                   {language}
//                 </li>
//               ))}
//             </ul>
//           </Modal>

//           {}

//           <div className={classes["dark-mode-toggle"]}>
//             <p className={classes["dark-mode-toggle-p"]}>
//               {isDarkMode ? "Light Mode" : "Dark Mode"}
//             </p>
//             <label className={classes["switch"]}>
//               <input
//                 type="checkbox"
//                 checked={isDarkMode}
//                 onChange={toggleDarkMode}
//               />
//               <span className={classes["slider"]}></span>
//             </label>
//           </div>
//         </div>

//         <div className={classes["fifth"]}>
//           <div className={classes["alerts"]}>
//             <p className={classes["alerts-p"]}>Alerts</p>
//           </div>
//           <div className={classes["notifications"]}>
//             <p className={classes["notifications-p"]}>Notifications</p>
//             <label class={classes["switch"]}>
//               <input type="checkbox" />
//               <span class={classes["slider"]}></span>
//             </label>
//           </div>
//         </div>

//         <div className={classes["sixth"]}>
//           <div className={classes["about"]}>
//             <p className={classes["about-p"]}>About</p>
//           </div>
//           <div className={classes["privacy"]}>
//             <p className={classes["privacy-p"]}>Privacy</p>
//           </div>
//           <div className={classes["terms"]}>
//             <p className={classes["terms-p"]}>Terms and Conditions</p>
//           </div>
//           <div className={classes["app-version"]}>
//             <p className={classes["app-version-p"]}>App Version</p>
//           </div>
//         </div>
//       </div>



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

// export default Dashboard;














import classes from "./Dashboard.module.css";
import Modal from "react-modal";
import backIcon from "../asset/back.svg";
import editIcon from "../asset/edit.svg";
import maleIcon from "../asset/male.svg";
import phoneIcon from "../asset/phone.svg";
import mailIcon from "../asset/mail.svg";
import balanceIcon from "../asset/balance.svg";
import rupeeIcon from "../asset/rupee.svg";
import profileIcon from "../asset/profile.svg";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "./DarkModeContext";
import { SERVER_URL } from "../index.js";
import React, { useEffect, useRef, useState } from 'react';
import { getDeviceInfo, getNetworkInfo } from "../helper/userFingerprint.js";
import { useCookies } from "react-cookie";
import { getParsedUA } from "../helper/parseUA.js";
import cssClass from "./Dashboard.module.css";
import Alert from "./Alert.jsx";
import payAsReadIcom from '../asset/pay-as-you-read.png';
import SubscriptionIcon from '../asset/subscription.png';
import Cookies from 'js-cookie';

const Dashboard = () => {
    //change

    const [payPerContentPrice,setPayPerContentPrice]=useState(0);//each content price will set according to handelchange
    const [articles, setArticles] = useState([]);//to store all articals values
    const [showPopup, setShowPopup] = useState(false);//this is for content show pop pup function
    const [contentId,setContentId]=useState(0);//to set content id for each content
    const [subscriptionValidity,setSubscriptionValidity]=useState()
    const [subscriberExistence, setSubscriberExistence] = useState(true);
    const [paymentStatus,setPaymentStatus]=useState(false)
    const [walletBalance, setWalletBalance] = useState(0);



//change
  const languages = ["English", "മലയാളം", "हिंदी"];
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [uid, setUid] = useState(localStorage.getItem("uid"));
  const [modalIsOpen, setModalIsOpen] = useState(false);
  // const [isDarkMode, setIsDarkMode] = useState(false);
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();

  const handleLanguageClick = (language) => {
    setSelectedLanguage(language);
    setModalIsOpen(false);
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  

  const handleImageClick = () => {
    navigate("/edit-profile");
  };

  const dateRef = useRef();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [activeSessions, setActiveSessions] = useState(null);
  const [error, setError] = useState(null);
  const [cookie, setCookie, removeCookie] = useCookies([
    "user_id",
    "session_id",
  ]);
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    honorific: "Mr",
  });
  const [showToast, setShowToast] = useState(null);
  const [pageReload, setPageReload] = useState(false);
  const [userUAInfo, setUserUAInfo] = useState(null);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(true);

  const [subscriptionButtonHandler,setSubscriptionButtonHandler]=useState(false)

  const toggleDeviceDropdown = (session) => {
   
    console.log(session.device_info.userAgent);
    formatUAInfo(session.device_info.userAgent);
    setActiveSessionId((prev) =>
      prev === session.session_id ? null : session.session_id
    );
  };

  const toggleDeviceDropdown1 = () => {
    setIsCollapsed(!isCollapsed);
    // console.log(session.device_info.userAgent);
    // formatUAInfo(session.device_info.userAgent);
    // setActiveSessionId((prev) =>
    //   prev === session.session_id ? null : session.session_id
    // );
  };

  useEffect(() => {
    console.log(uid);
    checkSessionStatus();
    fetchWalletBalance();
  }, []);

  useEffect(() => {
    if (localStorage.getItem("userInfo")) {
      setUserInfo(JSON.parse(localStorage.getItem("userInfo")));
    }
    console.log(userInfo);
  }, [userDetails]);

  const init = async () => {
    await checkSessionStatus();
    if (!localStorage.getItem("uid") || !localStorage.getItem("sid")) {
      setShowToast({ message: "Somthing went wrong", type: "error" });
      return;
    }
  };


  const formatUAInfo = (uaInfo) => {
    const parsedUA = getParsedUA(uaInfo);
    setUserUAInfo(parsedUA);
    console.log(parsedUA);
  };

  const fetchUserDetails = async () => {
    const response = await fetch(`${SERVER_URL}/get-user`, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseData = await response.json();
    if (response.status === 200) {
      setUserDetails(responseData);
    }
    
  };

  const checkSessionStatus = async () => {
    const response = await fetch(`${SERVER_URL}/check-session-status`, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseData = await response.json();
    try {
      if (response.status === 200) {
        await fetchUserDetails();
        await getAllUserSessions();
      } else if (response.status === 404) {
        // setError(responseData.error);
        console.log(showToast);
        setShowToast({ message: responseData.message, type: "error" });
        setTimeout(() => {
          setError(null);
          navigate("/");
          return;
        }, 2000);
      }
    } catch (error) {
      setShowToast({ message: String(error), type: "error" });
    }
    
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const openPopup = () => {
    setIsPopupOpen(true);
    setIsDropdownOpen(false);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const getAllUserSessions = async () => {
    // setPageReload(!pageReload);
    setIsPopupOpen(true);
    setIsDropdownOpen(false);
    console.log(cookie.user_id);
    const response = await fetch(`${SERVER_URL}/get-all-sessions`, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseData = await response.json();
    if (response.status === 200) {
      setActiveSessions(responseData.active_sessions);
    } else {
      // alert("Server error");
      setShowToast({ message: "Server error", type: "error" });
    }
  };

  const logoutFromDevice = async (session_id, user_id) => {
    const data = {
      session_id: session_id,
      user_id: user_id
    };
    const response = await fetch(`${SERVER_URL}/remove-user-session`, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (response.status === 200) {
      setShowToast({ message: "Logged out successfully", type: "error" });
      
      setTimeout(async() => {
        if (userDetails.session_info.session_id === session_id) {
          removeCookie("session_id");
          removeCookie("user_id");
          localStorage.clear();
          navigate("/home");
        } else { 
            await getAllUserSessions();
            navigate("/dashboard");
          
        }
        closePopup();
      }, 2000);
    } else {
      navigate("/404");
    }
  };

  // function setBackendCookie(name, value, days, domain) {
  //   let expires = "";
  //   if (days) {
  //     const date = new Date();
  //     date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  //     expires = "; expires=" + date.toUTCString();
  //   }
  //   document.cookie = name + "=" + (value || "")  + expires + "; path=/; domain=" + domain + "; samesite=Lax";
  // }

  const logoutFromAllDevice = async () => {
    const response = await fetch(`${SERVER_URL}/logout-from-all-device`, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      // alert("Logged out successfully");
      setShowToast({ message: "Logged out successfully", type: "success" });
      // localStorage.removeItem("loginMode");
      localStorage.clear();
      removeCookie("session_id");
      removeCookie("user_id");
      setTimeout(() => {
        navigate("/home");
        closePopup();
      }, 2000);
    } else {
      navigate("/404");
    }
  };

  const handelChange = (e) => {
    const { name, value } = e.target;
    console.log(name, "  ", value);
    setUserDetails((data) => ({
      ...data,
      [name]: value,
    }));
  };

  const handelUpdateUserDetails = async(e) => {
    e.preventDefault()
    const networkInfo = await getNetworkInfo();
    const deviceInfo = getDeviceInfo();
    const user_id = localStorage.getItem("uid");
    const session_id = localStorage.getItem("sid");
    const data = {
      phoneNumber: userDetails.phone,
      email: userDetails.email,
      name: userDetails.name,
      dob: userDetails.dob,
      // honorific: userDetails.honorific,
      status: "SUCCESS",
      fingerprint: {
        network: networkInfo,
        deviceInfo: deviceInfo,
        medium: localStorage.getItem("loginMode")
      },
      uid: user_id,
      sid: session_id
    };

    try {
      const response = await fetch(`${SERVER_URL}/update_user`, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      if(response.status === 200) {
        console.log(showToast);
        setShowToast({message : "details updated successfully", type: "success"});
        localStorage.setItem("uid", responseData.id );
        // console.log("hdvydevf :: ", responseData.session_id);
        console.log("mini :: ", responseData.session_info.session_id);
        localStorage.setItem("sid", responseData.session_info.session_id);
        console.log(responseData);
        setUserDetails(responseData);
        await fetchUserDetails();
        await getAllUserSessions();
        localStorage.setItem("userInfo", JSON.stringify(responseData));
        setTimeout(() => {
          setShowToast(null)
        }, 5000);
      }
    } catch(error) {
      setShowToast({message : "Error in updating user", type: "error"});
    }
  }

  const getDeviceImage = (browser, isAndroid) => {
    let deviceImage = require('../asset/browser.png');
    if (isAndroid) {
      deviceImage = require('../asset/smartphone.png');
    }
    else {
      if(browser === "Chrome") {
        deviceImage = require('../asset/chrome.png');
      }
      else if(browser === "Firefox") {
        deviceImage = require('../asset/firefox.png');
      }
      else if(browser === "Edge") {
        deviceImage = require('../asset/microsoft.png');
      }
    }
    console.log(deviceImage);
    
    return deviceImage;

  }

  const handleButtonClick = () => {
    navigate('/email');
  };

  const handleButtonClick1 = () => {
    navigate('/walletscreen');
  };

  const handleSubscriptionButton = () => {
    // navigate('/subscription');
    setSubscriptionButtonHandler(true)
  };
  const closeSubscriptionButtonPopup=()=>{
    setSubscriptionButtonHandler(false)
  }

  const checkSubscriberExistence = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/get_subscriber_by_id`, {
      method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
          body: JSON.stringify({user_id: uid }),
        });
   
      if (!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`);
      }
   
        const data = await response.json();
       if (data.success === 'exist') {
         // alert("subscriber already exist")
           setSubscriberExistence(false);
        
       }
    } catch (error) {
       console.error('Error fetching subscriber:', error);
       throw error;
     }
   };
 
 



// this function for whether the user have valid subscription or not
const checkSubscriptionValidity = async () => {
 try {
   const response = await fetch(`${SERVER_URL}/subscriptionValidity`, {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
     },
     body: JSON.stringify({ user_id: uid }),
   });

   // Ensure the response is valid
   if (!response.ok) {
     throw new Error('Network response was not ok');
   }

   // Parse JSON response
   const data = await response.json();

   // Handle the response data
   setSubscriptionValidity(data.access);
   // setDetails(data.details);
   console.log(data);
   console.log('Subscription validity response:', data.access);

 } catch (error) {
   console.error('There was a problem with the fetch operation:', error);
 }
};

// this is for razor pay 

const loadScript = (src) => {
 return new Promise((resolve) => {
  //  console.log("user id of the user is",uid)
   const script = document.createElement('script');
   script.src = src;
   script.onload = () => {
     resolve(true);
   };
   script.onerror = () => {
     resolve(false);
   };
   document.body.appendChild(script);
 });
};

const displayRazorpay = async (amount,duration) => {
 const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

 if (!res) {
   alert('Razorpay SDK failed to load. Are you online?');
   return;
 }
 console.log("amount",amount)
 makePayment(amount,duration);
};

const makePayment = async (amount,duration) => {
   console.log("make payment",amount)
 try {
   // Fetch order ID from your backend
   const response= await fetch(`${SERVER_URL}/create_order`, {
     method: 'POST',
       headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ courseAmount:amount}),
  });
   const data = await response.json();
   const newOrderId = data.order_id;
   var self=amount*100
   console.log("order ID------>"+newOrderId);

   const options = {
     key:'rzp_test_XIKIRmwuryqbiu', // Replace with your actual Razorpay API key
     amount: self,  // 1 INR = 100 paisa
     currency: 'INR',
     name: 'MBI',
     description: 'Test Transaction',
     image: 'https://example.com/your_logo',
     order_id: newOrderId.toString(),
     handler: (response) => {
       const handlePaymentSuccess = async () => {

         const paymentData = {
           razorpay_payment_id: response.razorpay_payment_id,
           razorpay_order_id: response.razorpay_order_id,
           razorpay_signature: response.razorpay_signature,
           uid:uid,
           money:self/100,
           duration:duration,
           contentId:null,
           rechargeType:"subscription"

           
         };

         try {
           // Call backend to handle payment success
           
           const verifyResponse = await fetch(`${SERVER_URL}/verify_payment`, {
             mode: "cors",
             cache: "no-cache",
             credentials: "include",
                    method: 'POST',
                      headers: {
                       'Content-Type': 'application/json',
                     },
                     body: JSON.stringify(paymentData),
                 });
                 const data = await verifyResponse.json();
                 if (data.message=='wallet recharge successful and content price deducted') {
                  setShowToast({
                    message:data.message,
                    type: "success",
                  });
                  setTimeout(()=>{setPaymentStatus(true)
                    
                    navigate('/contents')
                    navigate(`/contents/article/${contentId}`);
                    
                  },3000)
                  
                }else if(data.message=='Low wallet balance'){
                  setShowToast({
                    message:data.message,
                    type: "success",
                  });
                  setTimeout(()=>{setPaymentStatus(true)
                    setPaymentStatus(true)
                    alert(data.status)
                    navigate('/contents')
                    
                  },3000)
                  
  
                }else if(data.message=='Wallet recharged successfully'){
                  setShowToast({
                    message:data.message,
                    type: "success",
                  });
                  setTimeout(()=>{setPaymentStatus(true)
                    setPaymentStatus(true)
                    
                    navigate('/dashboard')
                    
                  },3000)
                  
                 
  
                }
  
                else{
                  console.log(paymentStatus);
                  alert('Payment successful');
                  navigate("/contents");
                }
  
           setSubscriptionButtonHandler(false);

           // Redirect to content page page or do further actions
            navigate('/dashboard') 
         } catch (error) {
           console.error('Payment verification failed:', error);
           alert('Payment verification failed');
           // Redirect to home or error page
           navigate('/dashboard');
         }
       };

       handlePaymentSuccess();
     },
     prefill: {
       name: "mbi_testing",  // Replace with actual user details
       email: "test@gmail.com",
       contact: "9635766141",
     },
     notes: {
       address: 'Kolkata',  // Replace with actual user address or additional notes
     },
     theme: {
       color: '#005792',  // Navy blue color
     },
     modal: {
       ondismiss: async () => {
         const failureData = {
           razorpay_payment_id: '',
           razorpay_order_id: newOrderId,
         };

       },
     },
   };

   const rzp = new window.Razorpay(options);

   // Handle payment failure
   rzp.on('payment.failed', async (response) => {
     const failureData = {
       razorpay_payment_id: response.error.metadata.payment_id,
       razorpay_order_id: response.error.metadata.order_id,
       uid:uid,
       money:self/100

     };

     try {
     
       const verifyResponse = await fetch(`${SERVER_URL}/record_payment_failure`, {
         method: 'POST',
           headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(failureData),
      });
       console.log("Failed paymentData----->"+JSON.stringify (failureData));
       alert('Payment failed and recorded.');
       navigate('/');
     } catch (error) {
       console.error('Failed to record payment failure:', error);
       alert('Failed to record payment failure.');
       navigate('/');
     }
   });

   rzp.open();
 } catch (error) {
   console.error('Error making payment:', error);
   alert('Error making payment. Please try again later.');
 }
};//razor pay code end

const fetchWalletBalance = async () => {
  try {
      const response = await fetch(`${SERVER_URL}/wallet/${uid}`);
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setWalletBalance(data.balance);
  } catch (error) {
      console.error('Error fetching wallet balance:', error);
  }
};
// const handlePay = async () => {
// if (walletBalance < payPerContentPrice) {
//     alert('Insufficient balance');
//     navigate(`/payment-option?amt=${payPerContentPrice}&contentId=${contentId}`)
// }
// else{
//   try {
//   const walletPamyemtData={
     
//      uid:uid,
//      money:payPerContentPrice,
//      duration:1,
//      contentId:contentId
     
//    };
 
// const response = await fetch(`${SERVER_URL}/pay_article`, {
//      method: 'POST',
//      headers: {
//          'Content-Type': 'application/json'
//      },
//      body: JSON.stringify(walletPamyemtData)
//  });

//  const data = await response.json();

//  if (data.status === 'success') {
//      alert('Article Purchased Successfully now you can  access your Articale');

//      setShowPopup(false)
//      setPaymentStatus(true)
//      // setWalletBalance(walletBalance - articleAmount); // Deduct amount from local state
//      // redirectToWallet(); // Redirect to wallet page
//      navigate(`article/${contentId}`);//all navigation will redirct to content page

//  } else {
//      alert('Payment Failed');
//  }
// } catch (error) {
//  console.error('Error paying for article:', error);
//  // alert('Payment Failed');
// }

// }


// };

  return (
    <>
      <div
        className={`${classes["dashboard-container"]} ${
          isDarkMode ? classes["dark-mode"] : ""
        }`}
      >
        <div className={classes["dashboard-profile"]}>
          <div className={classes["head"]}>
            <div>
              <img src={backIcon} alt="" />
            </div>
            <div>
              <p>Profile</p>
            </div>
            <div>
              <img
                src={editIcon}
                alt=""
                onClick={handleImageClick}
                className={classes["edit-details"]}
              />
            </div>
          </div>
          <div className={classes["bottom"]}>
            <div className={classes["left"]}>
              <img src={profileIcon} alt="" />
            </div>
            <div className={classes["right"]}>
              <div className={classes["name"]}>
                <p className={classes["name-p"]}>
                  {userDetails ? userDetails.name : ""}
                </p>
              </div>
              <div className={classes["gender"]}>
                <img src={maleIcon} alt="" />
                <p className={classes["gender-p"]}>
                  {userDetails ? userDetails.gender : ""}
                </p>
              </div>
              <div className={classes["phone"]}>
                <img src={phoneIcon} alt="" />
                <p className={classes["phone-p"]}>
                  {userDetails ? userDetails.phone : ""}
                </p>
              </div>
              <div className={classes["email"]}>
                <img src={mailIcon} alt="" />
                <p className={classes["email-p"]}>
                  {userDetails ? userDetails.email : ""}
                </p>
              </div>
              <div className={classes["balance"]}>
                <img src={balanceIcon} alt="" />
                <p className={classes["balance-p"]}>Balance :</p>
                <img src={rupeeIcon} alt="" />
                <p className={classes["balance-p"]}>{walletBalance}</p>
              </div>
            </div>
          </div>
        </div>

        <div className={classes["first"]}>
          <div className={classes["subscription"]} onClick={handleSubscriptionButton}>
            <p className={classes["subscription-p"]} >Subscription</p>
            <div className={classes["right-arrow-light"]}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
              >
                <g opacity="0.65">
                  <path
                    d="M4.10948 12.2459C4.24073 12.2459 4.37335 12.2021 4.48409 12.1146L10.2782 7.45386C10.419 7.34039 10.5011 7.16949 10.5011 6.98765C10.5011 6.80718 10.419 6.63492 10.2782 6.52281L4.5087 1.88668C4.25167 1.68023 3.87569 1.72125 3.66924 1.97828C3.4628 2.23531 3.50381 2.61129 3.76085 2.81773L8.95069 6.98902L3.73487 11.1836C3.47784 11.39 3.43682 11.766 3.64327 12.023C3.76221 12.1693 3.93448 12.2459 4.10948 12.2459Z"
                    fill="#666666"
                    stroke="#666666"
                  />
                </g>
              </svg>
            </div>
          </div>

          

          <div className={classes["device-management"]} onClick={() => toggleDeviceDropdown1()}>
            <p className={classes["device-management-p"]}>Device Management</p>
            <div className={classes["right-arrow-light"]}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
              >
                <g opacity="0.65">
                  <path
                    d="M4.10948 12.2459C4.24073 12.2459 4.37335 12.2021 4.48409 12.1146L10.2782 7.45386C10.419 7.34039 10.5011 7.16949 10.5011 6.98765C10.5011 6.80718 10.419 6.63492 10.2782 6.52281L4.5087 1.88668C4.25167 1.68023 3.87569 1.72125 3.66924 1.97828C3.4628 2.23531 3.50381 2.61129 3.76085 2.81773L8.95069 6.98902L3.73487 11.1836C3.47784 11.39 3.43682 11.766 3.64327 12.023C3.76221 12.1693 3.93448 12.2459 4.10948 12.2459Z"
                    fill="#666666"
                    stroke="#666666"
                  />
                </g>
              </svg>
            </div>
          </div>

            {!isCollapsed && (
                <div>
                    <div className={cssClass["popup-content"]}>
                        {activeSessions &&
                          activeSessions.map((session) => (
                            <div className={cssClass["device-container"]} key={session.session_id}>
                              <div
                                className={
                                  activeSessionId === session.session_id
                                    ? cssClass["device-num-expand"]
                                    : cssClass["device-num"]
                                }

                                onClick={() => toggleDeviceDropdown(session)}
                              >
                                <div className={cssClass["remove-part"]}>
                                <img src={getDeviceImage(session.device_info.browser, session.device_info.isAndroid)} alt="" />
                          <div>
                            <p className={cssClass["browser"]}>
                              {session.device_info.isAndroid
                                ? "Android"
                                : session.device_info.browser}
                            </p>
                            {userDetails.session_info.session_id ===
                              session.session_id && (
                              <p className={cssClass["point"]}>
                                &#8226;This device
                              </p>
                            )}
                          </div>
                                </div>
                                <div
                                  className={cssClass["this-device"]}
                                   onClick={(e) =>{
                                    e.stopPropagation();
                                    logoutFromDevice(session.session_id, session.user_info.id)
                                  }
                                  }
                                >
                                  remove
                                </div>
                              </div>
                              <div
                                className={cssClass["device-info-container"]}
                              >
                                {activeSessionId === session.session_id && (
                                  <div className={cssClass["device-info"]}>
                                    <div
                                      className={cssClass["device-info-child"]}
                                    >
                                      <div
                                        className={
                                          cssClass["device-info-child-head"]
                                        }
                                      >
                                        User
                                      </div>
                                      <p>
                                        Name :
                                        {session.user_info.name !== ""
                                          ? session.user_info.name
                                          : "None"}
                                      </p>
                                      <p>
                                        Email :
                                        {session.user_info.email !==
                                        ""
                                          ? session.user_info.email
                                          : "None"}
                                      </p>
                                      <p>
                                        Phone :
                                        {session.user_info.phone !== ""
                                          ? session.user_info.phone
                                          : "None"}
                                      </p>
                                    </div>
                                    <div
                                      className={cssClass["device-info-child"]}
                                    >
                                      <div
                                        className={
                                          cssClass["device-info-child-head"]
                                        }
                                      >
                                        Browser
                                      </div>
                                      <p>
                                        Name :
                                        {userUAInfo.browser.name !== undefined
                                          ? userUAInfo.browser.name
                                          : "None"}
                                      </p>
                                      <p>
                                        Major :
                                        {userUAInfo.browser.version !==
                                        undefined
                                          ? userUAInfo.browser.version
                                          : "None"}
                                      </p>
                                      <p>
                                        Version :
                                        {userUAInfo.browser.major !== undefined
                                          ? userUAInfo.browser.major
                                          : "None"}
                                      </p>
                                    </div>
                                    {}
                                    <div
                                      className={cssClass["device-info-child"]}
                                    >
                                      <div
                                        className={
                                          cssClass["device-info-child-head"]
                                        }
                                      >
                                        OS
                                      </div>
                                      <p>
                                        Name :{" "}
                                        {userUAInfo.os.name !== undefined
                                          ? userUAInfo.os.name
                                          : "None"}
                                      </p>
                                      <p>
                                        Version :{" "}
                                        {userUAInfo.os.version !== undefined
                                          ? userUAInfo.os.version
                                          : "None"}
                                      </p>
                                    </div>
                                    {}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                          </div>

                        <div
                          className={cssClass["log-out"]}
                          onClick={logoutFromAllDevice}
                        >
                          <button>Log out from all devices</button>
                        </div>
                     
                </div>
            )}

          <div className={classes["e-Paper"]}  onClick={handleButtonClick}>
            <p className={classes["e-Paper-p"]}>e-Paper</p>
            <div className={classes["right-arrow-light"]}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
              >
                <g opacity="0.65">
                  <path
                    d="M4.10948 12.2459C4.24073 12.2459 4.37335 12.2021 4.48409 12.1146L10.2782 7.45386C10.419 7.34039 10.5011 7.16949 10.5011 6.98765C10.5011 6.80718 10.419 6.63492 10.2782 6.52281L4.5087 1.88668C4.25167 1.68023 3.87569 1.72125 3.66924 1.97828C3.4628 2.23531 3.50381 2.61129 3.76085 2.81773L8.95069 6.98902L3.73487 11.1836C3.47784 11.39 3.43682 11.766 3.64327 12.023C3.76221 12.1693 3.93448 12.2459 4.10948 12.2459Z"
                    fill="#666666"
                    stroke="#666666"
                  />
                </g>
              </svg>
            </div>
          </div>
        </div>



        <div className={classes["second"]}>
          <div className={classes["content"]}>
            <p className={classes["content-p"]}>Content</p>
          </div>
          <div className={classes["favourite"]}>
            <p className={classes["favourite-p"]}>Favourite</p>
            <div className={classes["right-arrow-light"]}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
              >
                <g opacity="0.65">
                  <path
                    d="M4.10948 12.2459C4.24073 12.2459 4.37335 12.2021 4.48409 12.1146L10.2782 7.45386C10.419 7.34039 10.5011 7.16949 10.5011 6.98765C10.5011 6.80718 10.419 6.63492 10.2782 6.52281L4.5087 1.88668C4.25167 1.68023 3.87569 1.72125 3.66924 1.97828C3.4628 2.23531 3.50381 2.61129 3.76085 2.81773L8.95069 6.98902L3.73487 11.1836C3.47784 11.39 3.43682 11.766 3.64327 12.023C3.76221 12.1693 3.93448 12.2459 4.10948 12.2459Z"
                    fill="#666666"
                    stroke="#666666"
                  />
                </g>
              </svg>
            </div>
          </div>
          <div className={classes["download"]}>
            <p className={classes["download-p"]}>Download</p>
            <div className={classes["right-arrow-dark"]}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
              >
                <g opacity="0.65">
                  <path
                    d="M4.10948 12.2459C4.24073 12.2459 4.37335 12.2021 4.48409 12.1146L10.2782 7.45386C10.419 7.34039 10.5011 7.16949 10.5011 6.98765C10.5011 6.80718 10.419 6.63492 10.2782 6.52281L4.5087 1.88668C4.25167 1.68023 3.87569 1.72125 3.66924 1.97828C3.4628 2.23531 3.50381 2.61129 3.76085 2.81773L8.95069 6.98902L3.73487 11.1836C3.47784 11.39 3.43682 11.766 3.64327 12.023C3.76221 12.1693 3.93448 12.2459 4.10948 12.2459Z"
                    fill="black"
                    stroke="black"
                  />
                </g>
              </svg>
            </div>
          </div>
        </div>

        <div className={classes["third"]} >
          <div className={classes["wallet"]} onClick={handleButtonClick1}>
            <p className={classes["wallet-p"]} >Digital Wallet</p>
            <div className={classes["right-arrow-dark"]}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
              >
                <g opacity="0.65">
                  <path
                    d="M4.10948 12.2459C4.24073 12.2459 4.37335 12.2021 4.48409 12.1146L10.2782 7.45386C10.419 7.34039 10.5011 7.16949 10.5011 6.98765C10.5011 6.80718 10.419 6.63492 10.2782 6.52281L4.5087 1.88668C4.25167 1.68023 3.87569 1.72125 3.66924 1.97828C3.4628 2.23531 3.50381 2.61129 3.76085 2.81773L8.95069 6.98902L3.73487 11.1836C3.47784 11.39 3.43682 11.766 3.64327 12.023C3.76221 12.1693 3.93448 12.2459 4.10948 12.2459Z"
                    fill="black"
                    stroke="black"
                  />
                </g>
              </svg>
            </div>
          </div>
        </div>

        <div className={classes["fourth"]}>
          <div className={classes["general"]}>
            <p className={classes["general-p"]}>General</p>
          </div>
          <div className={classes["language-picker"]} onClick={openModal}>
            <div className={classes["language"]}>
              <p className={classes["news-language"]}>News Language</p>
              <p className={classes["selected-language"]}>{selectedLanguage}</p>
            </div>

            <div className={classes["right-arrow-dark"]}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
              >
                <g opacity="0.65">
                  <path
                    d="M4.10948 12.2459C4.24073 12.2459 4.37335 12.2021 4.48409 12.1146L10.2782 7.45386C10.419 7.34039 10.5011 7.16949 10.5011 6.98765C10.5011 6.80718 10.419 6.63492 10.2782 6.52281L4.5087 1.88668C4.25167 1.68023 3.87569 1.72125 3.66924 1.97828C3.4628 2.23531 3.50381 2.61129 3.76085 2.81773L8.95069 6.98902L3.73487 11.1836C3.47784 11.39 3.43682 11.766 3.64327 12.023C3.76221 12.1693 3.93448 12.2459 4.10948 12.2459Z"
                    fill="black"
                    stroke="black"
                  />
                </g>
              </svg>
            </div>
          </div>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            contentLabel="Language Picker"
            ariaHideApp={false}
            className={`${classes["modalContent"]} ${
              isDarkMode ? classes["dark-mode-modal"] : ""
            }`}
          >
            <div className={classes["select-heading"]}>
              <h2>Select Language</h2>
              <div className={classes["close"]}>
                <button onClick={closeModal} className={classes["close-btn"]}>
                  x
                </button>
              </div>
            </div>

            <ul className={classes.languageList}>
              {languages.map((language) => (
                <li
                  key={language}
                  className={classes["languageItem"]}
                  onClick={() => handleLanguageClick(language)}
                >
                  {language}
                </li>
              ))}
            </ul>
          </Modal>

          {}

          <div className={classes["dark-mode-toggle"]}>
            <p className={classes["dark-mode-toggle-p"]}>
              {isDarkMode ? "Light Mode" : "Dark Mode"}
            </p>
            <label className={classes["switch"]}>
              <input
                type="checkbox"
                checked={isDarkMode}
                onChange={toggleDarkMode}
              />
              <span className={classes["slider"]}></span>
            </label>
          </div>
        </div>

        <div className={classes["fifth"]}>
          <div className={classes["alerts"]}>
            <p className={classes["alerts-p"]}>Alerts</p>
          </div>
          <div className={classes["notifications"]}>
            <p className={classes["notifications-p"]}>Notifications</p>
            <label class={classes["switch"]}>
              <input type="checkbox" />
              <span class={classes["slider"]}></span>
            </label>
          </div>
        </div>

        <div className={classes["sixth"]}>
          <div className={classes["about"]}>
            <p className={classes["about-p"]}>About</p>
          </div>
          <div className={classes["privacy"]}>
            <p className={classes["privacy-p"]}>Privacy</p>
          </div>
          <div className={classes["terms"]}>
            <p className={classes["terms-p"]}>Terms and Conditions</p>
          </div>
          <div className={classes["app-version"]}>
            <p className={classes["app-version-p"]}>App Version</p>
          </div>
        </div>
        { subscriptionButtonHandler && (
                        <div className={classes['popup']}>
                            <div className={`${classes['popup-content']} ${isDarkMode ? classes['dark-mode'] : ''}`}>
                                <div className={classes['close']}>
                                    {/* <button className={`${classes['close-btn']} ${isDarkMode ? classes['dark-mode'] : ''}`}onClick={closeSubscriptionButtonPopup}>X</button> */}
                                </div>
                                <div className={classes['subscription-container']}>
                                    <div className={classes['heading']}>
                                        <h1 assName={classes['heading-read']}>To read this article subscribe</h1>
                                        <button className={`${classes['close-btn']} ${isDarkMode ? classes['dark-mode'] : ''}`}onClick={closeSubscriptionButtonPopup}>X</button>
                                    </div>

                                    <div className={classes['cards']}>

                                        <div className={classes['left']}>
                                            <div className={classes['image']}>
                                                <img src={payAsReadIcom} alt="" />
                                            </div>
                                            <h2>Monthly</h2>
                                            <div className={classes['monthly-description']}>
                                                <div className={classes['lines']}>
                                                    <p>&#8226; Perfect for the dynamic reader</p>
                                                </div>
                                                <div className={classes['lines']}>
                                                    <p>&#8226; Immediate access to Exclusive Content</p>
                                                </div>
                                                <div className={classes['lines']}>
                                                    <p>&#8226; Premium Features:ad-free interface,......</p>
                                                </div>
                                                <div className={classes['lines']}>
                                                    <p>&#8226; Renews each month</p>
                                                </div>
                                            </div>
                                            <div className={classes['submit-button']}>
                                                <button className={classes['suscribe-button']} onClick={() => displayRazorpay(199,30)}>Choose monthly Subscription</button>
                                            </div>
                                        </div>

                                        <div className={classes['middle']}>
                                            <div className={classes['image']}>
                                                <img src={SubscriptionIcon} alt="" />
                                            </div>
                                            <h2>Yearly</h2>
                                            <div className={classes['yearly-description']}>
                                                <div className={classes['lines']}>
                                                    <p>&#8226; Exceptional Value: Unlimited access at a reduced cost (12 months for the cost of 10)</p>
                                                </div>
                                                <div className={classes['lines']}>
                                                    <p>&#8226; Comprehensive Archive Access for research, nostalgia, or simply satisfying your curiosity</p>
                                                </div>
                                                <div className={classes['lines']}>
                                                    <p>&#8226; Immediate Access to Exclusive Content</p>
                                                </div>
                                                <div className={classes['lines']}>
                                                    <p>&#8226; Renews Annually</p>
                                                </div>
                                            </div>
                                            <div className={classes['submit-button']}>
                                                <button className={classes['suscribe-button']} onClick={() => displayRazorpay(999,365)}>Choose yearly Subscription</button>
                                            </div>
                                        </div>

                                        
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                    )}
      </div>



      {showToast != null && (
        <Alert
          message={showToast.message}
          type={showToast.type}
          setShowToast={setShowToast}
        />
      )}
    </>
  );
};

export default Dashboard;