import { RequestHandler } from "express";
import userModel from "./user.model";
import { golobalResponseSend } from "../../utilis/golobal.respons.send";
import { golobalResponseError } from "../../utilis/golobalError";
import { stackError } from "../../utilis/stackError";
import jwt from "jsonwebtoken"
import config from "../../config";
import mongoose from "mongoose";
import BlogPostModel from "../blogModel/blog.model";
// import { hashPassword } from "../../utilis/hassingPassword";

const userCreat:RequestHandler = async(req,res)=>{
    try {
        let reciveUser = req.body
        // const hashedPassword = await hashPassword(reciveUser?.password);
        //  reciveUser.password = hashedPassword
        let {_id,name ,email,} =await userModel.create(reciveUser)
        res.status(201).json(
        golobalResponseSend(true,"User registered successfully",201,{_id,name,email})
       )
    } catch (error) {
     res.status(400).json(
        golobalResponseError(false,"Validation error",400,error,stackError(error))
     )
       
    }
  

}

const loginUser: RequestHandler = async (req, res) => {
    try {
        const { email, password }: { email: string; password: string } = req.body;

        // Validate request body
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
                statusCode: 400,
            });
        }

        // Find the user by email
        const user = await userModel.findOne({ email,password });
       
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
                statusCode: 401,
                error: "User not found",
            });
        }
        if(user?.isBlocked == true){
            return res.status(401).json({
                success: false,
                message: "user is block",
                statusCode: 401,
                
            });
        }
        // Verify password
        // const isPasswordValid = await bcrypt.compare(password, user.password);
        // if (!isPasswordValid) {
        //     return res.status(401).json({
        //         success: false,
        //         message: "Invalid credentials",
        //         statusCode: 401,
        //         error: { details: "Password mismatch" },
        //     });
        // }

        // Generate JWT token
        
        const token = jwt.sign(
            {email: user.email,password:user?.password},
            config.jwt_secret as string, // Ensure JWT_SECRET is defined in your environment variables
            { expiresIn: '20d' }
        );

        // Send success response
        res.status(200).json({
            success: true,
            message: "Login successful",
            statusCode: 200,
            data: { token },
        });
    } catch (error) {
        res.status(401).json(
            golobalResponseError(false,"Invalid credentials",401,error,stackError(error))
        );
    }
};

const blockuserByAdmint:RequestHandler = async (req, res) => {
    const { userId } = req.params;
console.log(userId);

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid user ID format",
            statusCode: 400,
        });
    }

    try {
        // Find the user and update isBlocked to true
        const user = await userModel.findByIdAndUpdate(
            userId,
            { isBlocked: true },
            { new: true } // Return the updated document
        );

        // If user not found
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                statusCode: 404,
            });
        }

        // Success response
        return res.status(200).json({
            success: true,
            message: "User blocked successfully",
            statusCode: 200,
         
        });
    } catch (error) {
        // Handle server errors
        return res.status(500).json({
            success: false,
            message: "An error occurred while blocking the user",
            error,
            statusCode: 500,
        });
    }
};


const deletBlog:RequestHandler = async(req,res)=>{
    try {
        const id = req.params?.id
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid blog ID format",
                statusCode: 400,
            });
        }
        let findData =await BlogPostModel.findById(id)
        if (!findData) {
            return res.status(400).json({
                success: false,
                message: "please give me vaild id",
                statusCode: 400,
            });
        }
      await BlogPostModel.deleteOne({_id:id})
        res.status(200).json(
      {
        success: true,
        message: "Blog deleted successfully",
        statusCode: 200,
      }
       )
    } catch (error) {
     res.status(400).json(
        golobalResponseError(false,"Somthing wrong !",400,error,stackError(error))
     )
       
    }
  

}

export const userModelController = {userCreat,loginUser,blockuserByAdmint,deletBlog}