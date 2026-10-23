
import mongoose from "mongoose";
const userschema=new mongoose.Schema({
     fname:{
        type:String,
        required:true,
        trim:true,
        minlenth:2,
        maxlenth:17
    },
    lname:{
        type:String,
        required:true,
        trim:true,
        minlenth:2,
        maxlenth:17
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    password:{
        type:String,
        required:function(){
            return this.provider=="system"?true:false
        },
        trim:true
    },
    age:{
        type:Number,
        required:function(){
            return this.provider=="system"?true:false
        },
        min:20,
        max:60
    },
    gender:{
        type:String,
        enum:["male","female"],
        default:"male"
    },
    roles:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },
    phone:{
        type:String
    },
    changeCardintialAT:Date,
    profileimage:String,
    coverImages:[String],
    provider:{
        type:String,
        enum:["system","google"],
        default:"system"
    },
    isconfirmed:{
        type:Boolean,
        default:false
    },
    twoStepVerifiction:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true,
    strict:true,
    strictQuery:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true},
})


export const usermodel=  mongoose.models.user||mongoose.model("user",userschema)