import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
import router from './routes/cumi.js';

app.use(cors());
app.use(express.json());
mongoose.connect("mongodb://127.0.0.1:27017/cumi");

app.use("/backend", router);

app.listen(4000, () => {
  console.log('Server started on port 4000');
});
