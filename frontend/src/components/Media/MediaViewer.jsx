import React, { useState } from "react";
import ReactDOM from "react-dom";

import {Worker, Viewer, ViewMode, SpecialZoomLevel} from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { thumbnailPlugin } from '@react-pdf-viewer/thumbnail';
import pageThumbnailPlugin from './pageThumbnailPlugin';
import '@react-pdf-viewer/thumbnail/lib/styles/index.css';



const MediaViewer = ({ fileUrl }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);

    const thumbnailPluginInstance = thumbnailPlugin();
    const { Cover } = thumbnailPluginInstance;
    const pageThumbnailPluginInstance = pageThumbnailPlugin({
        PageThumbnail: <Cover getPageIndex={() => 0} />,
    });

    const openModal = (content) => {
        setModalContent(content);
        setIsModalOpen(true);
        document.body.classList.add("overflow-hidden"); // Prevent body scroll
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalContent(null);
        document.body.classList.remove("overflow-hidden"); // Restore body scroll
    };
    // Extract file extension from URL
    const fileExtension = fileUrl.split(".").pop().toLowerCase();

    const renderContent = () => {
        if (["png", "jpeg", "jpg", "gif", "webp", "svg"].includes(fileExtension)) {
        return (
            <div className="w-full h-full" onClick={() => openModal(
                <div className="relative flex justify-center items-center max-w-[80%] h-full mx-auto">
                    <button
                        onClick={closeModal}
                        className="absolute top-2 right-2 text-red-700 text-4xl font-bold z-[9999999999]"
                    >
                        &times;
                    </button>
                    <img src={fileUrl} alt="Preview" className="w-full h-auto"/>
                </div>
            )}>
                <img src={fileUrl} alt="Preview" className="w-full h-full cursor-pointer"/>
            </div>
        );
        }

        if (["mp4", "mkv", "webm", "ogg", "avi", "mpeg", "mov"].includes(fileExtension)) {
            return (
                <div onClick={() => openModal(
                    <div className="relative flex justify-center items-center max-w-[80%] h-full mx-auto">
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-red-700 text-4xl font-bold z-[9999999999]"
                        >
                            &times;
                        </button>
                        <video controls className="w-full h-full object-contain">
                            <source src={fileUrl}/>
                            Your browser does not support the video tag.
                        </video>
                    </div>
                )} className="w-full h-full">
                    <video controls className="w-full h-full object-cover cursor-pointer">
                        <source src={fileUrl}/>
                        Your browser does not support the video tag.
                    </video>
                </div>
        )
            ;
        }

        if (fileExtension === "pdf") {
            return (
                <div
                    className="w-full h-full cursor-pointer flex justify-center items-center bg-gray-200"
                    onClick={() =>
                        openModal(
                            <div className="relative max-w-[90%] h-full mx-auto">
                                <button
                                    onClick={closeModal}
                                    className="absolute top-2 right-2 text-red-700 text-4xl font-bold z-[9999999999]"
                                >
                                    &times;
                                </button>
                                <Worker workerUrl={`pdf.worker.min.js`}>
                                    <Viewer fileUrl={fileUrl}/>
                                </Worker>
                            </div>
                        )
                    }
                >
                    <Worker workerUrl={`pdf.worker.min.js`}>
                        <Viewer fileUrl={fileUrl}
                                            plugins={[pageThumbnailPluginInstance, thumbnailPluginInstance]}/>
                                </Worker>
                            </div>
                        )
                        ;
                    }

        return <div>Unsupported file type.</div>;
    };

        return (
        <>
            {/* Display the content inside carousel */}
            <div className="w-full h-full">{renderContent()}</div>

            {/* Portal for full-screen modal */}
            {isModalOpen &&
                ReactDOM.createPortal(
                    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex justify-center items-center z-[999999999] overflow-auto">
                        <div className="relative w-full h-full">
                            <button
                                onClick={closeModal}
                                className="absolute top-2 right-2 text-red-700 text-4xl font-bold z-[9999999999]"
                            >
                                &times;
                            </button>
                            <div className="w-full h-auto">{modalContent}</div>
                        </div>
                    </div>,
                    document.body
                )}
        </>
    );
};

export default MediaViewer;