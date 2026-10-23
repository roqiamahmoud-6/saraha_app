import { createClient } from "redis"

export const r_client = createClient({
  url: "rediss://default:gQAAAAAAA5s0AAIgcDIxNjU0Mjc1M2Y2NGE0MDIxOGMxMjg2YjU3MjY1MTlhYQ@up-ladybird-236340.upstash.io:6379"
});
export const connectionRedis=async()=>{
    try{
         await  r_client.connect()
    console.log("redis connected successfully👌")
    }catch(err){
        console.log(err)
    }

}