import { useRef, useState, useEffect } from 'react';
import notify from '../../utils/notify';
import socketService from '../../config/socket';
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
            // Use existing preview stream
            if (!previewStream) {
                notify("Camera access not available", "error");
                return;
            }
            
            // Maximum quality settings
            const options = {
                mimeType: 'video/webm;codecs=vp8,opus',
                videoBitsPerSecond: 8000000,    // 8 Mbps for high video quality
                audioBitsPerSecond: 320000,     // 320 kbps (studio quality audio)
                bitsPerSecond: 8320000,         // Total bitrate
                audioChannels: 2,               // Stereo audio
                sampleRate: 48000,             // Professional audio sample rate
                videoWidth: 1920,              // Full HD width
                videoHeight: 1080              // Full HD height
            };
            
            mediaRecorderRef.current = new MediaRecorder(previewStream, options);
            
            // Even smaller chunk interval for smoother recording
            const chunkInterval = 250; // 250ms chunks for better quality
            
            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    setRecordedChunks((prev) => [...prev, event.data]);
                    socketService.emit('live-stream-chunk', {
                        chunk: event.data,
                        streamerId: userId,
                    });
                }
            };

            // Start recording with smaller time slices
            startRecording(chunkInterval);
        } catch (err) {
            console.error("Error starting stream:", err);
            notify("Failed to start stream", "error");
        }
    };

    const startRecording = (timeSlice = 500) => {
        console.log('Starting recording with timeSlice:', timeSlice);
        setRecordedChunks([]);
        mediaRecorderRef.current.start(timeSlice);
        setIsRecording(true);
        
        // Update the structure of the emitted data
        const streamData = {
            text: "Started a live stream",
            visibility: 'public'
        };
        
        console.log('Emitting live-stream-start event');
        
        socketService.emit('live-stream-start', {
            streamerId: userId,
            streamData,
            notification: {
                actionType: 'live_stream',
                message: "Started a live stream",
                actorId: userId
            }
        });

        // Create notification through API
        console.log('Creating live stream notification...');
        axiosInstance.post('/notifications/create-live-stream', {
            streamData
        }).catch(error => {
            console.error('Error creating live stream notification:', error);
            notify('Failed to notify users about the stream', 'error');
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
                    socketService.emit('live-stream-end', {
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
        try {
            if (recordedChunks.length === 0) {
                notify("No stream data available to save", "error");
                return;
            }

            // Create a blob with explicit MIME type
            const blob = new Blob(recordedChunks, { 
                type: 'video/webm;codecs=vp8,opus'
            });

            // Create a File object with .webm extension
            const fileName = `${userId}-${Date.now()}-live.webm`;
            const file = new File([blob], fileName, { 
                type: 'video/webm'
            });

            // Upload and create post...
            const mediaUrl = await uploadFile(file);
            
            const postData = {
                text: postText,
                media: {
                    url: mediaUrl,
                    type: 'video'
                },
                feeling,
                visibility
            };

            const response = await axiosInstance.post("/posts", postData);
            notify("Stream saved successfully as a post!", "success");
            setShowSaveModal(false);
            onClose();
        } catch (err) {
            console.error("Error in handleSaveStream:", err);
            notify(err.response?.data?.message || "Error saving stream. Please try again.", "error");
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