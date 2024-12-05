import { useRef, useEffect, useState } from "react";

import {Sad, Care, Haha, Angry, Love, Wow, Like} from "../../../../constants/facebook-reactions"

import { HiDotsHorizontal } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";
import { IoIosBookmark } from "react-icons/io";
import { BiSolidHide } from "react-icons/bi";
import { RiUserUnfollowFill } from "react-icons/ri";

import { AiOutlineLike } from "react-icons/ai";
import { GoComment } from "react-icons/go";
import { PiMessengerLogo } from "react-icons/pi";
import { PiShareFat } from "react-icons/pi";


export default function Post({post}) {

    const [isPostDropdownOpen, setIsPostDropdownOpen] = useState(false)
    const togglePostDropdown = (e) => {
        e.stopPropagation(); // Prevent the outside click event from firing
        setIsPostDropdownOpen((prev)=>!prev);
      };
    const postDropdownButtonRef = useRef(null);
    const postDropdownRef = useRef(null);
    
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
        <div className="w-full pt-2 pb-1 mt-5 mb-5 bg-white rounded-lg shadow-md post xs:max-sm:px-4">
            <div id="post-top-part" className="flex items-center justify-between px-3">
                <div className="flex">
                    <div className="size-12">
                        <img className="w-full h-full rounded-full " src="/src/assets/person.png" alt="" />
                    </div>
                    <div className="ms-2">
                        <h5 className="text-base font-medium text-black">my awsome page</h5>
                        <h6 className="text-sm font-medium text-gray-500">13m</h6>
                    </div>
                </div>
                <div className="flex text-4xl">
                    <div className="relative mx-2">
                        <div  ref={postDropdownButtonRef} onClick={togglePostDropdown}>
                            <HiDotsHorizontal className="p-2 rounded-full cursor-pointer hover:bg-gray-100" />
                        </div>
                        {isPostDropdownOpen && 
                            <div ref={postDropdownRef} className="absolute w-[10em] h-auto top-[1.45em] -left-[9.5em] shadow-lg bg-white divide-y divide-gray-300 rounded-md z-[99999]">
                                <div className="px-2 pt-3 pb-3">
                                    <div className="flex flex-row items-center justify-between px-3 py-3 rounded-lg cursor-pointer hover:bg-gray-100">
                                        <div className="flex flex-row items-center">
                                            <div className="p-2 bg-gray-200 rounded-full me-2">
                                                <IoIosBookmark className="text-xl" />
                                            </div>
                                            <h5 className="text-base font-semibold">Save post</h5>
                                        </div>
                                    </div>
                                    <div className="flex flex-row items-center justify-between px-3 py-3 rounded-lg cursor-pointer hover:bg-gray-100">
                                        <div className="flex flex-row items-center">
                                            <div className="p-2 bg-gray-200 rounded-full me-2">
                                                <BiSolidHide className="text-xl" />
                                            </div>
                                            <h5 className="text-base font-semibold">Hide post</h5>
                                        </div>
                                    </div>
                                    <div className="flex flex-row items-center justify-between px-3 py-3 rounded-lg cursor-pointer hover:bg-gray-100">
                                        <div className="flex flex-row items-center">
                                            <div className="p-2 bg-gray-200 rounded-full me-2">
                                                <RiUserUnfollowFill className="text-xl" />
                                            </div>
                                            <h5 className="text-base font-semibold">Unfollow <span className="font-bold">my awsome page</span></h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                    <IoMdClose className="p-2 mx-2 rounded-full cursor-pointer hover:bg-gray-100" />
                </div>
            </div>
            <div id="post-middle-part" className="mt-3">
                <h5 className="px-3 mb-3">عاجل | القناة 14 الإسرائيلية: الجيش قد يفجر قريبا المنزل الذي قتل فيه السنوار</h5>
                <img className="w-full h-auto" src="/src/assets/post.jpg" />
                <div className="flex items-center justify-between px-3 py-2">
                    <div id="post-emojis" className="flex items-center">
                        <div className="z-30 rounded-full ring-1 ring-white size-5">
                            <Sad />
                        </div>
                        <div className="z-20 -ms-[0.05rem] ring-1 ring-white rounded-full size-5">
                            <Care />
                        </div>
                        <div className="z-10 -ms-[0.05rem] ring-1 ring-white rounded-full size-5">
                            <Love />
                        </div>       
                        <span className="text-sm font-semibold text-gray-500 ms-1">5.2k</span>                 
                    </div>
                    <div id="post-analysis">
                        <span className="text-sm font-semibold text-gray-500">347 comment</span>
                        <span className="text-sm font-semibold text-gray-500 ms-4">123 shares</span>
                    </div>
                </div>
            </div>
            <div className="px-3">
                <div className="border-t border-t-gray-300"></div>
            </div>
            <div id="post-bottom-part" className="flex items-center justify-center w-full px-3 mt-1">
                <div className="relative flex items-center justify-center flex-1 py-1 cursor-pointer hover:bg-gray-100 group">
                    <AiOutlineLike className="text-lg text-gray-500" />
                    <h5 className="text-sm font-semibold text-gray-500 ms-1">Like</h5>
                    <div className="absolute -left-3 -top-14 mt-2 transition-opacity delay-500 bg-white border border-gray-300 shadow-lg z-[99999] rounded-full opacity-0 group-hover:opacity-100">
                        <div className="flex px-2 py-1 transition-opacity delay-500 opacity-0 group-hover:opacity-100">
                            <div className="mx-1 transition-all duration-300 cursor-pointer hover:scale-125 size-8">
                                <Sad />
                            </div>
                            <div className="mx-1 transition-all duration-300 cursor-pointer hover:scale-125 size-8">
                                <Wow />
                            </div>
                            <div className="mx-1 transition-all duration-300 cursor-pointer hover:scale-125 size-8">
                                <Care />
                            </div>
                            <div className="mx-1 transition-all duration-300 cursor-pointer hover:scale-125 size-8">
                                <Angry />
                            </div>
                            <div className="mx-1 transition-all duration-300 cursor-pointer hover:scale-125 size-8">
                                <Haha />
                            </div>
                            <div className="mx-1 transition-all duration-300 cursor-pointer hover:scale-125 size-8">
                                <Like />
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center justify-center flex-1 py-1 hover:bg-gray-100">
                    <GoComment className="text-lg text-gray-500" />
                    <h5 className="text-sm font-semibold text-gray-500 ms-1">Comment</h5>
                </div>
                <div className="flex items-center justify-center flex-1 py-1 hover:bg-gray-100">
                    <PiMessengerLogo className="text-lg text-gray-500" />
                    <h5 className="text-sm font-semibold text-gray-500 ms-1">Send</h5>
                </div>
                <div className="flex items-center justify-center flex-1 py-1 hover:bg-gray-100">
                    <PiShareFat className="text-lg text-gray-500" />
                    <h5 className="text-sm font-semibold text-gray-500 ms-1">Share</h5>
                </div>
            </div>
        </div>
    )
}