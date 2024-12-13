import {HiDotsHorizontal} from "react-icons/hi";
import {IoIosBookmark, IoMdClose} from "react-icons/io";
import {BiSolidHide} from "react-icons/bi";
import {RiUserUnfollowFill} from "react-icons/ri";
import {useEffect, useRef, useState} from "react";
import axiosInstance from "../../../../config/axios.js";
import notify from "../../../../utils/notify.js";

export default function PostOptions({props}) {
    
    const [isFollowing, setIsFollowing] = useState(props?.isFollowing || false);
    const [isPostDropdownOpen, setIsPostDropdownOpen] = useState(false)
    const togglePostDropdown = (e) => {
        e?.stopPropagation(); // Prevent the outside click event from firing
        setIsPostDropdownOpen((prev)=>!prev);
    };
    const postDropdownButtonRef = useRef(null);
    const postDropdownRef = useRef(null);

    const toggleFollow = async () => {
        try {
            togglePostDropdown();
            if (isFollowing) {
                await axiosInstance.delete("/social/unfollow", {
                    data: { userId: props.authorId },
                });
                notify("You unfollowed " + props.authorName + " successfully!", "success");
            } else {
                await axiosInstance.post("/social/follow", { userId: props.authorId });
                notify("You are now following " + props.authorName + "!", "success");
            }
            setIsFollowing(!isFollowing);
        } catch (err) {
            togglePostDropdown();
            notify(err.response?.data?.message || "Failed to update follow status", "error");
        }
    };


    const savePost = async()=>{
        try {
            togglePostDropdown()
            await axiosInstance.post("/posts/save", {postId:props.postId})
            notify("Posts saved successfully!", "success");
        }catch (err) {
            togglePostDropdown()
            notify("Post couldn't be saved!" + err, "error");
        }
    }

    const hidePost = async () => {
        try {
            const response = await axiosInstance.post("/posts/hide", { postId:props.postId });
            props.hidePostFromList(props.postId)
            notify(response.data.message, "success");
        } catch (error) {
            console.log(error)
            notify("Failed to hide the post. Please try again.", "error");
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Close the dropdown if the click is outside both the dropdown and button
            if (
                postDropdownRef.current &&
                !postDropdownRef.current.contains(event.target) &&
                postDropdownButtonRef.current &&
                !postDropdownButtonRef.current.contains(event.target)
            ) {
                setIsPostDropdownOpen(false);
            }
        };

        // Bind the event listener for detecting outside clicks
        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup the event listener on unmount
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="flex text-4xl">
            <div className="relative mx-2">
                <div ref={postDropdownButtonRef} onClick={togglePostDropdown}>
                    <HiDotsHorizontal className="p-2 rounded-full cursor-pointer hover:bg-gray-100"/>
                </div>
                {isPostDropdownOpen &&
                    <div ref={postDropdownRef}
                         className="absolute w-[10em] h-auto top-[1.45em] -left-[9.5em] shadow-[0px_0px_8px_-1px_rgba(0,0,0,0.75)]  bg-white divide-y divide-gray-300 rounded-md z-[99999]">
                        <div className="px-2 pt-3 pb-3">
                            <div className="flex flex-row items-center justify-between px-3 py-3 rounded-lg cursor-pointer hover:bg-gray-100" onClick={savePost}>
                                <div className="flex flex-row items-center">
                                    <div className="p-2 bg-gray-200 rounded-full me-2">
                                        <IoIosBookmark className="text-xl"/>
                                    </div>
                                    <h5 className="text-base font-semibold">Save post</h5>
                                </div>
                            </div>
                            <div className="flex flex-row items-center justify-between px-3 py-3 rounded-lg cursor-pointer hover:bg-gray-100" onClick={()=>setIsPostHidden((prev)=>true)}>
                                <div className="flex flex-row items-center">
                                    <div className="p-2 bg-gray-200 rounded-full me-2">
                                        <BiSolidHide className="text-xl"/>
                                    </div>
                                    <h5 className="text-base font-semibold">Hide post</h5>
                                </div>
                            </div>
                            <div className="flex flex-row items-center justify-between px-3 py-3 rounded-lg cursor-pointer hover:bg-gray-100" 
                                onClick={toggleFollow}>
                                <div className="flex flex-row items-center">
                                    <div className="p-2 bg-gray-200 rounded-full me-2">
                                        <RiUserUnfollowFill className="text-xl"/>
                                    </div>
                                    <h5 className="text-base font-semibold">
                                        {isFollowing ? 'Unfollow ' : 'Follow '}
                                        <span className="font-bold">{props.authorName}</span>
                                    </h5>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
            <IoMdClose className="p-2 mx-2 rounded-full cursor-pointer hover:bg-gray-100" onClick={hidePost} />
        </div>
    )
}