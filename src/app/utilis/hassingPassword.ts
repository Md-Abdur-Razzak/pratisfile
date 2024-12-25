import bcrypt from "bcrypt"
// Function to hash a password
export const hashPassword=async(password:any)=> {
  const saltRounds = 10; // Recommended salt rounds
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}