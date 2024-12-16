import mongoose from 'mongoose';

const NgoInfoSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contactNumber: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  stripePublishableKey: { type: String, default: null }, // Default set to null
  stripeSecretKey: { type: String, default: null },      // Default set to null
  supportsPayments: { type: Boolean, default: false },  // Explicit flag for payment support
});

const NgoModel = mongoose.model("NgoInfo", NgoInfoSchema);
export { NgoModel as NgoInfo };
