import HomeSidebar from "./Sidebar/Sidebar" 
import HomeRightbar from "./Rightbar/RightBar"
import CreatePost from "./CreatePost/CreatePost";
import Stories from "./Stories/Stories";
import Posts from "./Posts/Posts.jsx";
import Messanger from "../../../components/Messanger/Messenger.jsx";

export default function Home() {

    return (
        <div className="flex w-screen h-auto overflow-x-hidden">
            <HomeSidebar />
            <div id="home" className="flex justify-center w-full">
                <div className="max-w-[37rem] w-full">
                    <CreatePost />
                    <Stories />
                    <Posts />
                </div>
            </div>
            <HomeRightbar />
            <Messanger />
        </div>
    )
}