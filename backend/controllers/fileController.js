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
    const videoUrl = req.query.url;
    const fileExtension = req.query.fileExtension;

    if (!videoUrl) {
        return res.status(400).send('Video URL is required');
    }

    const range = req.headers.range;
    if (!range) {
        return res.status(400).send('Range header is required');
    }

    https.get(videoUrl, (videoResponse) => {
        if (videoResponse.statusCode !== 200) {
            console.error("Error fetching video:", videoResponse.statusCode);
            return res.status(500).send('Error fetching the video');
        }

        const videoSize = parseInt(videoResponse.headers['content-length']);
        
        // Parse the range header
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : videoSize - 1;
        
        // Calculate content length
        const contentLength = end - start + 1;

        // Map file extensions to MIME types
        const mimeTypes = {
            'video/mp4': ['mp4'],
            'video/webm': ['webm'],
            'video/ogg': ['ogg'],
            'video/quicktime': ['mov'],
            'video/x-msvideo': ['avi'],
            'video/x-matroska': ['mkv']
        };

        // Get the file extension from the URL
        const extension = videoUrl.split('.').pop().toLowerCase();
        
        // Find the correct MIME type
        let contentType = 'video/mp4'; // default
        for (const [type, extensions] of Object.entries(mimeTypes)) {
            if (extensions.includes(extension)) {
                contentType = type;
                break;
            }
        }

        // Set response headers
        const headers = {
            'Content-Range': `bytes ${start}-${end}/${videoSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': contentLength,
            'Content-Type': contentType,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        };

        // Send partial content response
        res.writeHead(206, headers);

        // Create a new request for the specific range
        https.get(videoUrl, { 
            headers: { 
                'Range': `bytes=${start}-${end}`,
                'Accept': contentType
            }
        }, (rangeResponse) => {
            rangeResponse.pipe(res);
        }).on('error', (err) => {
            console.error("Error with range request:", err);
            res.status(500).send('Error streaming video range');
        });

    }).on('error', (err) => {
        console.error("Error with initial video request:", err);
        res.status(500).send('Error fetching the video');
    });
};