const { Router } = require('express');
const userController = require('../controllers/user.controller');
const { verifyToken } = require('../middleware/auth');

const router = Router();

router.put('/update', verifyToken, userController.updateProfile);

module.exports = router;
