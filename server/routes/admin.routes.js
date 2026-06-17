const { Router } = require('express');
const adminController = require('../controllers/admin.controller');
const { verifyToken, requireAdmin } = require('../middleware/auth');

const router = Router();

router.use(verifyToken, requireAdmin);

router.get('/users', adminController.getUsers);
router.delete('/users/:id', adminController.deleteUser);
router.patch('/users/:id/role', adminController.updateUserRole);
router.delete('/cars/:id', adminController.deleteCar);

module.exports = router;
