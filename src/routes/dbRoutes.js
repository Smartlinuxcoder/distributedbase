const express = require('express');
const router = express.Router();
const dbController = require('../controllers/dbController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/writeJson',  dbController.writeJson);
router.post('/updateJson',  dbController.updateJson);
router.post('/readJson',  dbController.readJson);

module.exports = router;
