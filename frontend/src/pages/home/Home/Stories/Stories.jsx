import {useEffect, useState} from "react";

import CreateStoryCarouselItem from "./CreateStoryCarouselItem";
import StoriesCarouselItem from "./StoriesCarouselItem";

import axiosInstance from "../../../../config/axios.js";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import {BouncyBallsLoader} from "react-loaders-kit";



export default function Stories() {
    const [stories, setStories] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(4);
    const [loading, setLoading] = useState(true);

    // Fetch stories from the backend
    const fetchStories = async () => {
        try {
            const response = await axiosInstance.get(`/user/story`);
            const newStories = response.data;

            // Use functional state update to avoid stale state
            setStories(prevStories => {
                const uniqueStories = newStories.filter(story =>
                    !prevStories.some(existingStory => existingStory._id === story._id)
                );

                if (uniqueStories.length < limit) {
                    setHasMore(false);  // If less than {limit} stories, no more stories available
                }

                return [...prevStories, ...uniqueStories];
            });

            setPage(page + 1); // Increment page number for next fetch
        } catch (err) {
            console.error('Error fetching stories:', err);
        } finally {
            setLoading(false)
        }
    };

// Fetch initial stories when the component is mounted
    useEffect(() => {
        fetchStories();
    }, []);

    const carouselResponsiveConfig = {
        superLargeDesktop: {
            // the naming can be any, depends on you.
            breakpoint: { max: 4000, min: 3000 },
            items: 5,
            slidesToSlide: 5
            },
            desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 3,
            slidesToSlide: 3
            },
            tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2,
            slidesToSlide: 2
            },
            mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
            slidesToSlide: 1
        }
    }



    return (
        <div id="stories" className="h-auto mx-2 mt-5">
            {loading ? (
                // Show loader while loading
                <div className="flex items-center justify-center w-full mt-20">
                    <BouncyBallsLoader loading={true} size={100}/>
                </div>
            ) : (
                <Carousel
                    swipeable={true}
                    responsive={carouselResponsiveConfig}
                    customTransition="all 0.5s"
                    transitionDuration={500}
                    containerClass="carousel-container w-full"
                    itemClass="carousel-item-padding-40-px"
                    centerMode={true}
                >
                    <CreateStoryCarouselItem />
                    {stories.map((story, index) => (
                        <StoriesCarouselItem fileUrl={story.story.url} key={index} />
                    ))}
                </Carousel>
            )

            }

        </div>
    )
}