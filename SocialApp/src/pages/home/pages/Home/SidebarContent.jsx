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


export default function SidebarContent() {
    return (
        <div>
            <div className="flex items-center px-2 py-3 rounded-lg cursor-pointer hover:bg-gray-100">
                <div className="size-10">
                    <img src="/src/assets/person.png" alt="no image" className="w-full h-full rounded-full" />
                </div>
                <h4 className="text-lg ms-3">Maria John</h4>
            </div>
            <div className="flex items-center px-3 py-3 rounded-lg cursor-pointer hover:bg-gray-100">
                <FaUserFriends className="text-3xl rounded-full" />
                <h4 className="text-lg ms-3">Friends</h4>
            </div>
            <div className="flex items-center px-3 py-3 rounded-lg cursor-pointer hover:bg-gray-100">
                <TbMessageFilled className="text-3xl rounded-full" />
                <h4 className="text-lg ms-3">Messages</h4>
            </div>
            <div className="flex items-center px-3 py-3 rounded-lg cursor-pointer hover:bg-gray-100">
                <IoMdTime className="text-3xl rounded-full" />
                <h4 className="text-lg ms-3">Memories</h4>
            </div>
            <div className="flex items-center px-3 py-3 rounded-lg cursor-pointer hover:bg-gray-100">
                <FaBookmark className="text-3xl rounded-full" />
                <h4 className="text-lg ms-3">Saved</h4>
            </div>
            <div className="flex items-center px-3 py-3 rounded-lg cursor-pointer hover:bg-gray-100">
                <MdGroups className="text-3xl rounded-full" />
                <h4 className="text-lg ms-3">Groups</h4>
            </div>
            <div className="flex items-center px-3 py-3 rounded-lg cursor-pointer hover:bg-gray-100">
                <MdOndemandVideo className="text-3xl rounded-full" />
                <h4 className="text-lg ms-3">Videos</h4>
            </div>
            <div className="flex items-center px-3 py-3 rounded-lg cursor-pointer hover:bg-gray-100">
                <MdOutlineStorefront className="text-3xl rounded-full" />
                <h4 className="text-lg ms-3">Marketplace</h4>
            </div>
            <div className="flex items-center px-3 py-3 rounded-lg cursor-pointer hover:bg-gray-100">
                <VscFeedback className="text-3xl rounded-full" />
                <h4 className="text-lg ms-3">Feeds</h4>
            </div>
            <div className="flex items-center px-3 py-3 rounded-lg cursor-pointer hover:bg-gray-100">
                <MdOutlineStorefront className="text-3xl rounded-full" />
                <h4 className="text-lg ms-3">Marketplace</h4>
            </div>
            <div className="flex items-center px-3 py-3 rounded-lg cursor-pointer hover:bg-gray-100">
                <GiConsoleController className="text-3xl rounded-full" />
                <h4 className="text-lg ms-3">Games</h4>
            </div>
            <div className="flex items-center px-3 py-3 rounded-lg cursor-pointer hover:bg-gray-100">
                <RxActivityLog className="text-3xl rounded-full" />
                <h4 className="text-lg ms-3">Activities</h4>
            </div>
        </div>
    )
}