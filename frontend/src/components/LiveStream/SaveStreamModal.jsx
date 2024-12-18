import { useState } from 'react';
import {Angry, Care, Haha, Sad, Wow} from "../../constants/facebook-reactions.jsx";
import { IoEarthSharp } from "react-icons/io5";
import notify from '../../utils/notify.js';


export default function SaveStreamModal({ onClose, onSave }) {
    const [postText, setPostText] = useState('');
    const [visibility, setVisibility] = useState('public');
    const [feeling, setFeeling] = useState(null);


    const handleFeelingChange = (feel) => {
        if(!feeling){
            setFeeling(feel);
        }else{
            if(feeling === feel){
                setFeeling(null)
            }else{
                setFeeling(feel)
            }
        }
    }

    const renderFeelingText = () => {
        if(feeling === "angry") return <span className="text-base font-normal">is feeling <span className="font-bold text-red-500">Angry</span></span>
        else if(feeling === "care") return <span className="text-base font-normal">is in <span className="font-bold text-pink-500">Love</span></span>
        else if(feeling === "haha") return <span className="text-base font-normal">is <span className="font-bold text-green-500">Laughing</span></span>
        else if(feeling === "sad") return <span className="text-base font-normal">is feeling <span className="font-bold text-blue-500">Sad</span></span>
        else return <span className="text-base font-normal">is <span className="font-bold text-yellow-500">Shocked</span></span>
    }

    const handleSave = () => {
        // if (!postText.trim()) {
        //     notify("Please enter a description for your post", "error");
        //     return;
        // }
        onSave({ postText, visibility, feeling });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md p-4 bg-white rounded-lg">
                <div className="flex justify-between mb-4">
                    <h2 className="text-xl font-bold">Save Live Stream</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
                </div>

                <textarea
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                    placeholder="Say something about your stream..."
                    className="w-full p-2 mb-4 border rounded-lg"
                    rows="3"
                />

                <div className="flex items-center mb-4 space-x-2">
                    <IoEarthSharp className="text-xl"/>
                    <select
                        value={visibility}
                        onChange={(e) => setVisibility(e.target.value)}
                        className="p-2 border rounded"
                    >
                        <option value="public">Public</option>
                        <option value="friends">Friends</option>
                        <option value="private">Private</option>
                    </select>
                </div>

                <div className="relative mb-4">
                    
                    <div className={`mt-2 w-fit bg-white border border-gray-300 shadow-lg z-[99999] rounded-full transition-opacity duration-300`}>
                        <div className="flex items-center justify-center px-2 py-1 transition-opacity delay-500">
                            <h3
                                className={`mx-1 z-10 transition-all duration-300 cursor-pointer hover:scale-125 size-8 font-bold me-5 mt-1`}
                                onClick={() => {
                                    handleFeelingChange(null)
                                }}>
                                None
                            </h3>
                            <div
                                className={`mx-1 z-10 transition-all duration-300 cursor-pointer hover:scale-125 ${feeling === "sad" ? "scale-125" : ""} size-8`}
                                onClick={() => {
                                    handleFeelingChange("sad")
                                }}>
                                <Sad/>
                            </div>
                            <div
                                className={`mx-1 transition-all duration-300 cursor-pointer hover:scale-125 size-8 ${feeling === "wow" ? "scale-125" : ""}`}
                                onClick={() => {
                                    handleFeelingChange("wow")
                                }}>
                                <Wow/>
                            </div>
                            <div
                                className={`mx-1 transition-all duration-300 cursor-pointer hover:scale-125 size-8 ${feeling === "care" ? "scale-125" : ""}`}
                                onClick={() => {
                                    handleFeelingChange("care")
                                }}>
                                <Care/>
                            </div>
                            <div
                                className={`mx-1 transition-all duration-300 cursor-pointer hover:scale-125 size-8 ${feeling === "angry" ? "scale-125" : ""}`}
                                onClick={() => {
                                    handleFeelingChange("angry")
                                }}>
                                <Angry/>
                            </div>
                            <div
                                className={`mx-1 transition-all duration-300 cursor-pointer hover:scale-125 size-8 ${feeling === "haha" ? "scale-125" : ""}`}
                                onClick={() => {
                                    handleFeelingChange("haha")
                                }}>
                                <Haha/>
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    className="w-full py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                >
                    Save Stream
                </button>
            </div>
        </div>
    );
} 