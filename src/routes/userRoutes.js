const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/writeJson', authenticateToken, userController.writeJson);
router.post('/updateJson', authenticateToken, userController.updateJson);
router.post('/readJson', authenticateToken, userController.readJson);

module.exports = router;
