
const MediaViewer = ({ fileUrl }) => {
    // Extract file extension from URL
    const fileExtension = fileUrl.split(".").pop().toLowerCase();

    if (["png", "jpeg", "jpg", "gif", "webp", "svg"].includes(fileExtension)) {
        return <img src={fileUrl} alt="Preview" style={{ maxWidth: "100%", width: "100%", height: "auto" }} />;
    }

    if (["mp4", "mkv", "webm", "ogg", "avi", "mpeg", "mov"].includes(fileExtension)) {
        return (
            <video controls style={{ maxWidth: "100%", width: "100%", height: "auto" }}>
                <source src={fileUrl} />
                Your browser does not support the video tag.
            </video>
        );
    }

    if (fileExtension === "pdf") {
        return (
            <iframe
                src={fileUrl}
                style={{ maxWidth: "100%", width: "100%", height: "auto", border: "none" }}
                title="PDF Viewer"
            ></iframe>
        );
    }

    return <div>Unsupported file type.</div>;
};

export default MediaViewer;