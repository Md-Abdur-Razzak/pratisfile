import express from "express"
import { blogModelController } from "./blog.controlls";
import { verifyToken } from "../../utilis/verifiToken";
import { isUser } from "../../utilis/isUser";
const blogRouter = express.Router()

 
blogRouter.post('/blogs',verifyToken,isUser,blogModelController?.blogCreat);
blogRouter.patch('/blogs/:id',verifyToken,isUser,blogModelController?.updateBlog);
blogRouter.delete('/blogs/:id',verifyToken,isUser,blogModelController?.deletBlog);
blogRouter.get('/blogs', blogModelController?.serchingBlog);

export default blogRouter