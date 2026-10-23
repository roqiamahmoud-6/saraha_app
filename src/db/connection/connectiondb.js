import mongoose from "mongoose";

export const connectiondb=async()=>{
    try{
         await  mongoose.connect("mongodb://localhost:27017/sara7a_app")
    console.log("db connected successfully👌")
    }catch(err){
        console.log(err)
    }

}