export const authorization =(roles=[])=>{
    return async (req,res,next)=>{
        const user =req.user
        if(!roles.includes(user.roles)){
            return res.status(400).json({message:"un authorized"})
        }
        next()
    }

}