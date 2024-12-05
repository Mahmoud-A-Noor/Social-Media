import React, { useState, useEffect } from "react";
import { BrokenCirclesLoader } from "react-loaders-kit";
import MediaViewerModal from "./MediaViewerModal.jsx";
import ImageViewer from "./ImageViewer/ImageViewer.jsx";
import VideoViewer from "./VideoViewer/VideoViewer.jsx";
import PdfViewer from "./PdfViewer/PdfViewer.jsx";
import { thumbnailPlugin } from '@react-pdf-viewer/thumbnail';
import pageThumbnailPlugin from './PdfViewer/pageThumbnailPlugin.jsx';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/thumbnail/lib/styles/index.css';

const MediaViewer = ({ fileUrl }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [loading, setLoading] = useState(true); // Track loading state
    const [videoThumbnail, setVideoThumbnail] = useState(null);

    const thumbnailPluginInstance = thumbnailPlugin();
    const { Cover } = thumbnailPluginInstance;
    const pageThumbnailPluginInstance = pageThumbnailPlugin({
        PageThumbnail: <Cover getPageIndex={() => 0} />,
    });

    useEffect(() => {
        if (["mp4", "mkv", "webm", "ogg", "avi", "mpeg", "mov"].includes(fileUrl.split(".").pop().toLowerCase())) {
            setLoading(true);

            const video = document.createElement("video");
            video.src = fileUrl;
            video.crossOrigin = "anonymous";
            video.currentTime = 5;

            video.addEventListener("loadeddata", () => {
                const canvas = document.createElement("canvas");
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;

                const ctx = canvas.getContext("2d");
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                const thumbnail = canvas.toDataURL("image/png");
                setVideoThumbnail(thumbnail);
                setLoading(false);
            });
        }
    }, [fileUrl]);

    const openModal = (content) => {
        setModalContent(content);
        setIsModalOpen(true);
        document.body.classList.add("overflow-hidden");
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalContent(null);
        document.body.classList.remove("overflow-hidden");
    };

    const fileExtension = fileUrl.split(".").pop().toLowerCase();

    const renderContent = () => {
        if (["png", "jpeg", "jpg", "gif", "webp", "svg"].includes(fileExtension)) {
            return <ImageViewer fileUrl={fileUrl} openModal={openModal} closeModal={closeModal} />;
        }

        if (["mp4", "mkv", "webm", "ogg", "avi", "mpeg", "mov"].includes(fileExtension)) {
            return (
                <VideoViewer
                    fileUrl={fileUrl}
                    videoThumbnail={videoThumbnail}
                    loading={loading}
                    openModal={openModal}
                    closeModal={closeModal}
                />
            );
        }

        if (fileExtension === "pdf") {
            return (
                <PdfViewer
                    fileUrl={fileUrl}
                    openModal={openModal}
                    closeModal={closeModal}
                    pageThumbnailPluginInstance={pageThumbnailPluginInstance}
                    thumbnailPluginInstance={thumbnailPluginInstance}
                />
            );
        }

        return <div>Unsupported file type.</div>;
    };

    return (
        <>
            <div className="w-full h-full bg-white">{renderContent()}</div>
            <MediaViewerModal isOpen={isModalOpen} content={modalContent} closeModal={closeModal} />
        </>
    );
};

export default MediaViewer;