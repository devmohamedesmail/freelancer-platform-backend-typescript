import express from 'express';
import CategoryController from '../../controllers/categories/controller.js';
import { authenticateToken } from '../../middlewares/auth.middleware.js';

const router = express.Router();



/**
 * Category Routes
 * @route /categories
 * @method GET
 * @description Get all categories
 * @access Public
 */
router.get('/', CategoryController.index);



/**
 * Get category by ID
 * @route /categories/:id
 * @method GET
 * @description Get a specific category by its ID
 * @access Public
 */
router.get('/:id', CategoryController.find);

/**
 * Create new category
 * @route /categories/create
 * @method POST
 * @description Create a new category
 * @access Public
 */
router.post('/create',  CategoryController.create);

/**
 * Update category
 * @route /categories/update/:id
 * @method PUT
 * @description Update an existing category
 * @access Public
 */
router.put('/update/:id', CategoryController.update);

/**
 * Delete category
 * @route /categories/:id
 * @method DELETE
 * @description Delete an existing category
 * @access Public
 */
router.delete('/:id', CategoryController.destroy);



export {router as categoriesRoutes};