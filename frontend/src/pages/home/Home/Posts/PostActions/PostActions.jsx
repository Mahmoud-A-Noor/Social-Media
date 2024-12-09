import {GoComment} from "react-icons/go";
import {PiMessengerLogo, PiShareFat} from "react-icons/pi";
import React from "./React.jsx"
import Share from "./Share.jsx";
import Comment from "./Comment.jsx";
import Send from "./Send.jsx";

export default function PostActions({postId, authorId}) {

    return (
        <div id="post-bottom-part" className="flex items-center justify-center w-full px-3 mt-1">

            <React postId={postId} />
            <Comment postId={postId} />
            <Send />
            <Share postId={postId} />
        </div>
    )
}