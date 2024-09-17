import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
dotenv.config();
import { DonationRouter } from "./routes/donation.js";
import { DonatorRouter } from "./routes/donator.js";
import { NgoRouter } from "./routes/ngo.js";
import { AcceptedInfoRouter } from "./routes/acceptedInfo.js";
import paymentRouter from "./routes/paymentRoutes.js";
import { NgoInfo } from "./models/NgoInfo.js";

const app = express(); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(  
  cors({ 
    origin: ["http://localhost:3000"],
    credentials: true, 
  })  
);
app.use(cookieParser()); 
 
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log("Listening to port", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error); 
  });   
     
  
app.use("/auth", DonatorRouter);
app.use("/auth", NgoRouter);
app.use("/", DonationRouter);
app.use('/', AcceptedInfoRouter); 
app.use("/api", paymentRouter);
app.get("/api/getkey", (req, res) =>{ 
  try {
    res.status(200).json({ key: process.env.PUBLISHABLE_API_KEY });
  } catch (error) {
    console.error("Error fetching Stripe API key:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}); 
 

//code to insert NGO data manually given down below


// async function insertNGOs() {
//   const ngoDetails = {
//     username: "Helping Hands",
//     email: "hh@gmail.com",
//     password: "hh",
//     contactNumber: "12345",
//     description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur, rerum. Error ipsum modi officia doloribus quisquam tenetur distinctio dolorum odit quidem ex iste, consequatur, rerum, magni omnis? Nobis, quidem unde.",
//     location:"Varanasi",
//   };

//   try { 
//     const hashPassword = await bcrypt.hash(ngoDetails.password, 10);

//     // Insert the NGO details into the database
//     await NgoInfo.insertMany([
//       {
//         username: ngoDetails.username,
//         email: ngoDetails.email,
//         password: hashPassword,
//         contactNumber: ngoDetails.contactNumber,
//         description: ngoDetails.description,
//         location: ngoDetails.location
//       }
//     ]);

//     console.log("NGO details inserted successfully!");
//   } catch (error) {
//     console.error("Error inserting NGO details:", error);
//   }
// }
// insertNGOs(); 
