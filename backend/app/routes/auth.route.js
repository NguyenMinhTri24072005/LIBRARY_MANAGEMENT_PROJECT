const express = require('express');
const authController = require('../controllers/auth.controller');
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get("/me", authMiddleware.verifyToken, authController.getMe);
router.put("/profile", authMiddleware.verifyToken, authController.updateMe);
router.put("/password", authMiddleware.verifyToken, authController.changePassword);

module.exports = router;