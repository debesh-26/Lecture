const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.js');
const { updateProgress, getProgress } = require('../controllers/progress.js');

router.put('/:videoId', auth, updateProgress);
router.get('/:videoId', auth, getProgress);

module.exports = router;