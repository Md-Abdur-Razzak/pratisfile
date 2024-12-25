import {ObjectId } from 'mongoose';

// Define the TypeScript interface
export type BlogPost = {
  title: string;
  content: string;
  author?: ObjectId;
  isPublished?: boolean;
 
}





