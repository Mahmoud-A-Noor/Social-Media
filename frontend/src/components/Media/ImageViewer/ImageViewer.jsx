import React from "react";

const ImageViewer = ({ fileUrl, openModal, closeModal }) => (
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

export default ImageViewer;