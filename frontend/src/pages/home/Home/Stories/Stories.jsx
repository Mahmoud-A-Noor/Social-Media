import StoriesCarouselItem from "./StoriesCarouselItem";
import CreateStoryCarouselItem from "./CreateStoryCarouselItem";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";


export default function Stories() {

    
    const responsive = {
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
            items: 1
        }
    }

    return (
        <div id="stories" className="h-auto mx-2 mt-5">
            <Carousel
                swipeable={true}
                responsive={responsive}
                customTransition="all 0.5s"
                transitionDuration={500}
                containerClass="carousel-container"
                itemClass="carousel-item-padding-40-px"
                centerMode={true}
                
            >
                <CreateStoryCarouselItem />
                <StoriesCarouselItem /> 
                <StoriesCarouselItem /> 
                <StoriesCarouselItem />
                <StoriesCarouselItem />
                <StoriesCarouselItem />
                <StoriesCarouselItem /> 
                <StoriesCarouselItem /> 
                <StoriesCarouselItem />
                <StoriesCarouselItem />
                <StoriesCarouselItem />
            </Carousel>
        </div>
    )
}