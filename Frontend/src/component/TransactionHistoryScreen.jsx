import React, { useState, useEffect } from 'react';
import classes from './TransactionHistoryScreen.module.css';
import requestIcon from '../asset/request.svg';
import requestDownIcon from '../asset/request_down.svg';
import inrIcon from '../asset/inr.svg';
import backIcon from '../asset/back.png';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { SERVER_URL } from "../index";
import { useDarkMode } from "./DarkModeContext";

const TransactionHistoryScreen = () => {
    const userId = 1;
    const [transactions, setTransactions] = useState([]);
    const [uid, setUid] = useState(Cookies.get('user_id'));
    const navigate = useNavigate();
    const { isDarkMode, toggleDarkMode } = useDarkMode();

    useEffect(() => {
        console.log("this is uid", uid)
        fetchTransactions();
    }, []);

    const fetchTransactions = () => {
        axios.get(`${SERVER_URL}/transactions/${uid}`, {
            withCredentials: true
        })
            .then(response => {
                setTransactions(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    };

    const renderItem = (item) => {
        let transactionType = '';
        let sign = '';
        let amountClass = '';
        console.log(item.payment_method)

        // if (item.payment_method === 'wallet') {
        //     transactionType = 'Article Purchase';
        //     sign = '-';
        //     amountClass = classes['wallet-debit'];
        // } else if (item.payment_method === 'Razorpay') {
        //     transactionType = 'UPI';
        //     sign = '+';
        //     amountClass = classes['article-purchase'];
        // } else {
        //     transactionType = 'UPI';
        //     sign = '+';
        //     amountClass = classes['upi'];
        // }

        if (item.payment_method.method === 'wallet') {
            transactionType = 'Article Purchase';
            sign = '-';
            amountClass = classes['wallet-debit'];
        } else {
            transactionType = '';
            sign = '+';
            amountClass = classes['upi'];
        }


        return (
            // <div className={classes['transaction-item']} key={item.id}>
            <div className={`${classes['transaction-item']}  ${isDarkMode ? classes['dark-mode'] : ''}`} key={item.id}>
                <div className={classes['left']}>
                    <div className={classes['transaction-name']}>
                        {item.payment_method.method === 'wallet' ? <img src={requestDownIcon} alt="" className={classes['transaction-name-image']} /> : <img src={requestIcon} alt="" className={classes['transaction-name-image']} />}
                        <p>{item.payment_method['details']}</p>
                        <p>{item.payment_method['method']}</p>
                    </div>
                    <div className={classes['transaction-time']}>
                        <p>{item.payment_status}</p>
                        <p>{new Date(item.payment_time).toLocaleString()}</p>
                    </div>
                </div>
                <div className={classes['right']}>
                    <p className={`${classes['right-rupees']} ${amountClass}`}>{sign}</p>
                    {/* <img src={inrIcon} alt="" className={classes['right-image']} /> */}
                    <p className={`${classes['right-rupees']} ${amountClass}`}>₹{item.amount}</p>
                </div>
            </div>
        );
    };

    const backToWallet = () => {
        navigate('/');
    };

    return (
        // <div className={classes['transaction-history']}>
        <div className={`${classes['transaction-history']} ${isDarkMode ? classes['dark-mode'] : ''}`}>
            {/* <div className={classes['back']} onClick={backToWallet}> */}
                {/* <img src={backIcon} alt="back" className={classes['back-image']} /> */}
                <h1>Transactions</h1>
            <div className={classes['all-transactions']}>
                {transactions.map(renderItem)}
            </div>
        </div>
    );
};

export default TransactionHistoryScreen;