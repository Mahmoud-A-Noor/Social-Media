import { useState } from "react";

import {Sad, Care, Haha, Angry, Love, Wow, Like} from "../../../../constants/facebook-reactions"

import { AiOutlineLike } from "react-icons/ai";
import { GoComment } from "react-icons/go";
import { PiMessengerLogo } from "react-icons/pi";
import { PiShareFat } from "react-icons/pi";
import PostOptions from "./PostOptions.jsx";
import { FaWindowClose } from "react-icons/fa";


export default function Post({post, hidePostFromList}) {

    const [isPostHidden, setIsPostHidden] = useState(false);

    return isPostHidden?(
        <div className="flex justify-between items-center bg-white rounded-md w-full h-auto py-4 px-5 mt-5 shadow-md ">
            <div className="flex items-center">
                <FaWindowClose className="text-xl self-start mt-2" />
                <div className="ms-4">
                    <h5 className="text-lg font-bold">Hidden</h5>
                    <h6 className="">A Hidden Post press <span className="">undo</span> button to reveal the content.</h6>
                </div>
            </div>
            <button className="text-lg font-semibold bg-gray-200 hover:bg-gray-300 p-2 rounded-lg" onClick={()=>setIsPostHidden((prev)=>false)}>
                Undo
            </button>
        </div>
    ):(
        <div className="w-full pt-2 pb-1 mt-5 mb-5 bg-white rounded-lg shadow-md post xs:max-sm:px-4">
            <div id="post-top-part" className="flex items-center justify-between px-3">
                <div className="flex">
                    <div className="size-12">
                        <img className="w-full h-full rounded-full " src="/src/assets/person.png" alt=""/>
                    </div>
                    <div className="ms-2">
                        <h5 className="text-base font-medium text-black">my awesome page</h5>
                        <h6 className="text-sm font-medium text-gray-500">13m</h6>
                    </div>
                </div>
                <PostOptions setIsPostHidden={setIsPostHidden} postId={post._id} authorId={post.author._id} hidePostFromList={hidePostFromList}/>
            </div>
            <div id="post-middle-part" className="mt-3">
                <h5 className="px-3 mb-3">عاجل | القناة 14 الإسرائيلية: الجيش قد يفجر قريبا المنزل الذي قتل فيه
                    السنوار</h5>
                <img className="w-full h-auto" src="/src/assets/post.jpg"/>
                <div className="flex items-center justify-between px-3 py-2">
                    <div id="post-emojis" className="flex items-center">
                        <div className="z-30 rounded-full ring-1 ring-white size-5">
                            <Sad/>
                        </div>
                        <div className="z-20 -ms-[0.05rem] ring-1 ring-white rounded-full size-5">
                            <Care/>
                        </div>
                        <div className="z-10 -ms-[0.05rem] ring-1 ring-white rounded-full size-5">
                            <Love/>
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
                <div
                    className="relative flex items-center justify-center flex-1 py-1 cursor-pointer hover:bg-gray-100 group">
                    <AiOutlineLike className="text-lg text-gray-500"/>
                    <h5 className="text-sm font-semibold text-gray-500 ms-1">Like</h5>
                    <div
                        className="absolute -left-3 -top-14 mt-2 transition-opacity delay-500 bg-white border border-gray-300 shadow-lg z-[99999] rounded-full opacity-0 group-hover:opacity-100">
                        <div
                            className="flex px-2 py-1 transition-opacity delay-500 opacity-0 group-hover:opacity-100">
                            <div
                                className="mx-1 transition-all duration-300 cursor-pointer hover:scale-125 size-8">
                                <Sad/>
                            </div>
                            <div
                                className="mx-1 transition-all duration-300 cursor-pointer hover:scale-125 size-8">
                                <Wow/>
                            </div>
                            <div
                                className="mx-1 transition-all duration-300 cursor-pointer hover:scale-125 size-8">
                                <Care/>
                            </div>
                            <div
                                className="mx-1 transition-all duration-300 cursor-pointer hover:scale-125 size-8">
                                <Angry/>
                            </div>
                            <div
                                className="mx-1 transition-all duration-300 cursor-pointer hover:scale-125 size-8">
                                <Haha/>
                            </div>
                            <div
                                className="mx-1 transition-all duration-300 cursor-pointer hover:scale-125 size-8">
                                <Like/>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-center flex-1 py-1 hover:bg-gray-100">
                    <GoComment className="text-lg text-gray-500"/>
                    <h5 className="text-sm font-semibold text-gray-500 ms-1">Comment</h5>
                </div>
                <div className="flex items-center justify-center flex-1 py-1 hover:bg-gray-100">
                    <PiMessengerLogo className="text-lg text-gray-500"/>
                    <h5 className="text-sm font-semibold text-gray-500 ms-1">Send</h5>
                </div>
                <div className="flex items-center justify-center flex-1 py-1 hover:bg-gray-100">
                    <PiShareFat className="text-lg text-gray-500"/>
                    <h5 className="text-sm font-semibold text-gray-500 ms-1">Share</h5>
                </div>
            </div>
        </div>
    )
}