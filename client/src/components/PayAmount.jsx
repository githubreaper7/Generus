import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './css/payAmount.css';
import { loadStripe } from '@stripe/stripe-js';

const PayAmount = () => {
  const location = useLocation();
  const [amount, setAmount] = useState('');
  const { email } = location.state || {}; // Receive the email of the selected NGO

  const handleInputChange = (event) => {
    setAmount(event.target.value);
  };

  const handleProceedClick = async (amount) => {
    try {
      const { data: { publishableKey } } = await axios.get(`http://localhost:4000/api/get-publishable-key/${email}`);

      // Initialize Stripe with the publishable key
      const stripe = await loadStripe(publishableKey);

      // Send the amount and email to the backend to create the checkout session
      const response = await axios.post("http://localhost:4000/api/create-checkout-session", { amount, email });

      const data = response.data;

      // Redirect to the Stripe Checkout page
      const result = await stripe.redirectToCheckout({
        sessionId: data.id,
      });

      // Handle any errors from Stripe
      if (result.error) {
        console.error(result.error.message);
        alert('An error occurred while processing your payment.');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      alert('An error occurred while processing your request. Please try again later.');
    }
  };

  return (
    <div className='pay-amount'>
      <h2>Donate to NGO</h2>
      <h4>Enter the amount you wish to donate (INR)</h4>
      <input
        type="number"
        value={amount}
        onChange={handleInputChange}
        placeholder="Enter amount"
      />
      <button onClick={() => handleProceedClick(amount)}>Proceed</button>
    </div>
  );
};

export default PayAmount;
