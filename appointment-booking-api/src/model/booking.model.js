import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true,"provider is required"],
    },
    slot:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Slot",
        required:[true,"slot is required"],
    },
    status:{
        type:String,
        enum:["confirmed","cancelled"],
        default:"user"
    }   
},{timestamps:true})

// One confirmed booking per slot.
bookingSchema.index(
  { slot: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "confirmed" },
  }
);

// One confirmed booking per user.
bookingSchema.index(
  { user: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "confirmed" },
  }
);


export const Booking = mongoose.model("Booking",bookingSchema)