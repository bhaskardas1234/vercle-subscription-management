import React,{useState, useRef, useEffect} from 'react'
import classes from './EditProfile.module.css';
import backIcon from '../asset/back.svg';
import profileIcon from '../asset/profile.svg';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from './DarkModeContext';
import { getDeviceInfo, getNetworkInfo } from "../helper/userFingerprint.js";
import { SERVER_URL } from "../index.js";
import { useCookies } from "react-cookie";
import { getParsedUA } from "../helper/parseUA.js";
import Alert from "./Alert.jsx";

const EditProfile = () => {

    const navigate = useNavigate();
    const dateRef = useRef();
    const [showToast, setShowToast] = useState(null);
    const [selectedGender, setSelectedGender] = useState('');
    const { isDarkMode } = useDarkMode();
    const [userInfo, setUserInfo] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [activeSessions, setActiveSessions] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [userUAInfo, setUserUAInfo] = useState(null);
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

    

    useEffect(() => {
        checkSessionStatus();
      }, []);

    useEffect(() => {
        if (localStorage.getItem("userInfo")) {
            setUserInfo(JSON.parse(localStorage.getItem("userInfo")));

        }
        console.log(userInfo);
    }, [userDetails]);

    useEffect(() => {
        // if (localStorage.getItem("userInfo")) {
            // let g = '';
            handleGenderClick(selectedGender)
            // setSelectedGender();

        // }
        // console.log(userInfo);
    }, [selectedGender]);

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

      const formatUAInfo = (uaInfo) => {
        const parsedUA = getParsedUA(uaInfo);
        setUserUAInfo(parsedUA);
        console.log(parsedUA);
      };

    const handleImageClick = () => {
        navigate('/dashboard');
    };

    const handleGenderClick = (gender) => {
        console.log(gender);
        setSelectedGender(gender);
        console.log(selectedGender);
    };

    const handelChange = (e) => {
        const { name, value } = e.target;
        console.log(name, "  ", value);
        setUserDetails((data) => ({
          ...data,
          [name]: value,
        }));
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
            sid: session_id,
        };
        console.log(data);

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
    

    return (
        <>





{/* //             <div className={cssClass["right"]}>
//               <form className={cssClass["userForm"]}>
//                 <div className={cssClass["name"]}>
//                   <label>Name</label>
//                   <input
//                     type="text"
//                     value={userDetails ? userDetails.name : ""}
//                     onChange={handelChange}
//                     name="name"
//                   />
//                 </div>

//                 <div className={cssClass["number"]}>
//                   <label>Phone Number</label>
//                   <input
//                     type="number"
//                     value={userDetails ? userDetails.phone : ""}
//                     onChange={handelChange}
//                     name="phone"
//                   />
//                 </div>

//                 <div className={cssClass["email"]}>
//                   <label>Email</label>
//                   <input
//                     type="text"
//                     value={userDetails ? userDetails.email : ""}
//                     onChange={handelChange}
//                     name="email"
//                   />
//                 </div>

//                 <div className={cssClass["dob"]}>
//                   <label>Date of Birth</label>
//                   <input
//                     value={userDetails ? userDetails.dob : ""}
//                     ref={dateRef}
//                     type="text"
//                     placeholder="Date Of Birth"
//                     name="dob"
//                     onFocus={() => (dateRef.current.type = "date")}
//                     onBlur={() => (dateRef.current.type = "text")}
//                     onChange={handelChange}
//                     max="2006-06-29"
//                   />
//                 </div>

//                 <input
//                   className={cssClass["submit"]}
//                   type="submit"
//                   onClick={(e) => handelUpdateUserDetails(e)}
//                   // value="Save changes"
//                 />
//               </form>
//             </div> */}





            <div className={`${classes['edit-profile-container']} ${isDarkMode ? classes['dark-mode'] : ''}`}>
                <div className={classes['head']}>
                    <div className={classes['profile']}>
                        <div className={classes['left']}>
                            <img src={backIcon} alt="" className={classes['back-image']} onClick={handleImageClick} />
                        </div>
                        <div className={classes['right']}>
                            <p className={classes['profile-p']}>Edit Profile</p>
                        </div>
                    </div>
                    <div className={classes['profile-image']}>
                        <img src={profileIcon} alt="" />
                        <p className={classes['change-profile-picture']}>Change Picture</p>
                    </div>
                </div>
                
                <div className={classes['bottom']}>
                    <div className={classes['name']}>
                        <div className={classes['name-p']}>
                            <p>Name</p>
                        </div>
                        <div>
                            <input 
                                type="text" 
                                className={`${classes['name-input']} ${isDarkMode ? classes['dark-mode'] : ''}`} 
                                value={userDetails ? userDetails.name : ""} 
                                onChange={handelChange} 
                                name="name"
                            />
                        </div>
                    </div>
                    <div className={classes['dob']}>
                        <div className={classes['dob-p']}>
                            <p>Date of Birth</p>
                        </div>
                        <div>
                            <input 
                                type="date" 
                                className={`${classes['dob-input']} ${isDarkMode ? classes['dark-mode'] : ''}`} 
                                value={userDetails ? userDetails.dob : ""}
                                ref={dateRef}
                                placeholder="Date Of Birth"
                                name="dob"
                                onFocus={() => (dateRef.current.type = "date")}
                                onBlur={() => (dateRef.current.type = "text")}
                                onChange={handelChange}
                                max="2006-06-29"
                            />
                        </div>
                    </div>
                    <div className={classes['email']}>
                        <div className={classes['email-p']}>
                            <p>Email ID</p>
                        </div>
                        <div>
                            <input 
                                type="text" 
                                className={`${classes['email-input']} ${isDarkMode ? classes['dark-mode'] : ''}`} 
                                value={userDetails ? userDetails.email : ""}
                                onChange={handelChange}
                                name="email"
                            />
                        </div>
                    </div>
                    <div className={classes['phone']}>
                        <div className={classes['phone-p']}>
                            <p>Phone Number</p>
                        </div>
                        <div>
                            <input 
                                type="text" 
                                className={`${classes['phone-input']} ${isDarkMode ? classes['dark-mode'] : ''}`}
                                value={userDetails ? userDetails.phone : ""}
                                onChange={handelChange}
                                name="phone" 
                            />
                        </div>
                    </div>
                    <div className={classes['gender']}>
                        <div className={classes['gender-p']}>
                            <p>Gender</p>
                        </div>

                        <div className={`${classes['gender-type']} ${isDarkMode ? classes['dark-mode'] : ''}`}>
                            <p
                                className={`${classes['gender-option']} ${selectedGender === 'male' ? classes['selected'] : ''}`}
                                onClick={() => setSelectedGender('male')}
                            >
                                Male
                            </p>
                            <p
                                className={`${classes['gender-option']} ${selectedGender === 'female' ? classes['selected'] : ''}`}
                                onClick={() => setSelectedGender('female')}
                            >
                                Female
                            </p>
                            <p
                                className={`${classes['gender-option']} ${selectedGender === 'prefer-not' ? classes['selected'] : ''}`}
                                onClick={() => setSelectedGender('prefer-not')}
                            >
                                Prefer not to say
                            </p>
                        </div>
                    </div>
                </div>

                <div className={classes['update']}>
                    <button 
                        className={classes['update-btn']}
                        type="submit"
                        onClick={(e) => handelUpdateUserDetails(e)}
                    >Update</button>
                </div>

                {showToast != null && (
        <Alert
          message={showToast.message}
          type={showToast.type}
          setShowToast={setShowToast}
        />
      )}
            </div>
        </>
    );
};

export default EditProfile