const express = require("express");
const router = express.Router();
const multer = require("multer");
const videosController = require("../controllers/videos");
const auth = require("../middleware/auth");

router.post("/upload", auth, videosController.uploadVideo);
router.get("/:id", auth, videosController.getVideo);
router.get("/", auth, videosController.getUserVideos);
router.get("/my-videos-with-progress", auth, videosController.getUserVideosWithProgress);


module.exports = router;
