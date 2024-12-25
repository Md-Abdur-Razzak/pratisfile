import jwt from "jsonwebtoken"
import config from "../config";
import { NextFunction,Response } from "express";
export let user = {}
export const verifyToken = (req:any, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized: Token is missing',
            statusCode: 401,
        });
    }

    try {
        const decoded = jwt.verify(token, config.jwt_secret!) as {
            password: string;
            email: string;
        };
       user = decoded;
      
        
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Unauthorized: Invalid token',
            statusCode: 401,
        });
    }
};

