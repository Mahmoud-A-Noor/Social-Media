
import { RiLiveFill } from "react-icons/ri";
import { FaPhotoVideo } from "react-icons/fa";
import { IoHappyOutline } from "react-icons/io5";


export default function CreatePost() {
    return (
        <div id="create-post" className="p-3 mt-5 bg-white rounded-lg shadow-md xs:max-sm:px-4">
            <div className="flex items-center">
                <div className="size-12">
                    <img className="w-full h-full rounded-full " src="/src/assets/person.png" alt="" />
                </div>
                <input className="flex-1 px-4 py-2 transition-all duration-300 ease-in-out bg-gray-100 rounded-full outline-none placeholder:text-lg placeholder:sm:max-md:text-base placeholder:xs:max-sm:text-sm placeholder:text-gray-500 ms-3 hover:bg-gray-200" type="text" placeholder="What's on your mind, Mahmoud?" />
            </div>
            <div className="mt-4 mb-3 border-b-2"></div>
            <div className="flex">
                <div className="flex items-center justify-center flex-1 py-3 rounded-lg hover:bg-gray-200 xs:max-sm:px-1">
                    <RiLiveFill className="text-2xl sm:max-md:text-xl xs:max-sm:text-lg" />
                    <span className="text-base font-semibold text-gray-500 sm:max-md:text-sm xs:max-sm:text-xs ms-2 text-nowrap">Live Video</span>
                </div>
                <div className="flex items-center justify-center flex-1 py-3 rounded-lg hover:bg-gray-200 xs:max-sm:px-1">
                    <FaPhotoVideo className="text-2xl sm:max-md:text-xl xs:max-sm:text-lg" />
                    <span className="text-base font-semibold text-gray-500 sm:max-md:text-sm xs:max-sm:text-xs ms-2">Photo/video</span>
                </div>
                <div className="flex items-center justify-center flex-1 py-3 rounded-lg hover:bg-gray-200 xs:max-sm:px-1">
                    <IoHappyOutline className="text-2xl sm:max-md:text-xl xs:max-sm:text-lg" />
                    <span className="text-base font-semibold text-gray-500 sm:max-md:text-sm xs:max-sm:text-xs ms-2">Feeling/activity</span>
                </div>
            </div>
        </div>
    )
}