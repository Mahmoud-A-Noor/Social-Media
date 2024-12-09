import { useState } from "react";

import {Sad, Care, Haha, Angry, Love, Wow, Like} from "../../../../constants/facebook-reactions"

import PostOptions from "./PostOptions.jsx";
import { FaWindowClose } from "react-icons/fa";
import PostActions from "./PostActions/PostActions.jsx";


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
            <PostActions postId={post._id} authorId={post.author._id} />
        </div>
    )
}