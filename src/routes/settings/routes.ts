import express from 'express';
import settingController from '../../controllers/settings/controller.js';

const router = express.Router();


/**
 * Get all settings
 * @route GET /api/v1/settings/
 * @desc Retrieve all settings
 * @access Private
 */
router.get('/', settingController.index);

/**
 * Get public settings only
 * @route GET /api/v1/settings/public
 * @desc Retrieve public settings only
 * @access Public
 */
router.get('/public', settingController.getPublic);

/**
 * Get setting by key
 * @route GET /api/v1/settings/key/:key
 * @desc Retrieve a setting by its key
 * @access Private
 */
router.get('/key/:key', settingController.findByKey);

/**
 * Get setting by ID
 * @route GET /api/v1/settings/:id
 * @desc Retrieve a setting by its ID
 * @access Private
 */
router.get('/:id', settingController.find);

/**
 * Create a new setting
 * @route POST /api/v1/settings/create
 * @desc Create a new setting
 * @access Private
 */
router.post('/create', settingController.create);

/**
 * Update setting
 * @route PUT /api/v1/settings/update/:id
 * @desc Update an existing setting
 * @access Private
 */
router.put('/update/:id', settingController.update);

/**
 * Delete setting
 * @route DELETE /api/v1/settings/:id
 * @desc Delete a setting
 * @access Private
 */
router.delete('/:id', settingController.destroy);


export { router as settingsRoutes }