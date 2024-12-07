import {Flip, toast} from "react-toastify";
import uploadFile from "../../../../utils/uploadFile.js";
import axiosInstance from "../../../../config/axios.js";
import {usePostContext} from "../../../../context/PostContext.jsx";
import CreatePostFormModal from "./CreatePostFormModal.jsx";



export default function CreatePostForm() {

    const {postVisibility, setPostVisibility, postContent, setPostContent, file, setFile, fileUrl, setFileUrl, setIsModalOpen, feeling} = usePostContext()


    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!postContent && !file) {
            toast.error("Post content or file is required.", toastConfig);
            return;
        }

        // Upload the file
        let uploadedFileUrl = fileUrl
        try {
            if(file){
                uploadedFileUrl = await uploadFile(file);
                setFileUrl(uploadedFileUrl); // Save the file URL
            }
        } catch (error) {
            toast.error(error.message, toastConfig);
        }
        try {
            // Create the post
            await axiosInstance.post("/posts", {
                text: postContent,
                media: { url: uploadedFileUrl, type: file?.type?.split("/")[0] || "unknown" },
                feeling: feeling,
                postVisibility: postVisibility
            });
            toast.success("Posts created successfully!", toastConfig);
        } catch (error) {
            setIsModalOpen(false);
            console.error(error)
            toast.error("Error creating post. Please try again.", toastConfig);
        }

        // reset all fields
        setPostContent("");
        setFile(null);
        setFileUrl(null);
        setIsModalOpen(false);
        setFeeling(null)
        setPostVisibility("public")
    };


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



    return(
        <>
            <form className="flex items-center" onSubmit={handleFormSubmit}>
                <div className="size-12">
                    <img className="w-full h-full rounded-full " src="/src/assets/person.png" alt=""/>
                </div>
                <input onClick={() => setIsModalOpen((prev) => !prev)}
                       className="flex-1 px-4 py-2 transition-all duration-300 ease-in-out bg-gray-100 rounded-full outline-none placeholder:text-lg placeholder:sm:max-md:text-base placeholder:xs:max-sm:text-sm placeholder:text-gray-500 ms-3 hover:bg-gray-200 cursor-pointer"
                       type="text" placeholder="What's on your mind, Mahmoud?"/>
                <CreatePostFormModal />
            </form>
        </>
    )
}