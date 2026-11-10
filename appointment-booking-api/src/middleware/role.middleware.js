import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const authorizeRoles = (...allowedRoles) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      throw new ApiError(401, "Authentication required");
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(403, "You are not authorized to access this resource");
    }

    next();
  });
};

export default authorizeRoles;