import {useParams} from "react-router-dom";
import PostOptions from "../home/Home/Posts/PostOptions.jsx";
import MediaViewer from "../../components/Media/MediaViewer.jsx";
import PostActions from "../home/Home/Posts/PostActions/PostActions.jsx";
import {useEffect, useState} from "react";
import axiosInstance from "../../config/axios.js";
import {BrokenCirclesLoader} from "react-loaders-kit";
import notify from "../../utils/notify.js";
import { useNavigate } from "react-router-dom";
import {Angry, Care, Haha, Like, Love, Sad, Wow} from "../../constants/facebook-reactions.jsx";


export default function Post(){
    const navigate = useNavigate();
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [isPostHidden, setIsPostHidden] = useState(true);
    const [loading, setLoading] = useState(true);

    const getPost = async (postId) => {
        try{
            setLoading(true)
            const response = await axiosInstance.get(`/posts/post/${postId}`)
            setPost(response.data)
            setLoading(false)
        }catch(error){
            setLoading(false)
            console.log(error)
            notify("Error, we couldn't get the post", "error")
        }

    }

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

    const updatePostReactions = (postId, newReaction, isRemove = false) => {
        setPost((prevPost)=> {
                if (prevPost._id === postId) {
                    if (isRemove) {
                        // Remove the reaction
                        return {
                            ...prevPost,
                            reactions: prevPost.reactions.filter(reaction =>
                                reaction.user._id !== prevPost.currentUserReaction
                            )
                        };
                    }

                    // Update or add reaction
                    const updatedReactions = prevPost.reactions.filter(reaction =>
                        reaction.user._id !== prevPost.currentUserReaction
                    );
                    return {
                        ...prevPost,
                        reactions: [...updatedReactions, newReaction]
                    };
                }
                return post;
            }
        );
    };

    const hidePostFromList = async () => {
        try {
            navigate("/")
        } catch (error) {
            console.log(error)
            notify("Failed to hide the post. Please try again.", "error");
        }
    };

    useEffect(() => {
        getPost(postId)
    }, []);

    if(loading) return <div className="w-screen h-screen flex items-center justify-center">
        <BrokenCirclesLoader loading={loading} size={300} />
    </div>


    return (
        <div className="w-full h-auto flex items-center justify-center">
            <div className="w-1/2 max-h-screen pt-2 pb-1 mt-5 mb-5 bg-white rounded-lg shadow-md post xs:max-sm:px-4">
                <div id="post-top-part" className="flex items-center justify-between px-3">
                    <div className="flex">
                        <div className="size-12">
                            <img
                                className="w-full h-full rounded-full"
                                src={post?.author?.profileImage || "/src/assets/person.png"}
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
                            <MediaViewer fileUrl={post.media.url} isPost={true}/>
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
                <PostActions post={post} updatePostReactions={updatePostReactions}/>
            </div>
        </div>
    )

}