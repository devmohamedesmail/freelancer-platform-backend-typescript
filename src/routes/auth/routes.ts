import express from 'express';
import AuthController from '../../controllers/auth/controller.js';
const router = express.Router();

// Define your auth routes here
/**
 * Register a new user
 * @route POST /api/v1/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', AuthController.register);
/**
 * Login user
 * @route POST /api/v1/auth/login
 * @desc Login user
 * @access Public
 */
router.post('/login', AuthController.login);
/**
 * Logout user
 * @route POST /api/v1/auth/logout
 * @desc Logout user
 * @access Private
 */
router.post('/logout', AuthController.logout);
/**
 * Delete user account
 * @route POST /api/v1/auth/delete-account
 * @desc Delete user account
 * @access Private
 */
router.post('/delete-account', AuthController.destroy);
/**
 * Get user profile
 * @route GET /api/v1/auth/me
 * @desc Get user profile
 * @access Private
 */
router.get('/me', AuthController.getProfile);




export { router as authRoutes }
