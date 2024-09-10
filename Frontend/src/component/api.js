import axios from 'axios';
import { SERVER_URL} from "../index";

const instance = axios.create({
  baseURL: `${SERVER_URL}`, // Replace with your backend API URL
});

export const fetchWalletBalance = (userId) => {
  return instance.get(`/wallet/${userId}`);
};

export const fetchTransactions = (userId) => {
  return instance.get(`/transactions/${userId}`);
};

export const createOrder = (userId, amount) => {
  return instance.post('/create_order', { user_id: userId, amount });
};

export const payArticle = (userId, articleId, amount) => {
  return instance.post('/pay_article', { user_id: userId, article_id: articleId, amount, payment_method: 'wallet' });
};

export const addFunds = (userId, amount) => {
  return instance.post('/add_funds', { user_id: userId, amount });
};