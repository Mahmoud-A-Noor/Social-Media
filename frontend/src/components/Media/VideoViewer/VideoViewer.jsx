import React from "react";
import { BrokenCirclesLoader } from "react-loaders-kit";

const VideoViewer = ({ fileUrl, videoThumbnail, loading, openModal, closeModal }) => (
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
        {loading ? (
            <div className="flex justify-center items-center w-full h-full">
                <BrokenCirclesLoader size={50} color="#ff0000" loading={true} />
            </div>
        ) : (
            <img src={videoThumbnail} alt="Video Thumbnail" className="w-full h-full object-cover cursor-pointer"/>
        )}
    </div>
);

export default VideoViewer;