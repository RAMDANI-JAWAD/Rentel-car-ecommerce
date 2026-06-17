const { Router } = require('express');
const favoriteController = require('../controllers/favorite.controller');
const { verifyToken } = require('../middleware/auth');

const router = Router();

router.get('/', verifyToken, favoriteController.getFavorites);
router.post('/', verifyToken, favoriteController.addFavorite);
router.delete('/:carId', verifyToken, favoriteController.removeFavorite);

module.exports = router;
