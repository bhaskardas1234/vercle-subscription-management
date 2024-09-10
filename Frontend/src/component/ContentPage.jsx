// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { SERVER_URL} from "../index";

// const ContentPage = ({ userId, redirectToWallet }) => {
//     const [articles, setArticles] = useState([]);
//     const [walletBalance, setWalletBalance] = useState(200); // Dummy initial wallet balance

//     useEffect(() => {
//         fetchArticles();
//         fetchWalletBalance();
//     }, []);

//     const fetchArticles = async () => {
//         try {
//             const response = await axios.get(`${SERVER_URL}/articles`);
//             setArticles(response.data);
//         } catch (error) {
//             console.error('Error fetching articles:', error);
//         }
//     };

//     const fetchWalletBalance = async () => {
//         try {
//             const response = await axios.get(`${SERVER_URL}/wallet/1`);
//             setWalletBalance(response.data.balance);
//         } catch (error) {
//             console.error('Error fetching wallet balance:', error);
//         }
//     };

//     const handlePay = async (articleId, articleAmount) => {
//         if (walletBalance < articleAmount) {
//             alert('Insufficient balance');
//             return;
//         }

//         try {
//             const response = await axios.post(`${SERVER_URL}/pay_article`, {
//                 user_id: 1,
//                 article_id: articleId,
//                 amount: articleAmount,
//                 payment_method: 'wallet'
//             });

//             if (response.data.status === 'success') {
//                 alert('Article Purchased Successfully');
//                 setWalletBalance(walletBalance - articleAmount); // Deduct amount from local state
//                 redirectToWallet(); // Redirect to wallet page
//             } else {
//                 alert('Payment Failed');
//             }
//         } catch (error) {
//             console.error('Error paying for article:', error);
//             // alert('Payment Failed');
//         }
//     };

//     const styles = {
//         container: {
//             padding: '20px',
//             fontFamily: 'Arial, sans-serif',
//         },
//         header: {
//             textAlign: 'center',
//             color: '#333',
//         },
//         wallet: {
//             textAlign: 'right',
//             fontSize: '1.2em',
//             marginBottom: '20px',
//             color: '#555',
//         },
//         article: {
//             border: '1px solid #ccc',
//             borderRadius: '8px',
//             padding: '15px',
//             margin: '10px 0',
//             boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
//         },
//         articleName: {
//             fontSize: '1.5em',
//             color: '#007BFF',
//         },
//         articlePrice: {
//             fontSize: '1.2em',
//             color: '#28a745',
//         },
//         payButton: {
//             backgroundColor: '#007BFF',
//             color: '#fff',
//             border: 'none',
//             padding: '10px 20px',
//             borderRadius: '5px',
//             cursor: 'pointer',
//             marginTop: '10px',
//         },
//         noArticles: {
//             textAlign: 'center',
//             color: '#777',
//         }
//     };

//     return (
//         <div style={styles.container}>
//             <h1 style={styles.header}>Articles</h1>
//             <p style={styles.wallet}>Wallet Balance: ${walletBalance}</p>
//             {articles.length > 0 ? (
//                 articles.map(article => (
//                     <div key={article.article_id} style={styles.article}>
//                         <h2 style={styles.articleName}>{article.article_name}</h2>
//                         <p style={styles.articlePrice}>Price: ${article.article_amount}</p>
//                         <button 
//                             style={styles.payButton} 
//                             onClick={() => handlePay(article.article_id, article.article_amount)}
//                         >
//                             Pay
//                         </button>
//                     </div>
//                 ))
//             ) : (
//                 <p style={styles.noArticles}>No articles available</p>
//             )}
//         </div>
//     );
// };

// export default ContentPage;