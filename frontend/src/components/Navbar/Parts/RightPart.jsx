import { useState, useRef, useEffect } from "react";

import axiosInstance from "../../../config/axios";
import socketService from '../../../config/socket';

import useThemeSwitcher from "../../../hooks/useThemeSwitcher";
import NotificationsDropdown from './NotificationsDropdown';

import { PiSquaresFourFill } from "react-icons/pi";
import { BiSolidBellRing } from "react-icons/bi";

import { MdHome } from "react-icons/md";
import { MdOndemandVideo } from "react-icons/md";
import { MdOutlineStorefront } from "react-icons/md";
import { MdGroups } from "react-icons/md";
import { GiConsoleController } from "react-icons/gi";

import { IoMdSettings } from "react-icons/io";
import { IoHelpCircle } from "react-icons/io5";
import { MdLightMode } from "react-icons/md";
import { MdDarkMode } from "react-icons/md";
import { MdFeedback } from "react-icons/md";
import { GiEntryDoor } from "react-icons/gi";
import { IoIosArrowForward } from "react-icons/io";

export default function RightPart() {
    const [isImageDropdownOpen, setIsImageDropdownOpen] = useState(false)
    const [isNavMenuDropdownOpen, setIsNavMenuDropdownOpen] = useState(false)
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
    const [theme, toggleTheme] = useThemeSwitcher()
    const [unreadCount, setUnreadCount] = useState(0);

    const imageDropdownButtonRef = useRef(null);
    const imageDropdownRef = useRef(null);
    const navMenuDropdownButtonRef = useRef(null);
    const navMenuDropdownRef = useRef(null);
    const notificationsButtonRef = useRef(null);
    const notificationsDropdownRef = useRef(null);

    const toggleImageDropdown = (e) => {
        e.stopPropagation();
        setIsImageDropdownOpen((prev) => !prev);
    };

    const toggleNavMenuDropdown = (e) => {
        e.stopPropagation();
        setIsNavMenuDropdownOpen((prev) => !prev);
    };

    const toggleNotifications = (e) => {
        e.stopPropagation();
        setIsNotificationsOpen(prev => !prev);
        if (!isNotificationsOpen) {
            setUnreadCount(0); // Reset count when opening notifications
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                imageDropdownRef.current &&
                !imageDropdownRef.current.contains(event.target) &&
                imageDropdownButtonRef.current &&
                !imageDropdownButtonRef.current.contains(event.target)
            ) {
                setIsImageDropdownOpen(false);
            }
            if (
                navMenuDropdownRef.current &&
                !navMenuDropdownRef.current.contains(event.target) &&
                navMenuDropdownButtonRef.current &&
                !navMenuDropdownButtonRef.current.contains(event.target)
            ) {
                setIsNavMenuDropdownOpen(false);
            }
            if (
                notificationsDropdownRef.current &&
                !notificationsDropdownRef.current.contains(event.target) &&
                notificationsButtonRef.current &&
                !notificationsButtonRef.current.contains(event.target)
            ) {
                setIsNotificationsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    useEffect(() => {
        // Fetch initial unread count
        const fetchUnreadCount = async () => {
            try {
                const response = await axiosInstance.get('/notifications/unread-count');
                setUnreadCount(response.data.count);
            } catch (error) {
                console.error('Error fetching unread count:', error);
            }
        };

        fetchUnreadCount();

        // Listen for new notifications
        socketService.on('notification', () => {
            setUnreadCount(prev => prev + 1);
        });

        return () => {
            socketService.off('notification');
        };
    }, []);

    

    return (
        <div className="flex items-center justify-center">
            <div ref={navMenuDropdownButtonRef} className="hidden p-2 mx-2 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300 xs:max-[480px]:block" onClick={toggleNavMenuDropdown}>
                <PiSquaresFourFill className="text-xl" />
            </div>
            {isNavMenuDropdownOpen &&
                <div ref={navMenuDropdownRef} className="absolute xs:max-[480px]:w-screen h-[21.5em] top-[2.9em] px-4 pt-3 pb-3 xs:max-[480px]:-left-[0%] shadow-[0px_0px_5px_0.1px_rgba(0,_0,_0,_0.75)] bg-white p-3 rounded-md">
                    <div className="flex flex-row items-center justify-between px-3 py-3 rounded-lg cursor-pointer hover:bg-gray-100 group">
                        <div className="flex flex-row items-center">
                            <div className="p-2 bg-gray-200 rounded-full me-2">
                                <MdHome className="text-xl" />
                            </div>
                            <h5 className="text-base font-semibold">Home</h5>
                        </div>
                        <div className="p-1 text-xl transition-all duration-300 rounded-full group-hover:translate-x-2">
                            <IoIosArrowForward />
                        </div>
                    </div>
                    <div className="flex flex-row items-center justify-between px-3 py-3 rounded-lg cursor-pointer hover:bg-gray-100 group">
                        <div className="flex flex-row items-center">
                            <div className="p-2 bg-gray-200 rounded-full me-2">
                                <MdOndemandVideo className="text-xl" />
                            </div>
                            <h5 className="text-base font-semibold">Videos</h5>
                        </div>
                        <div className="p-1 text-xl transition-all duration-300 rounded-full group-hover:translate-x-2">
                            <IoIosArrowForward />
                        </div>
                    </div>
                    <div className="flex flex-row items-center justify-between px-3 py-3 rounded-lg cursor-pointer hover:bg-gray-100 group">
                        <div className="flex flex-row items-center">
                            <div className="p-2 bg-gray-200 rounded-full me-2">
                                <MdOutlineStorefront className="text-xl" />
                            </div>
                            <h5 className="text-base font-semibold">Marketplace</h5>
                        </div>
                        <div className="p-1 text-xl transition-all duration-300 rounded-full group-hover:translate-x-2">
                            <IoIosArrowForward />
                        </div>
                    </div>
                    <div className="flex flex-row items-center justify-between px-3 py-3 rounded-lg cursor-pointer hover:bg-gray-100 group">
                        <div className="flex flex-row items-center">
                            <div className="p-2 bg-gray-200 rounded-full me-2">
                                <MdGroups className="text-xl" />
                            </div>
                            <h5 className="text-base font-semibold">Groups</h5>
                        </div>
                        <div className="p-1 text-xl transition-all duration-300 rounded-full group-hover:translate-x-2">
                            <IoIosArrowForward />
                        </div>
                    </div>
                    <div className="flex flex-row items-center justify-between px-3 py-3 rounded-lg cursor-pointer hover:bg-gray-100 group">
                        <div className="flex flex-row items-center">
                            <div className="p-2 bg-gray-200 rounded-full me-2">
                                <GiConsoleController className="text-xl" />
                            </div>
                            <h5 className="text-base font-semibold">Games</h5>
                        </div>
                        <div className="p-1 text-xl transition-all duration-300 rounded-full group-hover:translate-x-2">
                            <IoIosArrowForward />
                        </div>
                    </div>
                </div>
            }

            <div className="relative">
                <div
                    ref={notificationsButtonRef}
                    className="p-2 mx-2 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300"
                    onClick={toggleNotifications}
                >
                    <BiSolidBellRing className="text-xl" />
                    {unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center bg-red-500 text-white text-xs rounded-full px-1">
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </div>
                    )}
                </div>
                <div ref={notificationsDropdownRef}>
                    <NotificationsDropdown isOpen={isNotificationsOpen} />
                </div>
            </div>

            <div className="relative mx-2 size-9">
                <img ref={imageDropdownButtonRef} src="/src/assets/person.png" alt="no image" className="w-full h-full rounded-full cursor-pointer" onClick={toggleImageDropdown} />
                {isImageDropdownOpen &&
                    <div ref={imageDropdownRef} className="absolute w-[23em] h-[26.5em] top-[2.5em] -left-[20.5em] shadow-[0px_0px_5px_0.1px_rgba(0,_0,_0,_0.75)] bg-white p-3 divide-y divide-gray-300 rounded-md z-[99999]">
                        <div className="flex items-center w-full p-2 mt-2 mb-4 border border-gray-400 rounded-lg cursor-pointer hover:bg-gray-200">
                            <img src="/src/assets/person.png" alt="no image" className="rounded-full size-9 me-2" />
                            <h5 className="text-base font-semibold">Maria John</h5>
                        </div>
                        <div className="px-2 pt-3 pb-3">
                            <div className="flex flex-row items-center justify-between px-3 py-3 rounded-lg cursor-pointer hover:bg-gray-100">
                                <div className="flex flex-row items-center">
                                    <div className="p-2 bg-gray-200 rounded-full me-2">
                                        <IoMdSettings className="text-xl" />
                                    </div>
                                    <h5 className="text-base font-semibold">Settings</h5>
                                </div>
                                <div className="p-1 text-xl transition-all rounded-full hover:translate-x-1 hover:bg-gray-300 hover:text-2xl">
                                    <IoIosArrowForward className="" />
                                </div>
                            </div>
                            <div className="flex flex-row items-center justify-between px-3 py-3 rounded-lg cursor-pointer hover:bg-gray-100">
                                <div className="flex flex-row items-center">
                                    <div className="p-2 bg-gray-200 rounded-full me-2">
                                        <IoHelpCircle className="text-xl" />
                                    </div>
                                    <h5 className="text-base font-semibold">Help & Support</h5>
                                </div>
                                <div className="p-1 text-xl transition-all rounded-full hover:translate-x-1 hover:bg-gray-300 hover:text-2xl">
                                    <IoIosArrowForward className="" />
                                </div>
                            </div>
                            <div className="flex flex-row items-center justify-between px-3 py-3 rounded-lg cursor-pointer hover:bg-gray-100" onClick={toggleTheme}>
                                <div className="flex flex-row items-center">
                                    <div className="p-2 bg-gray-200 rounded-full me-2">
                                        {theme === "dark" ? <MdLightMode className="text-xl" /> : <MdDarkMode className="text-xl" />}
                                    </div>
                                    {theme === "dark" ? <h5 className="text-base font-semibold">Light Mode</h5> : <h5 className="text-base font-semibold">Dark Mode</h5>}
                                </div>
                            </div>
                            <div className="flex flex-row items-center justify-between px-3 py-3 rounded-lg cursor-pointer hover:bg-gray-100">
                                <div className="flex flex-row items-center">
                                    <div className="p-2 bg-gray-200 rounded-full me-2">
                                        <MdFeedback className="text-xl" />
                                    </div>
                                    <h5 className="text-base font-semibold">Feedback</h5>
                                </div>
                                <div className="p-1 text-xl transition-all rounded-full hover:translate-x-1 hover:bg-gray-300 hover:text-2xl">
                                    <IoIosArrowForward className="" />
                                </div>
                            </div>
                            <div className="flex flex-row items-center justify-between px-3 py-3 rounded-lg cursor-pointer hover:bg-gray-100">
                                <div className="flex flex-row items-center">
                                    <div className="p-2 bg-gray-200 rounded-full me-2">
                                        <GiEntryDoor className="text-xl" />
                                    </div>
                                    <h5 className="text-base font-semibold">Logout</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}