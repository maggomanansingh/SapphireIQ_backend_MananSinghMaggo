import mongoose from "mongoose";

export const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

export const isValidDate = (date) => {
  return (
    typeof date === "string" &&
    !Number.isNaN(Date.parse(date))
  );
};