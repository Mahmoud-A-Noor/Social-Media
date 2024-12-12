import { useEffect, useRef, useState } from "react";
import { IoHappyOutline } from "react-icons/io5";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import ReactDOM from "react-dom";
import axiosInstance from "../../../../../../config/axios.js";
import notify from "../../../../../../utils/notify.js";

export default function CommentInput({postId, setComments}) {
    const [comment, setComment] = useState("");
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
    const emojiPickerRef = useRef(null);
    const emojiPickerButtonRef = useRef(null);
    const textAreaRef = useRef(null);

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

    const handleInput = (e) => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = "auto"; // Reset height to calculate new height
            textAreaRef.current.style.height = `${Math.min(
                e.target.scrollHeight,
                300
            )}px`; // Limit height to 300px
        }
    };

    const addEmoji = (e) => {
        const sym = e.unified.split("_");
        const codeArray = [];
        sym.forEach((item) => codeArray.push("0x" + item));
        let emoji = String.fromCodePoint(...codeArray);
        setComment((prev) => prev + emoji);
        if (textAreaRef.current) {
            textAreaRef.current.style.height = "auto"; // Reset height to calculate new height
            textAreaRef.current.style.height = `${Math.min(
                textAreaRef.current.scrollHeight,
                300
            )}px`; // Limit height to 300px
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            // Create the post
            const response = await axiosInstance.post("/posts/comments", {
                text: comment,
                postId: postId
            })
            const newComment = response.data.comment;
            setComments((prev) => [newComment, ...prev]);
            setComment("")
            notify("Comment added successfully!", "success");
        } catch (error) {
            console.error(error)
            notify("An error occurred during adding the comment. Please try again.", "error");
        }
    }

    const emojiPickerPortal = isEmojiPickerOpen
        ? ReactDOM.createPortal(
            <div
                ref={emojiPickerRef}
                className="fixed z-[10000000000]"
                style={{
                    top: emojiPickerButtonRef.current?.getBoundingClientRect().bottom - 450 || 0,
                    left: emojiPickerButtonRef.current?.getBoundingClientRect().right + 15 || 0,
                }}
            >
                <Picker data={data} onEmojiSelect={addEmoji} />
            </div>,
            document.body // Render to body, not inside modal
        )
        : null;

    return (
        <form className="sticky bottom-0 left-0 right-0 z-30 bg-white px-5 mb-3" onSubmit={handleFormSubmit}>
            <div className="flex items-center justify-center">
                <textarea
                    className="border-1 resize-none focus:outline-0 w-full my-3 text-xl rounded-lg bg-gray-200 px-2 py-3"
                    placeholder="write a comment..."
                    ref={textAreaRef}
                    style={{maxHeight: "300px"}}
                    rows={1}
                    onInput={handleInput}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <div
                    ref={emojiPickerButtonRef}
                    onClick={toggleEmojiPicker}
                    className="ms-2 w-fit"
                >
                    <IoHappyOutline
                        className="text-5xl sm:max-md:text-xl xs:max-sm:text-lg rounded-full p-2 cursor-pointer hover:bg-gray-100"/>
                </div>
            </div>
            <div id="login-actions" className="flex flex-col text-center">
                <button className="group form-button md:bg-none xs:bg-white mt-0" type={"submit"}>Comment</button>
            </div>
            {emojiPickerPortal}
        </form>
    );
}