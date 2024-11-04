// eslint-disable-next-line react/prop-types
export default function Menu({ top = "0px", left = "0px", bottom = "0px", right = "0px", padding = "0.3em", isOpen, onMouseEnter, onMouseLeave, children }) {

    // State Usage
    // const [isMenuOpen, setIsMenuOpen] = useState(false);
    // const [isHovering, setIsHovering] = useState(false);
    // const menuRef = useRef(null);
    // const closeTimeoutRef = useRef(null);

    // const toggleMenu = () => {
    //     setIsMenuOpen(prev => !prev);
    // };

    // useEffect(() => {
    //     const handleClickOutside = (event) => {
    //         if (menuRef.current && !menuRef.current.contains(event.target)) {
    //             setIsMenuOpen(false);
    //         }
    //     };

    //     document.addEventListener('mousedown', handleClickOutside);
        
    //     return () => {
    //         document.removeEventListener('mousedown', handleClickOutside);
    //     };
    // }, []);

    // useEffect(() => {
    //     if (!isHovering && isMenuOpen) {
    //         closeTimeoutRef.current = setTimeout(() => {
    //             setIsMenuOpen(false);
    //         }, 500);
    //     }

    //     return () => {
    //         clearTimeout(closeTimeoutRef.current);
    //     };
    // }, [isHovering, isMenuOpen]);

    // Component Usage
    // <button onClick={toggleMenu} className="relative flex flex-row items-center justify-between px-3 py-3 rounded-lg cursor-pointer hover:bg-gray-100">
    //     open Menu
    //     <Menu isOpen={isMenuOpen} top="100%" left="0" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
    //         <div>Element 1</div>
    //         <div>Element 2</div>
    //         <div>Element 3</div>
    //     </Menu>
    // </button>


    return (
        <div id="menu" style={{ top, left, bottom, right, padding }} className={`absolute rounded-md cursor-auto z-[999] transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            {children}
        </div>
    );
}