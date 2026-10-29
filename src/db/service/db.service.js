export async function create({model,data}){
    return await model.insertOne(data)
}
export async function createe({model,data}){
    return await model.create(data)
}
export async function find({model,condition,projection= {}}){
    return await model.findOne(condition,projection)
}
export async function findall({ model, condition = {}, options = {} }) {
    return await model.find(condition)
        .skip(options.skip || 0)
        .sort(options.sort || 0)
        .limit(options.limit || 10)
}
export async function findbyid({model,id,options= {}}){
    return await model.findById(id,options)
}
export async function findByIdAndUpdate({model,id,updateData}){
    return await model.findByIdAndUpdate(id, { $set: updateData },{ returnDocument: "after", runValidators: true })
}
export async function findoneAndUPDATe({model,data,updateData}){
    return await model.findOneAndUpdate(data, { $set: updateData },{ returnDocument: "after", runValidators: true })
}


