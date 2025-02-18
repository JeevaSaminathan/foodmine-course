import { Router } from "express";
import { sample_users } from "../data";
import jwt from 'jsonwebtoken';
import asyncHandler from "express-async-handler";
import { User, UserModel } from "../models/user.model";
import { HTTP_BAD_REQUEST } from "../constants/http_status";
import bcrypt from 'bcryptjs';
const router = Router();

import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const otpStore: Record<string, string> = {};

router.use(bodyParser.json());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
    },
});

router.post('/send-otp', async (req: Request, res: Response) => {
    const email = req.body.email;
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); 

    otpStore[email] = otp;

    try {
        let info = await transporter.sendMail({
            from: `"My App" <${process.env.EMAIL_USER}>`,
            to: email, 
            subject: 'Your OTP Code', 
            text: `Your OTP code is ${otp}`,
        });

        console.log('Message sent: %s', info.messageId); 
        res.status(200).json({ message: 'OTP sent successfully', otp: otp });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error sending OTP' + error);
    }
});

// Route to verify OTP
router.post('/verify-otp', (req: Request, res: Response) => {
    const { email, otp } = req.body;

    if (otpStore[email] === otp) {
        delete otpStore[email]; // Clear the OTP after successful verification
        res.status(200).json({ message: 'OTP verified successfully'});
    } else {
        res.status(400).send('Invalid OTP');
    }
});



router.get("/seed", asyncHandler(
    async(req, res) => {
        const usersCount = await UserModel.countDocuments();
        if(usersCount> 0){
            res.send("Seed is already done!");
            return;
        }

        await UserModel.create(sample_users);
        res.send("Seed Is Done!");
    }
))

router.post("/login", asyncHandler(
    async (req, res) => {
        const {email, password} = req.body;
        const user = await UserModel.findOne({email});
    
        if(user && (await bcrypt.compare(password, user.password))){
            res.send(generateTokenResponse(user));
        }
        else{
            res.status(HTTP_BAD_REQUEST).send("User name or password is invalid!");
            }
    }
))

router.post('/register', asyncHandler(
    async (req, res) => {
        const {name, email, password, address} = req.body;
        const user = await UserModel.findOne({email});
        if(user){
            res.status(HTTP_BAD_REQUEST)
            .send('User is already exist, please login!');
            return;
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        const newUser:User = {
            id:'',
            name,
            email: email.toLowerCase(),
            password: encryptedPassword,
            address,
            isAdmin: false
        }

        const dbUser = await UserModel.create(newUser);
        res.send(generateTokenResponse(dbUser));
    }
))

router.delete("/deleteuser/:userId", async (req, res) => {
    try {
      const deletedUser = await UserModel.findByIdAndDelete(req.params.userId);
      if (!deletedUser) {
        return res.status(404).json({ error: 'Food not found' });
      }
      res.send(deletedUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

router.get("/getuser",asyncHandler(
    async (req, res) => {
        const users = await UserModel.find({ isAdmin: "false"});
        res.send(users);
    }
))

router.get("/userdetails/:userId",asyncHandler(
    async (req:any, res:any) => {
        const user = await UserModel.findById(req.params.userId);
        res.send(user);
    }
))

router.put('/updateUser/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
      const updatedUser = await UserModel.findByIdAndUpdate(userId, req.body, { new: true });
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.send(updatedUser);
    } catch (error) {
      console.error('Error updating user details:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
});

router.put('/changepassword/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const {name, email, password, newPassword, address, isAdmin} = req.body;
        const user = await UserModel.findOne({email});
    
        if(user && (await bcrypt.compare(password, user.password))){

            const encryptedPassword = await bcrypt.hash(newPassword, 10);

            const changeUser:User = {
                id: userId,
                name: name,
                email: email.toLowerCase(),
                password: encryptedPassword,
                address: address,
                isAdmin: isAdmin
            }
            const updatedUser = await UserModel.findByIdAndUpdate(userId, changeUser, { new: true });
            if (!updatedUser) {
                console.error('User is not Present');
                res.status(HTTP_BAD_REQUEST).send("User not found!");
            }
            res.send(updatedUser);
        }
        else{
            res.status(HTTP_BAD_REQUEST).send("Old Password is Wrong!");
        }
    } catch (error) {
      console.error('Error updating user details:', error);
      res.status(HTTP_BAD_REQUEST).send("Internal server error!");
    }
});


router.put('/forgetchangepassword', async (req: Request, res: Response) => {
    
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({email});
    
        if(user){

            const encryptedPassword = await bcrypt.hash(password, 10);

            const changeUser:User = {
                id: user.id,
                name: user.name,
                email: email.toLowerCase(),
                password: encryptedPassword,
                address: user.address,
                isAdmin: user.isAdmin
            }
            const updatedUser = await UserModel.findByIdAndUpdate(user.id, changeUser, { new: true });
            if (!updatedUser) {
                console.error('User is not Present');
                res.status(HTTP_BAD_REQUEST).send("User not found!");
            }
            res.send(updatedUser);
        }
        else{
            res.status(HTTP_BAD_REQUEST).send("Old Password is Wrong!");
        }
    } catch (error) {
      console.error('Error updating user details:', error);
      res.status(HTTP_BAD_REQUEST).send("Internal server error!");
    }
});

router.get("/userdetailsforgetpassword/:email",asyncHandler(
    async (req:any, res:any) => {
        const { email } = req.params;
        const user = await UserModel.findOne({email});
        res.send(user);
    }
))

const generateTokenResponse = (user: User) => {
    const token = jwt.sign({
        id: user.id, email:user.email, isAdmin:user.isAdmin
    },process.env.JWT_SECRET!, {
        expiresIn:"30d"
    });

    return {
        id: user.id,
        email: user.email,
        name: user.name,
        address: user.address,
        isAdmin: user.isAdmin,
        token: token
    };
}

export default router;