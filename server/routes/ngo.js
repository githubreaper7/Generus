import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NgoInfo } from "../models/NgoInfo.js";


const router = express.Router();


router.post("/ngoLogin", async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await NgoInfo.findOne({ email });
  
    if (!user) {
      return res.json({ message: "NGO is not registered." });

    }
  
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.json({ message: "Incorrect password" });
    }
  
    const token = jwt.sign({ username: user.username, email: user.email, role: "ngo" }, process.env.KEY, {
      expiresIn: "1h",
    });


    res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });
    res.json({status:true, message: "Login successful!",token});
  
    // return res.json({ status: true, message: "Login successful!" });
    } catch (error) {
      console.log(error);
      res.json({status:false, message:"Error"});
    }
  }); 

  router.get('/ngos', async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query; // default to page 1 and limit 10
      const ngos = await NgoInfo.find()
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
      const count = await NgoInfo.countDocuments();
  
      res.status(200).json({
        status: true,
        ngos,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        total: count
      });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  });
  
  router.get('/ngo-details/:email', async (req, res) => {
    try {
      const email = req.params.email;
      const ngo = await NgoInfo.findOne({ email }).select('-description -password');
      if (!ngo) {
        return res.status(404).json({ status: false, message: 'NGO not found' });
      }
  
      res.json({ ngo });
    } catch (error) {
      console.error('Error fetching donator details:', error);
      res.status(500).json({ status: false, message: 'Server error' });
    }
  });
   
  const verifyUser = async (req, res, next) => {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.json({ status: false, message: "No token" });
      }
  
      const decoded = await jwt.verify(token, process.env.KEY);
      req.user = decoded;
      next();
    } catch (error) {
      return res.json({ status: false, message: "Unauthorized", error });
    }
  };
  
  
  
  router.get("/verify", verifyUser, (req, res) => {
    return res.json({ status: true, message: "Authorized" });
  });
  
  
  
  router.get("/logout", (req, res) => {
    res.clearCookie('token');
    res.json({ status: true, message: "Logged out" });
  });

  export { router as NgoRouter };