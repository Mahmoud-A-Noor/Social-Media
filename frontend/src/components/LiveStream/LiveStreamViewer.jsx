import { useEffect, useRef, useState } from 'react';
import socket from '../../config/socket';

export default function LiveStreamViewer({ streamerId, streamData }) {
    const videoRef = useRef(null);
    const mediaSourceRef = useRef(null);
    const sourceBufferRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Setup MediaSource
        mediaSourceRef.current = new MediaSource();
        videoRef.current.src = URL.createObjectURL(mediaSourceRef.current);

        mediaSourceRef.current.addEventListener('sourceopen', () => {
            sourceBufferRef.current = mediaSourceRef.current.addSourceBuffer('video/webm; codecs="vp8,opus"');
            setIsConnected(true);
            
            // Join stream room
            socket.emit('join-stream', { streamerId });
        });

        // Handle incoming stream chunks
        socket.on('stream-chunk', ({ chunk }) => {
            if (sourceBufferRef.current && !sourceBufferRef.current.updating) {
                const reader = new FileReader();
                reader.onload = function() {
                    sourceBufferRef.current.appendBuffer(this.result);
                };
                reader.readAsArrayBuffer(chunk);
            }
        });

        // Handle stream end
        socket.on('stream-ended', () => {
            setIsConnected(false);
            // Clean up and show stream ended message
            if (videoRef.current?.srcObject) {
                videoRef.current.srcObject = null;
            }
            notify("Stream has ended", "info");
        });

        return () => {
            socket.off('stream-chunk');
            socket.off('stream-ended');
            socket.emit('leave-stream', { streamerId });
            
            if (videoRef.current?.srcObject) {
                videoRef.current.srcObject = null;
            }
        };
    }, [streamerId]);

    return (
        <div className="relative">
            <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg" />
            {isConnected && (
                <div className="absolute px-2 py-1 text-white bg-red-500 rounded top-4 left-4">
                    LIVE
                </div>
            )}
            <div className="p-4">
                <h3 className="font-bold">{streamData.text}</h3>
                {streamData.feeling && (
                    <p className="text-gray-600">Feeling: {streamData.feeling}</p>
                )}
            </div>
        </div>
    );
} 