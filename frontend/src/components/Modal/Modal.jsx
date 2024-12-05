
// eslint-disable-next-line react/prop-types
import { IoMdClose } from "react-icons/io";

export default function Modal({isOpen=false, header="default header", width="24rem", onClose, children}) {

    if (!isOpen) return null;
    
    // Usage
    
    // const [openModal, setOpenModal] = useState(null); // null means no modal is open
    // const openModalHandler = (modal) => setOpenModal(modal);
    // const closeModalHandler = () => setOpenModal(null);
    
    // <button onClick={() => openModalHandler('modal1')} className="px-4 py-2 mt-4 text-white bg-green-500 rounded hover:bg-green-600">
    //     Open MediaViewerModal 1
    // </button>
    // <MediaViewerModal isOpen={openModal === 'modal1'} onClose={closeModalHandler}>
    //     <h2 className="text-lg font-semibold">MediaViewerModal 1 Title</h2>
    //     <p>This is the content of MediaViewerModal 1.</p>
    // </MediaViewerModal>

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-[9999999999]">
            <div className="absolute inset-0" onClick={onClose}></div>
            <div className="relative max-w-full p-3 bg-white rounded-lg shadow-lg" style={{width:width}}>
                <div
                    className="absolute top-2 right-2 p-2 text-2xl transition-all duration-150 rounded-full hover:bg-gray-100 cursor-pointer"
                    onClick={onClose}>
                    <IoMdClose/>
                </div>
                <div className="flex items-center justify-center border-b-2">
                    <h1 className="text-xl font-bold pb-2">{header}</h1>
                </div>
                {children}
            </div>
        </div>
    )
}