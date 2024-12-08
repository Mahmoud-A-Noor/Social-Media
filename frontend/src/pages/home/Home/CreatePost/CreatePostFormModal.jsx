import {IoDocumentText, IoHappyOutline} from "react-icons/io5";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import {FaPhotoVideo} from "react-icons/fa";
import Modal from "../../../../components/Modal/Modal.jsx";
import {useEffect} from "react";
import {usePostContext} from "../../../../context/CreatePostContext.jsx";


export default function CreatePostFormModal(){

    const {textAreaRef, emojiPickerButtonRef, emojiPickerRef, isEmojiPickerOpen, setIsEmojiPickerOpen, isModalOpen, setIsModalOpen, handleFileSelect, feeling, file, setFile, setFileUrl, postVisibility, setPostVisibility, postContent, setPostContent } = usePostContext()

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                emojiPickerRef.current &&
                !emojiPickerRef.current.contains(event.target) && // Click outside the picker
                emojiPickerButtonRef.current &&
                !emojiPickerButtonRef.current.contains(event.target) // Click outside the button
            ) {
                setIsEmojiPickerOpen(false);
            }
        };

        // Add event listener to capture clicks outside
        document.addEventListener("mousedown", handleClickOutside);

        // Clean up the event listener
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleEmojiPicker = (event) => {
        event.stopPropagation(); // Prevent the event from propagating to the document listener
        setIsEmojiPickerOpen((prev) => !prev);
    };

    const handleFileRemove = () => {
        setFile(null); // Remove the selected file
        setFileUrl(null);
    };

    const handleInput = (e) => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = "auto"; // Reset height to calculate new height
            textAreaRef.current.style.height = `${Math.min(e.target.scrollHeight, 200)}px`; // Limit height to 200px
        }
    };

    const addEmoji = (e)=>{
        const sym = e.unified.split("_")
        const codeArray = []
        sym.forEach((item)=>codeArray.push("0x" + item))
        let emoji = String.fromCodePoint(...codeArray)
        setPostContent((prev)=>prev + emoji)
        if (textAreaRef.current) {
            textAreaRef.current.style.height = "auto"; // Reset height to calculate new height
            textAreaRef.current.style.height = `${Math.min(textAreaRef.current.scrollHeight, 200)}px`; // Limit height to 200px
        }
    }

    const renderFeelingText = () => {
        if(feeling === "Angry") return <span className="text-base font-normal">is feeling <span className="font-bold text-red-500">Angry</span></span>
        else if(feeling === "Care") return <span className="text-base font-normal">is in <span className="font-bold text-pink-500">Love</span></span>
        else if(feeling === "Haha") return <span className="text-base font-normal">is <span className="font-bold text-green-500">Laughing</span></span>
        else if(feeling === "Sad") return <span className="text-base font-normal">is feeling <span className="font-bold text-blue-500">Sad</span></span>
        else return <span className="text-base font-normal">is <span className="font-bold text-yellow-500">Shocked</span></span>
    }

    return(
        <>
            <Modal isOpen={isModalOpen === true} onClose={() => {
                setIsModalOpen(false)
                setIsEmojiPickerOpen(false)
            }} header="Create Post" width="37rem">
                <div className="flex items-center mt-2 gap-2">
                    <div className="size-10">
                        <img className="w-full h-full rounded-full " src="/src/assets/person.png" alt=""/>
                    </div>
                    <div>
                        <h4 className="text-base font-semibold">Mahmoud Noor {feeling && renderFeelingText()}</h4>
                        <div className="relative">
                            <select value={postVisibility}
                                    onChange={(e) => setPostVisibility((prev) => e.target.value)}
                                    className="w-[5rem] max-h-[1.8rem] bg-transparent placeholder:text-slate-400 text-slate-700 text-xs border border-slate-200 rounded px-1 py-1 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer">
                                <option value="public">Public</option>
                                <option value="friend">Friends</option>
                                <option value="private">Private</option>
                            </select>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 strokeWidth="1.2" stroke="currentColor"
                                 className="h-5 w-5 ml-1 absolute top-[0.3rem] left-[3.5rem] text-slate-700">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"/>
                            </svg>
                        </div>
                    </div>
                </div>
                <textarea
                    className="border-0 resize-none focus:outline-0 w-full my-3 text-xl px-2"
                    placeholder="What's on your mind, Mahmoud?"
                    ref={textAreaRef}
                    style={{maxHeight: "200px"}}
                    rows={1}
                    onInput={handleInput}
                    value={postContent}
                    onChange={e => setPostContent(e.target.value)}
                />
                <div ref={emojiPickerButtonRef} onClick={toggleEmojiPicker} className="ms-auto w-fit">
                    <IoHappyOutline
                        className="text-5xl sm:max-md:text-xl xs:max-sm:text-lg rounded-full p-2 cursor-pointer hover:bg-gray-100"/>
                </div>
                {isEmojiPickerOpen &&
                    <div ref={emojiPickerRef} className="absolute top-0 -right-[350px] z-30">
                        <Picker data={data} onEmojiSelect={addEmoji}/>
                    </div>
                }
                {file && (
                    <div className="flex items-center gap-2">
                        <p className="text-sm">{file.name}</p>
                        <button
                            className="text-red-500 hover:underline"
                            onClick={handleFileRemove}
                        >
                            Remove
                        </button>
                    </div>
                )}
                <div className="flex items-center mt-2">
                    <label
                        className="flex items-center justify-center flex-1 py-3 rounded-lg hover:bg-gray-200 xs:max-sm:px-1 cursor-pointer">
                        <FaPhotoVideo className="text-2xl sm:max-md:text-xl xs:max-sm:text-lg"/>
                        <span
                            className="text-base font-semibold text-gray-500 sm:max-md:text-sm xs:max-sm:text-xs ms-2">Photo/video</span>
                        <input type="file" accept=".png, .jpeg, .jpg, .gif, .webp, .svg, .mp4, .mkv, .webm, .ogg, .avi, .mpeg, .mov" className="hidden" onChange={handleFileSelect}/>
                    </label>
                    <label
                        className="flex items-center justify-center flex-1 py-3 rounded-lg hover:bg-gray-200 xs:max-sm:px-1 cursor-pointer">
                        <IoDocumentText className="text-2xl sm:max-md:text-xl xs:max-sm:text-lg"/>
                        <span
                            className="text-base font-semibold text-gray-500 sm:max-md:text-sm xs:max-sm:text-xs ms-2">Document</span>
                        <input type="file" accept=".pdf" className="hidden" onChange={handleFileSelect}/>
                    </label>
                </div>
                <div className="flex flex-col text-center">
                    <button className="form-button md:bg-none xs:bg-white" type="submit">Post</button>
                </div>
            </Modal>
        </>
    )
}