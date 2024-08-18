import express from "express";
import { AcceptedInfo } from "../models/AcceptedInfo.js";
import { NgoInfo } from "../models/NgoInfo.js";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
  
const router = express.Router();

const app = express();

// Middleware to parse cookies
app.use(cookieParser());

router.get("/accepted-donations", async (req, res) => {
    const token = req.cookies.token;
  console.log('token');
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }
  try {
    console.log('hi');
      const decoded = jwt.verify(token, process.env.KEY);
      const ngoEmail = decoded.email;

      console.log(ngoEmail);
      
      let acceptedInfo = await AcceptedInfo.findOne({ ngo: ngoEmail });
      console.log(acceptedInfo);
      
      if (!acceptedInfo) {
        return res.status(404).json({ message: "Access denied. No token provided." });
    } else {
        const donations = await acceptedInfo.accepted;
        res.json({ status: true, donations });
    }
  } catch (error) {
      res.status(500).json({ error: 'Failed to accept donation' });
  }
  });

  export { router as AcceptedInfoRouter };