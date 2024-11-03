import HomeSidebar from "./Sidebar/Sidebar" 
import HomeRightbar from "./Rightbar/RightBar"
import CreatePost from "./CreatePost/CreatePost";
import Stories from "./Stories/Stories";
import Post from "./Post/Post";
import Modal from "../../../components/Modal/Modal"
import Menu from "../../../components/Menu/Menu"
import Tooltip from "../../../components/Tooltip/Tooltip"

export default function Home() {
    
    return (
        <div className="flex w-screen">
            <HomeSidebar />
            <div id="home" className="flex justify-center w-full">
                <div className="max-w-[37rem] w-full">
                    <CreatePost />
                    <Stories />
                    <div id="posts" className="w-full h-auto">
                        <Post />
                        <Post />
                    </div>
                </div>
            </div>
            <HomeRightbar />
        </div>
    )
}