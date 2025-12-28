import express from 'express';
import ReviewController from '../../controllers/reviews/controller.js';
const router = express.Router();

/**
 * Review Routes
 * Get all reviews
 * router.get('/', ReviewController.index);
 * Get reviews by store ID
 * router.get('/store/:store_id', ReviewController.getByStore);
 * Get reviews by user ID
 * router.get('/user/:user_id', ReviewController.getByUser);
 */
router.get('/', ReviewController.index);

/**
 * Get reviews by store ID
 * router.get('/store/:store_id', ReviewController.getByStore);
 * 
 */
router.get('/store/:store_id', ReviewController.getByStore);

/**
 * Get reviews by user ID
 * router.get('/user/:user_id', ReviewController.getByUser);
 */
router.get('/user/:user_id', ReviewController.getByUser);

/**
 * Get single review by ID
 * router.get('/:id', ReviewController.find);
 */
router.get('/:id', ReviewController.find);

/**
 * Create review
 * 
 */
router.post('/create', ReviewController.create);

/**
 * Update review
 * router.put('/:id', ReviewController.update);
 */
router.put('/:id', ReviewController.update);

/**
 * Delete review
 * router.delete('/:id', ReviewController.destroy); 
 * 
 */
router.delete('/:id', ReviewController.destroy);


export { router as reviewsRoutes };