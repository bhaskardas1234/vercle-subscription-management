import cssClass from "./Registration.module.css";
import mathrubhumiIcon from "../asset/mathrubhumi-logo.png";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { SERVER_URL } from "../index.js";
import { getDeviceInfo, getNetworkInfo } from "../helper/userFingerprint.js";
import PhoneInput from "react-phone-input-2";
import Alert from "./Alert.jsx";

const Registration = () => {
  const navigate = useNavigate();
  const dateRef = useRef();
  const location = useLocation();

  const [userInfo, setUserInfo] = useState(null);
  const [loginMode, setLoginMode] = useState("");
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    honorific: "Mr",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [phoneInputReadOnly, setPhoneInputReadOnly] = useState(false);
  const [emailInputReadOnly, setEmailInputReadOnly] = useState(false);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(null);
  const [userPhone, setUserPhone] = useState(null);
  const [countryCode, setCountryCode] = useState("");
  const [registrationType, setRegistrationType] = useState(null);
  const [loginInfo, setLoginInfo] = useState(null);

  const handelChange = (e) => {
    const { name, value } = e.target;
    console.log(name, "  ", value);
    setUserDetails((data) => ({
      ...data,
      [name]: value,
    }));
  };

  useEffect(() => {
    if(localStorage.getItem("uid") && !new URLSearchParams(location.search).get("type")
    ) {
      navigate("/contents");
    }
  }, [])

  useEffect(() => {
    if (localStorage.getItem("loginMode")) {
      setLoginMode(localStorage.getItem("loginMode"));
    }
    const updateType = new URLSearchParams(location.search).get("type");
    setRegistrationType(updateType);
    if (updateType) {
      setUserDetails(JSON.parse(localStorage.getItem("loginInfo")));
    } else {
      const userInfoFromStorage = JSON.parse(localStorage.getItem("userInfo"));
      setUserInfo(userInfoFromStorage);
      console.log(userInfo);
      // if (userInfoFromStorage) {
      //   formatUserDetails(userInfoFromStorage);
      // }
    }
    // fetchUserDetails();
  }, [location]);

  useEffect(() => {
    if (userInfo) {
      formatUserDetails();
    }
  }, [userInfo, loginMode]);

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  const formatUserDetails = () => {
    console.log("formatUserDetails called");
    let body = {};
    if (loginMode === "GMAIL") {
      body = {
        name: userInfo.identities[0].name ? userInfo.identities[0].name : userInfo.identities[0].providerMetadata.name,
        email: userInfo.identities[0].identityValue,
        phone: "",
        dob: "",
      };
      setEmailInputReadOnly(true);
    } else if (loginMode === "WHATSAPP") {
      body = {
        name: userInfo.identities[0].name,
        email: "",
        phone: userInfo.identities[0].identityValue.slice(localStorage.getItem("country_code").length),
        dob: "",
      };
      setPhoneInputReadOnly(true);
    } else if (loginMode === "FACEBOOK") {
      let flag = false;
      if (isValidEmail(userInfo.identities[0].identityValue)) flag = true;
      body = {
        name: userInfo.identities[0].name,
        email: flag ? userInfo.identities[0].identityValue : "",
        phone: !flag ? userInfo.identities[0].identityValue.slice(localStorage.getItem("country_code").length) : "",
        dob: "",
      };
      if (flag) {
        setEmailInputReadOnly(true);
      } else setPhoneInputReadOnly(true);
    } else if (loginMode === "EMAIL") {
      body = {
        name: userInfo.identities[0].name,
        email: userInfo.identities[0].identityValue,
        phone: "",
        dob: "",
      };
      setEmailInputReadOnly(true);
    } else if (loginMode === "SMS") {
      body = {
        name: "",
        email: "",
        phone: userInfo.identities[0].identityValue.slice(localStorage.getItem("country_code").length),
        dob: "",
      };
      setPhoneInputReadOnly(true);
    }
    console.log(userDetails);
    setUserDetails((data) => ({
      ...data,
      ...body,
    }));
  };
  const handelUpdateUserDetails = async(e) => {
    e.preventDefault()
    setIsLoading(true);
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
      setIsLoading(false)
      const responseData = await response.json();
      if(response.status === 200) {
        setShowToast({message : "details updated successfully", type: "success"});
        localStorage.setItem("uid", responseData.id );
        // console.log("hdvydevf :: ", responseData.session_id);
        console.log("mini :: ", responseData.session_info.session_id);
        localStorage.setItem("sid", responseData.session_info.session_id);
        console.log(responseData);
        setUserDetails(responseData);
        // await fetchUserDetails();
        // await getAllUserSessions();
        localStorage.setItem("userInfo", JSON.stringify(responseData));
        navigate("/contents");
      }
    } catch(error) {
      setShowToast({message : "Error in updating user", type: "error"});
    }
  }

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
    // else {
    //   setError(responseData.error);
    //   setTimeout(() => {
    //     setError(null);
    //   }, 2000);
    // }
  };

  const finalAuth = async (e) => {
    e.preventDefault();
    console.log("final-auth");
    setIsLoading(true);
    console.log(userDetails);
    let type = "";
    if (isValidEmail(userInfo.identities[0].identityValue)) {
      type = "email";
    } else {
      type = "phone";
    }
    const validityData = {
      id1: type === "phone" ? localStorage.getItem("country_code") + userDetails.phone : userDetails.email,//
      id2: type === "phone" ? userDetails.email : localStorage.getItem("country_code") + userDetails.phone,//
    };
    if (
      (type === "phone" && userDetails.email !== "") ||
      (type === "email" && userDetails.phone !== "")
    ) {
      console.log(type);
      console.log(userDetails.email);
      console.log(userDetails.phone);
      const userExists = await checkUserInDB(validityData, type);
      if (!userExists) {
        setIsLoading(false);
        return false;
      }
    }
    const networkInfo = await getNetworkInfo();
    const deviceInfo = getDeviceInfo();
    const data = {
      phoneNumber: userDetails.phone,
      email: userDetails.email,
      name: userDetails.name,
      dob: userDetails.dob,
      honorific: userDetails.honorific,
      status: "SUCCESS",
      asid: userInfo.sessionInfo.sessionId,
      token: userInfo.token,
      identity: userInfo.identities[0].identityValue,
      fingerprint: {
        network: networkInfo,
        deviceInfo: deviceInfo,
        userId: userInfo.userId,
        medium: localStorage.getItem("loginMode")
      },
    };

    try {
      const response = await fetch(`${SERVER_URL}/add_user`, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      setIsLoading(false);

      if (response.status === 200) {
        const responseData = await response.json();
        localStorage.setItem("uid", responseData.user.id );
        localStorage.setItem("sid", responseData.session_id);
        navigate("/contents");
      } else {
        const errorData = await response.json();
        // setError(errorData.error);
        setShowToast({
          message: "You have exceed the maximum device login count",
          type: "error",
        });
        // setTimeout(() => {
        //   setError(null);
        // }, 3000);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error:", error);
      // setError("An unexpected error occurred.");
      setShowToast({ message: "An unexpected error occurred", type: "error" });
      // setTimeout(() => {
      //   setError(null);
      // }, 3000);
    }
  };

  const checkUserInDB = async (data, type) => {
    const response = await fetch(
      `${SERVER_URL}/find-user-utility?type=${type}`,
      {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    // console.log(response.json());
    const responseData = await response.json();
    if (response.status !== 200) {
      //   console.log(responseData.user_info);
      //   setLoginInfo(responseData.user_info);
      //   localStorage.setItem("loginInfo", JSON.stringify(responseData.user_info));
      // setError(responseData.message);
      setShowToast({ message: responseData.message, type: "error" });

      // setTimeout(() => {
      //   setError(null);
      // }, 2000);
      return false;
    } else if (response.status === 500) {
      console.log("internal server error");
      navigate("/404");
      // return false;
    }
    return true;
  };  

  return (
    <>
      <form
        className={cssClass["registration-form"]}
        onSubmit={(event) => registrationType ? handelUpdateUserDetails(event) : finalAuth(event)}
      >
        <div className={cssClass["register"]}>
          <img src={mathrubhumiIcon} alt="" />
        </div>

        <div>
          <div className={cssClass["registering"]}>
            <p>Thank you for registering with us</p>
          </div>

          <div className={cssClass["tellUs"]}>
            <p>Tell us more about you</p>
          </div>
        </div>

        <div className={cssClass["inputBoxes"]}>
          <div className={cssClass["name"]}>
            <select name="honorific" id="" className={cssClass["select-options"]} onChange={handelChange} >
              <option value="select" selected>Select</option>
              {/* <option value="Select" selected>Select</option> */}
              <option value="Mr" >Mr</option>
              <option value="Ms">Ms</option>
              <option value="Mrs">Mrs</option>
              <option value="Others">Others</option>
            </select>
            <input
              type="text"
              value={userDetails.name}
              name="name"
              onChange={handelChange}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className={cssClass["number"]}>
            <input
              type="number"
              value={userDetails.phone}
              name="phone"
              onChange={handelChange}
              placeholder="Enter your phone number (optional)"
              readOnly={phoneInputReadOnly}
            />
            {/* <PhoneInput
                name='phone'
                country={"in"}
                placeholder="Enter phone number"
                onChange={(phone, data) => {setUserPhone(phone); setCountryCode(data.dialCode); handelChange()}}
            /> */}
          </div>

          <div className={cssClass["dob"]}>
            <input
              ref={dateRef}
              type="text"
              placeholder="Date Of Birth"
              name="dob"
              onFocus={() => (dateRef.current.type = "date")}
              onBlur={() => (dateRef.current.type = "text")}
              onChange={handelChange}
              max="2006-06-29"
              value={userDetails.dob}
            />
          </div>

          <div className={cssClass["addEmail"]}>
            <input
              type="email"
              placeholder="Enter your email id (optional)"
              value={userDetails.email}
              name="email"
              onChange={handelChange}
              readOnly={emailInputReadOnly}
            />
          </div>
        </div>

        <div className={cssClass["proceedButton"]}>
          {!isLoading ? (
            <button type="submit">Proceed</button>
          ) : (
            <button>
              <ClipLoader size={10} />
            </button>
          )}
        </div>
      </form>
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
    </>
  );
};

export default Registration;