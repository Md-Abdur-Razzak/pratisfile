import { RequestHandler } from "express"
import userModel from "../Module/userModel/user.model"
import { user } from "./verifiToken"

export const isAdmin:RequestHandler = async(req,res,next)=>{
    const {email} = user as {email:string}
    const checkAdmin = await userModel.findOne({email})
    if (!checkAdmin) {
        return res.status(400).json({
            success: false,
            message: "oops ! user not available ",
            statusCode: 400,
        })
        
    }
    
    if(checkAdmin?.role === "admin"){
        console.log(checkAdmin?.role);
        next()
    }else{
        res.status(401).json(
            {
                success: false,
                message: 'Unauthorized access',
                statusCode: 401,  
            }
        )
    }
}