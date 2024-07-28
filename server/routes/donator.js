import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Donator } from "../models/Donator.js";
import cookieParser from "cookie-parser";

const router = express.Router();
const app = express();
app.use(cookieParser());

router.post("/userSignup", async (req, res) => {
  const { username, email, password, address, contactNumber } = req.body;
  try {
    const exists = await Donator.findOne({ email });

    if (exists) {
      return res.json({ status: false, message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new Donator({
      username,
      email,
      password: hashPassword,
      address,
      contactNumber,
    });

    await newUser.save();

    const token = jwt.sign(
      { email: newUser.email, role: "user" },
      process.env.KEY,
      {
        expiresIn: "1h",
      }
    );
    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 3600000 });
    res.json({ status: true,message: "Record registered!", token });

    // res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 3600000 });
    // return res.json({ status: true, message: "Record registered!", token });
  } catch (error) {
    console.log(error);
    res.json({ status: false, message: "Error" });
  }
});

 
router.post("/userLogin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Donator.findOne({ email });

    if (!user) {
      return res.json({ status: false, message: "User is not registered." });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.json({ status: false, message: "Incorrect password" });
    }

    const token = jwt.sign(
      { email: user.email, role: "user" },
      process.env.KEY,
      {
        expiresIn: "1h",
      }
    );

    const expiryTime = 3600; // 1 hour in seconds
    res.cookie("token", token, { httpOnly: true, maxAge: expiryTime * 1000 });
    res.json({ status: true, message: "Login successful!", token, expiryTime });
  } catch (error) {
    console.log(error);
    res.json({ status: false, message: "Error" });
  }
});

// router.get('/:id', async (req, res) => {
//   try {
//     const donator = await Donator.findById(req.params.id);
//     if (!donator) {
//       return res.status(404).json({ message: 'Donator not found' });
//     }
//     res.json(donator);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

router.get('/getUser', async (req, res) => {
  try {
    const token = req.cookies.token;
    if(!token){
      return res.status(401).json({message: 'Access denied'});
    }
    const decoded = jwt.verify(token, process.env.KEY);
    const email = decoded.email;

    const user = await Donator.findOne({email});
    res.json(user); 
  } catch (error) {
    res.status(500).json({message: 'Error'});
  }
})

// Update donator by ID
router.put('/:id', async (req, res) => {
  const { username, address, contactNumber } = req.body;
  try {
    const updatedDonator = await Donator.findByIdAndUpdate(
      req.params.id,
      { username, address, contactNumber },
      { new: true }
    );
    if (!updatedDonator) {
      return res.status(404).json({ message: 'Donator not found' });
    }
    res.json(updatedDonator);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
  res.clearCookie("token");
  res.json({ status: true, message: "Logged out" });
});

export { router as DonatorRouter };
