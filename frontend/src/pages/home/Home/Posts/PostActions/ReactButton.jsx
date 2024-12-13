import { useEffect, useState } from "react";
import { AiOutlineLike } from "react-icons/ai";
import { Angry, Care, Haha, Like, Love, Sad, Wow } from "../../../../../constants/facebook-reactions.jsx";
import axiosInstance from "../../../../../config/axios.js";
import notify from "../../../../../utils/notify.js";

export default function ReactButton({postId, updatePostReactions, post}) {
    const [reaction, setReaction] = useState(null);
    const [isReactionsVisible, setIsReactionsVisible] = useState(false);

    // Set initial reaction if user has already reacted
    useEffect(() => {
        if (post.reactions) {
            // Find the current user's reaction
            const userReaction = post.reactions.find(r => r.user._id === post.currentUserReaction);
            if (userReaction) {
                setReaction(userReaction.type);
            }
        }
    }, [post]);

    const reactToPost = async(react) => {
        try {
            setIsReactionsVisible(false);
            
            // If there's an existing reaction, always update it
            if (reaction) {
                if (reaction === react) {
                    // Remove reaction if clicking the same one
                    await axiosInstance.delete("/posts/reactions", {
                        data: { postId }
                    });
                    setReaction(null);
                    updatePostReactions(postId, null, true);
                } else {
                    // Update to new reaction
                    const response = await axiosInstance.put("/posts/reactions", {
                        postId,
                        type: react
                    });
                    setReaction(react);
                    updatePostReactions(postId, response.data);
                }
            } else {
                // Create new reaction
                const response = await axiosInstance.post("/posts/reactions", {
                    postId,
                    type: react
                });
                setReaction(react);
                updatePostReactions(postId, response.data);
            }
        } catch (err) {
            console.error(err);
            notify(err.response?.data?.error || "Reaction couldn't be added!", "error");
        }
    };

    const renderReactionText = () => {
        if(reaction === "angry") return <span className="text-red-500">Angry</span>
        else if(reaction === "care") return <span className="text-pink-500">Care</span>
        else if(reaction === "haha") return <span className="text-green-500">Haha</span>
        else if(reaction === "sad") return <span className="text-blue-700">Sad</span>
        else if(reaction === "wow") return <span className="text-yellow-500">Wow</span>
        else if(reaction === "love") return <span className="text-pink-800">Love</span>
        else if(reaction === "like") return <span className="text-blue-400">Like</span>
    }

    const renderReactionEmoji = () => {
        if(reaction === "angry") return <Angry/>
        else if(reaction === "care") return <Care/>
        else if(reaction === "love") return <Love/>
        else if(reaction === "haha") return <Haha/>
        else if(reaction === "sad") return <Sad/>
        else if(reaction === "wow") return <Wow/>
        else return <Like/>
    }

    return (
        <div className="relative flex items-center justify-center flex-1 py-1 cursor-pointer hover:bg-gray-100 group"
             onMouseEnter={() => setIsReactionsVisible(true)}
             onMouseLeave={() => setTimeout(() => setIsReactionsVisible(false), 300)}>
            <div className="w-6 h-6 text-2xl sm:max-md:text-xl xs:max-sm:text-lg">
                {reaction ? renderReactionEmoji() : <AiOutlineLike className="text-2xl text-gray-500"/>}
            </div>
            <span className="text-base font-semibold text-gray-500 sm:max-md:text-sm xs:max-sm:text-xs ms-2">
                {reaction ? renderReactionText() : "Like"}
            </span>
            <div className={`absolute -left-3 -top-14 mt-2 transition-opacity delay-300 bg-white border border-gray-300 shadow-lg z-[99999] rounded-full ${isReactionsVisible ? "opacity-100 visible" : "opacity-0 invisible"}`}>
                <div className="flex px-2 py-1">
                    <div
                        className="mx-1 transition-all duration-300 cursor-pointer hover:scale-125 size-8"
                        onClick={() => reactToPost("like")}>
                        <Like/>
                    </div>
                    <div
                        className="mx-1 transition-all duration-300 cursor-pointer hover:scale-125 size-8"
                        onClick={() => reactToPost("wow")}>
                        <Wow/>
                    </div>
                    <div
                        className="mx-1 transition-all duration-300 cursor-pointer hover:scale-125 size-8"
                        onClick={() => reactToPost("care")}>
                        <Care/>
                    </div>
                    <div
                        className="mx-1 transition-all duration-300 cursor-pointer hover:scale-125 size-8"
                        onClick={() => reactToPost("angry")}>
                        <Angry/>
                    </div>
                    <div
                        className="mx-1 transition-all duration-300 cursor-pointer hover:scale-125 size-8"
                        onClick={() => reactToPost("haha")}>
                        <Haha/>
                    </div>
                    <div
                        className="mx-1 transition-all duration-300 cursor-pointer hover:scale-125 size-8"
                        onClick={() => reactToPost("love")}>
                        <Love/>
                    </div>
                    <div className="mx-1 transition-all duration-300 cursor-pointer hover:scale-125 size-8"
                         onClick={() => reactToPost("sad")}>
                        <Sad/>
                    </div>
                </div>
            </div>
        </div>
    )
}