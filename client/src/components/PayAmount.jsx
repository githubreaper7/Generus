import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './css/payAmount.css'

const PayAmount = () => {
  const location = useLocation();
  const [amount, setAmount] = useState('');
  const { username } = location.state || {};
 
  const handleInputChange = (event) => {
    setAmount(event.target.value);
  };

  const handleProceedClick = async (amount) => {
    try {
      console.log('first: Fetching API key');
    const { data: { key } } = await axios.get("http://localhost:4000/api/getkey");
    console.log('API Key:', key);

    console.log('second: Creating Razorpay order');
    const { data: { order } } = await axios.post("http://localhost:4000/api/checkout", { amount });
    console.log('Order:', order);


      console.log('third');
      const options = {
        key: key,
        amount: order.amount,
        currency: "INR",
        name: "Ngo",
        description: "Payment to NGO",
        // image: "https://avatars.githubusercontent.com/u/25058652?v=4",
        order_id: order.id,
        callback_url: "http://localhost:4000/api/paymentverification",
        prefill: {
          name: "NGO",
          email: "ngo@gmail.com",
          contact: "9999999999"
        },
        notes: {
          "address": "Razorpay Corporate Office"
        },
        theme: {
          "color": "#121212"
        }
      };
      console.log('fourth');
      const razor = new window.Razorpay(options);
      razor.open();
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
