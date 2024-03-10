import { Router } from "express";
import { sample_users } from "../data";
import jwt from 'jsonwebtoken';
import asyncHandler from "express-async-handler";
import { User, UserModel } from "../models/user.model";
import { HTTP_BAD_REQUEST } from "../constants/http_status";
import bcrypt from 'bcryptjs';
const router = Router();

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