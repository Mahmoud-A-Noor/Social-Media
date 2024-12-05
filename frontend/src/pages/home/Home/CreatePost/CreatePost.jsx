import {useState, useRef} from "react";

import Modal from "../../../../components/Modal/Modal.jsx"
import axiosInstance from "../../../../config/axios.js";
import uploadFile from "../../../../utils/uploadFile.js";
import {Angry, Care, Haha, Sad, Wow, Like} from "../../../../constants/facebook-reactions.jsx";


import { RiLiveFill } from "react-icons/ri";
import { FaPhotoVideo } from "react-icons/fa";
import { IoHappyOutline } from "react-icons/io5";
import { IoDocumentText } from "react-icons/io5";
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import {ToastContainer, toast, Flip} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



export default function CreatePost() {

    const [isModalOpen, setIsModalOpen] = useState(false);
    isModalOpen ? document.body.style.overflow="hidden" : document.body.style.overflow="auto"; // prevent page from scrolling when modal is opened
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

    const ref = useRef(null);

    const [postContent, setPostContent] = useState('');
    const [file, setFile] = useState(null);
    const [fileUrl, setFileUrl] = useState(null);

    const [isReactionsVisible, setIsReactionsVisible] = useState(false);
    const [feeling, setFeeling] = useState(null);
    const [postVisibility, setPostVisibility] = useState("public");

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
        let uploadedFileUrl = fileUrl
        try {
            if(file){
                uploadedFileUrl = await uploadFile(file);
                setFileUrl(uploadedFileUrl); // Save the file URL
            }
        } catch (error) {
            toast.error(error.message, toastConfig);
        }
        try {
            // Create the post
            await axiosInstance.post("/posts", {
                text: postContent,
                media: { url: uploadedFileUrl, type: file?.type?.split("/")[0] || "unknown" },
                feeling: feeling,
                postVisibility: postVisibility
            });
            toast.success("Posts created successfully!", toastConfig);
        } catch (error) {
            setIsModalOpen(false);
            console.error(error)
            toast.error("Error creating post. Please try again.", toastConfig);
        }

        // reset all fields
        setPostContent("");
        setFile(null);
        setFileUrl(null);
        setIsModalOpen(false);
        setFeeling(null)
        setPostVisibility("public")
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
            toast.error('Invalid file type. Please select an image, video, or document.', toastConfig);
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


    const handleFeelingChange = (feel) => {
        if(!feeling){
            setFeeling(feel);
            setIsModalOpen(true)
        }else{
            if(feeling === feel){
                setFeeling(null)
            }else{
                setFeeling(feel)
                setIsModalOpen(true)
            }
        }
        setIsReactionsVisible(false);
    }

    const renderFeelingEmoji = () => {
        if(feeling === "Angry") return <Angry/>
        else if(feeling === "Care") return <Care/>
        else if(feeling === "Haha") return <Haha/>
        else if(feeling === "Sad") return <Sad/>
        else if(feeling === "Shocked") return <Wow/>
        else return <Like/>
    }
    const renderFeelingText = () => {
        if(feeling === "Angry") return <span className="text-base font-normal">is feeling <span className="font-bold text-red-500">Angry</span></span>
        else if(feeling === "Care") return <span className="text-base font-normal">is in <span className="font-bold text-pink-500">Love</span></span>
        else if(feeling === "Haha") return <span className="text-base font-normal">is <span className="font-bold text-green-500">Laughing</span></span>
        else if(feeling === "Sad") return <span className="text-base font-normal">is feeling <span className="font-bold text-blue-500">Sad</span></span>
        else return <span className="text-base font-normal">is <span className="font-bold text-yellow-500">Shocked</span></span>
    }



    return (
        <div id="create-post" className="p-3 mt-5 bg-white rounded-lg shadow-md xs:max-sm:px-4">
            <form className="flex items-center" onSubmit={handleFormSubmit}>
                <div className="size-12">
                    <img className="w-full h-full rounded-full " src="/src/assets/person.png" alt=""/>
                </div>
                <input onClick={() => setIsModalOpen((prev) => !prev)}
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
                        <div>
                            <h4 className="text-base font-semibold">Mahmoud Noor {feeling && renderFeelingText()}</h4>
                            <div className="relative">
                                <select value={postVisibility} onChange={()=>setPostVisibility((prev)=>e.target.value)}
                                        className="w-[5rem] max-h-[1.8rem] bg-transparent placeholder:text-slate-400 text-slate-700 text-xs border border-slate-200 rounded px-1 py-1 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer">
                                    <option value="public">Public</option>
                                    <option value="friend">Friends</option>
                                    <option value="private">Private</option>
                                </select>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth="1.2" stroke="currentColor"
                                     className="h-5 w-5 ml-1 absolute top-[0.3rem] left-[3.5rem] text-slate-700">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"/>
                                </svg>
                            </div>
                        </div>
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
                        <label
                            className="flex items-center justify-center flex-1 py-3 rounded-lg hover:bg-gray-200 xs:max-sm:px-1 cursor-pointer">
                            <FaPhotoVideo className="text-2xl sm:max-md:text-xl xs:max-sm:text-lg"/>
                            <span
                                className="text-base font-semibold text-gray-500 sm:max-md:text-sm xs:max-sm:text-xs ms-2">Photo/video</span>
                            <input type="file" className="hidden" onChange={handleFileSelect}/>
                        </label>
                        <label
                            className="flex items-center justify-center flex-1 py-3 rounded-lg hover:bg-gray-200 xs:max-sm:px-1 cursor-pointer">
                            <IoDocumentText className="text-2xl sm:max-md:text-xl xs:max-sm:text-lg"/>
                            <span
                                className="text-base font-semibold text-gray-500 sm:max-md:text-sm xs:max-sm:text-xs ms-2">Document</span>
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
                <div className="flex items-center justify-center flex-1 py-3 rounded-lg hover:bg-gray-200 xs:max-sm:px-1">
                    <RiLiveFill className="text-2xl sm:max-md:text-xl xs:max-sm:text-lg"/>
                    <span className="text-base font-semibold text-gray-500 sm:max-md:text-sm xs:max-sm:text-xs ms-2 text-nowrap">Live Video</span>
                </div>
                <label
                    className="flex items-center justify-center flex-1 py-3 rounded-lg hover:bg-gray-200 xs:max-sm:px-1 cursor-pointer">
                    <FaPhotoVideo className="text-2xl sm:max-md:text-xl xs:max-sm:text-lg"/>
                    <span
                        className="text-base font-semibold text-gray-500 sm:max-md:text-sm xs:max-sm:text-xs ms-2">Photo/video</span>
                    <input type="file" className="hidden" onChange={(e) => {
                        handleFileSelect(e);
                        setIsModalOpen(true)
                    }}/>
                </label>
                <div className="relative group flex-1">
                    <div
                        className="flex items-center justify-center py-3 rounded-lg hover:bg-gray-200 xs:max-sm:px-1 cursor-pointer" onMouseEnter={() => setIsReactionsVisible(true)} onMouseLeave={() => setIsReactionsVisible(false)}>
                        <div className="text-2xl sm:max-md:text-xl xs:max-sm:text-lg w-6 h-6">
                            {feeling?renderFeelingEmoji():<IoHappyOutline />}
                        </div>
                        <span className="text-base font-semibold text-gray-500 sm:max-md:text-sm xs:max-sm:text-xs ms-2">{feeling?feeling:"Feeling"}</span>
                        <div className={`absolute -left-3 -top-14 mt-2 bg-white border border-gray-300 shadow-lg z-[99999] rounded-full transition-opacity duration-300 ${isReactionsVisible ? "opacity-100 visible" : "opacity-0 invisible"}`}>
                                <div
                                    className="flex px-2 py-1 transition-opacity delay-500 opacity-0 group-hover:opacity-100">
                                    <div
                                        className="mx-1 transition-all duration-300 cursor-pointer hover:scale-125 size-8"
                                        onClick={() => {
                                            handleFeelingChange("Sad")
                                        }}>
                                        <Sad/>
                                    </div>
                                    <div
                                        className="mx-1 transition-all duration-300 cursor-pointer hover:scale-125 size-8"
                                        onClick={() => {
                                            handleFeelingChange("Shocked")
                                        }}>
                                        <Wow/>
                                    </div>
                                    <div
                                        className="mx-1 transition-all duration-300 cursor-pointer hover:scale-125 size-8"
                                        onClick={() => {
                                            handleFeelingChange("Care")
                                        }}>
                                        <Care/>
                                    </div>
                                    <div
                                        className="mx-1 transition-all duration-300 cursor-pointer hover:scale-125 size-8"
                                        onClick={() => {
                                            handleFeelingChange("Angry")
                                        }}>
                                        <Angry/>
                                    </div>
                                    <div
                                        className="mx-1 transition-all duration-300 cursor-pointer hover:scale-125 size-8"
                                        onClick={() => {
                                            handleFeelingChange("Haha")
                                        }}>
                                        <Haha/>
                                    </div>
                                </div>
                            </div>
                        </div>
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