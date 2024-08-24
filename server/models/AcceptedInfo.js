import mongoose from "mongoose";
import {Donation} from "./Donation.js";

const AcceptedInfoSchema = new mongoose.Schema({
    ngo: {type: String, required: true, unique: true},
    accepted: [Donation.schema],
})

const AcceptedInfoModel = mongoose.model("AcceptedInfo", AcceptedInfoSchema);
export {AcceptedInfoModel as AcceptedInfo}; 