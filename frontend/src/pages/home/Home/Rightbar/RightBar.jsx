import React, {useEffect, useState} from "react";
import axiosInstance from "../../../../config/axios.js";
import notify from "../../../../utils/notify.js"
import {FillCircleLoader} from "react-loaders-kit";
import socketService from "../../../../config/socket.js";
import getUserIdFromToken from "../../../../utils/getUserIdFromToken.js";

export default function RightBar() {
    const [friendRequests, setFriendRequests] = useState([]);
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);


    const handleFriendRequest = async (userId, accept) => {
        try {
            await axiosInstance.post('social/respond-friend-request', {
                userId,
                accept
            });

            // Update the state to remove the processed friend request
            setFriendRequests((oldFriendRequests) =>
                oldFriendRequests.filter(request => request.actorId._id !== userId)
            );

            notify(`Friend request ${accept ? 'accepted' : 'declined'} successfully`, "success");
        } catch (error) {
            notify('Error responding to friend request: ' + error.message, "error");
        }
    };

    const fetchFriendRequests = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get("social/get-friend-requests")
            setFriendRequests(response.data);
        } catch (err) {
            notify('Failed to fetch friend requests', "error");
        } finally {
            setLoading(false);
        }
    };

    const fetchOnlineFriends = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get("user/get-online-friends")
            setFriends(response.data);
        } catch (err) {
            notify('Failed to fetch friend requests', "error");
        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
        fetchFriendRequests();
        fetchOnlineFriends()

        socketService.on('user-status-change', ({ id, status }) => {
            if(id !== getUserIdFromToken(localStorage.getItem("accessToken")))
            setFriends((prevFriends) => {
                // If the user is online and not in the friends list, fetch them from the backend
                if (status === 'online') {
                    if (!prevFriends.some(friend => friend._id === id)) {
                        // Fetch the online friend from the backend if they are not in the list
                        axiosInstance.get(`/social/get-online-friend`, {
                            friendId: id
                        })
                            .then(response => {
                                setFriends(prev => [...prev, response.data]); // Add to state
                            })
                            .catch(error => {
                                console.log('Error fetching online friend:', error);
                            });
                    }
                } else if (status === 'offline') {
                    // If the user is offline, remove them from the friends list
                    return prevFriends.filter(friend => friend._id !== id);
                }
                return prevFriends;
            });
        });
        socketService.on('notification', (data) =>{
            if(data.notification.actionType === "friend-request")
            fetchFriendRequests();
        });

        return () => {
            socketService.off('user-status-change');
        };
    }, []);

    if (loading) return (
        <div className="h-screen w-[27rem] flex items-center justify-center">
            <FillCircleLoader loading={loading} size={47} />
        </div>
    )


    return (
        <div id="home-rightbar"
             className="h-svh max-h-svh min-[1260px]:w-[27rem] min-[1260px]:block hidden mt-2 bg-[#F0F2F5] pe-8 py-3">
            {(friendRequests && friendRequests.length > 0) &&
            <div className="w-full bg-white p-2 rounded-md shadow-md">
                <h5 className="mb-3 text-lg font-semibold text-gray-500">Friend Requests</h5>
                {friendRequests.map((friendRequest, index) => {
                    return (
                        <div key={index}>
                            <div className="flex items-center space-x-2 w-full">
                                <img className="rounded-full size-12"
                                     src={friendRequest?.actorId?.profileImage || "/src/assets/person.png"}
                                     alt=""/>
                                <p className="font-semibold">{friendRequest.actorId.username}</p>
                            </div>
                            <div className="flex items-center space-x-2 w-full">
                                <button
                                    className="form-button flex-1 text-white hover:text-white bg-green-500 hover:bg-green-600 border-0"
                                    onClick={() => {
                                        handleFriendRequest(friendRequest.actorId._id, true);
                                    }}>Accept
                                </button>
                                <button
                                    className="form-button flex-1 text-white hover:text-white bg-red-500 hover:bg-red-600 border-0"
                                    onClick={() => {
                                        handleFriendRequest(friendRequest.actorId._id, false);
                                    }}>Decline
                                </button>
                            </div>
                            {index!==friendRequests.length-1?<div className="w-full border-t-2 my-2"></div>:null}
                        </div>
                    )
                })}
            </div>
            }

            <div className="my-5"></div>

            {(friends && friends.length > 0) &&
                <div className="bg-white rounded-lg shadow-md p-3">
                    <h5 className="mb-3 text-lg font-semibold text-gray-500">Online Users</h5>
                    <div className="overflow-y-scroll max-h-[41vh]">
                        {friends.map((friend, index) => {
                            return (
                                <div key={index} className="flex items-center px-1 py-2 cursor-pointer hover:bg-white">
                                    <div className="relative">
                                        <img className="rounded-full size-12"
                                             src={friend?.profileImage || "/src/assets/person.png"}
                                             alt=""/>
                                        <span
                                            className="absolute top-0 right-0 w-3 h-3 bg-green-400 rounded-full opacity-75 animate-ping"></span>
                                        <span
                                            className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full"></span>
                                    </div>
                                    <h5 className="text-lg ms-2">{friend.username}</h5>

                                </div>
                            )
                        })}
                    </div>
                </div>
            }
        </div>
    )
}