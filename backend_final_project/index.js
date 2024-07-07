import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import User from './models/User.js'; 
import tracker from './routes/tracker.js'
import nodemailer from 'nodemailer';
import bcryt from 'bcrypt';
import jwt from "jsonwebtoken";


dotenv.config();
mongoose.connect(process.env.ATLAS_URL);

const app = express();
app.use(express.json());
app.use(cors());
app.use("/tracker" , tracker)

app.get('/', (req,res) => {
  res.send("Welcome to GET/")
})


app.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      
      if (user) {
        if (user.password === password) {
          res.json({ success: true, userId: user._id });
        } else {
          res.json({ success: false, message: 'The password is incorrect' });
        }
      } else {
        res.json({ success: false, message: 'User not found' });
      }
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
  app.post('/', async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const user = new User({ name, email, password }); 
      await user.save();
      res.json({ success: true, userId: user._id });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  });

  app.post ('/forgotPassword', async (req,res) => {

    const {email} = req.body;
    
    if (!process.env.JWT_KEY || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({ message: "Server configuration error" });
    }

    try{
      const user = await User.findOne({email});
      if(!user){
        return res.json({message: "user is not reegister yet!"}) 
      }
      const token  = jwt.sign({id: user._id}, process.env.JWT_KEY, {expiresIn: '5m' })


      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'shevelenko.work@gmail.com',
          pass: 'cedv ufsa sicm hjqc'
        }
      });
      const encodedToken = encodeURIComponent(token).replace(/\./g, "%2E");
      var mailOptions = {
        from: 'shevelenko.work@gmail.com',
        to: email,
        subject: 'Reset Password',
        text: `http://localhost:5173/resetPassword/${encodedToken}`
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          return res.json({ message: "error sending email" });
        } else {
          return res.json({ status: true, message: "email sent" });
        }
      });
      
    } catch(err){
      console.log(err);
    }
  })


  app.post("/resetPassword/:token", async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    try {
      const decoded = await jwt.verify(token, process.env.JWT_KEY);
      const id = decoded.id;
      // const hashPassword = await bcryt.hash(password, 10);
      await User.findByIdAndUpdate({ _id: id }, { password: password });
      return res.json({ status: true, message: "updated password" });
    } catch (err) {
      return res.json("invalid token");
    }
  });
  
  
// Global ERROR Middleware
app.use((err, req, res, next) => {
  res.status(500).send('Something went WRONG!!!');
});


const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
