import { useState } from 'react';
import { IoHappyOutline, IoEarthSharp } from "react-icons/io5";

export default function SaveStreamModal({ onClose, onSave }) {
    const [postText, setPostText] = useState('');
    const [visibility, setVisibility] = useState('public');
    const [feeling, setFeeling] = useState(null);
    const [isReactionsVisible, setIsReactionsVisible] = useState(false);

    const handleSave = () => {
        if (!postText.trim()) {
            notify("Please enter a description for your post", "error");
            return;
        }
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
                    <div
                        className="flex items-center space-x-2 cursor-pointer"
                        onMouseEnter={() => setIsReactionsVisible(true)}
                        onMouseLeave={() => setIsReactionsVisible(false)}
                    >
                        <IoHappyOutline className="text-xl"/>
                        <span>{feeling || "Add Feeling"}</span>
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