import React, { createContext, useContext, useState, useRef } from 'react';
import { toast } from 'react-toastify'; // Assuming you're using react-toastify for notifications
import { Flip } from 'react-toastify';

const PostContext = createContext();

export const usePostContext = () => {
    return useContext(PostContext);
};

export const PostProvider = ({ children }) => {
    // State variables
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
    const [postContent, setPostContent] = useState('');
    const [file, setFile] = useState(null);
    const [fileUrl, setFileUrl] = useState(null);
    const [isReactionsVisible, setIsReactionsVisible] = useState(false);
    const [feeling, setFeeling] = useState(null);
    const [postVisibility, setPostVisibility] = useState('public');

    // Refs
    const emojiPickerRef = useRef(null);
    const emojiPickerButtonRef = useRef(null);
    const textAreaRef = useRef(null);

    // Toast config
    const toastConfig = {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Flip,
    };

    // File validation and selection function
    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        // File validation
        const validTypes = [
            // Image types
            "image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp", "image/svg+xml",
            // Video types
            "video/mp4", "video/mkv", "video/webm", "video/ogg", "video/avi", "video/mpeg", "video/quicktime",
            // Document types
            "application/pdf",
        ];

        if (!validTypes.includes(selectedFile.type)) {
            toast.error('Invalid file type. Please select an image, video, or document.', toastConfig);
            return;
        }

        setFile(selectedFile); // Set the selected file
        setFileUrl(null); // Reset file URL
    };

    // Effect for preventing page scroll when modal is open
    if (isModalOpen) {
        document.body.style.overflow = "hidden";
    } else {
        document.body.style.overflow = "auto";
    }

    // Context value to provide the states and functions to the consuming components
    const value = {
        isModalOpen, setIsModalOpen,
        isEmojiPickerOpen, setIsEmojiPickerOpen,
        postContent, setPostContent,
        file, setFile,
        fileUrl, setFileUrl,
        isReactionsVisible, setIsReactionsVisible,
        feeling, setFeeling,
        postVisibility, setPostVisibility,
        emojiPickerRef,
        emojiPickerButtonRef,
        textAreaRef,
        toastConfig,
        handleFileSelect,
    };

    return (
        <PostContext.Provider value={value}>
            {children}
        </PostContext.Provider>
    );
};