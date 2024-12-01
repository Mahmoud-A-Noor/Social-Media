import axiosInstance from "../config/axios.js";



export default async function uploadFile(file) {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axiosInstance.post('/file', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data.url; // Assuming the backend returns the file URL in the `url` field.
    } catch (error) {
        throw new Error(error.response?.data?.message || 'File upload failed.');
    }
}