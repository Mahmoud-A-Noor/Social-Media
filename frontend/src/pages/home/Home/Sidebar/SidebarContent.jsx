import { FaUserFriends } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { FaBookmark } from "react-icons/fa";
import { MdGroups } from "react-icons/md";
import { MdOndemandVideo } from "react-icons/md";
import { MdOutlineStorefront } from "react-icons/md";
import { VscFeedback } from "react-icons/vsc";
import { GiConsoleController } from "react-icons/gi";
import { RxActivityLog } from "react-icons/rx";
import { TbMessageFilled } from "react-icons/tb";
import {useAuth} from "../../../../context/authContext.jsx";


export default function SidebarContent() {

    const {user} = useAuth()

    return (
        <div>
            <div className="flex items-center px-2 py-3 rounded-lg cursor-pointer hover:bg-white ">
                <div className="size-10">
                    <img src={user?.profileImage || "/src/assets/person.png"} alt="no image" className="w-full h-full rounded-full" />
                </div>
                <h4 className="text-lg ms-3">{user?.username}</h4>
            </div>
            <div className="flex items-center px-3 py-3 rounded-lg cursor-pointer hover:bg-white ">
                <FaUserFriends className="text-3xl rounded-full" />
                <h4 className="text-lg ms-3">Friends</h4>
            </div>
            <div className="flex items-center px-3 py-3 rounded-lg cursor-pointer hover:bg-white ">
                <TbMessageFilled className="text-3xl rounded-full" />
                <h4 className="text-lg ms-3">Messages</h4>
            </div>
            <div className="flex items-center px-3 py-3 rounded-lg cursor-pointer hover:bg-white ">
                <IoMdTime className="text-3xl rounded-full" />
                <h4 className="text-lg ms-3">Memories</h4>
            </div>
            <div className="flex items-center px-3 py-3 rounded-lg cursor-pointer hover:bg-white ">
                <FaBookmark className="text-3xl rounded-full" />
                <h4 className="text-lg ms-3">Saved</h4>
            </div>
            <div className="flex items-center px-3 py-3 rounded-lg cursor-pointer hover:bg-white ">
                <MdGroups className="text-3xl rounded-full" />
                <h4 className="text-lg ms-3">Groups</h4>
            </div>
            <div className="flex items-center px-3 py-3 rounded-lg cursor-pointer hover:bg-white ">
                <MdOndemandVideo className="text-3xl rounded-full" />
                <h4 className="text-lg ms-3">Videos</h4>
            </div>
            <div className="flex items-center px-3 py-3 rounded-lg cursor-pointer hover:bg-white ">
                <MdOutlineStorefront className="text-3xl rounded-full" />
                <h4 className="text-lg ms-3">Marketplace</h4>
            </div>
            <div className="flex items-center px-3 py-3 rounded-lg cursor-pointer hover:bg-white ">
                <VscFeedback className="text-3xl rounded-full" />
                <h4 className="text-lg ms-3">Feeds</h4>
            </div>
            <div className="flex items-center px-3 py-3 rounded-lg cursor-pointer hover:bg-white ">
                <MdOutlineStorefront className="text-3xl rounded-full" />
                <h4 className="text-lg ms-3">Marketplace</h4>
            </div>
            <div className="flex items-center px-3 py-3 rounded-lg cursor-pointer hover:bg-white ">
                <GiConsoleController className="text-3xl rounded-full" />
                <h4 className="text-lg ms-3">Games</h4>
            </div>
            <div className="flex items-center px-3 py-3 rounded-lg cursor-pointer hover:bg-white ">
                <RxActivityLog className="text-3xl rounded-full" />
                <h4 className="text-lg ms-3">Activities</h4>
            </div>
        </div>
    )
}