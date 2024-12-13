import React from "react";
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { BrokenCirclesLoader } from "react-loaders-kit";

const PdfViewer = ({ fileUrl, openModal, closeModal, pageThumbnailPluginInstance, thumbnailPluginInstance }) => (
    <div className="flex items-center justify-center w-full h-full bg-gray-200 cursor-pointer" onClick={() => openModal(
        <div className="relative max-w-[90%] h-full mx-auto">
            <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-red-700 text-4xl font-bold z-[9999999999]"
            >
                &times;
            </button>
            <Worker workerUrl={`pdf.worker.min.js`}>
                <Viewer fileUrl={fileUrl} renderLoader={() => <BrokenCirclesLoader size={50} color="#ff0000" loading={true} />} />
            </Worker>
        </div>
    )}>
        <Worker workerUrl={`pdf.worker.min.js`}>
            <Viewer fileUrl={fileUrl} plugins={[pageThumbnailPluginInstance, thumbnailPluginInstance]} renderLoader={() => <BrokenCirclesLoader size={50} color="#ff0000" loading={true} />} />
        </Worker>
    </div>
);

export default PdfViewer;