

import LeftPart from "./Components/LeftPart";
import MiddlePart from "./Components/MiddlePart";
import RightPart from "./Components/RightPart";


// eslint-disable-next-line react/prop-types
export default function Navbar({switchPage}) {


    return (
        <div id="navbar" className="flex justify-between w-screen px-3 py-1 bg-white border border-gray-300 shadow-md xs:max-sm:py-2">
            <LeftPart />
            <MiddlePart switchPage={switchPage} />
            <RightPart />
        </div>
    )
}