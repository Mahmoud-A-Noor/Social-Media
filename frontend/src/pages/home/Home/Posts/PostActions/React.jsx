import {AiOutlineLike} from "react-icons/ai";
import {Angry, Care, Haha, Like, Love, Sad, Wow} from "../../../../../constants/facebook-reactions.jsx";
import axiosInstance from "../../../../../config/axios.js";
import {useState} from "react";
import notify from "../../../../../utils/notify.js";

export default function React({postId}){

    const [reaction, setReaction] = useState(null);
    const [isReactionsVisible, setIsReactionsVisible] = useState(false);


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

    const reactToPost = async(react)=>{
        try {
            setIsReactionsVisible(false)
            if(!reaction){
                setReaction(react);
                await axiosInstance.post("/posts/reactions", {postId, type: react})
            }else{
                if(reaction === react){
                    setReaction(null)
                    await axiosInstance.delete("/posts/reactions", {
                        data: {postId}
                    })
                }else{
                    setReaction(react)
                    await axiosInstance.put("/posts/reactions", {postId, type: react})
                }
            }
        }catch (err) {
            setIsReactionsVisible(false)
            notify("Reaction couldn't be added!" + err, "error");
        }
    }

    return (
        <div className="relative flex items-center justify-center flex-1 py-1 cursor-pointer hover:bg-gray-100 group"
             onMouseEnter={() => setIsReactionsVisible(true)}
             onMouseLeave={() => setIsReactionsVisible(false)}>
            <div className="text-2xl sm:max-md:text-xl xs:max-sm:text-lg w-6 h-6">
                {reaction ? renderReactionEmoji() : <AiOutlineLike className="text-2xl text-gray-500"/>}
            </div>
            <span
                className="text-base font-semibold text-gray-500 sm:max-md:text-sm xs:max-sm:text-xs ms-2">{reaction ? renderReactionText() : "Like"}</span>
            <div
                className={`absolute -left-3 -top-14 mt-2 transition-opacity delay-500 bg-white border border-gray-300 shadow-lg z-[99999] rounded-full opacity-0 group-hover:opacity-100  ${isReactionsVisible ? "opacity-100 visible" : "opacity-0 invisible"}`}>
                <div className="flex px-2 py-1 transition-opacity delay-500 opacity-0 group-hover:opacity-100">
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