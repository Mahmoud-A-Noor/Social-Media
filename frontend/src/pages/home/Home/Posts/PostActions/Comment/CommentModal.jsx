import Modal from "../../../../../../components/Modal/Modal.jsx";
import { Sad, Care, Love, Haha, Angry, Wow, Like } from "../../../../../../constants/facebook-reactions.jsx";
import Comments from "./Comments.jsx";
import CommentInput from "./CommentInput.jsx";
import MediaViewer from "../../../../../../components/Media/MediaViewer.jsx";
import { useState } from "react";

export default function CommentModal({isModalOpen, setIsModalOpen, post}) {
    const [comments, setComments] = useState([]);

    // Function to render reaction icons (similar to Post component)
    const renderReactionIcons = () => {
        const reactionCounts = post.reactions.reduce((acc, reaction) => {
            acc[reaction.type] = (acc[reaction.type] || 0) + 1;
            return acc;
        }, {});

        const totalReactions = post.reactions.length;

        // Map reaction types to their components
        const reactionComponents = {
            sad: Sad,
            care: Care,
            haha: Haha,
            angry: Angry,
            love: Love,
            wow: Wow,
            like: Like
        };

        // Get unique reaction types
        const uniqueReactions = [...new Set(post.reactions.map(r => r.type))];

        return (
            <div className="flex items-center">
                {uniqueReactions.slice(0, 3).map((type, index) => {
                    const ReactionComponent = reactionComponents[type];
                    return (
                        <div 
                            key={type} 
                            className={`${index !== 0 ? '-ms-[0.05rem]' : ''} z-${30 - index * 10} rounded-full ring-1 ring-white size-5`}
                        >
                            <ReactionComponent />
                        </div>
                    );
                })}
                {totalReactions > 0 && (
                    <span className="text-sm font-semibold text-gray-500 ms-1">
                        {totalReactions}
                    </span>
                )}
            </div>
        );
    };

    return (
        <Modal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            header={post.author.username} 
            width="41rem"
        >
            <div className="w-full pt-2 pb-1 mt-5 mb-3 bg-white rounded-lg shadow-md post xs:max-sm:px-4">
                <div id="post-top-part" className="flex items-center justify-between px-3">
                    <div className="flex">
                        <div className="size-12">
                            <img 
                                className="w-full h-full rounded-full" 
                                src={post.author.profileImage || "/src/assets/person.png"} 
                                alt={post.author.username}
                            />
                        </div>
                        <div className="ms-2">
                            <h5 className="text-base font-medium text-black">{post.author.username}</h5>
                            <h6 className="text-sm font-medium text-gray-500">
                                {new Date(post.createdAt).toLocaleString()}
                            </h6>
                        </div>
                    </div>
                </div>
                <div id="post-middle-part" className="mt-3">
                    {post.text && (
                        <h5 className="px-3 mb-3">{post.text}</h5>
                    )}
                    {post.media && post.media.url && (
                        <div className="w-full">
                            <MediaViewer fileUrl={post.media.url} isPost={true} />
                        </div>
                    )}
                    <div className="flex items-center justify-between px-3 py-2">
                        <div id="post-emojis">
                            {renderReactionIcons()}
                        </div>
                        <div id="post-analysis">
                            <span className="text-sm font-semibold text-gray-500">
                                {post.comments.length} comments
                            </span>
                            <span className="text-sm font-semibold text-gray-500 ms-4">
                                {post.shares.length} shares
                            </span>
                        </div>
                    </div>
                </div>
                <div className="px-3">
                    <div className="border-t border-t-gray-300"></div>
                </div>
            </div>
            <Comments postId={post._id} comments={comments} setComments={setComments} />
            <CommentInput postId={post._id} setComments={setComments} />
        </Modal>
    );
}