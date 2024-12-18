import {Flip, toast} from "react-toastify";

export default function notify(message="", type="success"){

    const toastConfig = {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Flip,
    }
    if(type === "success") toast.success(message, toastConfig);
    else if(type === "info") toast.info(message, toastConfig);
    else if(type === "warning") toast.warning(message, toastConfig);
    else toast.error(message, toastConfig);
}