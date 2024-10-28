import { MdHome } from "react-icons/md";
import { MdOndemandVideo } from "react-icons/md";
import { MdOutlineStorefront } from "react-icons/md";
import { MdGroups } from "react-icons/md";
import { GiConsoleController } from "react-icons/gi";


// eslint-disable-next-line react/prop-types
export default function MiddlePart({switchPage}) {
    return (
        <div className="flex items-center justify-center xs:max-[480px]:hidden">
            <div className="nav-icon active md:max-lg:px-6 sm:max-md:px-4 xs:max-sm:px-2" onClick={()=>{switchPage("home")}}>
                <MdHome />
            </div>
            <div className="nav-icon active md:max-lg:px-6 sm:max-md:px-4 xs:max-sm:px-2" onClick={()=>{switchPage("videos")}}>
                <MdOndemandVideo />
            </div>
            <div className="nav-icon active md:max-lg:px-6 sm:max-md:px-4 xs:max-sm:px-2" onClick={()=>{switchPage("marketplace")}}>
                <MdOutlineStorefront />
            </div>
            <div className="nav-icon active md:max-lg:px-6 sm:max-md:px-4 xs:max-sm:px-2" onClick={()=>{switchPage("groups")}}>
                <MdGroups />
            </div>
            <div className="nav-icon active md:max-lg:px-6 sm:max-md:px-4 xs:max-sm:px-2" onClick={()=>{switchPage("games")}}>
                <GiConsoleController />
            </div>
        </div>
    )
}