import {useEffect, useState} from "react";

import Post from "./Post.jsx";
import axiosInstance from "../../../../config/axios.js";

import InfiniteScroll from 'react-infinite-scroll-component';
import {BouncyBallsLoader, GooeyLoader2} from "react-loaders-kit";



export default function Posts() {

    const [posts, setPosts] = useState([]);
    const [hiddenPosts, setHiddenPosts] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(3);
    const [loading, setLoading] = useState(true);

    const hidePostFromList = (postId) => {
        setHiddenPosts((prevHiddenPosts) => [...prevHiddenPosts, postId]); // Add to hiddenPosts
        setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId)); // Remove from posts
    };

    const fetchPosts = async () => {
        try {
            const response = await axiosInstance.get(`/posts?page=${page}&limit=${limit}`);
            const newPosts = response.data;

            // Use functional state update to ensure up-to-date posts
            setPosts((prevPosts) => {
                const filteredPosts = newPosts.filter(post => {
                    // Allow duplicate posts only if they are shared
                    const isDuplicate = prevPosts.some(existingPost => existingPost._id === post._id);
                    return !isDuplicate || post.shares && post.shares.length > 0; // Allow shared posts to appear twice
                }).filter(post => !hiddenPosts.includes(post._id));

                if (filteredPosts.length < limit) {
                    setHasMore(false); // If less than {limit} posts, no more posts available
                }

                return [...prevPosts, ...filteredPosts];
            });

            setPage(page + 1); // Increment page number for next fetch
        } catch (err) {
            console.error('Error fetching posts:', err);
        }
        setLoading(false);
    };

    const loader = <div className="flex justify-center items-center h-64">
            <GooeyLoader2 loading={loading} size={100} />
        </div>

// Fetch initial posts when the component is mounted
    useEffect(() => {
        fetchPosts();
    }, []);


    return loading ? loader : posts.length !== 0 ? (
        <div id="posts" className="w-full h-auto">
            <InfiniteScroll
                dataLength={posts.length} // This is important for react-infinite-scroll-component
                next={fetchPosts} // Fetch more posts when scrolled
                hasMore={hasMore} // When to stop the infinite scroll
                loader={loader}
                endMessage={null}
            >
                {posts.map((post, index) => (
                    <Post key={index} post={post} hidePostFromList={hidePostFromList} />
                ))}
            </InfiniteScroll>
        </div>
    ):(
        <div className="flex flex-col items-center justify-center w-full h-auto space-x-8 space-y-16 lg:flex-row lg:space-y-0 2xl:space-x-0 mt-3">
            <div className="flex flex-col items-center justify-center w-full text-center lg:w-1/2 lg:px-2 xl:px-0">
                <p className="font-bold tracking-wider text-gray-300 text-7xl md:text-8xl lg:text-9xl">Sorry</p>
                <p className="mt-2 text-4xl font-bold tracking-wider text-gray-300 md:text-5xl lg:text-6xl">there's no posts to be shown</p>
                <p className="my-12 text-lg text-gray-500 md:text-xl lg:text-2xl">Try to follow other users or add friends to get more posts</p>
            </div>
        </div>
    )
}