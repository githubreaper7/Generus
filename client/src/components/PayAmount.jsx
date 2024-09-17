import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './css/payAmount.css';

import {loadStripe} from '@stripe/stripe-js';

const PayAmount = () => {
  const location = useLocation();
  const [amount, setAmount] = useState('');
  const { username } = location.state || {};
 
  const handleInputChange = (event) => {
    setAmount(event.target.value);
  }; 

  const handleProceedClick = async (amount) => {
    try {
      const { data: { key } } = await axios.get("http://localhost:4000/api/getkey");
    const stripe = await loadStripe(key);

    const response = await axios.post("http://localhost:4000/api/create-checkout-session", { amount, username });

    const data = response.data;
    const result = stripe.redirectToCheckout({
        sessionId:data.id
    });
    
    } catch (error) {
      console.error('An error occurred:', error);
      alert('An error occurred while processing your request. Please try again later.');
    }
  };

  return (
    <div className='pay-amount'>
        <h2>Donate to {username}</h2>
        <h4>Enter the amount you wish to donate (INR)</h4>
        <input type="number"
        value={amount}
        onChange={handleInputChange}
        placeholder="Enter amount"></input>
        <button onClick={() => handleProceedClick(amount)}>Proceed</button>
    </div>
  );
}

export default PayAmount;
