import mongoose from  'mongoose';

// Define the schema for your user data
const loginSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, 
  },
  password: {
    type: String,
    required: true,
  },
});
const LoginModel = mongoose.model('logins', loginSchema);
export default LoginModel