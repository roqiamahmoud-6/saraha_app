import { createClient } from "redis"
import { urlRedis } from "../../../env/config.service.js";

export const r_client = createClient({
  url: urlRedis
});
export const connectionRedis=async()=>{
    try{
         await  r_client.connect()
    console.log("redis connected successfully👌")
    }catch(err){
        console.log(err)
    }

}