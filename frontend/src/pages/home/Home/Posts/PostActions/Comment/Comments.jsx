import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import notify from "../../../../../../utils/notify.js";
import axiosInstance from "../../../../../../config/axios.js";

const Comments = ({ postId, comments, setComments }) => {
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // Load initial comments
    useEffect(() => {
        fetchComments();
    }, []);

    const fetchComments = async () => {
        try {
            const limit = 10;
            const response = await axiosInstance.get(`/posts/comments?postId=${postId}&page=${page}&limit=${limit}`);
            const newComments = response.data.comments;

            setComments((prev) => {
                const allComments = [...prev, ...newComments];
                const uniqueComments = Array.from(new Set(allComments.map((c) => c._id))).map((id) =>
                    allComments.find((c) => c._id === id)
                );
                return uniqueComments;
            });

            setHasMore(newComments.length === limit);
            setPage((prev) => prev + 1);
        } catch (error) {
            console.error(error)
            notify('Error fetching comments', "error");
        }
    };

    const fetchReplies = async (commentId, page) => {
        try {
            const limit = 5;
            const response = await axiosInstance.get(`/posts/comments/replies?commentId=${commentId}&page=${page}&limit=${limit}`);
            const newReplies = response.data.replies;

            setComments((prev) =>
                prev.map((comment) =>
                    comment._id === commentId
                        ? {
                            ...comment,
                            replies: [
                                ...comment.replies.filter(
                                    (existingReply) =>
                                        !newReplies.some((newReply) => newReply._id === existingReply._id)
                                ), // Avoid duplicates
                                ...newReplies,
                            ],
                            replyPage: page + 1,
                            hasMoreReplies: newReplies.length === limit,
                        }
                        : comment
                )
            );
        } catch (error) {
            console.error(error)
            notify('Error fetching replies', "error");
        }
    };

    const handleReplyToggle = (commentId) => {
        const comment = comments.find((c) => c._id === commentId);

        if (comment.showReplies) {
            // Hide replies
            setComments((prev) =>
                prev.map((c) =>
                    c._id === commentId
                        ? { ...c, showReplies: false }
                        : c
                )
            );
        } else {
            // Load next page of replies or first page
            fetchReplies(commentId, comment.replyPage || 1);
            setComments((prev) =>
                prev.map((c) =>
                    c._id === commentId
                        ? { ...c, showReplies: true }
                        : c
                )
            );
        }
    };


    const toggleReplyInput = (commentId) => {
        setComments((prev) =>
            prev.map((comment) =>
                comment._id === commentId
                    ? { ...comment, showReplyInput: !comment.showReplyInput }
                    : comment
            )
        );
    };

    const handleReplyInputChange = (commentId, text) => {
        setComments((prev) =>
            prev.map((comment) =>
                comment._id === commentId ? { ...comment, newReplyText: text } : comment
            )
        );
    };


    const addReply = async (commentId, text) => {
        try {
            const response = await axiosInstance.post('/posts/comments', { postId: postId, parentId: commentId, text });
            const newReply = response.data.reply;

            // Ensure that the newReply has the `user` field populated
            if (newReply && newReply.user) {
                setComments((prev) =>
                    prev.map((comment) =>
                        comment._id === commentId
                            ? {
                                ...comment,
                                replies: [...(comment.replies || []), newReply],
                                showReplyInput: false,
                                newReplyText: '',
                            }
                            : comment
                    )
                );
            } else {
                console.error('New reply does not have user populated:', newReply);
            }
        } catch (error) {
            console.error(error)
            notify('Error adding reply', "error");
        }
    };

    return (
        <div>
            <InfiniteScroll
                dataLength={comments.length}
                next={fetchComments}
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}
                endMessage={null}
            >
                {comments.map((comment) => (
                    <div key={comment._id} style={{ marginBottom: '20px', borderBottom: '1px solid #ccc' }}>
                        <div className="flex items-start justify-start">
                            <img className="rounded-full size-12 me-2" src="/src/assets/person.png" alt=""/>
                            <div className="flex-1 p-4 mb-4 bg-gray-200 rounded shadow">
                                {/* Comment Text */}
                                <p className="font-semibold text-gray-800">{comment.user.username}</p>
                                <p className="text-gray-600">{comment.text}</p>

                                {/* Show Replies Button */}
                                {comment.replies?.length > 0 && (
                                    <button
                                        onClick={() => handleReplyToggle(comment._id)}
                                        className="mt-2 text-sm text-blue-500 hover:underline"
                                    >
                                        {comment.showReplies
                                            ? 'Hide Replies'
                                            : `Show Replies (${comment.replies.length})`}
                                    </button>
                                )}

                                {/* Reply Button */}
                                <button
                                    onClick={() => toggleReplyInput(comment._id)}
                                    className="mt-2 ml-4 text-sm text-gray-600 hover:text-gray-800 hover:underline"
                                >
                                    Reply
                                </button>

                                {/* Reply Input (only if adding a reply) */}
                                {comment.showReplyInput && (
                                    <div className="mt-2 ml-4">
                                        <input
                                            type="text"
                                            value={comment.newReplyText || ''}
                                            onChange={(e) => handleReplyInputChange(comment._id, e.target.value)}
                                            className="form-input "
                                            placeholder="Write a reply..."
                                        />
                                        <button
                                            onClick={() => addReply(comment._id, comment.newReplyText)}
                                            className="form-button "
                                        >
                                            Reply
                                        </button>
                                    </div>
                                )}

                                {/* Replies Section */}
                                {comment.showReplies && (
                                    <div className="mt-2 ml-4">
                                        {comment.replies?.map((reply) => (
                                            <div key={`${comment._id}-reply-${reply._id}`} className="pl-4 text-gray-700 border-l">
                                                <p className="text-sm">
                                                    <strong>{reply.user.username}:</strong> {reply.text}
                                                </p>
                                            </div>
                                        ))}
                                        {comment.hasMoreReplies && (
                                            <button
                                                onClick={() => fetchReplies(comment._id, comment.replyPage || 1)}
                                                className="text-sm text-blue-500 hover:underline"
                                            >
                                                Load more replies
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </InfiniteScroll>
        </div>
    );
};

export default Comments;