import { useRef } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { HiOutlineArrowLeft } from "react-icons/hi";

export default function LeftPart() {
  const searchInputRef = useRef(null);

  const focusSearchInput = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  return (
    <div className="flex items-center max-[1260px]:w-[5.5rem]">
      <div className="size-[2.9rem] bg-transparent">
        <img src="/src/assets/new_logo.png" alt="" className="w-full h-full" />
      </div>
      <div className="group/nav-search-box relative max-[1260px]:z-10">
        <IoSearchSharp
          onClick={focusSearchInput}
          className="absolute z-20 text-gray-500 transition-all duration-300 ease-in-out -translate-y-1/2 opacity-100 left-3 top-1/2 group-focus-within/nav-search-box:-translate-x-4 group-focus-within/nav-search-box:opacity-0"
        />
        <div className="absolute p-2 text-gray-500 transition-all duration-300 ease-in-out -translate-y-1/2 bg-white rounded-full opacity-0 left-3 top-1/2 -z-10 hover:bg-gray-100 group-focus-within/nav-search-box:z-0 group-focus-within/nav-search-box:-translate-x-14 group-focus-within/nav-search-box:cursor-pointer group-focus-within/nav-search-box:text-2xl group-focus-within/nav-search-box:opacity-100">
          <HiOutlineArrowLeft />
        </div>
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search Lamasocial"
          className="absolute -top-[17px] left-0 max-w-52 rounded-full bg-gray-100 py-[0.4rem] pl-10 outline-none transition-all duration-300 ease-in-out placeholder:text-sm placeholder:text-gray-500 focus:px-4 max-[1260px]:w-10 max-[1260px]:focus:w-52"
        />
        <div className="invisible absolute -bottom-[87px] -left-[3.65rem] z-30 flex max-h-72 min-h-16 w-[17em] items-center justify-center rounded-lg bg-white opacity-0 shadow-2xl transition-all duration-300 ease-in-out group-focus-within/nav-search-box:visible group-focus-within/nav-search-box:opacity-100">
          <h5 className="text-gray-500">No recent searches</h5>
        </div>
      </div>
    </div>
  );
}
