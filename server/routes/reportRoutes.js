const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// GET /api/reports - Get all reports
router.get('/', reportController.getAllReports);

// GET /api/reports/:id - Get report by ID
router.get('/:id', reportController.getReportById);

// POST /api/reports - Create a report (with image upload)
router.post('/', upload.array('images', 5), reportController.createReport);

// PUT /api/reports/:id - Update a report (auth required)
router.put('/:id', auth, reportController.updateReport);

// DELETE /api/reports/:id - Delete a report (auth required)
router.delete('/:id', auth, reportController.deleteReport);

module.exports = router;
