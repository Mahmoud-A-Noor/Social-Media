import HomeSidebar from "./Home/Sidebar" 
import CreatePost from "./Home/CreatePost";
import Stories from "./Home/Stories";
import Posts from "./Home/Posts";
import HomeRightbar from "./Home/Rightbar"


export default function Home() {

    
    return (
        <div className="flex w-screen">
            <HomeSidebar />
            <div id="home" className="flex justify-center w-full">
                <div className=" max-w-[37rem] w-full">
                    <CreatePost />
                    <Stories />
                    <Posts />
                </div>
            </div>
            <HomeRightbar />
        </div>
    )
}