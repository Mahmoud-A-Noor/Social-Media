import { IoHappyOutline, IoEarthSharp } from "react-icons/io5";
import { useLiveStreamContext } from '../../context/LiveStreamContext';

export default function StreamSetup({ onStartStream }) {
    const { 
        liveStreamText, 
        setLiveStreamText,
        streamVisibility, 
        setStreamVisibility,
        streamFeeling,
        setStreamFeeling,
        isReactionsVisible, 
        setIsReactionsVisible 
    } = useLiveStreamContext();

    return (
        <div className="space-y-4">
            <textarea
                value={liveStreamText}
                onChange={(e) => setLiveStreamText(e.target.value)}
                placeholder="What's this live stream about?"
                className="w-full p-2 border rounded-lg"
                rows="3"
            />

            <div className="flex items-center space-x-2">
                <IoEarthSharp className="text-xl"/>
                <select
                    value={streamVisibility}
                    onChange={(e) => setStreamVisibility(e.target.value)}
                    className="p-2 border rounded"
                >
                    <option value="public">Public</option>
                    <option value="friends">Friends</option>
                    <option value="private">Private</option>
                </select>
            </div>

            <div className="relative">
                <div
                    className="flex items-center space-x-2 cursor-pointer"
                    onMouseEnter={() => setIsReactionsVisible(true)}
                    onMouseLeave={() => setIsReactionsVisible(false)}
                >
                    <IoHappyOutline className="text-xl"/>
                    <span>{streamFeeling || "Add Feeling"}</span>
                    {/* Add your reactions popup component here */}
                </div>
            </div>

            <button
                onClick={onStartStream}
                className="w-full py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
            >
                Start Stream
            </button>
        </div>
    );
} 