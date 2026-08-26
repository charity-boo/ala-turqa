const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyAdmin } = require('../middleware/authMiddleware');

// @route   POST /api/admin/staff
// @desc    Create a new staff/admin user
router.post('/staff', verifyAdmin, adminController.createStaffUser);

// @route   GET /api/admin/staff
// @desc    Get all staff/admin users
router.get('/staff', verifyAdmin, adminController.getStaffUsers);

// @route   GET /api/admin/has-setup
router.get('/has-setup', adminController.checkSetup);

// @route   POST /api/admin/setup
router.post('/setup', adminController.setupFirstAdmin);

module.exports = router;
