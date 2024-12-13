import { useState } from "react";
import { Sad, Care, Haha, Angry, Love, Wow, Like } from "../../../../constants/facebook-reactions"
import PostOptions from "./PostOptions.jsx";
import { FaWindowClose } from "react-icons/fa";
import PostActions from "./PostActions/PostActions.jsx";
import MediaViewer from "../../../../components/Media/MediaViewer.jsx";

export default function Post({post, hidePostFromList, updatePostReactions}) {
    const [isPostHidden, setIsPostHidden] = useState(false);
    // Function to render reaction icons
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

    return isPostHidden ? (
        <div className="flex items-center justify-between w-full h-auto px-5 py-4 mt-5 bg-white rounded-md shadow-md ">
            <div className="flex items-center">
                <FaWindowClose className="self-start mt-2 text-xl" />
                <div className="ms-4">
                    <h5 className="text-lg font-bold">Hidden</h5>
                    <h6 className="">A Hidden Post press <span className="">undo</span> button to reveal the content.</h6>
                </div>
            </div>
            <button 
                className="p-2 text-lg font-semibold bg-gray-200 rounded-lg hover:bg-gray-300" 
                onClick={() => setIsPostHidden(false)}
            >
                Undo
            </button>
        </div>
    ) : (
        <div className="w-full pt-2 pb-1 mt-5 mb-5 bg-white rounded-lg shadow-md post xs:max-sm:px-4">
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
                <PostOptions 
                    setIsPostHidden={setIsPostHidden} 
                    postId={post._id} 
                    authorId={post.author._id} 
                    hidePostFromList={hidePostFromList}
                    isFollowing={post.author.isFollowing}
                    authorName={post.author.username}
                />
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
            <PostActions post={post} updatePostReactions={updatePostReactions} />
        </div>
    );
}