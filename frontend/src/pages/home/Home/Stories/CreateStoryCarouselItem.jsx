import axiosInstance from "../../../../config/axios.js";
import uploadFile from "../../../../utils/uploadFile.js";
import { IoAddOutline } from "react-icons/io5";
import notify from "../../../../utils/notify.js";


export default function createStoryCarouselItem() {

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
            notify('Invalid file type. Please select an image, video, or document.', "error");
            return;
        }

        try {
            const storyUrl = await uploadFile(selectedFile)
            await axiosInstance.post("/user/story", {
                storyUrl
            });
            notify("Your story has been added successfully!", "success");
        } catch (error) {
            notify(error, "error");
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