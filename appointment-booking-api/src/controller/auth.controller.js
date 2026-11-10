import {
  registerUser as registerUserService,
  loginUser as loginUserService,
} from "../service/auth.service.js";

import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof email !== "string" ||
    !isValidEmail(email.trim()) ||
    typeof password !== "string" ||
    password.length < 8
  ) {
    throw new ApiError(
      400,
      "Name, valid email, and password of at least 8 characters are required"
    );
  }

  const user = await registerUserService({
    name: name.trim(),
    email,
    password,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, user, "User registered successfully"));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (
    typeof email !== "string" ||
    !isValidEmail(email.trim()) ||
    typeof password !== "string" ||
    !password
  ) {
    throw new ApiError(400, "Valid email and password are required");
  }

  const result = await loginUserService({
    email,
    password,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Login successful"));
});
