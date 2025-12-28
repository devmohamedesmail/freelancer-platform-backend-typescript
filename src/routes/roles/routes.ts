import express from 'express';
import { authenticateToken } from '../../middlewares/auth.middleware.js';
import RoleController from '../../controllers/roles/controller.js';
const router = express.Router();


/**
 * @route   GET /api/v1/roles
 * @desc    Get all roles
 * @access  Protected
 */
router.get('/', RoleController.index);

/**
 * @route   GET /api/v1/roles/statistics
 * @desc    Get role statistics
 * @access  Protected
 */
router.get('/statistics', authenticateToken, RoleController.getStatistics);





/**
 * @route   GET /api/v1/roles/:id
 * @desc    Get a single role by ID
 * @access  Protected
 */
router.get('/:id', authenticateToken, RoleController.find);

/**
 * @route   GET /api/v1/roles/:id/users
 * @desc    Get all users for a specific role
 * @access  Protected
 * @query   page, limit
 */
router.get('/:id/users', authenticateToken, RoleController.getUsersByRole);

/**
 * @route   POST /api/v1/roles
 * @desc    Create a new role
 * @access  Protected (Admin only)
 */
router.post('/create', authenticateToken, RoleController.create);

/**
 * @route   PUT /api/v1/roles/:id
 * @desc    Update a role
 * @access  Protected (Admin only)
 */
router.put('/:id', authenticateToken, RoleController.update);

/**
 * @route   DELETE /api/v1/roles/:id
 * @desc    Delete a role
 * @access  Protected (Admin only)
 */
router.delete('/:id', authenticateToken, RoleController.destroy);



export { router as roleRoutes }