import {GoComment} from "react-icons/go";
import {useState} from "react";
import CommentModal from "./CommentModal.jsx";

export default function CommentButton({post}){

    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className="flex items-center justify-center flex-1 py-1 cursor-pointer hover:bg-gray-100"
                 onClick={() => setIsModalOpen(true)}>
                <GoComment className="text-lg text-gray-500"/>
                <h5 className="text-sm font-semibold text-gray-500 ms-1">Comment</h5>
            </div>
            <CommentModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} post={post}/>
        </>
    )
}