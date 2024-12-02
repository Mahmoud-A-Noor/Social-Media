import axiosInstance from "../../../../config/axios.js";
import uploadFile from "../../../../utils/uploadFile.js";

import {Flip, toast} from "react-toastify";
import { IoAddOutline } from "react-icons/io5";


export default function createStoryCarouselItem() {

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

    const handleFileSelect = async (e) => {
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
        ];
        if (!validTypes.includes(selectedFile.type)) {
            toast.error('Invalid file type. Please select an image, video, or document.', toastConfig);
            return;
        }

        try {
            const storyUrl = await uploadFile(selectedFile)
            await axiosInstance.post("/user/story", {
                storyUrl
            });
            toast.success("Your story has been added successfully!", );
        } catch (error) {
            toast.error(error, toastConfig);
        }
    };

    return (
        <form className="relative w-24 mx-1 overflow-hidden h-44 rounded-xl group">
            <img className="w-full h-full" src="/src/assets/story.png" alt=""/>
            <div className="absolute bg-white group-hover:bg-black w-full h-1/4 bottom-0 transition-all duration-500">
                <label className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-black group-hover:bg-white border-white group-hover:border-black text-white group-hover:text-black w-10 h-10 rounded-full font-bold text-2xl flex items-center justify-center border-4  cursor-pointer transition-all duration-700">
                        <IoAddOutline/>
                    </div>
                    <input type="file" className="hidden" onChange={handleFileSelect}/>
                </label>
            </div>
        </form>
    )
}