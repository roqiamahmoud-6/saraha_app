import express from "express"
import { connectiondb } from "./db/connection/connectiondb.js"
import { userRouter } from "./modules/usermodule/usercontroller.js"
import { usermodel } from "./db/models/usermodel.js"
import cors from "cors"
import { connectionRedis } from "./db/connection/connection.redis.js"
import { messageRouter } from "./modules/messagemodule/messagecontroller.js"
import { port } from "../env/config.service.js"
import { conversationRouter } from "./modules/conversationModel/conversationcontroller.js"
const app = express()
export const bootstrap =async()=>{

await connectiondb()
await connectionRedis()
app.use(cors())
app.use(express.json())

app.use("/users",userRouter)
app.use("/conversations",conversationRouter)
app.use("/messages",messageRouter)
app.use("{/*ddd}",(req,res,next)=>{
    res.status(404).json({message:`url :${req.originalUrl} or method ${req.method} not found`})
})

app.listen(port,()=>{
    console.log("app created successfully❤❤")
})
}
