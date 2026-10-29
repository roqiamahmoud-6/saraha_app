import mongoose from "mongoose";
import { urlDb } from "../../../env/config.service.js";

export const connectiondb=async()=>{
    try{
         await  mongoose.connect(urlDb)
    console.log("db connected successfully👌")
    }catch(err){
        console.log(err)
    }

}