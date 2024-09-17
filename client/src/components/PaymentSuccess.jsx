import React from 'react'
import { Link } from "react-router-dom"

const PaymentSuccess = () => {
    
  return (
    <div className='pay-amount'>
      <h2>Payment successful</h2>
      <p>Thank you for your contribution. Each effort counts!</p>
      <p>Go to <Link to="/">Home page</Link></p>
    </div>
  ) 
}

export default PaymentSuccess
