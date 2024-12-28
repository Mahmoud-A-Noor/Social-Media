import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from "../../config/axios.js";
import {BrokenCirclesLoader} from "react-loaders-kit";
import getUserIdFromToken from "../../utils/getUserIdFromToken.js";
import MediaViewer from "../../components/Media/MediaViewer.jsx";
import notify from "../../utils/notify.js"
import uploadFile from "../../utils/uploadFile.js"
import {useAuth} from "../../context/authContext.jsx";
import {ToastContainer} from "react-toastify";


export default function Profile(){
    const { profileId } = useParams();
    const [activeTab, setActiveTab] = useState('posts');
    const {user, setUser} = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [file, setFile] = useState(null);
    const [editForm, setEditForm] = useState({
        username: '',
        email: '',
    });
    const [posts, setPosts] = useState([]);
    const [friends, setFriends] = useState([]);
    const [followers, setFollowers] = useState([]);

    const currentUserId = getUserIdFromToken(localStorage.getItem('accessToken'));
    const isOwnProfile = currentUserId === profileId;

    useEffect(() => {
        fetchUserData();
        fetchUserContent();
    }, [profileId]);

    const fetchUserData = async () => {
        try {
            const response = await axiosInstance.get(`/profile/${profileId}`);
            const data = await response.data;
            setUser(data);
            setEditForm({
                username: data.username,
                email: data.email,
                profileImage: data.profileImage
            });
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const fetchUserContent = async () => {
        try {
            const postsRes = await axiosInstance.get(`/profile/${profileId}/posts`)
            setPosts(postsRes.data);
            const friendsRes = await axiosInstance.get(`/profile/${profileId}/friends`)
            setFriends(friendsRes.data)
            const followersRes = await axiosInstance.get(`/profile/${profileId}/followers`)
            setFollowers(followersRes.data);

        } catch (error) {
            console.error('Error fetching user content:', error);
        }
    };

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        // File validation
        const validTypes = [
            // Image types
            "image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp", "image/svg+xml",
        ];

        if (!validTypes.includes(selectedFile.type)) {
            notify('Invalid file type. Please select an proper image.', "error");
            return;
        }

        setFile(selectedFile); // Set the selected file
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const uploadedFileUrl = await uploadFile(file)
            const response = await axiosInstance.put(`/profile/update-profile`, {
                username: editForm.username,
                email: editForm.email,
                profileImage: uploadedFileUrl
            });

            if (response.status === 200) {
                const updatedUser = await response.data;
                setUser(updatedUser);
                setIsEditing(false);
                notify("Profile updated successfully.", "success")
            }
        } catch (error) {
            notify('Error updating profile:', error);
        }
    };

    const renderEditForm = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
                <form onSubmit={handleEditSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Username</label>
                        <input
                            type="text"
                            value={editForm.username}
                            onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            value={editForm.email}
                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Profile Image</label>
                        <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="file_input" type="file" accept=".png, .jpeg, .jpg, .gif, .webp, .svg"  onChange={handleFileSelect} />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2 bg-gray-200 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'posts':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {posts.map(post => (
                            <a href={`/post/${post._id}`} key={post._id} className="border rounded p-4">
                                <p>{post.text}</p>
                                {post.media?.url && (
                                    <div className="mt-2 rounded">
                                        <MediaViewer fileUrl={post.media.url} />
                                    </div>
                                )}
                            </a>
                        ))}
                    </div>
                );
            case 'friends':
                return (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {friends.map(friend => (
                            <a href={`/profile/${friend._id}`} key={friend._id} className="border rounded p-4 text-center">
                                <img
                                    src={friend?.profileImage || '/src/assets/person.png'}
                                    alt={friend?.username}
                                    className="w-20 h-20 rounded-full mx-auto"
                                />
                                <p className="mt-2 font-medium">{friend.username}</p>
                            </a>
                        ))}
                    </div>
                );
            case 'followers':
                return (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {followers.map(follower => (
                            <a href={`/profile/${follower._id}`} key={follower._id} className="border rounded p-4 text-center">
                                <img
                                    src={follower?.profileImage || '/src/assets/person.png'}
                                    alt={follower?.username}
                                    className="w-20 h-20 rounded-full mx-auto"
                                />
                                <p className="mt-2 font-medium">{follower.username}</p>
                            </a>
                        ))}
                    </div>
                );
            default:
                return null;
        }
    };

    if (!user) return <div className="w-screen h-screen flex items-center justify-center">
        <BrokenCirclesLoader loading={true} size={300} />
    </div>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center space-x-6">
                    <img
                        src={user?.profileImage || '/src/assets/person.png'}
                        alt={user?.username}
                        className="w-32 h-32 rounded-full"
                    />
                    <div>
                        <h1 className="text-2xl font-bold">{user.username}</h1>
                        <p className="text-gray-600">{user.email}</p>
                        {isOwnProfile && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="form-button mt-2"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>

                <div className="mt-8 border-b">
                    <div className="flex space-x-4">
                        {['posts', 'friends', 'followers'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-2 px-4 ${
                                    activeTab === tab
                                        ? 'border-b-2 border-blue-500 font-medium'
                                        : 'text-gray-500'
                                }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-6">
                    {renderTabContent()}
                </div>
            </div>
            {isEditing && renderEditForm()}

            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition: Flip
            />
        </div>
    );
};