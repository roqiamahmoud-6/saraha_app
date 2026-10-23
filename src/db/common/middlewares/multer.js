import multer from "multer"
import {randomUUID}from "crypto"
import fs from "node:fs"
import{resolve} from "node:path"

export const multerLocal= ({custompath="general",ext=[]})=>{
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
         
         function filefilter (req,file,cb){
            if(!ext.includes (file.mimetype) ){
               cb(new Error("i don't have a clue "))
            }else{
               cb(null,true)
            }
         }

     const upload =multer({storage,fileFilter: filefilter})
     
       return upload
}