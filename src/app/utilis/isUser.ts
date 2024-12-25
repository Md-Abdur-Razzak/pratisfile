import { RequestHandler } from "express"
import userModel from "../Module/userModel/user.model"
import { user } from "./verifiToken"

export const isUser:RequestHandler = async(req,res,next)=>{
    const {email} = user as {email:string}
    
    const checkAdmin = await userModel.findOne({email})
    if (!checkAdmin || checkAdmin?.isBlocked) {
        return res.status(401).json({
            success: false,
            message: "Unauthorize user",
            statusCode: 401,
        })
        
    }
    
    if(checkAdmin?.role === "user"){
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