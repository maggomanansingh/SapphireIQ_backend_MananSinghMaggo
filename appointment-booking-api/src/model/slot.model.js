import mongoose from "mongoose";

const slotSchema = new mongoose.Schema({
    provider:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true,"provider is required"],
    },
    startTime:{
        type:Date,
        required:[true,"Slot start time is required"],
    },
    endTime:{
        type:Date,
        required:[true,"Slot end time is required"],
    }    
},{timestamps:true})

slotSchema.indexes({provider:1, startTime:1})

export const Slot = mongoose.model("Slot",slotSchema)