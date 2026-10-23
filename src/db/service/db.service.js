export async function create({model,data}){
    return await model.insertOne(data)
}
export async function createe({model,data}){
    return await model.create(data)
}
export async function find({model,condition}){
    return await model.findOne(condition)
}
export async function findbyid({model,id,options}){
    return await model.findById(id,options)
}
export async function findByIdAndUpdate({model,id,updateData}){
    return await model.findByIdAndUpdate(id, { $set: updateData },{ new: true, runValidators: true })
}
export async function findoneAndUPDATe({model,data,updateData}){
    return await model.findOneAndUpdate(data, { $set: updateData },{ new: true, runValidators: true })
}


