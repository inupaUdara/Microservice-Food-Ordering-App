const express = require("express");
const multer = require("multer");
const router = express.Router();
const imageController = require("../controllers/imageController");

// Use memory storage for multer
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("image"), imageController.upload);
router.get("/", imageController.getAll);
router.get("/:id", imageController.getOne);
router.delete("/:id", imageController.remove);
router.put("/:id", upload.single("image"), imageController.update);

module.exports = router;
