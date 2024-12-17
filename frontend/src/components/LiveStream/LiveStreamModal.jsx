import { useRef, useState, useEffect } from 'react';
import notify from '../../utils/notify';
import socket from '../../config/socket';
import getUserIdFromToken from '../../utils/getUserIdFromToken';
import SaveStreamModal from './SaveStreamModal';
import axiosInstance from '../../config/axios';
import uploadFile from '../../utils/uploadFile';

export default function LiveStreamModal({ onClose }) {
    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [previewStream, setPreviewStream] = useState(null);
    const userId = getUserIdFromToken(localStorage.getItem("accessToken"));

    const initializePreview = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: true, 
                audio: true 
            });
            videoRef.current.srcObject = stream;
            setPreviewStream(stream);
        } catch (err) {
            console.error("Error accessing camera:", err);
            notify("Failed to access camera/microphone", "error");
        }
    };


    const startStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: true, 
                audio: true 
            });
            videoRef.current.srcObject = stream;
            
            mediaRecorderRef.current = new MediaRecorder(stream);
            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    setRecordedChunks((prev) => [...prev, event.data]);
                    socket.emit('live-stream-chunk', {
                        chunk: event.data,
                        streamerId: userId,
                    });
                }
            };

            // Start recording immediately
            startRecording();
        } catch (err) {
            console.error("Error accessing camera:", err);
            notify("Failed to access camera/microphone", "error");
        }
    };

    const startRecording = () => {
        setRecordedChunks([]);
        mediaRecorderRef.current.start(1000);
        setIsRecording(true);
        
        // Notify users about the stream
        socket.emit('live-stream-start', {
            streamerId: userId,
            streamData: {
                text: "Started a live stream",
                visibility: 'public' // Default to public for live streams
            }
        });

        // Create notification
        axiosInstance.post('/notifications/create-live-stream', {
            streamData: {
                text: "Started a live stream",
                visibility: 'public'
            }
        });
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            return new Promise((resolve) => {
                // Listen for the dataavailable event one last time
                mediaRecorderRef.current.addEventListener('dataavailable', (event) => {
                    if (event.data.size > 0) {
                        setRecordedChunks(prev => [...prev, event.data]);
                    }
                });

                // Listen for the stop event to complete the process
                mediaRecorderRef.current.addEventListener('stop', () => {
                    // Notify viewers that stream has ended
                    socket.emit('live-stream-end', {
                        streamerId: userId
                    });

                    setIsRecording(false);
                    resolve();
                });

                // Stop the recording
                mediaRecorderRef.current.stop();
            });
        }
        return Promise.resolve();
    };

    const handleSaveStream = async ({ postText, visibility, feeling }) => {
        if (recordedChunks.length === 0) return;

        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const fileName = `${userId}-${new Date().toISOString()}-live-stream.webm`;
        const file = new File([blob], fileName, { type: 'video/webm' });

        try {
            const fileUrl = await uploadFile(file);
            
            // Create post with the recorded stream
            await axiosInstance.post("/posts", {
                text: postText,
                media: { 
                    url: fileUrl, 
                    type: "video"
                },
                feeling: feeling,
                postVisibility: visibility
            });

            notify("Stream saved successfully!", "success");
            setShowSaveModal(false);
            onClose();
        } catch (err) {
            console.error("Error saving stream:", err);
            notify("Error saving stream. Please try again.", "error");
        }
    };

    const stopAllTracks = () => {
        // Stop tracks from video element
        if (videoRef.current?.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => {
                track.stop();
                videoRef.current.srcObject.removeTrack(track);
            });
            videoRef.current.srcObject = null;
        }

        // Stop preview stream tracks
        if (previewStream) {
            previewStream.getTracks().forEach(track => {
                track.stop();
                previewStream.removeTrack(track);
            });
            setPreviewStream(null);
        }

        // Stop any remaining tracks
        navigator.mediaDevices.getUserMedia({ audio: true, video: true })
            .then(stream => {
                stream.getTracks().forEach(track => track.stop());
            })
            .catch(() => {});
    };

    const handleSaveClick = async () => {
        try {
            // Stop recording if active
            if (isRecording) {
                await stopRecording();
            }

            // Stop all tracks and camera
            stopAllTracks();

            // Reset recording state
            setIsRecording(false);

            // Show save modal
            setShowSaveModal(true);
        } catch (error) {
            console.error('Error preparing to save stream:', error);
            notify('Error preparing to save stream', 'error');
        }
    };

    const handleModalClose = async () => {
        try {
            // Stop recording if active
            if (isRecording) {
                await stopRecording();
            }

            stopAllTracks();

            // Reset states
            setIsRecording(false);
            setRecordedChunks([]);
            setShowSaveModal(false);

            // Finally, close the modal
            onClose();
        } catch (error) {
            console.error('Error closing stream:', error);
            notify('Error closing stream', 'error');
            onClose();
        }
    };

    // Add to cleanup effect
    useEffect(() => {
        initializePreview()
        return () => {
            if (isRecording) {
                stopRecording();
            }
            stopAllTracks();
            if (mediaRecorderRef.current && isRecording) {
                mediaRecorderRef.current.stop();
            }
        };
    }, []);

    // Add to End Stream button click handler
    const handleEndStream = async () => {
        try {
            await stopRecording();
            stopAllTracks();
            onClose();
        } catch (error) {
            console.error('Error ending stream:', error);
            notify('Error ending stream', 'error');
            onClose();
        }
    };

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="w-full max-w-2xl p-4 bg-white rounded-lg">
                    <div>
                        <div className="flex justify-between mb-4">
                            <h2 className="text-xl font-bold">Live Stream</h2>
                            <button onClick={handleModalClose} className="text-gray-500 hover:text-gray-700">✕</button>
                        </div>
                        
                        <div className="relative">
                            <video 
                                ref={videoRef} 
                                autoPlay 
                                playsInline
                                className="w-full rounded-lg"
                            />
                            {isRecording && (
                                <div className="absolute px-2 py-1 text-white bg-red-500 rounded top-4 left-4">
                                    LIVE
                                </div>
                            )}
                        </div>

                        <div className="flex justify-center gap-4 mt-4">
                            {!isRecording ? (
                                <button
                                    onClick={startStream}
                                    className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
                                >
                                    Go Live
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={handleEndStream}
                                        className="px-4 py-2 text-white bg-gray-500 rounded-lg hover:bg-gray-600"
                                    >
                                        End Stream
                                    </button>
                                    <button
                                        onClick={handleSaveClick}
                                        className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600"
                                    >
                                        Save Stream
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showSaveModal && (
                <SaveStreamModal 
                    onClose={() => {
                        setShowSaveModal(false);
                        handleModalClose();
                    }}
                    onSave={handleSaveStream}
                />
            )}
        </>
    );
}