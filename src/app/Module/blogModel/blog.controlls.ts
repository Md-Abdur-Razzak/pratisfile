import { RequestHandler } from "express";
import { golobalResponseSend } from "../../utilis/golobal.respons.send";
import { golobalResponseError } from "../../utilis/golobalError";
import { stackError } from "../../utilis/stackError";
import BlogPostModel from "./blog.model";
import { BlogPost } from "./blog.interface";
import { user } from "../../utilis/verifiToken";
import userModel from "../userModel/user.model";
import mongoose from "mongoose";
import { hashPassword } from "../../utilis/hassingPassword";


const blogCreat:RequestHandler = async(req,res)=>{
    try {
        let blogData = req.body
        const {email}= user as  { email: string; password: string }
        const findByIddata = await userModel.findOne({email})
        if (findByIddata) {
            blogData.author = findByIddata?._id
        }
        let {_id,title,content,author} =await (await BlogPostModel.create(blogData))
        let authorData =await (await userModel.findById(author))
         const hashedPassword = await hashPassword(authorData?.password);
         if (authorData ) {
            authorData.password = hashedPassword
         } 
        
        res.status(201).json(
        golobalResponseSend(true,"Blog created successfully",201,{_id,title,content,author:authorData})
       )
    } catch (error) {
     res.status(400).json(
        golobalResponseError(false,"Validation error",400,error,stackError(error))
     )
       
    }
  

}

const updateBlog:RequestHandler = async(req,res)=>{
    try {
        const id = req.params?.id
        const {content,title}=req.body
        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "Title and content are required",
                statusCode: 400,
            });
        }
        let updateblogData =await BlogPostModel.findByIdAndUpdate(id,{content,title},{ new: true })
       
        const { _id, title: updatedTitle = '', content: updatedContent = '', author = '' } = updateblogData || {};

        let authorData =await (await userModel.findById(author))
        const hashedPassword = await hashPassword(authorData?.password);
        if (authorData ) {
            authorData.password = hashedPassword
        } 
        res.status(200).json(
        golobalResponseSend(true,"Blog updated successfully",200,{_id,title,content,author:authorData})
       )
    } catch (error) {
     res.status(400).json(
        golobalResponseError(false,"Validation error",400,error,stackError(error))
     )
       
    }
  

}

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
        
        let findData =await BlogPostModel.findById({_id:id})
        if (!findData) {
            return res.status(400).json({
                success: false,
                message: "please give me vaild id",
                statusCode: 400,
            });
        }
      await BlogPostModel.deleteOne({_id:id})
        res.status(201).json(
      {
        success: true,
        message: "Blog deleted successfully",
        statusCode: 400,
      }
       )
    } catch (error) {
     res.status(400).json(
        golobalResponseError(false,"Somthing wrong !",400,error,stackError(error))
     )
       
    }
  

}


 const serchingBlog: RequestHandler = async (req, res) => {
    try {
        const { search, sortBy = "createdAt", sortOrder = "desc", filter } = req.query;
 
        
        // Construct the query object
        const query: any = {};
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } }, // Search in title
                { content: { $regex: search, $options: "i" } }, // Search in content
            ];
        }
        let authorFilter: string | undefined;
        if (typeof filter === 'string') {
          authorFilter = filter.trim(); // Ensure it's a string and remove extra spaces
          if (!mongoose.Types.ObjectId.isValid(authorFilter)) {
            return res.status(400).json({
              success: false,
              message: 'Invalid author ID provided',
              statusCode: 400,
            });
          }
        }
    
       // Sort object
        let sort: any = {};
        if (sortBy || sortOrder) {
            sort[sortBy as string] = sortOrder.toString() === "asc" ? 1 : -1;
            console.log("this is a sort data : ",sort,sortOrder);
        }
            console.log(query);
            

        // Fetch blogs
        const blogs = await BlogPostModel.find(query).sort(sort)
        const usermodal = await userModel.find()
        const enhancedPosts = blogs.map(post => {
            const author = usermodal.find(user =>String(user._id) === String(post.author));
            return {
                _id: post._id,
                title: post.title,
                content: post.content,
                author: author ? {
                    _id: author._id,
                    name: author.name,
                    email: author.email
                } : null,
               
             
            };
        });
        
            
        res.status(200).json({
            success: true,
            message: "Blogs fetched successfully",
            statusCode: 200,
            data: enhancedPosts,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch blogs",
            statusCode: 500,
            error
            
        });
    }
};

export const blogModelController = {blogCreat,updateBlog,deletBlog,serchingBlog}