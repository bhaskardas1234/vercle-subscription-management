// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useLocation, useNavigate } from "react-router-dom";
// import classes from "./Wallet.module.css";
// import arrowIcon from "../asset/right-arrow.png";
// import { SERVER_URL } from "../index";
// import Cookies from "js-cookie";
// import Modal from "react-modal";
// import Alert from "./Alert.jsx";
// import Loader from "./Loader.jsx";
// import { ClipLoader } from "react-spinners";



// const WalletScreen = () => {

//   const [balance, setBalance] = useState(0);
//   const navigate = useNavigate();
//   const [selectedAmount, setSelectedAmount] = useState(null);
//   const [showInput, setShowInput] = useState(false);
//   const [updateAmount, setUpdateAmount] = useState("");
//   const [uid, setUid] = useState(Cookies.get("user_id"));
//   const [contentId, setContentId] = useState(0);
//   const [paymentStatus, setPaymentStatus] = useState(false);
//   const location = useLocation();
//   const [callbackLoader, setCallbackLoader] = useState(false);
//   const [showToast, setShowToast] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     const id = new URLSearchParams(location.search).get("contentId");
//     console.log(id, "this is id i  am getting")
//     // console.log(amount1);
//     // setPayPerContentPrice(amount1);
//     setContentId(id);
//   }, []);

//   useEffect(() => {
//     const fetchBalance = async () => {
//       // console.log(uid,"jdjerekrjkejk")
//       try {
//         const response = await fetch(`${SERVER_URL}/wallet/${uid}`);
//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         const data = await response.json();
//         setBalance(data.balance);
//       } catch (error) {
//         console.error('Error fetching balance:', error);
//       }
//     };

//     fetchBalance();
//   }, [paymentStatus]); // Dependency array to refetch when userId changes

//   const loadScript = (src) => {
//     return new Promise((resolve) => {
//       console.log("user id of the user is", uid);
//       const script = document.createElement("script");
//       script.src = src;
//       script.onload = () => {
//         resolve(true);
//       };
//       script.onerror = () => {
//         resolve(false);
//       };
//       document.body.appendChild(script);
//     });
//   };

//   const displayRazorpay = async (amount, duration) => {
//     const res = await loadScript(
//       "https://checkout.razorpay.com/v1/checkout.js"
//     );

//     if (!res) {
//       alert("Razorpay SDK failed to load. Are you online?");
//       return;
//     }
//     console.log("amount", amount);
//     console.log("duration", duration);
//     makePayment(amount, duration);
//   };

//   const makePayment = async (amount, duration) => {
//     console.log("make payment", amount);
//     try {
//       // Fetch order ID from your backend
//       const response = await fetch(`${SERVER_URL}/create_order`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ courseAmount: amount }),
//       });
//       const data = await response.json();
//       const newOrderId = data.order_id;
//       var self = amount * 100;
//       console.log("order ID------>" + newOrderId);

//       const options = {
//         key: "rzp_test_XIKIRmwuryqbiu", // Replace with your actual Razorpay API key
//         amount: self, // 1 INR = 100 paisa
//         currency: "INR",
//         name: "MBI",
//         description: "Test Transaction",
//         image: "https://example.com/your_logo",
//         order_id: newOrderId.toString(),
//         handler: (response) => {
//           const handlePaymentSuccess = async () => {
//             const paymentData = {
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_signature: response.razorpay_signature,
//               uid: uid,
//               money: self / 100,
//               duration: duration,
//               contentId: contentId,
//               rechargeType: "wallet"
//             };
//             setIsLoading(true);
//             try {
//               // Call backend to handle payment success

//               const verifyResponse = await fetch(
//                 `${SERVER_URL}/verify_payment`,
//                 {
//                   mode: "cors",
//                   cache: "no-cache",
//                   credentials: "include",
//                   method: "POST",
//                   headers: {
//                     "Content-Type": "application/json",
//                   },
//                   body: JSON.stringify(paymentData),
//                 }
//               );
//               const data = await verifyResponse.json();
//               // if (data.status=='Payment successful') {
//               //   setPaymentStatus(true)

//               //   alert("You wallet recharge has been done !")
//               //   if (contentId!=null){
//               //     navigate('/contents')
//               //     // navigate(`/contents/article/${contentId}`);
//               //   }
//               //   else{
//               //     navigate(`/dashboard`)
//               //   }
//               // }
//               // else{
//               //   alert('Payment not successful');
//               //   navigate("/contents");
//               // }

//               if (data.status == 'wallet has been recharged and content price has been deducted') {
//                 setPaymentStatus(true)
//                 alert(data.status)
//                 navigate('/contents')
//                 navigate(`/contents/article/${contentId}`);

//               } else if (data.status == 'low wallet balance') {
//                 setPaymentStatus(true)
//                 alert(data.status)
//                 navigate('/contents')

//               } else if (data.status == 'wallet recharge has been successfully done') {
//                 setPaymentStatus(true)
//                 alert(data.status)
//                 navigate('/dashboard')

//               }

//               else {
//                 console.log(paymentStatus);
//                 alert('Payment successful');
//                 navigate("/contents");
//               }
//               //there will be pop up with the heading that do you want to pay for this content? yes or no?
//               //return your popup code here

//               // Redirect to content page page or do further actions
//             } catch (error) {
//               console.error("Payment verification failed:", error);
//               alert("Payment verification failed");
//               // Redirect to home or error page
//               navigate("/walletscreen");
//             }
//           };
//           setIsLoading(false);
//           handlePaymentSuccess();
//         },
//         prefill: {
//           name: "mbi_testing", // Replace with actual user details
//           email: "test@gmail.com",
//           contact: "9635766141",
//         },
//         notes: {
//           address: "Kolkata", // Replace with actual user address or additional notes
//         },
//         theme: {
//           color: "#005792", // Navy blue color
//         },
//         modal: {
//           ondismiss: async () => {
//             const failureData = {
//               razorpay_payment_id: "",
//               razorpay_order_id: newOrderId,
//             };
//           },
//         },
//       };

//       const rzp = new window.Razorpay(options);

//       // Handle payment failure
//       rzp.on("payment.failed", async (response) => {
//         const failureData = {
//           razorpay_payment_id: response.error.metadata.payment_id,
//           razorpay_order_id: response.error.metadata.order_id,
//           uid: uid,
//           money: self / 100,
//         };

//         try {
//           const verifyResponse = await fetch(
//             `${SERVER_URL}/record_payment_failure`,
//             {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//               },
//               body: JSON.stringify(failureData),
//             }
//           );
//           console.log("Failed paymentData----->" + JSON.stringify(failureData));
//           alert("Payment failed and recorded.");
//           navigate("/contents");
//         } catch (error) {
//           console.error("Failed to record payment failure:", error);
//           alert("Failed to record payment failure.");
//           navigate("/contents");
//         }
//       });

//       rzp.open();
//     } catch (error) {
//       console.error("Error making payment:", error);
//       alert("Error making payment. Please try again later.");
//     }
//   }; //razor pay code end


//   const handleAddFunds = (amt) => {
//     displayRazorpay(amt, 1);
//   };

//   const handleOtherClick = () => {
//     setSelectedAmount(null); // Deselect other amounts
//     setShowInput(true); // Show the input field
//   };

//   const handleImageClick = () => {
//     navigate("/transaction-history");
//   };

//   const handleUpdateClick = () => {
//     if (selectedAmount !== null) {
//       handleAddFunds(selectedAmount);
//     } else if (showInput) {
//       handleAddFunds(updateAmount);
//     }
//   };




//   return (
//     <>
//       {callbackLoader ? (
//       <div className="loader-container">
//         <Loader />
//       </div>) : 
//       !isLoading ? (
//         <>
//           <div className={classes["wallets-container"]}>
//             <div className={classes["info"]}>
//               <h1 className={classes["info-wallet"]}>Wallet</h1>
//             </div>
  
//             <div className={classes["choose-amount"]}>
//               <p className={classes["choose-amount-p"]}>
//                 Choose an amount to add to your account, then use it to purchase and
//                 subscribe to services and products.
//               </p>
//             </div>
  
//             <div className={classes["amounts"]}>
//               <div className={classes["amounts-first-row"]}>
//                 <p
//                   className={`${classes["amounts-100"]} ${selectedAmount === 100 ? classes["selected"] : ""
//                     }`}
//                   onClick={() => {
//                     setSelectedAmount(100);
//                     setShowInput(false);
//                   }}
//                 >
//                   100
//                 </p>
//                 <p
//                   className={`${classes["amounts-200"]} ${selectedAmount === 200 ? classes["selected"] : ""
//                     }`}
//                   onClick={() => {
//                     setSelectedAmount(200);
//                     setShowInput(false);
//                   }}
//                 >
//                   200
//                 </p>
//               </div>
//               <div className={classes["amounts-second-row"]}>
//                 <p
//                   className={`${classes["amounts-500"]} ${selectedAmount === 500 ? classes["selected"] : ""
//                     }`}
//                   onClick={() => {
//                     setSelectedAmount(500);
//                     setShowInput(false);
//                   }}
//                 >
//                   500
//                 </p>
//                 <p
//                   className={`${classes["amounts-other"]} ${showInput ? classes["selected"] : ""
//                     }`}
//                   onClick={handleOtherClick}
//                 >
//                   Other
//                 </p>
//               </div>
  
//               {showInput && (
//                 <div className={classes["add-fund-other"]}>
//                   <input
//                     type="number"
//                     placeholder="Add Funds"
//                     className={classes["add-fund"]}
//                     value={updateAmount}
//                     onChange={(e) => setUpdateAmount(Number(e.target.value))}
//                   />
//                 </div>
//               )}
//             </div>
  
//             <div className={classes["balance"]}>
//               <p className={classes["balance-latest"]}>Balance: {balance}</p>
//             </div>
  
//             <div className={classes["update"]}>
//               <button
//                 onClick={handleUpdateClick}
//                 className={classes["update-button"]}
//               >
//                 Update
//               </button>
//             </div>
  
//             <div className={classes["transactions"]}>
//               <p className={classes["all-transactions"]}>All Transactions</p>
//               <img
//                 src={arrowIcon}
//                 className={classes["arrow-image"]}
//                 onClick={handleImageClick}
//                 alt="View All Transactions"
//               />
//             </div>
//           </div>
//         </>
//       ) : (
//         <div className="clip-loader-container">
//           <button disabled>
//             <Loader/>
//           </button>
//         </div>
//       )}
  
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

// export default WalletScreen;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import classes from "./Wallet.module.css";
import arrowIcon from "../asset/right-arrow.png";
import { SERVER_URL } from "../index";
import Cookies from "js-cookie";
import Modal from "react-modal";
import Alert from "./Alert.jsx";
import Loader from "./Loader.jsx";
import { useDarkMode } from "./DarkModeContext";

const WalletScreen = () => {
 
  const [balance, setBalance] = useState(0);
  const navigate = useNavigate();
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [showInput, setShowInput] = useState(false);
  const [updateAmount, setUpdateAmount] = useState("");
  const [uid, setUid] = useState(localStorage.getItem("uid"));
  const [contentId, setContentId] = useState(0);
  const[paymentStatus,setPaymentStatus]=useState(false);
  const location = useLocation();
  const [callbackLoader, setCallbackLoader] = useState(false);
  const [showToast, setShowToast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  useEffect(() => {
    const id = new URLSearchParams(location.search).get("contentId");
    console.log(id,"this is id i  am getting")
    // console.log(amount1);
    // setPayPerContentPrice(amount1);
    setContentId(id);
  }, []);

  useEffect(() => {
    const fetchBalance = async () => {
      // console.log(uid,"jdjerekrjkejk")
      try {
        const response = await fetch(`${SERVER_URL}/wallet/${uid}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setBalance(data.balance);
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    };

    fetchBalance();
  }, [paymentStatus]); // Dependency array to refetch when userId changes

  const loadScript = (src) => {
    return new Promise((resolve) => {
      console.log("user id of the user is", uid);
      const script = document.createElement("script");
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

  const displayRazorpay = async (amount, duration) => {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }
    console.log("amount", amount);
    console.log("duration", duration);
    makePayment(amount, duration);
  };

  const makePayment = async (amount, duration) => {
    console.log("make payment", amount);
    try {
      // Fetch order ID from your backend
      const response = await fetch(`${SERVER_URL}/create_order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseAmount: amount }),
      });
      const data = await response.json();
      const newOrderId = data.order_id;
      var self = amount * 100;
      console.log("order ID------>" + newOrderId);

      const options = {
        key: "rzp_test_XIKIRmwuryqbiu", // Replace with your actual Razorpay API key
        amount: self, // 1 INR = 100 paisa
        currency: "INR",
        name: "MBI",
        description: "Test Transaction",
        image: "https://example.com/your_logo",
        order_id: newOrderId.toString(),
        handler: (response) => {
          const handlePaymentSuccess = async () => {
            const paymentData = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              uid: uid,
              money: self / 100,
              duration: duration,
              contentId: contentId,
              rechargeType:"wallet"
            };
            setIsLoading(true);
            try {
              // Call backend to handle payment success

              const verifyResponse = await fetch(
                `${SERVER_URL}/verify_payment`,
                {
                  mode: "cors",
                  cache: "no-cache",
                  credentials: "include",
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(paymentData),
                }
              );
              const data = await verifyResponse.json();
              if(verifyResponse.status==500){
                alert("payment not success full")

               }
              else if (data.message=='wallet recharge successful and content price deducted') {
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

             } catch (error) {
              console.error("Payment verification failed:", error);
              alert("Payment verification failed");
              // Redirect to home or error page
              navigate("/walletscreen");
            }
          };
          setIsLoading(false);
          handlePaymentSuccess();
        },
        prefill: {
          name: "mbi_testing", // Replace with actual user details
          email: "test@gmail.com",
          contact: "9635766141",
        },
        notes: {
          address: "Kolkata", // Replace with actual user address or additional notes
        },
        theme: {
          color: "#005792", // Navy blue color
        },
        modal: {
          ondismiss: async () => {
            const failureData = {
              razorpay_payment_id: "",
              razorpay_order_id: newOrderId,
            };
          },
        },
      };

      const rzp = new window.Razorpay(options);

      // Handle payment failure
      rzp.on("payment.failed", async (response) => {
        const failureData = {
          razorpay_payment_id: response.error.metadata.payment_id,
          razorpay_order_id: response.error.metadata.order_id,
          uid: uid,
          money: self / 100,
        };

        try {
          const verifyResponse = await fetch(
            
            `${SERVER_URL}/record_payment_failure`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(failureData),
            }
          );
          console.log("Failed paymentData----->" + JSON.stringify(failureData));
          alert("Payment failed and recorded.");
          navigate("/contents");
        } catch (error) {
          console.error("Failed to record payment failure:", error);
          alert("Failed to record payment failure.");
          navigate("/contents");
        }
      });

      rzp.open();
    } catch (error) {
      console.error("Error making payment:", error);
      alert("Error making payment. Please try again later.");
    }
  }; //razor pay code end

  
  const handleAddFunds = (amt) => {
    displayRazorpay(amt, 1);
  };

  const handleOtherClick = () => {
    setSelectedAmount(null); // Deselect other amounts
    setShowInput(true); // Show the input field
  };

  const handleImageClick = () => {
    navigate("/transaction-history");
  };

  const handleUpdateClick = () => {
    if (selectedAmount !== null) {
      handleAddFunds(selectedAmount);
    } else if (showInput) {
      handleAddFunds(updateAmount);
    }
  };

  return (
    <>
      {callbackLoader ? (
      <div className="loader-container">
        <Loader />
      </div>) : 
      !isLoading ? (
        <>
          <div className={`${classes['wallets-container']} ${isDarkMode ?  classes['dark-mode'] : ''}`}>
            <div className={classes["info"]}>
            <h1 className={`${classes['info-wallet']} ${isDarkMode ? classes['dark-mode'] : ''}`}>Wallet</h1>
            </div>
  
            <div className={classes["choose-amount"]}>
              <p className={classes["choose-amount-p"]}>
                Choose an amount to add to your account, then use it to purchase and
                subscribe to services and products.
              </p>
            </div>
  
            <div className={classes["amounts"]}>
              <div className={classes["amounts-first-row"]}>
                <p
                  className={`${classes["amounts-100"]} ${selectedAmount === 100 ? classes["selected"] : ""
                    }`}
                  onClick={() => {
                    setSelectedAmount(100);
                    setShowInput(false);
                  }}
                >
                  100
                </p>
                <p
                  className={`${classes["amounts-200"]} ${selectedAmount === 200 ? classes["selected"] : ""
                    }`}
                  onClick={() => {
                    setSelectedAmount(200);
                    setShowInput(false);
                  }}
                >
                  200
                </p>
              </div>
              <div className={classes["amounts-second-row"]}>
                <p
                  className={`${classes["amounts-500"]} ${selectedAmount === 500 ? classes["selected"] : ""
                    }`}
                  onClick={() => {
                    setSelectedAmount(500);
                    setShowInput(false);
                  }}
                >
                  500
                </p>
                <p
                  className={`${classes["amounts-other"]} ${showInput ? classes["selected"] : ""
                    }`}
                  onClick={handleOtherClick}
                >
                  Other
                </p>
              </div>
  
              {showInput && (
                <div className={classes["add-fund-other"]}>
                  <input
                    type="number"
                    placeholder="Add Funds"
                    className={`${classes['add-fund']} ${isDarkMode ?  classes['dark-mode'] : '' }`}
                    value={updateAmount}
                    onChange={(e) => setUpdateAmount(Number(e.target.value))}
                  />
                </div>
              )}
            </div>
  
            <div className={classes["balance"]}>
              <p className={classes["balance-latest"]}>Balance: {balance}</p>
            </div>
  
            <div className={classes["update"]}>
              <button
                onClick={handleUpdateClick}
                className={classes["update-button"]}
              >
                Update
              </button>
            </div>
  
            <div className={classes["transactions"]}>
              <p className={classes["all-transactions"]}>All Transactions</p>
              <img
                src={arrowIcon}
                className={classes["arrow-image"]}
                onClick={handleImageClick}
                alt="View All Transactions"
              />
            </div>
          </div>
        </>
      ) : (
        <div className="clip-loader-container">
          <button disabled>
            <Loader/>
          </button>
        </div>
      )}
  
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

export default WalletScreen;