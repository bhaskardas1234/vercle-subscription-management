import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import React, { useState, useEffect } from "react";
import { SERVER_URL} from "../index";

const ProtectedRoute = ({ children }) => {
  const uid = Cookies.get("user_id");
  const { id } = useParams();
  const navigate = useNavigate();
  const [subscriptionValidity, setSubscriptionValidity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [price, setPrice] = useState(null);

  const checkSubscriptionValidity = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/subscriptionValidity`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: uid }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setSubscriptionValidity(data.access);
      setIsLoading(false);
      console.log("Subscription validity response:", data);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  const articleCost = async () => {
    try {
        const response = await fetch(`${SERVER_URL}/get_articleCost_by_id`, {
            method:"POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({id: id }),
        });
        if (! response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        const price = data.article_cost;
        setPrice(price);
        console.log(`Article price api is working properly ${price}`);
    } catch (error) {
        console.error("There was a problem with the fetch article cost api :", error);
    }
  }


  useEffect(() => {
    checkSubscriptionValidity();
    articleCost();
  }, []);

  useEffect(() => {
    if (!isLoading && subscriptionValidity && price !== null) {
      if (!subscriptionValidity.includes(parseInt(id)) && price !== 0) {
        navigate("/contents");
      }
    }
  }, [isLoading, subscriptionValidity, id, navigate, price]);

  if (isLoading) {
    return <div>Loading...</div>; // Show a loading indicator while checking subscription validity
  }

  return price === 0 || subscriptionValidity.includes(parseInt(id)) ? children : null;
};

export default ProtectedRoute;