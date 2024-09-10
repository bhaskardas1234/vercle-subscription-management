// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { SERVER_URL } from "../index.js";

// const EmailPage = () => {
//   const [email, setEmail] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const [emailNotFound, setEmailNotFound] = useState(false);
//   const [otpLessSignIn, setOtpLessSignIn] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();

//   const validateEmail = (email) => {
//     const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailPattern.test(email);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateEmail(email)) {
//       setErrorMessage('Please enter a valid email address.');
//       return;
//     }

//     setIsLoading(true);
//     setErrorMessage('');

//     try {
//       const response = await fetch(`${SERVER_URL}/check-email`, {
//         method: 'POST',
//         mode: "cors",
//         cache: "no-cache",
//         credentials: "include",
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email }),
//       });

//       const result = await response.json();

//       if (response.ok) {
//         if (result.redirect === 'contents') {
//           navigate('/epaper');
//         } else {
//           navigate('/subscription');
//         }
//       } else {
//         if (result.message === "User not found, but email is present in EPaper_Subscription" && result.trigger_auth) {
//           setEmailNotFound(true);
//           console.log(email);
//           await emailAuth(email);
//         } else {
//           setErrorMessage(result.message);
//         }
//       }
//     } catch (error) {
//       setErrorMessage('An error occurred. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const emailAuth = async (email) => {
//     if (otpLessSignIn) {
//       try {
//         await otpLessSignIn.initiate({ channel: "EMAIL", email });
//       } catch (error) {
//         console.error('Error initiating magic link:', error);
//         setErrorMessage('Failed to initiate magic link authentication.');
//       }
//     } else {
//       setErrorMessage('OTPless is not available.');
//     }
//   };

//   useEffect(() => {
//     const checkOTPlessLoaded = setInterval(() => {
//       if (window.OTPless) {
//         clearInterval(checkOTPlessLoaded);

//         const callback = (userinfo) => {
//           const emailMap = userinfo.identities.find(
//             (item) => item.identityType === "EMAIL"
//           );

//           const email = emailMap?.identityValue;
//           console.log(email);

//           fetch(`${SERVER_URL}/check-email`, {
//             method: 'POST',
//             mode: "cors",
//             cache: "no-cache",
//             credentials: "include",
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ email }),
//           })
//             .then((response) => response.json())
//             .then((result) => {
//               if (result.redirect === 'contents') {
//                 navigate("/epaper");
//               } else {
//                 navigate("/subscription");
//               }
//             })
//             .catch((error) => {
//               console.error('Error:', error);
//             });
//         };

//         setOtpLessSignIn(new window.OTPless(callback));
//       }
//     }, 100);

//     return () => clearInterval(checkOTPlessLoaded);
//   }, [navigate]);

//   return (
//     <div>
//       <h1>E-Paper Page</h1>

//       {!emailNotFound ? (
//         <form onSubmit={handleSubmit}>
//           <div>
//             <label>Email Address:</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>
//           <button type="submit" disabled={isLoading}>
//             {isLoading ? "Loading..." : "Submit"}
//           </button>
//         </form>
//       ) : (
//         <div>
//           <p>A magic link has been sent to your email for authentication.</p>
//         </div>
//       )}

//       {errorMessage && <p className="error-message">{errorMessage}</p>}
//     </div>
//   );
// };

// export default EmailPage;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SERVER_URL } from "../index.js";
import classes from "./EmailPage.module.css";

const EmailPage = () => {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [emailNotFound, setEmailNotFound] = useState(false);
  const [otpLessSignIn, setOtpLessSignIn] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch(`${SERVER_URL}/check-email`, {
        method: 'POST',
        mode: "cors",
        cache: "no-cache",
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok) {
        if (result.redirect === 'epaper') {
          navigate('/epaper');
        } else {
          navigate('/epaperSubscription');
        }
      } else {
        if (result.message === "User not found, but email is present in EPaper_Subscription" && result.trigger_auth) {
          setEmailNotFound(true);
          console.log(email);
          await emailAuth(email);
        } else {
          setErrorMessage(result.message);
        }
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const emailAuth = async (email) => {
    if (otpLessSignIn) {
      try {
        await otpLessSignIn.initiate({ channel: "EMAIL", email });
      } catch (error) {
        console.error('Error initiating magic link:', error);
        setErrorMessage('Failed to initiate magic link authentication.');
      }
    } else {
      setErrorMessage('OTPless is not available.');
    }
  };

  useEffect(() => {
    const checkOTPlessLoaded = setInterval(() => {
      if (window.OTPless) {
        clearInterval(checkOTPlessLoaded);

        const callback = (userinfo) => {
          const emailMap = userinfo.identities.find(
            (item) => item.identityType === "EMAIL"
          );

          const email = emailMap?.identityValue;
          console.log(email);

          fetch(`${SERVER_URL}/check-email`, {
            method: 'POST',
            mode: "cors",
            cache: "no-cache",
            credentials: "include",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
          })
            .then((response) => response.json())
            .then((result) => {
              if (result.redirect === 'epaper') {
                navigate("/epaper");
              } else {
                // navigate("/epaperSubscription");
                navigate("/login");
              }
            })
            .catch((error) => {
              console.error('Error:', error);
            });
        };

        setOtpLessSignIn(new window.OTPless(callback));
      }
    }, 100);

    return () => clearInterval(checkOTPlessLoaded);
  }, [navigate]);

  return (
    <div className={classes["email-page"]}>
      <h1>E-Paper Page</h1>

      {!emailNotFound ? (
        <form onSubmit={handleSubmit} className={classes["email-form"]}>
          <div className={classes["form-group"]}>
            <label>Email Address:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={classes["form-input"]}
            />
          </div>
          <button type="submit" disabled={isLoading} className={classes["submit-button"]}>
            {isLoading ? "Loading..." : "Submit"}
          </button>
        </form>
      ) : (
        <div className={classes["magic-link-message"]}>
          <p>A magic link has been sent to your email for authentication.</p>
        </div>
      )}

      {errorMessage && <p className={classes["error-message"]}>{errorMessage}</p>}
      
    </div>
  );
};

export default EmailPage;
