import express from "express";
import dotenv from "dotenv";
dotenv.config();
import Stripe from 'stripe';
const stripe = Stripe(process.env.SECRET_API_KEY);

import { Payment } from "../models/paymentModel.js";
// import {checkout, paymentVerification} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create-checkout-session", async (req, res) => {
  try{
  const {amount, username} = req.body;

  const lineItems = [{
    price_data: {
      currency: "inr",
      product_data: {
        name: username,
      },
      unit_amount: amount * 100, // Convert to paise
    },
    quantity: 1
  }];

  const session = await stripe.checkout.sessions.create({
      payment_method_types:["card"],
      line_items:lineItems,
      mode:"payment",
      success_url:"http://localhost:3000/paymentsuccess",
      cancel_url:"http://localhost:3000/paymentcancel",
  });

  res.json({id:session.id})
}catch (error) {
  console.error("Error creating Stripe session:", error);
  res.status(500).json({ error: "Failed to create session" });
}

});
 
export default router;  