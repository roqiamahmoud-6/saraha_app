import mongoose from "mongoose";
const messageschema =new mongoose.Schema({
    content :{
        type:String,
        required:function(){
            return !this.attachments?.length
        }
    },
    attachments:[String],
    userId:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:"user"
    },
    conversation:{
        type:Boolean,
        default:"false"
    },
    status:{
        type:String,
        default:"new",
        enum:["pending","accepted","rejected","new"]
    },
    conversationId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "conversation",
  required: true
  },
    senderId:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:"user"
    }


},{
    timestamps:true,
    strict:true,
    strictQuery:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true},
})

export const messageModel= mongoose.models.message||mongoose.model("message",messageschema)