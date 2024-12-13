import React from "react";
import { BrokenCirclesLoader } from "react-loaders-kit";
import { FaPlay } from "react-icons/fa"; // Import play icon

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const VideoViewer = ({
  fileUrl,
  videoThumbnail,
  loading,
  openModal,
  closeModal,
}) => {
  const handleClick = () => {
    openModal(
      <div className="relative flex items-center justify-center w-full h-full">
        <button
          onClick={closeModal}
          className="absolute right-2 top-2 z-[9999999999] text-4xl font-bold text-red-700"
        >
          &times;
        </button>
        <video
          controls
          autoPlay
          className="w-full h-full object-fit" // Add ability to save current time
          onTimeUpdate={(e) => {
            // Save current time to localStorage
            localStorage.setItem(`video-${fileUrl}`, e.target.currentTime);
          }}
          // Load saved time when video loads
          onLoadedMetadata={(e) => {
            const savedTime = localStorage.getItem(`video-${fileUrl}`);
            if (savedTime) {
              e.target.currentTime = parseFloat(savedTime);
            }
          }}
        >
          <source
            src={`${apiBaseUrl}/file/video?url=${encodeURIComponent(fileUrl)}`}
            type={`video/${fileUrl.split(".").pop().toLowerCase()}`}
          />
          Your browser does not support the video tag.
        </video>
      </div>,
    );
  };

  return (
    <div className="relative w-full h-full cursor-pointer group" onClick={handleClick}>
      {loading ? (
        <div className="flex items-center justify-center w-full h-full">
          <BrokenCirclesLoader size={50} color="#ff0000" loading={true} />
        </div>
      ) : (
        <>
          {/* Video thumbnail */}
          <img
            src={videoThumbnail}
            alt="Video thumbnail"
            className="object-cover w-full h-full cursor-pointer"
          />

          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="p-4 transition-transform duration-200 transform bg-black bg-opacity-50 rounded-full group-hover:scale-110">
              <FaPlay
                className="text-3xl text-white"
                style={{ marginLeft: "4px" }} // Slight adjustment to center the play icon
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VideoViewer;
