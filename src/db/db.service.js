export async function create({model,data}){
    return await model.insertOne(data)
}
export async function find({model,condition}){
    return await model.findOne(condition)
}

