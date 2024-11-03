
// eslint-disable-next-line react/prop-types
export default function Modal({isOpen, onClose, children}) {
    
    if (!isOpen) return null;
    
    // Usage
    
    // const [openModal, setOpenModal] = useState(null); // null means no modal is open
    // const openModalHandler = (modal) => setOpenModal(modal);
    // const closeModalHandler = () => setOpenModal(null);
    
    // <button onClick={() => openModalHandler('modal1')} className="px-4 py-2 mt-4 text-white bg-green-500 rounded hover:bg-green-600">
    //     Open Modal 1
    // </button>
    // <Modal isOpen={openModal === 'modal1'} onClose={closeModalHandler}>
    //     <h2 className="text-lg font-semibold">Modal 1 Title</h2>
    //     <p>This is the content of Modal 1.</p>
    // </Modal>

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50">
            <div className="absolute inset-0" onClick={onClose}></div>
            <div className="relative max-w-full p-6 bg-white rounded-lg shadow-lg w-96">
                {children}
            </div>
        </div>
    )
}