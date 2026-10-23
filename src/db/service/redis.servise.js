import { r_client } from "../connection/connection.redis.js";


export async function setValue({key,value,ex}){
    value= typeof value =="string"?value:JSON.stringify(value)
    ex?
    await r_client.set(key,value,{ EX:ex }):
    await r_client.set(key,value)

}
export async function getValue({key}){
    try{
       return JSON.parse(await r_client.get(key))
    }catch(err){
       return await r_client.get(key);
    }
}
export async function incr({ key, ex = 60 * 6 }) {
    const value = await r_client.incr(key);
    if (value === 1) {
        await r_client.expire(key, ex);
    }
    return value;
}
export async function deleteKey ({key}){
    await r_client.del(key)
}
export async function ttl ({key}){
   return await r_client.ttl(key)
}
export async function exist ({key}){
   return await r_client.exists(key)
}
export async function updateIfExist ({key,value,ex}){
    if(!await r_client.exists(key)){
        return 0
    }else{
        value= typeof value =="string"?value:JSON.stringify(value)
      ex?
    await r_client.set(key,value,{ EX:ex }):
    await r_client.set(key,value)
    }
}

