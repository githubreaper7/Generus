import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
dotenv.config();
import { DonationRouter } from "./routes/donation.js";
import { DonatorRouter } from "./routes/donator.js";
import { NgoRouter } from "./routes/ngo.js";
import { NgoInfo } from "./models/NgoInfo.js";
import bcrypt from "bcrypt";
 
const app = express();
app.use(express.json());
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


//code to insert NGO data manually given down below


// async function insertNGOs() {
//   const ngoDetails = {
//     username: "ngo",
//     email: "ngo@gmail.com",
//     password: "ngo",
//     contactNumber: "1234567890",
//     description: "for orphans"
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
//         description: ngoDetails.description
//       }
//     ]);

//     console.log("NGO details inserted successfully!");
//   } catch (error) {
//     console.error("Error inserting NGO details:", error);
//   }
// }
// insertNGOs(); 
