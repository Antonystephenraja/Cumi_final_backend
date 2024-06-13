import mongoose from  'mongoose';
const Device = new mongoose.Schema({},{strict:false});
const InputModel = mongoose.model("Devices",Device)
export default InputModel;

