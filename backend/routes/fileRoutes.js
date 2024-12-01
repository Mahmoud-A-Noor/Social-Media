const fileController = require("../controllers/fileController");
const multer = require("multer");
const express = require("express");
const router = express.Router();


// Configure Multer
const storage = multer.memoryStorage();
const upload = multer({ storage });



router.post('/', upload.single("file"), fileController.uploadFile);
router.put('/', upload.single('newFile'), fileController.updateFile);
router.delete('/', fileController.deleteFile);

module.exports = router;