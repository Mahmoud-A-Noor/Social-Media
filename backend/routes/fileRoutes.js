const fileController = require("../controllers/fileController");
const multer = require("multer");
const express = require("express");
const router = express.Router();


// Configure Multer
const storage = multer.memoryStorage();
const upload = multer(
    {
        storage,
        limits: { fileSize: 1024 * 1024 * 100 }, // 100 MB
    });



router.post('/', upload.single("file"), fileController.uploadFile);
router.put('/', upload.single('newFile'), fileController.updateFile);
router.delete('/', fileController.deleteFile);

module.exports = router;