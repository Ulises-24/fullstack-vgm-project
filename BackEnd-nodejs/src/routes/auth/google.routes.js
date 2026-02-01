const express = require('express');
const authGoogleController = require('../../controllers/auth.google.controller');

const router = express.Router();

router.get('/url', authGoogleController.getGoogleAuthUrl);
router.post('/login', authGoogleController.loginWithGoogle);
router.post('/register', authGoogleController.registerWithGoogle);
router.get('/callback', authGoogleController.getGoogleCallback);

module.exports = router;