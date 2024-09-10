// import { useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { useState } from 'react';
// import { SERVER_URL} from "../index";
// import Cookies from 'js-cookie';
// import classes from './PaymentOption.module.css'

// const PaymentOption = () => {
  
//   const [amount, setAmount] = useState(0);
//   const navigate = useNavigate();
//   const [uid, setUid] = useState(Cookies.get('user_id'));
//   const [contentId,setContentId]=useState(0);
//   const [showPopup, setShowPopup] = useState(false);
//   const[paymentStatus,setPaymentStatus]=useState(false);
//   const[subscriptionButtonHandler,setSubscriptionButtonHandler]=useState(false);
//   const [payPerContentPrice,setPayPerContentPrice]=useState(5);
//   const location = useLocation();
 
//   useEffect(() => {
//     // const param = new URLSearchParams(location.search);
//     // const amount1 = param.get('amt');
//     const amount1 = new URLSearchParams(location.search).get("amt");
//     const id=new URLSearchParams(location.search).get("contentId")
//     console.log(amount1);
//     setPayPerContentPrice(amount1);
//     setContentId(id)
//   },[])

// //   const openWallet = () => {
// //     navigate('/walletscreen');
// //   }

//   const openWallet=()=>{
//     navigate(`/walletscreen?contentId=${contentId}`)
//   }


//   const loadScript = (src) => {
//     return new Promise((resolve) => {
//       console.log("user id of the user is",uid)
//       const script = document.createElement('script');
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

//   const displayRazorpay = async (amount,duration) => {
//     const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

//     if (!res) {
//       alert('Razorpay SDK failed to load. Are you online?');
//       return;
//     }
//     console.log("amount",amount)
//     makePayment(amount,duration);
//   };

  
//   const makePayment = async (amount,duration) => {
//       console.log("make payment",amount)
//     try {
//       // Fetch order ID from your backend
//       const response= await fetch(`${SERVER_URL}/create_order`, {
//         method: 'POST',
//           headers: {
//            'Content-Type': 'application/json',
//          },
//          body: JSON.stringify({ courseAmount:amount}),
//      });
//       const data = await response.json();
//       const newOrderId = data.order_id;
//       var self=amount*100
//       console.log("order ID------>"+newOrderId);

//       const options = {
//         key:'rzp_test_XIKIRmwuryqbiu', // Replace with your actual Razorpay API key
//         amount: self,  // 1 INR = 100 paisa
//         currency: 'INR',
//         name: 'MBI',
//         description: 'Test Transaction',
//         image: 'https://example.com/your_logo',
//         order_id: newOrderId.toString(),
//         handler: (response) => {
//           const handlePaymentSuccess = async () => {

//             const paymentData = {
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_signature: response.razorpay_signature,
//               uid:uid,
//               money:self/100,
//               duration:duration,
//               contentId:contentId,
//               rechargeType:"content recharge through razorpay",
              
              
//             };

//             try {
//               // Call backend to handle payment success
              
//               const verifyResponse = await fetch(`${SERVER_URL}/verify_payment`, {
//                 mode: "cors",
//                 cache: "no-cache",
//                 credentials: "include",
//                        method: 'POST',
//                          headers: {
//                           'Content-Type': 'application/json',
//                         },
//                         body: JSON.stringify(paymentData),
//                     });

//                     const data = await verifyResponse.json();
//                     if (data.status=='Payment successful') {
                      
//                       alert("payment successfull")
//                       console.log('///////////////////////////////////////////////////////////////////////////////////////////'+contentId)
//                       // navigate('/contents/article/${contentId}');
//                       navigate('/contents');
//                       navigate(`/contents/article/${contentId}`);
//                     }
//                     else{
//                       alert('Payment not successful');
//                     }
              
             
              
//               //setpopup false for first time in /contents route
//                setShowPopup(false);
              
//                setPaymentStatus(true)
               
//                setSubscriptionButtonHandler(false);

//               // Redirect to content page page or do further actions
              
//               // navigate('/contents')
//               //navigate(`/contents/article/${contentId}`);
//             } catch (error) {
//               console.error('Payment verification failed:', error);
//               alert('Payment verification failed');
//               // Redirect to home or error page
//               navigate('/');
//             }
//           };

//           handlePaymentSuccess();
//         },
//         prefill: {
//           name: "mbi_testing",  // Replace with actual user details
//           email: "test@gmail.com",
//           contact: "9635766141",
//         },
//         notes: {
//           address: 'Kolkata',  // Replace with actual user address or additional notes
//         },
//         theme: {
//           color: '#005792',  // Navy blue color
//         },
//         modal: {
//           ondismiss: async () => {
//             const failureData = {
//               razorpay_payment_id: '',
//               razorpay_order_id: newOrderId,
//             };

//           },
//         },
//       };

//       const rzp = new window.Razorpay(options);

//       // Handle payment failure
//       rzp.on('payment.failed', async (response) => {
//         const failureData = {
//           razorpay_payment_id: response.error.metadata.payment_id,
//           razorpay_order_id: response.error.metadata.order_id,
//           uid:uid,
//           money:self/100

//         };

//         try {
        
//           const verifyResponse = await fetch(`${SERVER_URL}/record_payment_failure`, {
//             method: 'POST',
//               headers: {
//                'Content-Type': 'application/json',
//              },
//              body: JSON.stringify(failureData),
//          });
//           console.log("Failed paymentData----->"+JSON.stringify (failureData));
//           alert('Payment failed and recorded.');
//           navigate('/');
//         } catch (error) {
//           console.error('Failed to record payment failure:', error);
//           alert('Failed to record payment failure.');
//           navigate('/');
//         }
//       });

//       rzp.open();
//     } catch (error) {
//       console.error('Error making payment:', error);
//       alert('Error making payment. Please try again later.');
//     }
//   };//razor pay code end

//   return (
//     // <>
//     //   <div>
//     //   <button onClick={() => displayRazorpay(payPerContentPrice,1)}>razorpay</button>&nbsp;
//     //   <button onClick={() => openWallet()}>wallet</button>
//     //   {/* <button onClick={() => openWallet()}>wallet</button> */}
//     //   </div>
//     // </>
//     <>
//       <div className={classes["option-container"]}>
//         <div className={classes["choose-option"]}>
//           <p className={classes["choose-option-p"]}>Choose One option</p>
//         </div>

//         <div className={classes["option-buttons"]}>
//           <button onClick={() => displayRazorpay(payPerContentPrice, 1)} className={classes["razorpay"]}>razorpay</button>
//           <button onClick={() => openWallet()} className={classes["wallet"]}>wallet</button>
//         </div>
//         {/* <button onClick={() => openWallet()}>wallet</button> */}
//       </div>
//     </>
//   );
// };

// export default PaymentOption;

import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { SERVER_URL} from "../index";
import Cookies from 'js-cookie';
import classes from './PaymentOption.module.css';
import Alert from "./Alert.jsx";
import { useDarkMode } from "./DarkModeContext";

const PaymentOption = () => {
  
  const [amount, setAmount] = useState(0);
  const navigate = useNavigate();
  const [uid, setUid] = useState(localStorage.getItem("uid"));
  const [contentId,setContentId]=useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const[paymentStatus,setPaymentStatus]=useState(false);
  const[subscriptionButtonHandler,setSubscriptionButtonHandler]=useState(false);
  const [payPerContentPrice,setPayPerContentPrice]=useState(5);
  const[showToast,setShowToast]=useState(null)
  const location = useLocation();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  useEffect(() => {
    // const param = new URLSearchParams(location.search);
    // const amount1 = param.get('amt');
    const amount1 = new URLSearchParams(location.search).get("amt");
    const id=new URLSearchParams(location.search).get("contentId")
    console.log(amount1);
    setPayPerContentPrice(amount1);
    setContentId(id)
  },[])

//   const openWallet = () => {
//     navigate('/walletscreen');
//   }

  const openWallet=()=>{
    navigate(`/walletscreen?contentId=${contentId}`)
  }


  const loadScript = (src) => {
    return new Promise((resolve) => {
      console.log("user id of the user is",uid)
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
              contentId:contentId,
              rechargeType:"razorpay direct payment"

              
              
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
                    if (data.message=='razorpay direct payment for content') {
                      
                      setShowToast({//show success toast
                       message:"Your content recharge is done",
                       type: "success",
                     });
                     
                     setTimeout(()=>{
                     navigate('/contents');
                     navigate(`/contents/article/${contentId}`);

                    },3000)
                   }
                   else{
                     setShowToast({
                       message:"payment not successful",
                       type: "error",
                     });
                   }
             
            
              setShowPopup(false);
             
              setPaymentStatus(true)
              
              setSubscriptionButtonHandler(false);
              
            } catch (error) {
              console.error('Payment verification failed:', error);
              alert('Payment verification failed');
              // Redirect to home or error page
              navigate('/');
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

  return (
    // <>
    //   <div>
    //   <button onClick={() => displayRazorpay(payPerContentPrice,1)}>razorpay</button>&nbsp;
    //   <button onClick={() => openWallet()}>wallet</button>
    //   {/* <button onClick={() => openWallet()}>wallet</button> */}
    //   </div>
    // </>
    <>
      <div className={`${classes['option-container']} ${isDarkMode ? classes['dark-mode'] : ''}`}>
        <div className={classes["choose-option"]}>
          <p className={classes["choose-option-p"]}>Choose One option</p>
        </div>

        <div className={classes["option-buttons"]}>
          <button onClick={() => displayRazorpay(payPerContentPrice, 1)} className={classes["razorpay"]}>razorpay</button>
          <button onClick={() => openWallet()} className={classes["wallet"]}>wallet</button>
        </div>
        {/* <button onClick={() => openWallet()}>wallet</button> */}
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

export default PaymentOption;