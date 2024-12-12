import ReactButton from "./ReactButton.jsx"
import ShareButton from "./ShareButton.jsx";
import CommentButton from "./Comment/CommentButton.jsx";
import SendButton from "./SendButton.jsx";
import {useState} from "react";

export default function PostActions({postId, authorId}) {


    return (
        <div id="post-bottom-part" className="flex items-center justify-center w-full px-3 mt-1">
            <ReactButton postId={postId} />
            <CommentButton postId={postId} />
            <SendButton />
            <ShareButton postId={postId} />
        </div>
    )
}