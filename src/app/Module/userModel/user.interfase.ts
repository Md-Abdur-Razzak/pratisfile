type UserRole = "admin" | "user";
export type Tuser = {
    name: string; // The full name of the user
    email: string; // The email address of the user
    password: string; // The password, securely stored
    role?: UserRole; // The role, default is "user"
    isBlocked?: boolean; // Indicates if the user is blocked, default is false
    createdAt?: Date; // The timestamp when the user was created
    updatedAt?: Date; // The timestamp of the last update
  };