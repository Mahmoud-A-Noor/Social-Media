import ReactButton from "./ReactButton.jsx"
import ShareButton from "./ShareButton.jsx";
import CommentButton from "./Comment/CommentButton.jsx";
import SendButton from "./SendButton.jsx";
import {useState} from "react";

export default function PostActions({post, updatePostReactions}) {


    return (
        <div id="post-bottom-part" className="flex items-center justify-center w-full px-3 mt-1">
            <ReactButton postId={post._id} post={post} updatePostReactions={updatePostReactions} />
            <CommentButton post={post} />
            <SendButton />
            <ShareButton postId={post._id} />
        </div>
    )
}