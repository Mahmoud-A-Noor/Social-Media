import {useState, useRef} from "react";

import Modal from "../../../../components/Modal/Modal.jsx"
import axiosInstance from "../../../../config/axios.js";

import { RiLiveFill } from "react-icons/ri";
import { FaPhotoVideo } from "react-icons/fa";
import { IoHappyOutline } from "react-icons/io5";
import { IoDocumentText } from "react-icons/io5";

import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

import {ToastContainer, toast, Flip} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import uploadFile from "../../../../utils/uploadFile.js";



export default function CreatePost() {

    const [isModalOpen, setIsModalOpen] = useState(false);
    isModalOpen ? document.body.style.overflow="hidden" : document.body.style.overflow="auto"; // prevent page from scrolling when modal is opened
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

    const ref = useRef(null);

    const [postContent, setPostContent] = useState('');
    const [file, setFile] = useState(null);
    const [fileUrl, setFileUrl] = useState(null);

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
    }


    const handleFormSubmit = async (e) => {
        e.preventDefault();
        
        if (!postContent && !file) {
            toast.error("Post content or file is required.", toastConfig);
            return;
        }

        // Upload the file
        try {
            if(!fileUrl){
                const uploadedFileUrl = await uploadFile(file);
                setFileUrl(uploadedFileUrl); // Save the file URL
            }
        } catch (error) {
            toast.error(error.message, toastConfig);
        }

        try {
            // Create the post
            const postResponse = await axiosInstance.post("/posts", {
                text: postContent,
                media: { url: fileUrl, type: file?.type?.split("/")[0] || "unknown" },
            });
            toast.success("Post created successfully!", );

            setPostContent("");
            setFile(null);
            setFileUrl(null);
            setIsModalOpen(false);
        } catch (error) {
            setIsModalOpen(false);
            toast.error("Error creating post. Please try again.", toastConfig);
        }
    };

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        // File validation (Optional: Add more types if needed)
        const validTypes = [
            // Image types
            "image/png",
            "image/jpeg",
            "image/jpg",
            "image/gif",
            "image/webp",
            "image/svg+xml",

            // Video types
            "video/mp4",
            "video/mkv",
            "video/webm",
            "video/ogg",
            "video/avi",
            "video/mpeg",
            "video/quicktime", // .mov format

            // Document types
            "application/pdf",
        ];
        if (!validTypes.includes(selectedFile.type)) {
            toast.error('Invalid file type. Please select an image, video, or document.', {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Flip,
            });
            return;
        }

        setFile(selectedFile); // Set the selected file
        setFileUrl(null);
    };

    const handleFileRemove = () => {
        setFile(null); // Remove the selected file
        setFileUrl(null);
    };

    const handleInput = (e) => {
        if (ref.current) {
            ref.current.style.height = "auto"; // Reset height to calculate new height
            ref.current.style.height = `${Math.min(e.target.scrollHeight, 200)}px`; // Limit height to 200px
        }
    };

    const addEmoji = (e)=>{
        const sym = e.unified.split("_")
        const codeArray = []
        sym.forEach((item)=>codeArray.push("0x" + item))
        let emoji = String.fromCodePoint(...codeArray)
        setPostContent((prev)=>prev + emoji)
        if (ref.current) {
            ref.current.style.height = "auto"; // Reset height to calculate new height
            ref.current.style.height = `${Math.min(ref.current.scrollHeight, 200)}px`; // Limit height to 200px
        }
    }



    return (
        <div id="create-post" className="p-3 mt-5 bg-white rounded-lg shadow-md xs:max-sm:px-4">
            <form className="flex items-center" onSubmit={handleFormSubmit}>
                <div className="size-12">
                    <img className="w-full h-full rounded-full " src="/src/assets/person.png" alt=""/>
                </div>
                <input onClick={() => setIsModalOpen((prev)=>!prev)}
                    className="flex-1 px-4 py-2 transition-all duration-300 ease-in-out bg-gray-100 rounded-full outline-none placeholder:text-lg placeholder:sm:max-md:text-base placeholder:xs:max-sm:text-sm placeholder:text-gray-500 ms-3 hover:bg-gray-200 cursor-pointer"
                    type="text" placeholder="What's on your mind, Mahmoud?"/>

                <Modal isOpen={isModalOpen === true} onClose={() => {
                    setIsModalOpen(false)
                    setIsEmojiPickerOpen(false)
                }} header="Create Post" width="37rem">
                    <div className="flex items-center mt-2 gap-2">
                        <div className="size-10">
                            <img className="w-full h-full rounded-full " src="/src/assets/person.png" alt=""/>
                        </div>
                        <h4 className="text-lg font-semibold">Mahmoud Noor</h4>
                    </div>
                    <textarea
                        className="border-0 resize-none focus:outline-0 w-full my-3 text-xl px-2"
                        placeholder="What's on your mind, Mahmoud?"
                        ref={ref}
                        style={{maxHeight: "200px"}}
                        rows={1}
                        onInput={handleInput}
                        value={postContent}
                        onChange={e => setPostContent(e.target.value)}
                    />
                    <IoHappyOutline
                        className="text-5xl sm:max-md:text-xl xs:max-sm:text-lg ms-auto rounded-full p-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => setIsEmojiPickerOpen((prev) => !prev)}/>
                    {isEmojiPickerOpen &&
                        <div className="absolute top-0 -right-[350px] z-30">
                            <Picker data={data} onEmojiSelect={addEmoji}/>
                        </div>
                    }
                    {file && (
                        <div className="flex items-center gap-2">
                            <p className="text-sm">{file.name}</p>
                            <button
                                className="text-red-500 hover:underline"
                                onClick={handleFileRemove}
                            >
                                Remove
                            </button>
                        </div>
                    )}
                    <div className="flex items-center mt-2">
                        <label className="flex items-center justify-center flex-1 py-3 rounded-lg hover:bg-gray-200 xs:max-sm:px-1 cursor-pointer">
                            <FaPhotoVideo className="text-2xl sm:max-md:text-xl xs:max-sm:text-lg"/>
                            <span className="text-base font-semibold text-gray-500 sm:max-md:text-sm xs:max-sm:text-xs ms-2">Photo/video</span>
                            <input type="file" className="hidden" onChange={handleFileSelect}/>
                        </label>
                        <label className="flex items-center justify-center flex-1 py-3 rounded-lg hover:bg-gray-200 xs:max-sm:px-1 cursor-pointer">
                            <IoDocumentText className="text-2xl sm:max-md:text-xl xs:max-sm:text-lg"/>
                            <span className="text-base font-semibold text-gray-500 sm:max-md:text-sm xs:max-sm:text-xs ms-2">Document</span>
                            <input type="file" className="hidden" onChange={handleFileSelect}/>
                        </label>
                    </div>
                    <div className="flex flex-col text-center">
                        <button className="form-button md:bg-none xs:bg-white" type="submit">Post</button>
                    </div>
                </Modal>
            </form>
            <div className="mt-4 mb-3 border-b-2"></div>
            <div className="flex">
                <div
                    className="flex items-center justify-center flex-1 py-3 rounded-lg hover:bg-gray-200 xs:max-sm:px-1">
                    <RiLiveFill className="text-2xl sm:max-md:text-xl xs:max-sm:text-lg"/>
                    <span
                        className="text-base font-semibold text-gray-500 sm:max-md:text-sm xs:max-sm:text-xs ms-2 text-nowrap">Live Video</span>
                </div>
                <div
                    className="flex items-center justify-center flex-1 py-3 rounded-lg hover:bg-gray-200 xs:max-sm:px-1">
                    <FaPhotoVideo className="text-2xl sm:max-md:text-xl xs:max-sm:text-lg"/>
                    <span
                        className="text-base font-semibold text-gray-500 sm:max-md:text-sm xs:max-sm:text-xs ms-2">Photo/video</span>
                </div>
                <div className="flex items-center justify-center flex-1 py-3 rounded-lg hover:bg-gray-200 xs:max-sm:px-1">
                    <IoHappyOutline className="text-2xl sm:max-md:text-xl xs:max-sm:text-lg" />
                    <span className="text-base font-semibold text-gray-500 sm:max-md:text-sm xs:max-sm:text-xs ms-2">Feeling</span>
                </div>
            </div>
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition: Flip
            />
        </div>
    )
}