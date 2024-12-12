import { IoMdClose } from "react-icons/io";
import { useEffect } from "react";
import ReactDOM from "react-dom";

export default function Modal({
                                  isOpen = false,
                                  onClose,
                                  header = "default header",
                                  width = "24rem",
                                  children,
                              }) {
    useEffect(() => {
        // Ensure modal-root exists in the DOM
        let modalRoot = document.getElementById("modal-root");
        if (!modalRoot) {
            modalRoot = document.createElement("div");
            modalRoot.id = "modal-root";
            document.body.appendChild(modalRoot);
        }

        // Disable body scroll when the modal is open
        if (isOpen) {
            document.body.style.overflow = "hidden";

            // Prevent touchmove on the body
            const preventBodyScroll = (e) => {
                if (!e.target.closest(".modal-content")) {
                    e.preventDefault();
                }
            };
            document.addEventListener("touchmove", preventBodyScroll, { passive: false });
            document.addEventListener("wheel", preventBodyScroll, { passive: false });

            return () => {
                document.body.style.overflow = "";

                // Cleanup event listeners
                document.removeEventListener("touchmove", preventBodyScroll);
                document.removeEventListener("wheel", preventBodyScroll);
            };
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const modalRoot = document.getElementById("modal-root");

    return ReactDOM.createPortal(
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999999999]">
            {/* Overlay */}
            <div className="absolute inset-0" onClick={onClose}></div>

            <div
                className="modal-content relative max-w-full p-3 bg-white rounded-lg shadow-lg overflow-auto"
                style={{ width: width, maxHeight: "90vh" }}
            >
                <div
                    className="absolute top-2 right-2 p-2 text-2xl transition-all duration-150 rounded-full hover:bg-gray-100 cursor-pointer"
                    onClick={onClose}
                >
                    <IoMdClose />
                </div>

                {header && (
                    <div className="flex items-center justify-center border-b-2">
                        <h1 className="text-xl font-bold pb-2">{header}</h1>
                    </div>
                )}

                <div className="overflow-y-auto" style={{ maxHeight: "calc(90vh - 4rem)" }}>
                    {children}
                </div>
            </div>
        </div>,
        modalRoot
    );
}