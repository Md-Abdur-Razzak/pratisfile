import { model, Model, Schema } from "mongoose";
import { Tuser } from "./user.interfase";

const UserSchema: Schema<Tuser> = new Schema(
    {
      name: { 
        type: String, 
        required: [true, "Name is required."] // Custom error message
        
      },
      email: { 
        type: String, 
        required: [true, "Email is required."], // Custom error message
        unique: true 
      },
      password: { 
        type: String, 
        required: [true, "Password is required."] // Custom error message
      },
      role: { 
        type: String, 
        enum: ["admin", "user"], 
        default: "user" 
      },
      isBlocked: { 
        type: Boolean, 
        default: false ,
        
      },
    },
    {
      timestamps: true, // Automatically manage createdAt and updatedAt
    }
  );
  
  // Create and Export the Model
 const userModel = model<Tuser>('User', UserSchema);
  export default userModel