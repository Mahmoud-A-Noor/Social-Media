import { useState, useRef, useEffect } from "react";

import SidebarContent from "./SideBarContent";

import { IoIosArrowForward } from "react-icons/io";



export default function HomeSidebar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const toggleSidebar = (e) => {
        e.stopPropagation(); // Prevent the outside click event from firing
        setIsSidebarOpen((prev)=>!prev);
    };
    
    const sidebarButtonRef = useRef(null);
    const sidebarRef = useRef(null);
      
    useEffect(() => {
        const handleClickOutside = (event) => {
          if (
            sidebarRef.current &&
            !sidebarRef.current.contains(event.target) &&
            sidebarButtonRef.current &&
            !sidebarButtonRef.current.contains(event.target)
          ) {
            setIsSidebarOpen(false);
          }
        };
    
        // Bind the event listener for detecting outside clicks
        document.addEventListener('mousedown', handleClickOutside);
        
        // Cleanup the event listener on unmount
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);
    
    return (
      <div id="home-sidebar" className="relative h-svh max-h-svh">
        <div className="900px:block hidden lg:w-[17em] w-[14em] h-full bg-[#F0F2F5] mt-2">
          <SidebarContent />
        </div>
        <div className="relative z-50 items-center hidden h-full xs:max-md:flex">
            <div ref={sidebarButtonRef} className={`absolute top-1/2 -translate-y-1/2 text-xl transition-all duration-500 w-[35px] h-[50px] rounded-tr-full rounded-br-full bg-black flex items-center justify-center ${isSidebarOpen?"translate-x-[13.65em] p-1":""}`} onClick={toggleSidebar}>
                <IoIosArrowForward className={`text-2xl text-white transition-all duration-500 ${isSidebarOpen?"rotate-180":""}`} />
            </div>
            <div ref={sidebarRef} className={`absolute ${isSidebarOpen?"left-0":"-left-[17em]"} w-[17em] h-full transition-all duration-500 bg-[#F0F2F5]`}>
                <SidebarContent />
            </div>
        </div>
      </div>
    )
}