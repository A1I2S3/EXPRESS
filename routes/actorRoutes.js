const express = require('express');
const { requireRole } = require('../middleware/verifyrole.js');
const { verifyToken } = require('../middleware/verifytoken.js');
const router = express.Router();
const actorController = require('../controllers/actorController');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', [verifyToken, requireRole("director"), upload.single('file')], actorController.uploadActors);

router.get('/download', [verifyToken, requireRole(['director', 'actor'])], actorController.downloadActors);

module.exports = router;