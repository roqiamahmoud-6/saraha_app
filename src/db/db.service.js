export async function create({model,data}){
    return await model.insertOne(data)
}
export async function find({model,condition}){
    return await model.findOne(condition)
}
export async function findbyid({model,id}){
    return await model.findById(id)
}

