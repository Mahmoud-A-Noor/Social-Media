import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreatePostForm from "./CreatePostForm.jsx";
import PostExtras from "./PostExtras.jsx";
import {PostProvider} from "../../../../context/PostContext.jsx";



export default function CreatePost() {
    return (
        <div id="create-post" className="p-3 mt-5 bg-white rounded-lg shadow-md xs:max-sm:px-4">
            <PostProvider>
                <CreatePostForm />
                <div className="mt-4 mb-3 border-b-2"></div>
                <PostExtras  />
            </PostProvider>
            <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" transition: Flip
            />
        </div>
    )
}