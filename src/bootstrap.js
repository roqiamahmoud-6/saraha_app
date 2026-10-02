import express from "express"
import { connectiondb } from "./db/connectiondb.js"
import { userRouter } from "./modules/usermodule/usercontroller.js"
import { usermodel } from "./db/models/usermodel.js"
import cors from "cors"
const app = express()
export const bootstrap =async()=>{

await connectiondb()
app.use(cors())
app.use(express.json())

app.use("/users",userRouter)

app.use("{/*ddd}",(req,res,next)=>{
    res.status(404).json({message:`url :${req.originalUrl} or method ${req.method} not found`})
})

app.listen(3000,()=>{
    console.log("app created successfully❤❤")
})
}
