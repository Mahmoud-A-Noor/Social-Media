import {RiLiveFill} from "react-icons/ri";
import {FaPhotoVideo} from "react-icons/fa";
import {IoHappyOutline} from "react-icons/io5";
import {Angry, Care, Haha, Like, Sad, Wow} from "../../../../constants/facebook-reactions.jsx";
import {usePostContext} from "../../../../context/CreatePostContext.jsx";


export default function PostExtras() {

    const {isReactionsVisible, setIsReactionsVisible, feeling, setFeeling, handleFileSelect, setIsModalOpen} = usePostContext()

    const handleFeelingChange = (feel) => {
        if(!feeling){
            setFeeling(feel);
            setIsModalOpen(true)
        }else{
            if(feeling === feel){
                setFeeling(null)
            }else{
                setFeeling(feel)
                setIsModalOpen(true)
            }
        }
        setIsReactionsVisible(false);
    }

    const renderFeelingEmoji = () => {
        if(feeling === "Angry") return <Angry/>
        else if(feeling === "Care") return <Care/>
        else if(feeling === "Haha") return <Haha/>
        else if(feeling === "Sad") return <Sad/>
        else if(feeling === "Shocked") return <Wow/>
        else return <Like/>
    }


    return(
        <>
            <div className="flex">
                <div
                    className="flex items-center justify-center flex-1 py-3 rounded-lg hover:bg-gray-200 xs:max-sm:px-1">
                    <RiLiveFill className="text-2xl sm:max-md:text-xl xs:max-sm:text-lg"/>
                    <span
                        className="text-base font-semibold text-gray-500 sm:max-md:text-sm xs:max-sm:text-xs ms-2 text-nowrap">Live Video</span>
                </div>
                <label
                    className="flex items-center justify-center flex-1 py-3 rounded-lg hover:bg-gray-200 xs:max-sm:px-1 cursor-pointer">
                    <FaPhotoVideo className="text-2xl sm:max-md:text-xl xs:max-sm:text-lg"/>
                    <span
                        className="text-base font-semibold text-gray-500 sm:max-md:text-sm xs:max-sm:text-xs ms-2">Photo/video</span>
                    <input type="file" className="hidden" onChange={(e) => {
                        handleFileSelect(e);
                        setIsModalOpen(true)
                    }}/>
                </label>
                <div className="relative group flex-1">
                    <div
                        className="flex items-center justify-center py-3 rounded-lg hover:bg-gray-200 xs:max-sm:px-1 cursor-pointer"
                        onMouseEnter={() => setIsReactionsVisible(true)}
                        onMouseLeave={() => setIsReactionsVisible(false)}>
                        <div className="text-2xl sm:max-md:text-xl xs:max-sm:text-lg w-6 h-6">
                            {feeling ? renderFeelingEmoji() : <IoHappyOutline/>}
                        </div>
                        <span
                            className="text-base font-semibold text-gray-500 sm:max-md:text-sm xs:max-sm:text-xs ms-2">{feeling ? feeling : "Feeling"}</span>
                        <div
                            className={`absolute -left-3 -top-14 mt-2 bg-white border border-gray-300 shadow-lg z-[99999] rounded-full transition-opacity duration-300 ${isReactionsVisible ? "opacity-100 visible" : "opacity-0 invisible"}`}>
                            <div
                                className="flex px-2 py-1 transition-opacity delay-500 opacity-0 group-hover:opacity-100">
                                <div
                                    className="mx-1 transition-all duration-300 cursor-pointer hover:scale-125 size-8"
                                    onClick={() => {
                                        handleFeelingChange("Sad")
                                    }}>
                                    <Sad/>
                                </div>
                                <div
                                    className="mx-1 transition-all duration-300 cursor-pointer hover:scale-125 size-8"
                                    onClick={() => {
                                        handleFeelingChange("Shocked")
                                    }}>
                                    <Wow/>
                                </div>
                                <div
                                    className="mx-1 transition-all duration-300 cursor-pointer hover:scale-125 size-8"
                                    onClick={() => {
                                        handleFeelingChange("Care")
                                    }}>
                                    <Care/>
                                </div>
                                <div
                                    className="mx-1 transition-all duration-300 cursor-pointer hover:scale-125 size-8"
                                    onClick={() => {
                                        handleFeelingChange("Angry")
                                    }}>
                                    <Angry/>
                                </div>
                                <div
                                    className="mx-1 transition-all duration-300 cursor-pointer hover:scale-125 size-8"
                                    onClick={() => {
                                        handleFeelingChange("Haha")
                                    }}>
                                    <Haha/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}