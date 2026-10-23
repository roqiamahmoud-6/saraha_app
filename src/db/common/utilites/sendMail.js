import { randomInt } from "node:crypto";
import nodemailer from "nodemailer";
import { otpTemplate } from "./otpTemplete.js";

export const sendEmail =async({to,subject,html})=>{
    const transporter = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:"rokasaber94@gmail.com",
            pass:"qhwmjwejrpgvnpkl"
            // qhwm jwej rpgv npkl
        }
    })
    const info =await transporter.sendMail({
        from:`sara7aAPP<rokasaber94@gmail.com>`,
        to,
        subject,
        html,
    })
}
export const generateOtp=()=>{
  return randomInt(100000,1000000).toString()
}