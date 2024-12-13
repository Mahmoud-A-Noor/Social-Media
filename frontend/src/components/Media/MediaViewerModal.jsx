import React from "react";
import ReactDOM from "react-dom";

const MediaViewerModal = ({ isOpen, content, closeModal }) => {
    return (
        isOpen &&
        ReactDOM.createPortal(
            <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-80 flex justify-center items-center z-[999999999] overflow-auto">
                <div className="relative w-full h-full">
                    <div className="w-full h-auto">{content}</div>
                </div>
            </div>,
            document.body
        )
    );
};

export default MediaViewerModal;