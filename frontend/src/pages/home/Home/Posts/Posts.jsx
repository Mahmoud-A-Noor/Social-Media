import {useEffect, useState} from "react";

import Post from "./Post.jsx";
import axiosInstance from "../../../../config/axios.js";

import InfiniteScroll from 'react-infinite-scroll-component';
import {BouncyBallsLoader} from "react-loaders-kit";



export default function Posts() {

    const [posts, setPosts] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(3);

    // Fetch posts from the backend
    const fetchPosts = async () => {
        try {
            const response = await axiosInstance.get(`/posts?page=${page}&limit=${limit}`);
            const newPosts = response.data;

            // Use functional state update to ensure up-to-date posts
            setPosts((prevPosts) => {
                const uniquePosts = newPosts.filter(post =>
                    !prevPosts.some(existingPost => existingPost._id === post._id)
                );

                if (uniquePosts.length < limit) {
                    setHasMore(false);  // If less than {limit} posts, no more posts available
                }

                return [...prevPosts, ...uniquePosts];
            });

            setPage(page + 1); // Increment page number for next fetch
        } catch (err) {
            console.error('Error fetching posts:', err);
        }
    };

// Fetch initial posts when the component is mounted
    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <div id="posts" className="w-full h-auto">
            <InfiniteScroll
                dataLength={posts.length} // This is important for react-infinite-scroll-component
                next={fetchPosts} // Fetch more posts when scrolled
                hasMore={hasMore} // When to stop the infinite scroll
                loader={<div className="flex items-center justify-center w-full mt-20">
                    <BouncyBallsLoader loading={true} size={100} />
                </div>}
                endMessage={null}
            >
                {posts.map((post, index) => (
                    <Post key={index} post={post} />
                ))}
            </InfiniteScroll>
        </div>
    )
}