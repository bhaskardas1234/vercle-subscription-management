import React, { useEffect, useState } from "react";

import cssClass from "./Login.module.css";
import { useNavigate } from "react-router-dom";

import googleIcon from "../asset/google.png";
import facebookIcon from "../asset/facebook.png";
import whatsappIcon from "../asset/whatsapp.png";
import mathrubhumiIcon from "../asset/mathrubhumi-logo.png";
import emailIcon from "../asset/email.png";
import phoneIcon from "../asset/phone.png";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { ClipLoader } from "react-spinners";
import { SERVER_URL } from "../index.js";
import { getDeviceInfo, getNetworkInfo } from "../helper/userFingerprint.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Alert from "./Alert.jsx";
import Loader from "./Loader.jsx";
import {PhoneNumberFormat , PhoneNumberUtil} from "google-libphonenumber";

const Login = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState();
  const [loginMode, setLoginMode] = useState();
  const [otpLessSignin, setOtpLessSignin] = useState(false);
  const [otplessLoaded, setOtplessLoaded] = useState(false);
  const [loginInfo, setLoginInfo] = useState(null);
  const [nativeEmail, setNativeEmail] = useState(false);
  const [nativePhone, setNativePhone] = useState(false);
  const [userPhone, setUserPhone] = useState(null);
  const [countryCode, setCountryCode] = useState("in");
  const [userEmail, setUserEmail] = useState(null);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loggedInUserDetails, setLoggedInUserDetails] = useState(null);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(null);
  const [userNetworkinfo, setuserNetworkInfo] = useState(null);
  const [callbackLoader, setCallbackLoader] = useState(false);

  useEffect(() => {
    if(localStorage.getItem("uid")) {
      navigate("/contents");
    }
  }, [])

  useEffect(() => {
    const fetchNetworkInfo = async () => {
      try {
        const network = await getNetworkInfo();
        console.log(network);
        setuserNetworkInfo(network);
        setCountryCode(network.ipLocation.country.code.toLowerCase());
        console.log(network.ipLocation.country.code);
        localStorage.setItem("country_code", network.ipLocation.callingCode);//
      } catch (error) {
        console.error("Failed to fetch network information", error);
      }
    };
    fetchNetworkInfo();
  }, []);
  

  // useEffect(() => {
  //   if (localStorage.getItem("callbackLoader") === "true") {
  //     setCallbackLoader(true);
  //   }
  // }, []);

useEffect(() => {
    // Check if OTPless is loaded

    const checkOTPlessLoaded = setInterval(() => {
      if (window.OTPless) {
        clearInterval(checkOTPlessLoaded);
        setOtplessLoaded(true);

        const OtplessCallback = async (userinfo) => {
          setCallbackLoader(true);
          localStorage.removeItem("callbackLoader");
          const emailMap = await userinfo.identities.find(
            (item) => item.identityType === "EMAIL"
          )?.identityValue;
      
          const mobileMap = await userinfo.identities.find(
            (item) => item.identityType === "MOBILE"
          )?.identityValue;
      
          const token = await userinfo.token;
      
          console.log(token);
          console.log(mobileMap);
          console.log(emailMap);
          // setLoginInfo(userinfo);
          console.log(userinfo);
          const data = {
            id:
              mobileMap == undefined ? emailMap : mobileMap.slice(countryCode.length),
          };
          console.log(data);
          const type = mobileMap == undefined ? "email" : "phone";
          const userExists = await checkUserInDB(data, type);
          console.log(".............................................");
          if (!userExists) {
            console.log(loginInfo);
            const l_info = JSON.parse(localStorage.getItem("loginInfo"));
            const networkInfo = await getNetworkInfo();
            const deviceInfo = getDeviceInfo();
            const user_data = {
              ...l_info,
              network_info: networkInfo,
              device_info: deviceInfo,
              medium: localStorage.getItem("loginMode")
            };
            console.log(loginInfo);
            // user_data.network_info = userinfo.network;
            // user_data.device_info = userinfo.deviceInfo;
            console.log(user_data);
            if (user_data.is_eligible_to_login) {
              // localStorage.removeItem("loginInfo");
              // if user has not filled all the field in register page
              if(user_data.dob === "" || user_data.email === "" || user_data.phone === "" ) {
                console.log("going to register..............................");
                localStorage.setItem("userInfo", JSON.stringify(userinfo));
                navigate("/register?type=udt");
                const session = await saveUserSession(user_data, false);
              }
              else {
                const session = await saveUserSession(user_data, true);
              }
            } else {
              console.log("You have exceed the maximum device login count");
              // setError("You have exceed the maximum device login count");
              setShowToast({
                message: "You have exceed the maximum device login count",
                type: "error",
              });
              setIsLoading(false);
              setNativePhone(false);
              setTimeout(() => {
                // setError(null);
                navigate("/login");
              }, 1000);
            }
            // navigate("/home");
          } else {
            localStorage.setItem("userInfo", JSON.stringify(userinfo));
            userinfo.callingCode = countryCode;
            navigate("/register");
          }
          setTimeout(() => {
            setCallbackLoader(false);
          }, 10*1000);
        };

        setOtpLessSignin(new window.OTPless(OtplessCallback));
      }
    }, 100);

    return () => clearInterval(checkOTPlessLoaded);
  }, [showToast]);



  // useEffect(() => {
  //   const otplessScript = document.createElement("script");
  //   otplessScript.id = "otpless-sdk";
  //   otplessScript.src = "https://otpless.com/v2/headless.js";
  //   otplessScript.setAttribute("data-appid", "BRXZMFZ0FZEO6BHQX1AO");
  //   otplessScript.onload = initializeOtplessSDK;
  //   document.head.appendChild(otplessScript);

  //   return () => {
  //     document.head.removeChild(otplessScript);
  //   };
  // }, []);

  // useEffect(() => {
  //   const otplessScript = document.createElement("script");
  //   otplessScript.id = "otpless-sdk";
  //   otplessScript.src = "https://otpless.com/v2/headless.js";
  //   otplessScript.setAttribute("data-appid", "BRXZMFZ0FZEO6BHQX1AO");
  //   otplessScript.onload = initializeOtplessSDK;
  //   document.head.appendChild(otplessScript);

  //   return () => {
  //     const script = document.getElementById("otpless-sdk")
  //     // document.head.removeChild(otplessScript);
  //     document.head.removeChild(script);
  //   };
  // }, []);

  // const initializeOtplessSDK = () => {
  //   setOtpLessSignin(new window.OTPless(OtplessCallback));
  // };

  const checkUserInDB = async (data, type) => {
    const response = await fetch(`${SERVER_URL}/find-user?type=${type}`, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    // console.log(response.json());
    const responseData = await response.json();
    if (response.status === 200) {
      console.log(responseData.user_info);
      setLoginInfo(responseData.user_info);
      console.log(loginInfo);
      localStorage.setItem("loginInfo", JSON.stringify(responseData.user_info));
      return false;
    } else if (response.status === 500) {
      console.log("internal server error");
      navigate("/404");
      // return false;
    }
    return true;
  };

  const saveUserSession = async (data, redirect) => {
    const response = await fetch(`${SERVER_URL}/save-user-session`, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (response.status !== 200) {
      console.log(response.data);
    } else {
      const responseData = await response.json();
      localStorage.setItem("uid", responseData.user.id );
      localStorage.setItem("sid", responseData.session_id);
      if(redirect)navigate(`/contents`);
    }
  };

  function changeLoginMode(mode) {
    localStorage.setItem("loginMode", mode);
  }
  const oAuthHandler = async (providerName) => {
    setLoginMode(providerName);
    changeLoginMode(providerName);
    try {
      const response = await otpLessSignin.initiate({
        channel: "OAUTH",
        channelType: providerName,
      });
      // console.log(JSON.stringify(response));
      console.log(response.statusCode);
      localStorage.setItem("callbackLoader", "true");
    } catch (error) {
      console.error(`error in ${providerName.toLowerCase()} signin`, error);
    }
  };
  const phoneAuth = async (phoneNumber) => {
    // console.log(phoneNumber);
    let phoneNumberWitoutCountryCode = phoneNumber.slice(countryCode.length);
    console.log(phoneNumberWitoutCountryCode);
    try {
      const response = await otpLessSignin.initiate({
        channel: "PHONE",
        phone: phoneNumberWitoutCountryCode,
        countryCode: countryCode,
      });
      if (response.statusCode !== 200) {
        setShowToast({
          message: response.response.errorMessage,
          type: "error",
        });
      }
    } catch (error) {
      setShowToast({ message: String(error), type: "error" });
    }
    setIsLoading(false);
  };
  const emailAuth = async (email) => {
    if(!isValidEmail(email)) {
      setShowToast({
        message: "Enter a valid email",
        type: "error",
      });
      return;
    }
    setShowToast({
      message: "Magic link sent successfully!! Check your email",
      type: "success",
    });
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    await otpLessSignin.initiate({ channel: "EMAIL", email: email });
  };

  const handelEmailClick = () => {
    setNativeEmail(!nativeEmail);
    changeLoginMode(!nativeEmail ? "EMAIL" : "SMS");
  };

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const verifyOTP = async (otp) => {
    console.log("verify", userPhone);
    console.log(countryCode);
    setShowToast({ message: "verifying the otp", type: "info" });
    let phoneNumberWitoutCountryCode = userPhone.slice(countryCode.length);
    console.log(phoneNumberWitoutCountryCode);
    setIsLoading(true);
    try {
      const response = await otpLessSignin.verify({
        channel: "PHONE",
        phone: phoneNumberWitoutCountryCode,
        otp: otp,
        countryCode: countryCode,
      });
      if (response.statusCode !== 200) {
        setShowToast({
          message: response.response.errorMessage,
          type: "error",
        });
        console.log("error in verifying otp!!");
        console.log(response);
      } else {
        setShowToast({ message: "OTP verified successfully", type: "success" });
      }
    } catch (error) {
      console.error("From verify otps", error);
    }
    localStorage.setItem("callbackLoader", "true");
    setIsLoading(false);
  };

  const handelNativePhoneAuth = () => {
    changeLoginMode("SMS");
    console.log("stat");
    const phoneUtilInstance = PhoneNumberUtil.getInstance();
    console.log(userPhone);
    if (userPhone == null || userPhone.length === countryCode.length) {
      setShowToast({ message: "phone can not be empty", type: "error" });
    } else {
      const number = phoneUtilInstance.parseAndKeepRawInput(userPhone,userNetworkinfo.ipLocation.country.code);
      console.log(number);
      if (
        !phoneUtilInstance.isValidNumberForRegion(
          number,
          userNetworkinfo.ipLocation.country.code
        )
      ) {
        console.log(".................");
        setShowToast({ message: "Invalid phone number", type: "error" });
      } else {
        setNativePhone(true);
        setShowToast({ message: "OTP sent successfully", type: "success" });
        phoneAuth(userPhone);
      }
    }
  };

  return (
    <>
    {
      callbackLoader?<Loader height={"80"} width={"80"}/> : 
      <div className={cssClass["login-form"]}>
            <div className={cssClass["register"]}>
              <img src={mathrubhumiIcon} alt="" />
            </div>

            <div>
              <div className={cssClass["registerToLogin"]}>
                <p>Register to login</p>
              </div>

              {localStorage.getItem("loginMode") === "EMAIL" ? (
                <div className={cssClass["mobileNumber"]}>
                  <p>Enter your email</p>
                </div>
              ) : (
                <div className={cssClass["mobileNumber"]}>
                  <p>Enter mobile number</p>
                </div>
              )}
            </div>

            {!nativeEmail ? (
              <>
                <div className={cssClass["inp"]}>
                  <PhoneInput
                    country={countryCode}
                    placeholder="Enter phone number"
                    onChange={(phone, data) => {
                      setUserPhone(phone);
                      setCountryCode(data.dialCode);
                      localStorage.setItem('country_code', data.dialCode)
                    }}
                  />
                </div>
                {nativePhone && (
                  <input
                  type="text"
                  placeholder="Enter the OTP"
                  onChange={(event) => setOtp(event.target.value.replace(/[^0-9]/g,''))}
                  className={cssClass["native-phone-input"]}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={otp}
                  maxLength={6}
                />
                )}
                {!nativePhone ? (
                  <div
                    className={cssClass["continue"]}
                    onClick={handelNativePhoneAuth}
                  >
                    <button>Continue</button>
                  </div>
                ) : (
                  <div className={cssClass["continue"]}>
                    {!isLoading ? (
                      <>
                        <button onClick={() => verifyOTP(otp)}>
                          Verify & Continue
                        </button>
                        <button onClick={() => setNativePhone(false)}>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button>
                        <ClipLoader size={10} />
                      </button>
                    )}
                  </div>
                )}
              </>
            ) : (
              <>
                <div className={cssClass["inp"]}>
                  <input
                    type="email"
                    onChange={(event) => setUserEmail(event.target.value)}
                    className={cssClass["native-phone-input"]}
                    placeholder="Enter your email"
                  />
                </div>
                <div className={cssClass["continue"]}>
                  {!isLoading ? (
                    <button onClick={() => emailAuth(userEmail)}>
                      Continue
                    </button>
                  ) : (
                    <button>
                      <ClipLoader size={10} />
                    </button>
                  )}
                  {nativeEmail && (
                    <button
                      onClick={() => {
                        setNativeEmail(false);
                        changeLoginMode("SMS");
                      }}
                      style={{ marginLeft: "1rem" }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </>
            )}

            <div className={cssClass["or"]}>
              <hr />
              <p>or</p>
              <hr />
            </div>

            <div
              className={cssClass["whatsapp"]}
              onClick={() => oAuthHandler("WHATSAPP")}
            >
              <button>
                <img className={cssClass["whatsappIcon"]} src={whatsappIcon} />{" "}
                Whatsapp
              </button>
            </div>

            <div className={cssClass["viaText"]}>
              <p>You can also login via</p>
            </div>

            <div className={cssClass["otherLoginOptions"]}>
              <div className={cssClass["email-google-facebook"]}>
                <div
                  className={cssClass["email"]}
                  onClick={() => handelEmailClick()}
                >
                  {
                    !nativeEmail ? <img className={cssClass["otherLoginIcon"]} src={emailIcon} />:
                    <img className={cssClass["otherLoginIcon"]} src={phoneIcon} />
                  }
                  
                </div>
                <div
                  className={cssClass["google"]}
                  onClick={() => oAuthHandler("GMAIL")}
                >
                  <img
                    className={cssClass["otherLoginIcon"]}
                    src={googleIcon}
                  />
                </div>
                <div
                  className={cssClass["facebook"]}
                  onClick={() => oAuthHandler("FACEBOOK")}
                >
                  <img
                    className={cssClass["otherLoginIcon"]}
                    src={facebookIcon}
                  />
                </div>
              </div>
            </div>

            <div className={cssClass["terms"]}>
              <p>
                By signing up, you agree to the{" "}
                <a href="">terms and conditions.</a>
              </p>
            </div>

            <div className={cssClass["guest"]}>
              <p>Continue as a guest</p>
            </div>
          </div>
    }
          
          {/* {error && (
        // <div className={cssClass["alert"]}>
        //   <div className={cssClass["alert-inner"]}>{error}</div>
        // </div>
        <Alert message={error} type={error} />
      )} */}
          {showToast != null && (
            <Alert
              message={showToast.message}
              type={showToast.type}
              setShowToast={setShowToast}
            />
          )}
          {/* <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      /> */}
    </>
  );
};

export default Login;