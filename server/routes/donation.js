import express from "express";
import { Donation } from "../models/Donation.js";
import { AcceptedInfo } from "../models/AcceptedInfo.js";
import { NgoInfo } from "../models/NgoInfo.js";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
  
const router = express.Router();

const app = express();

// Middleware to parse cookies
app.use(cookieParser());

router.post("/donate", async (req, res) => {
  try { 
    const {
      clothingItems,
      season,
      quantity,
      condition,
      specialInstructions,
      preferredDay,
      status,
      acceptedBy
    } = req.body;
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }
    const decoded = jwt.verify(token, process.env.KEY);
    const email = decoded.email;

    const newDonation = new Donation({
      email,
      clothingItems,
      season,
      quantity,
      condition,
      specialInstructions,
      preferredDay,
      status,
      acceptedBy
    });

    await newDonation.save();

    res
      .status(201)
      .json({ message: "Donation saved successfully", donation: newDonation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving donation" });
  }
});

router.get("/user-donations", async (req, res) => {
  try {
    // const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.KEY);
    const email = decoded.email;

    const donations = await Donation.find({ email, status: "Pending" });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching donations" });
  }
});

router.get("/confirmed-donations", async (req, res) => {
  try {
    // const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.KEY);
    const email = decoded.email;

    const donations = await Donation.find({ email, $or: [{ status: "Accepted by NGO" }, { status: "Fully Accepted" }] });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching donations" });
  }
});

router.delete("/delete-donation/:id", async (req, res) => {
  try {
    // const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.KEY);
    const email = decoded.email;

    const donation = await Donation.findOneAndDelete({
      _id: req.params.id,
      email,
    });

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    res.status(200).json({ message: "Donation deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting donation" });
  }
});

router.post('/accept-donation/:id', async (req, res) => {
  const donationId = req.params.id;
  const token = req.cookies.token;
  console.log('token');
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }
  try {
    console.log('hi');
      const decoded = jwt.verify(token, process.env.KEY);
      // const ngoUsername = decoded.username;
      const ngoEmail = decoded.email;

      // console.log(ngoUsername);
      console.log(ngoEmail);
      const donation = await Donation.findById(donationId);
      if (!donation) {
          return res.status(404).json({ error: 'Donation not found' });
      }
      // let acceptedInfo = await AcceptedInfo.findOne({ ngo: ngoEmail });
      // console.log(acceptedInfo);
      // Update the donation status and add a notification
      donation.status = "Accepted by NGO";
      donation.notifications.push({
          message: 'Your donation has been accepted by the NGO',
          status: 'Pending'
      });
      donation.acceptedBy = ngoEmail; 
      await donation.save();
      console.log('saved success');
      
    //   if (!acceptedInfo) {
    //     acceptedInfo = new AcceptedInfo({
    //         ngo: ngoEmail,
    //         accepted: [donation]
    //     });
    // } else {
    //     acceptedInfo.accepted.push(donation);
    // }
    // console.log('accept');
    
    //   await acceptedInfo.save();

      // await Donation.findByIdAndDelete(donationId);

      
      res.status(200).json({ message: 'Donation accepted and user notified' });
  } catch (error) {
      res.status(500).json({ error: 'Failed to accept donation' });
  }
})

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
    const donations = await Donation.find({ acceptedBy: ngoEmail });
    res.json({ status: true, donations });
  //   let acceptedInfo = await AcceptedInfo.findOne({ ngo: ngoEmail });
  //   console.log(acceptedInfo);
    
  //   if (!acceptedInfo) {
  //     return res.status(404).json({ message: "Access denied. No token provided." });
  // } else {
  //     const donations = await acceptedInfo.accepted;
  //     res.json({ status: true, donations });
  // }

} catch (error) {
    res.status(500).json({ error: 'Failed to accept donation' });
}
});


router.post('/user-accept/:id', async (req, res) => {
  const donationId = req.params.id;
  
  try {
      const donation = await Donation.findById(donationId);
      if (!donation) {
          return res.status(404).json({ error: 'Donation not found' });
      }

      // Update the notification status and donation status
      const notification = donation.notifications.find(notif => notif.message === 'Your donation has been accepted by the NGO' && notif.status === 'Pending');
      if (notification) {
          notification.status = 'Accepted by User';
      }
 
      donation.status = "Fully Accepted";
      await donation.save();
 
      res.status(200).json({ message: 'Donation fully accepted' });
  } catch (error) {
      res.status(500).json({ error: 'Failed to accept donation' });
  }
}); 
 

router.get("/donations", async (req, res) => {
  try {
    console.log('donations');
    const donations = await Donation.find({ status: "Pending" });
    res.json({ status: true, donations });
  } catch (error) {
    console.error(error);
    res.json({ status: false, message: "Error fetching donations" });
  }
});

export { router as DonationRouter };

// const resetNotifications = async () => {
//   try {
//     await Donation.updateMany(
//       { 'notifications.status': { $ne: 'Pending' } },
//       { $set: { 'notifications.$[].status': 'Pending' } }
//     );
//     console.log('Notification statuses reset successfully.');
//   } catch (error) {
//     console.error('Error resetting notification statuses:', error);
//   } finally {
//     mongoose.connection.close();
//   }
// };

// resetNotifications();