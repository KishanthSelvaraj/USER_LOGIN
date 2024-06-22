// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieparser = require("cookie-parser");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config();
const Empmodel = require("./models/Emp");
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET"],
    credentials: true,
  })
);
app.use(cookieparser());
mongoose.connect("mongodb://0.0.0.0:27017/employee");
const db = mongoose.connection;
const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json("The token was not available");
  } else {
    jwt.verify(token, process.env.PASS_KEY , (err, decoded) => {
      if (err) return res.json("Token is wrong");
      next();
    });
  }
};
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  Empmodel.findOne({ email: email })
  .then(user=>{
    if (!user) {
       return res.status(404).json({ message: "User not found" });
     }
     const token = jwt.sign({ id:user._id }, process.env.PASS_KEY, { expiresIn: '1h' });
     var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      }
    });
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset',
      text:`http://localhost:5173/reset-password/${user._id}/${token}`
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        res.status(500).json({ message: "Error sending password reset email" });
      } else {
        console.log('Password reset email sent: ' + info.response);
        res.status(200).json({ message: "Password reset link sent to your email" ,token:token});
      }
    });
  });
});
app.post('/register', async (req, res) => {
  console.log(req.body);
  try {
    const { firstName, lastName, phoneNumber, dob, email, password, confirmPassword } = req.body;

    // Check if the email already exists in the database
    const existingUserEmail = await Empmodel.findOne({ email });
    if (existingUserEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Check if the phone number already exists in the database
    const existingUserPhoneNumber = await Empmodel.findOne({ phoneNumber });
    if (existingUserPhoneNumber) {
      return res.status(400).json({ message: 'Phone number already exists' });
    }

    // If email and phone number don't exist, create a new user
    const newUser = new Empmodel({ firstName, lastName, phoneNumber, dob, email, password, confirmPassword });
    await newUser.save();

    res.status(200).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  Empmodel.findOne({ email: email }).then((user) => {
    if (user) {
      if (user.password === password) {
        const token = jwt.sign({ email: user.email }, process.env.PASS_KEY , { expiresIn: "1d" });
        res.cookie("token", token);
        res.status(200).json({ message: "You are Successfully Logged In", token: token });
      } else {
        res.status(500).json("Incorrect Password or Email");
      }
    } else {
      res.status(404).json("Email not found"); // Notify the user if email doesn't exist
    }
  });
});


app.post('/reset-password/:id/:token', (req, res) => {
  const { id, token } = req.params;
  jwt.verify(token, process.env.PASS_KEY, (err, decoded) => {
      if (err) {
          return res.json({ Status: "Error with token" });
      } else {
        const {password}=req.body;
          Empmodel.findByIdAndUpdate({ _id: id }, { password: password })
              .then(u => res.send({ Status: "Success" }))
              .catch(err => res.send({ Status: err }));
      }
  });
});
app.get("/home", verifyUser, (req, res) => {
  return res.json("Success");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
