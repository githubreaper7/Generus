// import { instance } from "../server.js";
// import crypto from "crypto";
// // import { Payment } from "../models/paymentModel.js";

// export const checkout = async (req, res) => {
//   try {
//     console.log('inside checkout function, request body:', req.body);
//     const {amount} = req.body;
//     if (!amount) {
//       return res.status(400).send('Amount is required');
//     }
//     console.log(amount); 
//     const options = {
//       amount: amount*100,
//       currency: "INR",
//     };
//     console.log(options);
//     const order = await instance.orders.create(options);
//     console.log('Razorpay order created:', order);
//     res.status(200).json({
//       success: true,
//       order,
//     });
//   } catch (error) {
//     console.error("Error creating order:", error);
//     res.status(500).send('Error creating order');
//   }
// };  

//   export const paymentVerification = async (req, res) => {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
//       req.body;
  
//     const body = razorpay_order_id + "|" + razorpay_payment_id;
  
//     const expectedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_APT_SECRET)
//       .update(body.toString())
//       .digest("hex");
  
//     const isAuthentic = expectedSignature === razorpay_signature;
   
//     if (isAuthentic) {
//       // Database comes here
  
//     //   await Payment.create({
//     //     razorpay_order_id,
//     //     razorpay_payment_id,
//     //     razorpay_signature,
//     //   });
  
//     //   res.redirect(
//     //     `http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`
//     //   );
//     alert('payment success');
//     } else {
//       res.status(400).json({
//         success: false,
//       });
//     }
//   };