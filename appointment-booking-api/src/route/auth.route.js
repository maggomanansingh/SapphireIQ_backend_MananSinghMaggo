import { Router } from "express";

import {
  register,
  login,
} from "../controller/auth.controller.js";

const router = Router();
/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User registration and login
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Alex Doe
 *               email:
 *                 type: string
 *                 example: alex@example.com
 *               password:
 *                 type: string
 *                 example: Password123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid registration input
 *       409:
 *         description: Email already registered
 */
router.post("/register", register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user or provider
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: alex@example.com
 *               password:
 *                 type: string
 *                 example: Password123
 *     responses:
 *       200:
 *         description: Login successful. Returns JWT access token and user details.
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Invalid email or password
 */
router.post("/login", login);




export default router;