const express = require('express');
const authGoogleRoutes = require('./google.routes');
const authMicrosoftRoutes = require('./microsoft.routes');
const logoutController = require('../../controllers/logout.controller');

const router = express.Router();

router.use('/google', authGoogleRoutes);
router.use('/microsoft', authMicrosoftRoutes);
router.post('/logout', logoutController);

module.exports = router;