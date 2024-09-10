import React from "react";
import { SERVER_URL} from "../index";
import { useState } from "react";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ArticleDetails.css"
import { useDarkMode } from "./DarkModeContext";

const ArticleDetails = () => {
    let { id } = useParams();
    const [article, setArticle] = useState(null);
    const navigate = useNavigate();
    const { isDarkMode, toggleDarkMode } = useDarkMode();

    useEffect (() => {
        const getArticle = async() => {
            try {
                const response = await fetch(`${SERVER_URL}/article/${id}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setArticle(data);
            } catch (error) {
                console.error("Error in fetching article", error);
            }
        }
        getArticle();
    }, [id])

    if (!article) {
        return <div>Loading...</div>;
    };

    return (
        <div className={`body ${isDarkMode ? 'dark-mode' : ''}`}>
            <h1 className={`title ${isDarkMode ? 'dark-mode' : ''}`}>READ THE ARTICLE IN DETAIL</h1>
            <div className={`articleDetail ${isDarkMode ? 'dark-mode' : ''}`}>
                <h1 className={`title ${isDarkMode ? 'dark-mode' : ''}`}>{article.title}</h1>
                <p>{article.content}</p>
            </div>
        </div>
    );
};

export default ArticleDetails;