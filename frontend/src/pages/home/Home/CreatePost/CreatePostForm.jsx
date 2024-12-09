import uploadFile from "../../../../utils/uploadFile.js";
import axiosInstance from "../../../../config/axios.js";
import {usePostContext} from "../../../../context/CreatePostContext.jsx";
import CreatePostFormModal from "./CreatePostFormModal.jsx";
import notify from "../../../../utils/notify.js";



export default function CreatePostForm() {

    const {postVisibility, setPostVisibility, postContent, setPostContent, file, setFile, fileUrl, setFileUrl, setIsModalOpen, feeling, setFeeling} = usePostContext()


    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!postContent && !file) {
            notify("Post content or file is required.", "error");
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
            notify(error.message, "error");
        }
        try {
            // Create the post
            await axiosInstance.post("/posts", {
                text: postContent,
                media: { url: uploadedFileUrl, type: file?.type?.split("/")[0] || "unknown" },
                feeling: feeling,
                postVisibility: postVisibility
            });
            notify("Posts created successfully!", "success");
        } catch (error) {
            setIsModalOpen(false);
            console.error(error)
            notify("Error creating post. Please try again.", "error");
        }

        // reset all fields
        setPostContent("");
        setFile(null);
        setFileUrl(null);
        setIsModalOpen(false);
        setFeeling(null)
        setPostVisibility("public")
    };



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