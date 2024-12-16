import express from "express";
import dotenv from "dotenv";
import Stripe from 'stripe';
import { NgoInfo } from "../models/NgoInfo.js";
import crypto from "crypto"; // For decrypting the secret key if necessary

dotenv.config();

const router = express.Router();

// Helper function to decrypt the Stripe secret key (if encrypted)
const decryptSecretKey = (encryptedSecretKeyWithIV) => {
  const encryptionKey = process.env.ENCRYPTION_KEY; // A secure 32-character key stored in .env
  const [ivHex, encryptedSecretKey] = encryptedSecretKeyWithIV.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(encryptionKey, 'hex'), iv);
  let decrypted = decipher.update(encryptedSecretKey, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

// Route to get the publishable key for the NGO
router.get("/get-publishable-key/:email", async (req, res) => {
  try {
    const { email } = req.params;

    const ngo = await NgoInfo.findOne({ email });

    if (!ngo) {
      return res.status(404).json({ error: "NGO not found" });
    }

    res.json({ publishableKey: ngo.stripePublishableKey });
  } catch (error) {
    console.error("Error fetching publishable key:", error);
    res.status(500).json({ error: "Failed to fetch publishable key" });
  }
});

// Route to create the checkout session for the donation
router.post("/create-checkout-session", async (req, res) => {
  try {
    const { amount, email } = req.body;

    const ngo = await NgoInfo.findOne({ email });

    if (!ngo) {
      return res.status(404).json({ error: "NGO not found" });
    }

    if (!ngo.stripeSecretKey || !ngo.stripePublishableKey) {
      return res.status(400).json({ error: "This NGO does not accept online payments." });
    }

    // Decrypt the Stripe secret key (if applicable)
    const stripeSecretKey = decryptSecretKey(ngo.stripeSecretKey);

    // Initialize Stripe
    const stripe = Stripe(stripeSecretKey);

    const lineItems = [{
      price_data: {
        currency: "inr",
        product_data: { name: ngo.username },
        unit_amount: amount * 100,
      },
      quantity: 1,
    }];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "http://localhost:3000/paymentsuccess",
      cancel_url: "http://localhost:3000/paymentcancel",
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    res.status(500).json({ error: "Failed to create session" });
  }
});



export default router;
