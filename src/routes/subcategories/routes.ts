import express from 'express';
import SubcategoryController from '../../controllers/subcategories/controller.js';
import { authenticateToken } from '../../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * Subcategory Routes
 * @route /subcategories
 * @method GET
 * @description Get all subcategories
 * @access Public
 */
router.get('/', SubcategoryController.index);

/**
 * Get subcategory by ID
 * @route /subcategories/:id
 * @method GET
 * @description Get a specific subcategory by its ID
 * @access Public
 */
router.get('/:id', SubcategoryController.find);

/**
 * Create new subcategory
 * @route /subcategories/create
 * @method POST
 * @description Create a new subcategory
 * @access Protected
 */
router.post('/create', SubcategoryController.create);

/**
 * Update subcategory
 * @route /subcategories/update/:id
 * @method PUT
 * @description Update an existing subcategory
 * @access Protected
 */
router.put('/update/:id', authenticateToken, SubcategoryController.update);

/**
 * Delete subcategory
 * @route /subcategories/:id
 * @method DELETE
 * @description Delete an existing subcategory
 * @access Protected
 */
router.delete('/:id', authenticateToken, SubcategoryController.destroy);

export { router as subcategoriesRoutes };
