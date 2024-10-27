export default function HomeRightbar() {
    return (
        <div id="home-rightbar" className="h-svh max-h-svh min-[1260px]:w-[27rem] min-[1260px]:block hidden bg-[#F0F2F5] px-2 py-3">
            <h5 className="mb-3 text-lg font-bold text-gray-500">Contacts</h5>
            <div className="flex items-center px-1 py-2">
                <img className="rounded-full size-12" src="/src/assets/person.png" alt="" />
                <h5 className="text-lg ms-2">John Doe</h5>
            </div>
            <div className="flex items-center px-1 py-2">
                <div className="relative">
                    <img className="rounded-full size-12" src="/src/assets/person.png" alt="" />
                    <span className="absolute top-0 right-0 w-3 h-3 bg-green-400 rounded-full opacity-75 animate-ping"></span>
                    <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full"></span>
                </div>
                <h5 className="text-lg ms-2">John Doe</h5>
            </div>
            <div className="flex items-center px-1 py-2">
                <img className="rounded-full size-12" src="/src/assets/person.png" alt="" />
                <h5 className="text-lg ms-2">John Doe</h5>
            </div>
            <div className="flex items-center px-1 py-2">
                <div className="relative">
                    <img className="rounded-full size-12" src="/src/assets/person.png" alt="" />
                    <span className="absolute top-0 right-0 w-3 h-3 bg-green-400 rounded-full opacity-75 animate-ping"></span>
                    <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full"></span>
                </div>
                <h5 className="text-lg ms-2">John Doe</h5>
            </div>
            <div className="my-3"></div>
            <h5 className="mb-3 text-lg font-bold text-gray-500">Groups</h5>
            <div className="flex items-center px-1 py-2">
                <img className="rounded-full size-12" src="/src/assets/person.png" alt="" />
                <h5 className="text-lg ms-2">Group 1</h5>
            </div>
            <div className="flex items-center px-1 py-2">
                <div className="relative">
                    <img className="rounded-full size-12" src="/src/assets/person.png" alt="" />
                    <span className="absolute top-0 right-0 w-3 h-3 bg-green-400 rounded-full opacity-75 animate-ping"></span>
                    <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full"></span>
                </div>
                <h5 className="text-lg ms-2">Group 2</h5>
            </div>
            <div className="flex items-center px-1 py-2">
                <img className="rounded-full size-12" src="/src/assets/person.png" alt="" />
                <h5 className="text-lg ms-2">Group 3</h5>
            </div>
            <div className="flex items-center px-1 py-2">
                <div className="relative">
                    <img className="rounded-full size-12" src="/src/assets/person.png" alt="" />
                    <span className="absolute top-0 right-0 w-3 h-3 bg-green-400 rounded-full opacity-75 animate-ping"></span>
                    <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full"></span>
                </div>
                <h5 className="text-lg ms-2">Group 4</h5>
            </div>
        </div>
    )
}