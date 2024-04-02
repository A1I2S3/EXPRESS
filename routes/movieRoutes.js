const express = require('express');
const { requireRole } = require('../middleware/verifyrole.js');
const { verifyToken } = require('../middleware/verifytoken.js');
const router = express.Router();
const movieController = require('../controllers/movieController');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', verifyToken, movieController.getAllMovies);

router.post('/upload', [verifyToken, requireRole("director"), upload.single('file')], movieController.uploadMovies);

router.get('/download', [verifyToken, requireRole('director')], movieController.downloadMovies);

module.exports = router;