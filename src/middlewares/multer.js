import multer from "multer"
import {randomUUID}from "crypto"
import fs from "node:fs"
import{resolve} from "node:path"

export const multerLocal= (custompath)=>{
    const pathh = `src/uploads/${custompath}`
    if(!fs.existsSync(pathh)){
        fs.mkdirSync(pathh,{recursive:true})
    }

     const storage = multer.diskStorage({
          destination:(req,File,cb)=>{
             cb(null,resolve(pathh))
          },
          filename:(req,File,cb)=>{
             cb(null,randomUUID()+"__"+File.originalname)
          }
       })
    
       const upload =multer({storage})
       return upload
}