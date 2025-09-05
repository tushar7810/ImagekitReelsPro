import mongoose, { mongo } from "mongoose";

const url = process.env.DB_URI!

if(!url){
    throw new Error("Please define mongo_uri in env variables")
}

let cached = global.mongoose

if(!cached){
    cached = global.mongoose = {
        conn: null,
        promise: null
    }
}

export async function connectDB() {
    if(cached.conn){
        return cached.conn
    }
    if(!cached.promise){
        const opt = {
            bufferCommands: true,
            maxPoolSize: 10
        }
        mongoose
        .connect(url)
        .then(() => mongoose.connection)
    }

    try{
        cached.conn = await cached.promise
    }catch(error){
        cached.promise = null
        throw error
    }

    return cached.conn
}