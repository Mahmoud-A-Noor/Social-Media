const { v4: uuidv4 } = require("uuid");
const cloudinary = require("../config/cloudinary");
const streamifier = require('streamifier');
const https = require('https');


// Upload file endpoint
exports.uploadFile = async(req, res) => {
    const file = req.file;
    if (!file) return res.status(400).send({ message: "No file uploaded." });

    const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "auto", public_id: uuidv4() },
        (error, result) => {
            if (error) return res.status(500).send({ message: "Upload failed.", error });
            res.send({ url: result.secure_url });
        }
    );

    uploadStream.end(file.buffer);
}


// Delete file endpoint
exports.deleteFile = async (req, res) => {
    const { publicId } = req.body;

    if (!publicId) {
        return res.status(400).json({ error: 'Public ID is required to delete a file.' });
    }

    try {
        const result = await cloudinary.uploader.destroy(publicId);
        if (result.result !== 'ok') {
            return res.status(400).json({ error: 'Failed to delete file.' });
        }
        res.status(200).json({ message: 'File deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// update file endpoint
exports.updateFile = async (req, res) => {
    const newFile = req.file;
    const { publicId } = req.body; // publicId of the old file and new file data
    if (!publicId || !newFile) {
        return res.status(400).json({ error: 'Public ID and new file data are required.' });
    }

    try {
        // Delete the old file
        await cloudinary.uploader.destroy(publicId);

        // Upload the new file using a stream
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: 'auto' }, // Auto-detect file type (image/video/document)
            (error, result) => {
                if (error) {
                    return res.status(500).json({ error: error.message });
                }
                res.status(200).json({ message: 'File updated successfully.', newFileUrl: result.secure_url });
            }
        );
        streamifier.createReadStream(newFile.buffer).pipe(uploadStream);
        // const result = await cloudinary.uploader.upload(newFile, {
        //     resource_type: "auto",
        // });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Route to stream the video dynamically using a video URL passed in the query string
exports.streamVideo = (req, res) => {
    const videoUrl = req.query.url; // Get the video URL from the query string
    const fileExtension = req.query.fileExtension; // Get the video URL from the query string

    if (!videoUrl) {
        return res.status(400).send('Video URL is required');
    }

    console.log("Fetching video from:", videoUrl); // Log the URL being requested

    const range = req.headers.range;

    if (!range) {
        res.status(400).send('Range header is required');
        return;
    }

    https.get(videoUrl, (videoResponse) => {
        if (videoResponse.statusCode !== 200) {
            console.error("Error fetching video:", videoResponse.statusCode);
            return res.status(500).send('Error fetching the video');
        }

        const videoSize = parseInt(videoResponse.headers['content-length']);
        const CHUNK_SIZE = 10 ** 6; // 1MB chunk size

        const start = parseInt(range.replace(/\D/g, ''));
        const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

        const contentLength = end - start + 1;

        res.status(206); // Partial content
        res.set({
            'Content-Range': `bytes ${start}-${end}/${videoSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': contentLength,
            'Content-Type': fileExtension,
            'Cache-Control': 'no-cache, no-store, must-revalidate', // Disable caching
            'Pragma': 'no-cache', // Older HTTP/1.0 cache control
            'Expires': '0', // Prevent caching in the future
        });

        videoResponse.pipe(res);
    }).on('error', (err) => {
        console.error("Error with video stream:", err);
        res.status(500).send('Error fetching the video');
    });
}