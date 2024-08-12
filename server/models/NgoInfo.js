import mongoose from 'mongoose';

const NgoInfoSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contactNumber: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true } // Added location field
});

const NgoModel = mongoose.model("NgoInfo", NgoInfoSchema);
export { NgoModel as NgoInfo };
