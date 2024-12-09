import {GoComment} from "react-icons/go";
import React from "./React.jsx";

export default function Comment({postId}){



    return (
        <div className="flex items-center justify-center flex-1 py-1 hover:bg-gray-100">
            <GoComment className="text-lg text-gray-500"/>
            <h5 className="text-sm font-semibold text-gray-500 ms-1">Comment</h5>
        </div>
    )
}