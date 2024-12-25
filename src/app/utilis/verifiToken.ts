import jwt, { JwtPayload } from "jsonwebtoken"
import config from "../config";
import { NextFunction,Response,Request} from "express";

export const verifyToken = (req:Request, res: Response, next: NextFunction) => {
    const authorizationHeader = req.headers.authorization; 
    const token = authorizationHeader?.split(' ')[1]; 
    
    

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized: Token is missing',
            statusCode: 401,
        });
    }

    try {
        const decoded = jwt.verify(token, config.jwt_secret!) as JwtPayload;
        req.user = decoded as JwtPayload;
      
        
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Unauthorized: Invalid token',
            statusCode: 401,
        });
    }
};

