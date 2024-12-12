import {PiShareFat} from "react-icons/pi";
import {MdOutlinePublic} from "react-icons/md";
import {FaUserFriends} from "react-icons/fa";
import ReactButton from "./ReactButton.jsx";
import axiosInstance from "../../../../../config/axios.js";
import {useState} from "react";
import notify from "../../../../../utils/notify.js";

export default function ShareButton({postId}){

    const [isShareOptionsVisible, setIsShareOptionsVisible] = useState(false);


    const sharePost = async(shareType)=>{
        setIsShareOptionsVisible(false)
        try {
            await axiosInstance.post("/posts/share", {
                postId: postId,
                type: shareType,
            })
            notify("Post shared successfully!", "success");
        }catch (err) {
            notify("Post couldn't be shared, try again..." + err, "error");
        }
    }

    return (
        <div className="relative flex items-center justify-center flex-1 py-1 hover:bg-gray-100 cursor-pointer group"
             onMouseEnter={() => setIsShareOptionsVisible(true)}
             onMouseLeave={() => setIsShareOptionsVisible(false)}>
            <PiShareFat className="text-lg text-gray-500"/>
            <h5 className="text-sm font-semibold text-gray-500 ms-1">Share</h5>
            <div
                className={`absolute left-0 right-0 -top-[6.7rem] mt-2 transition-opacity delay-500 bg-white border border-gray-300 shadow-lg z-[99999] rounded-md opacity-0 group-hover:opacity-100  ${isShareOptionsVisible ? "opacity-100 visible" : "opacity-0 invisible"}`}>
                <div className="flex items-center text-base p-3 hover:bg-gray-200" onClick={() => {
                    sharePost("public")
                }}>
                    <MdOutlinePublic/>
                    <h6 className="ms-2 font-semibold">Public</h6>
                </div>
                <div className="flex items-center text-base p-3 hover:bg-gray-200" onClick={() => {
                    sharePost("friends")
                }}>
                    <FaUserFriends/>
                    <h6 className="ms-2 font-semibold">Friends</h6>
                </div>
            </div>
        </div>
    )
}