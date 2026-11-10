import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Name is required"],
        trim:true
    },
    email:{
        type:String,
        required:[true,"email is required"],
        trim:true,
        lowercase:true,
        unique:true
    },
    password:{
        type:String,
        required:[true,"Password is required"]
    },
    role:{
        type:String,
        enum:["user","provider"],
        default:"user"
    }
},{timestamps:true})

export const User = mongoose.model("User",userSchema)