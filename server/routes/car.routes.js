const { Router } = require('express');
const carController = require('../controllers/car.controller');
const { verifyToken, requireAdmin } = require('../middleware/auth');

const router = Router();

router.get('/', carController.getCars);
router.post('/', verifyToken, requireAdmin, carController.createCar);
router.put('/:id', verifyToken, requireAdmin, carController.updateCar);

module.exports = router;
