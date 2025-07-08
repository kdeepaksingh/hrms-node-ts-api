export interface IUser {
  name: string;
  email: string;
  mobileNo: string;
  password?: string;
  resetToken?: string;
  resetTokenExpiry?: Date;
  verificationCode: string;
  role?: "user" | "admin";
}


export interface ILogin {
  email: string;
  password:string;
  mobileNo:string;
  verificationCode: string;
}
