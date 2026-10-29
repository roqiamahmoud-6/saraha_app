import mongoose from "mongoose"

const conversationSchema =new mongoose.Schema({
    user1:{
        type:String,
        required:true
    },
    user2:{
        type:String,
        required:true
    },
    messageId:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:"message"
    }
},{
    timestamps:true,
    strict:true,
    strictQuery:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true},
})

export const conversationModel= mongoose.models.conversation||mongoose.model("conversation",conversationSchema)