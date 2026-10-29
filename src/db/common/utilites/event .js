import { EventEmitter } from "events";

 export const eventEmitter = new EventEmitter()

eventEmitter.on("confirm email",async(fn)=>{
    await fn()
})
eventEmitter.on("reset password",async(fn)=>{
    await fn()
})
eventEmitter.on("sign in with verifiction",async(fn)=>{
    await fn()
})
