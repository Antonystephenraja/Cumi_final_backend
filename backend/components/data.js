import mongoose from 'mongoose';
const Data = new mongoose.Schema({
    device_name:String,
    thickness: String,
    device_status: String,
    signal_strength: String,
    timestamp: String,
    battery_status:String,
})


export default mongoose.model("data", Data);

