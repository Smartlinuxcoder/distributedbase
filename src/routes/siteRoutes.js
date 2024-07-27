const express = require('express');
const router = express.Router();
const siteController = require('../controllers/siteController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/register', siteController.register);
router.post('/login', siteController.login);
router.post('/secureaccess', siteController.secureAccess);

module.exports = router;
