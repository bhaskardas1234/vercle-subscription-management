import { SERVER_URL} from "../index";
import { useState, useEffect, createContext, createName } from "react";
import classes from './Main.module.css';
import payAsReadIcom from '../asset/pay-as-you-read.png';
import SubscriptionIcon from '../asset/subscription.png';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import walletIcon from '../asset/wallet.svg';
import Alert from "./Alert.jsx";
import { useCookies } from "react-cookie";
import { useDarkMode } from './DarkModeContext';

const Main = () => {
    const [payPerContentPrice,setPayPerContentPrice]=useState(0);//each content price will set according to handelchange
    const [articles, setArticles] = useState([]);//to store all articals values
    const [showPopup, setShowPopup] = useState(false);//this is for content show pop pup function
    const [contentId,setContentId]=useState(0);//to set content id for each content
    const [subscriptionValidity,setSubscriptionValidity]=useState()
    const [subscriberExistence, setSubscriberExistence] = useState(true);
    const [subscriptionButtonHandler,setSubscriptionButtonHandler]=useState(false)
    const [paymentStatus,setPaymentStatus]=useState(false)
    const [uid, setUid] = useState(localStorage.getItem("uid")); // Example of setting initial user ID
    const [walletBalance, setWalletBalance] = useState(0);
    const [walletPopUp,setWalletPopUp]=useState(false)
    const [walletRechargeHandler,setWalletRechargeHandler]=useState(false)
    const { isDarkMode } = useDarkMode();
    

    //HOME
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const [nameInitial, setNameInitial] = useState('')
    const [userDetails, setUserDetails] = useState({
      name: "",
      email: "",
      phone: "",
      dob: "",
      honorific: "Mr",
    });
    const [userInfo, setUserInfo] = useState(null);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [error, setError] = useState(null);
    const [showToast, setShowToast] = useState(null);
    const [cookie, setCookie, removeCookie] = useCookies([]);
    const [pageReload, setPageReload] = useState(false);

  const navigate = useNavigate();
  const handleLogOut = async () => {
    if(!localStorage.getItem("uid") || !localStorage.getItem("sid")) {
      setShowToast({message: "Somthing went wrong", type: "error"});
      return;
    }
    const data = {
      session_id: localStorage.getItem("sid"),
      user_id: localStorage.getItem("uid")
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
      // alert("Logged out successfully");
      setShowToast({ message: "Logged out successfully", type: "success" });
      // localStorage.removeItem("loginMode");
      // localStorage.removeItem("uid");
      // localStorage.removeItem("sid");
      // localStorage.removeItem("userinfo");
      localStorage.clear();
      setIsLoggedIn(false);
      // removeCookie("session_id", {domain: ".setucodeverse.net", path: "/"});
      removeCookie("session_id", {domain: "16.170.173.14", path: "/"}); 
      removeCookie("user_id", {domain: "16.170.173.14", path: "/"});
      // removeCookie("user_id", {domain: ".setucodeverse.net", path: "/"});
      // removeCookie("user_id");
      // setUid(null);
      navigate("/contents");
    } else {
      navigate("/404");
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
    if (response.status === 200) {
      setIsLoggedIn(true);
      setPageReload(!pageReload);
    }
    else {
      // setError(responseData.error);
      // setShowToast({message: responseData.error, type: "error"});
      // setTimeout(() => {
      //   // setError(null);
      //   navigate("/home");
      // }, 1000);
      localStorage.removeItem("uid");
      localStorage.removeItem("sid");
      localStorage.removeItem("userinfo");
    }
  };
  useEffect(() => {
    checkSessionStatus()
  }, []);

  //HOME
  
    // const navigate = useNavigate();
  
    useEffect(() => {
      const fetchArticles = async () => {
        const verifyResponse = await fetch(`${SERVER_URL}/get_all_articles`, {
          method: 'GET',
            headers: {
             'Content-Type': 'application/json',
           },
          });
          const data = await verifyResponse.json();
          setArticles(data);
        };
         //fetch all articals 
        fetchArticles();
        //check the subscriber whether he existense or not
        if(uid !=null){
        checkSubscriberExistence();
        checkSubscriptionValidity ();
        //to fetch the wallet balance
        fetchWalletBalance();
        }
    }, [paymentStatus,showPopup]);

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
        const response = await fetch(`${SERVER_URL}/subscription_validity`, {
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
                rechargeType:"subscription",
                via:"web"

                
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
                      if (data.message=='Payment verified and details saved successfully') {
                
                // alert("payment successfull")
                setShowToast({
                  message:"payment successful",
                  type: "success",
                });

                setTimeout(()=>{
                  navigate('/contents');
                },3000)

                
              }
              else{
                setShowToast({
                  message:"payment  not successful",
                  type: "error",
                });
                setTimeout(()=>{
                  navigate('/contents');
                },3000)
              }
                
                //setpopup false for first time in /contents route
                 setShowPopup(false);
                
                 setPaymentStatus(true)
                 
                 setSubscriptionButtonHandler(false);
              // if (verifyResponse.status==200) {
                
              //   alert("payment successfull")
              // }
              // else{
              //   alert('Payment not successful');
              // }
                
              //   //setpopup false for first time in /contents route
              //    setShowPopup(false);
                
              //    setPaymentStatus(true)
                 
              //    setSubscriptionButtonHandler(false);

              //   // Redirect to content page page or do further actions
              //    navigate('/contents') 
              } catch (error) {
                console.error('Payment verification failed:', error);
                alert('Payment verification failed');
                // Redirect to home or error page
                navigate('/contents');
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







    //this function is for subscription pop up function setup
    // const handleViewClick = (isPremium) => {
    //     if (isPremium) {
    //         if(payPerContentPrice >0){
    //           if (subscriptionValidity == null) {
    //             if (walletBalance>payPerContentPrice) {//change code
    //               handlePay()
                
                
    //             }
    //             else{
    //             console.log("this user has no subscription plan")
    //             setShowPopup(true);
    //             }
    //           }
    //            else if(subscriptionValidity=='all'){
    //            console.log("this user has plan subscription (monthly and yearly)")
    //            navigate(`/contents/article/${contentId}`);
    //            }
    //            else if(typeof subscriptionValidity =="object")
    //             {
    //              console.log("this is user has some content subscription plan")
    //              const valuesArray = Object.values(subscriptionValidity)
    //              console.log(valuesArray); // [1, 2, 3]
    //              console.log(contentId)
    //              console.log(typeof contentId,typeof valuesArray[0])
    //             //  const str = number.toString(contentId);
    //              if(valuesArray.includes(contentId)){
    //               console.log("content it is else if portion",payPerContentPrice)
    //               navigate(`/contents/article/${contentId}`);
    //               }

    //              else if(walletBalance){
    //               if(walletBalance>=payPerContentPrice){
    //                 // openWalletPopUp()
    //                 handlePay()
      
    //               }else{
    //                 setShowPopup(true)
    //               }
      
      
    //             }
    //              else{
    //               console.log(typeof subscriptionValidity ,"subscription validity type")
    //               setShowPopup(true);

    //              }

    //             }
    //         else{
    //           setShowPopup(true);
    //         }

    //       }
          
    //       else{
    //         navigate(`/contents/article/${contentId}`);//all navigation will redirct to content page
    //       }
          
    //     }
    // };

    const handleViewClick = (isPremium) => {
        
      if (isPremium) {
          if(payPerContentPrice<=0){
          navigate(`/contents/article/${contentId}`);//all navigation will redirct to content page
          }
           else if(payPerContentPrice >0 && uid!=null && isLoggedIn ){
            if (subscriptionValidity == null) {
              if (walletBalance>payPerContentPrice) {//change code
                handlePay()
              
              
              }
              else{
              console.log("this user has no subscription plan")
              setShowPopup(true);
              }
            }
             else if(subscriptionValidity=='all' && isLoggedIn){
             console.log("this user has plan subscription (monthly and yearly)")
             navigate(`/contents/article/${contentId}`);
             }
             else if(typeof subscriptionValidity =="object" && isLoggedIn)
              {
               console.log("this is user has some content subscription plan")
               const valuesArray = Object.values(subscriptionValidity)
               console.log(valuesArray); // [1, 2, 3]
               console.log(contentId)
               console.log(typeof contentId,typeof valuesArray[0])
              //  const str = number.toString(contentId);
               if(valuesArray.includes(contentId)){
                console.log("content it is else if portion",payPerContentPrice)
                navigate(`/contents/article/${contentId}`);
                }

               else if(walletBalance){
                if(walletBalance>=payPerContentPrice){
                  // openWalletPopUp()
                  handlePay()
    
                }else{
                  setShowPopup(true)
                }
    
    
              }
               else{
                console.log(typeof subscriptionValidity ,"subscription validity type")
                setShowPopup(true);

               }

              }
          else{
            if(isLoggedIn){
              setShowPopup(true)
            }
            else{
              navigate('/login')
            }
            
          }

        }
        else{
          navigate('/login')
        }
        
        
        
      }
  };

    //this fuction is for pop up close
    const closePopup = () => {
        setShowPopup(false);
    };
    // this is for geting all articals details
    
    //on handel change function as per content price setup
    const handleChange = (amount,contentId) => {
      setPayPerContentPrice(parseFloat(amount));
      setContentId(contentId);
      
      console.log("content Price",payPerContentPrice)
    };
    //this is for subsciption button handler
    const handleSubscriptionButton=()=>{

      setSubscriptionButtonHandler(true)
    }
    //to cut the close subscription button pop up
    const closeSubscriptionButtonPopup=()=>{
      setSubscriptionButtonHandler(false)

    }

    const paymentOption=()=>{
      navigate(`/payment-option?amt=${payPerContentPrice}&contentId=${contentId}`)
    }



    const fetchWalletBalance = async () => {
      try {
          const response = await fetch(`${SERVER_URL}/wallet/${uid}`);
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setWalletBalance(parseFloat(data.balance));
          // alert(typeof data.balance)
      } catch (error) {
          console.error('Error fetching wallet balance:', error);
      }
  };
  const handlePay = async () => {
    if (walletBalance < payPerContentPrice) {
        alert('Insufficient balance');
        navigate(`/payment-option?amt=${payPerContentPrice}&contentId=${contentId}`)
    }
    else{
      try {
      const walletPamyemtData={
         
         uid:uid,
        //  money:payPerContentPrice,
         duration:1,
         contentId:contentId
         
       };
     
const response = await fetch(`${SERVER_URL}/pay_article`, {
         method: 'POST',
         headers: {
             'Content-Type': 'application/json'
         },
         body: JSON.stringify(walletPamyemtData)
     });

     const data = await response.json();

     if (data.status === 'success') {
         alert('Article Purchased Successfully now you can  access your Articale');

         setShowPopup(false)
         setPaymentStatus(true)
         // setWalletBalance(walletBalance - articleAmount); // Deduct amount from local state
         // redirectToWallet(); // Redirect to wallet page
         navigate(`/contents/article/${contentId}`);//all navigation will redirct to content page

     } else {
         alert('Payment Failed');
     }
 } catch (error) {
     console.error('Error paying for article:', error);
     // alert('Payment Failed');
 }

    }

    
};

///////////////////////////////////////////////////////////////////////////////////////////////////////
useEffect(() => {
  if (localStorage.getItem("userInfo")) {
    setUserInfo(JSON.parse(localStorage.getItem("userInfo")));
  }
  console.log(userInfo);
}, [userDetails]);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
      setUserInfo(responseData);
    }
    
  };

  useEffect(() => {
    fetchUserDetails();
  }, [])


// const closeWalletPopup=()=>{
//   setWalletPopUp(false)
//   setWalletRechargeHandler(false)
  

// }
// const openWalletPopUp=async()=>{
//   setWalletPopUp(true)
// }
// const YesWalletPopup=()=>{
  
//   handlePay();
//   setWalletRechargeHandler(true)
//   setWalletPopUp(false)

// }
  
    return (
        <>
            <div className={`${classes['body']} ${isDarkMode ? classes['dark-mode'] : ''}`}>

            <div className={`${classes['container']} ${isDarkMode ? classes['dark-mode'] : ''}`}>

            <h1 className={`title ${isDarkMode ? 'dark-mode' : ''}`}>ALL NEWS</h1>
            {isLoggedIn&&(<div className={classes["subscription-wallet"]}>
            <div>
              <img src={walletIcon} className={classes["subscription-wallet-img"]} alt="" />
            </div>
            <div>
              <p className={classes["wallet-balance-p"]}>{walletBalance}</p>
            </div>
          </div>)}

          {/* <div className={classes["home-container"]}>
        {isLoggedIn ? (
          <>
            <button onClick={handleLogOut}>Logout</button>
            <button onClick={() => navigate("/dashboard")}>Dashboard</button>
          </>
        ) : (
          <button onClick={() => navigate("/login")}>Login</button>
        )}
      </div> */}




      {/* ppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp */}

      <div className={classes["dropdown"]}> 
    
    {isLoggedIn ? (
      <>
            <div className={classes["dropbtn1"]}>
            <p className={classes["name-p"]}>
                Hi, {userInfo ? userInfo.name : ""}
                </p>
            </div>
            <div className={classes["dropdown-content"]}>
                   <a onClick={() => navigate("/dashboard")}>My Account</a>
                   <a href="#">My BookMark</a>
                   <a  onClick={handleLogOut}>Logout</a>
              </div> 
      </>
    ) : (
      <div onClick={() => navigate("/login")}>Login</div>
    )}
    </div>

                   { isLoggedIn &&(<div className={classes["subscription"]}>
                    <button className={`${classes['suscribe-button']} ${isDarkMode ? classes['dark-mode'] : ''}`} onClick={handleSubscriptionButton}>Take Subscription</button>
                    </div>)}
                    {/* <div className={classes["subscription"]}>
                      <pre>        {walletBalance}</pre>
                    </div> */}



              <div className={`${classes['article-container']} ${isDarkMode ? classes['dark-mode'] : ''}`}>
                        {articles.length > 0 && (() => {
                            const articleElements = [];
                            for (let i = 0; i < articles.length; i++) {
                                const article = articles[i];
                                articleElements.push(
                                  <div className={`${classes['article']} ${isDarkMode ? classes['dark-mode'] : ''}`} key={article.id} onMouseOver={() => handleChange(article.price,article.id)} >
                                       
                                       <h1 className={`${classes['h1']} ${isDarkMode ? classes['dark-mode'] : ''}`}>{article.title}</h1>

                                        {/* value set up when greter that 0  then amount will be payble */}
                                        <p className={classes['price']}> {article.price>0?<p onClick={() => handleChange(article.price,article.id)}>Premium  {article.price}</p>:<p></p>}</p>

                                        <button className={`${classes['news-btn']} ${isDarkMode ? classes['dark-mode'] : ''}`} onClick={() => handleViewClick(true)}>View</button>
                                        {/* {<button className={classes['news-btn']} onClick={() => togglePopup}>View</button>} */}

                                        
                                    </div>
                                );
                            }
                            return articleElements;
                        })()}
                    </div>
                    {/* this page is content page pop up */}
                    {showPopup && (
                        <div className={classes['popup']}>
                            <div className={`${classes['popup-content']} ${isDarkMode ? classes['dark-mode'] : ''}`}>
                                <div className={classes['close']}>
                                    <button className={`${classes['close-btn']} ${isDarkMode ? classes['dark-mode'] : ''}`}onClick={closePopup}>X</button>
                                </div>
                                <div className={classes['subscription-container']}>
                                    <div className={classes['heading']}>
                                        <h1 className={`${classes['heading-read']} ${isDarkMode ? classes['dark-mode'] : ''}`}>To read this article subscribe</h1>
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
                                                                            { (
                                        <div className={classes['right']}>
                                            <div className={classes['image']}>
                                                <img src={payAsReadIcom} alt="" />
                                            </div>
                                            <h2>Pay as you read</h2>
                                            <div className={classes['pay-as-read-description']}>
                                                <div className={classes['lines']}>
                                                    <p>&#8226; Unlock Exclusive Insights</p>
                                                </div>
                                                <div className={classes['lines']}>
                                                    <p>&#8226; Pay Only for What You Consume</p>
                                                </div>
                                                <div className={classes['lines']}>
                                                    <p>&#8226; Immediate Access to Exclusive Content</p>
                                                </div>
                                            </div>
                                            <div className={classes['submit-button']}>
                                                {/* {<button className={classes['suscribe-button']} onClick={() => displayRazorpay(payPerContentPrice,1)}>Flexible and Cost-Efficient</button> */
                                                <button className={classes['suscribe-button']} onClick={() => handlePay()}>Flexible and Cost-Efficient</button>
                                                  /* <button className={classes['suscribe-button']}><Link to={{ pathname: '/payment-option', state: payPerContentPrice }}>Flexible and Cost-Efficient</Link></button> */}
                                                
                                                
                                            </div>
                                        </div>
                                      )}
                                    </div>
                                </div>
                                {/* <button onClick={handleClosePopup}>cancel</button> */}
                            </div>
                        </div>
                    )}
                    {/* show popup for subscription on contents  */}

                     { subscriptionButtonHandler && (
                        <div className={classes['popup']}>
                            <div className={classes['popup-content']}>
                                <div className={classes['close']}>
                                    <button className={classes['close-btn']} onClick={closeSubscriptionButtonPopup}>X</button>
                                </div>
                                <div className={classes['subscription-container']}>
                                    <div className={classes['heading']}>
                                        <p className={classes['heading-read']}>To read this article subscribe</p>
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

                    {/* {error && (
        <div className={cssClass["alert"]}>
          <div className={cssClass["alert-inner"]}>{error}</div>
        </div>
      )} */}
      {showToast != null && (
        <Alert
          message={showToast.message}
          type={showToast.type}
          setShowToast={setShowToast}
        />
      )}

                </div>

            </div>
        </>
    );
}

export default Main;