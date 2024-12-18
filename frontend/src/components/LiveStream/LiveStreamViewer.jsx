import { useEffect, useRef, useState } from 'react';
import socket from '../../config/socket';
import notify from '../../utils/notify';

export default function LiveStreamViewer({ streamerId, streamData }) {
    const videoRef = useRef(null);
    const mediaSourceRef = useRef(null);
    const sourceBufferRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    const queuedChunks = useRef([]);
    const isProcessing = useRef(false);
    const isSourceBufferActive = useRef(false);

    const processQueue = async () => {
        if (isProcessing.current || 
            queuedChunks.current.length === 0 || 
            !sourceBufferRef.current ||
            !isSourceBufferActive.current) {
            return;
        }

        isProcessing.current = true;

        try {
            while (queuedChunks.current.length > 0 && 
                   sourceBufferRef.current && 
                   !sourceBufferRef.current.updating && 
                   isSourceBufferActive.current) {
                const chunk = queuedChunks.current.shift();
                if (chunk instanceof Blob) {
                    const arrayBuffer = await chunk.arrayBuffer();
                    sourceBufferRef.current.appendBuffer(arrayBuffer);
                    await new Promise(resolve => {
                        const handleUpdate = () => {
                            sourceBufferRef.current?.removeEventListener('updateend', handleUpdate);
                            resolve();
                        };
                        sourceBufferRef.current?.addEventListener('updateend', handleUpdate);
                    });
                }
            }
        } catch (error) {
            if (error.name !== 'InvalidStateError') {
                console.error('Error processing video chunk:', error);
            }
        } finally {
            isProcessing.current = false;
            // Check if there are more chunks to process
            if (queuedChunks.current.length > 0 && isSourceBufferActive.current) {
                processQueue();
            }
        }
    };

    const initializeMediaSource = () => {
        console.log('Initializing MediaSource');
        if (mediaSourceRef.current) {
            URL.revokeObjectURL(videoRef.current.src);
        }

        mediaSourceRef.current = new MediaSource();
        videoRef.current.src = URL.createObjectURL(mediaSourceRef.current);

        mediaSourceRef.current.addEventListener('sourceopen', () => {
            console.log('MediaSource opened');
            try {
                if (!sourceBufferRef.current && mediaSourceRef.current.readyState === 'open') {
                    sourceBufferRef.current = mediaSourceRef.current.addSourceBuffer('video/webm; codecs="vp8,opus"');
                    isSourceBufferActive.current = true;
                    setIsConnected(true);

                    sourceBufferRef.current.addEventListener('error', (e) => {
                        console.error('SourceBuffer error:', e);
                        isSourceBufferActive.current = false;
                    });

                    // Process any chunks that arrived before initialization
                    processQueue();
                }
            } catch (error) {
                console.error('Error setting up SourceBuffer:', error);
                notify('Error initializing video player', 'error');
            }
        });
    };

    useEffect(() => {
        initializeMediaSource();

        const handleStreamChunk = ({ chunk }) => {
            if (!chunk || !isSourceBufferActive.current) return;

            try {
                // Ensure chunk is a Blob
                const blobChunk = chunk instanceof Blob ? chunk : new Blob([chunk], { type: 'video/webm' });
                queuedChunks.current.push(blobChunk);
                
                if (!isProcessing.current) {
                    processQueue();
                }
            } catch (error) {
                console.error('Error handling stream chunk:', error);
            }
        };

        socket.on('stream-chunk', handleStreamChunk);

        return () => {
            socket.off('stream-chunk');
            isSourceBufferActive.current = false;
            
            if (sourceBufferRef.current && mediaSourceRef.current?.readyState === 'open') {
                try {
                    mediaSourceRef.current.removeSourceBuffer(sourceBufferRef.current);
                } catch (error) {
                    console.warn('Error removing source buffer:', error);
                }
            }
            
            if (mediaSourceRef.current?.readyState === 'open') {
                try {
                    mediaSourceRef.current.endOfStream();
                } catch (error) {
                    console.warn('Error ending media source stream:', error);
                }
            }

            if (videoRef.current) {
                videoRef.current.src = '';
                URL.revokeObjectURL(videoRef.current.src);
            }
        };
    }, [streamerId]);

    return (
        <div className="relative w-full">
            <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                controls
                className="w-full rounded-lg"
            />
            {isConnected && (
                <div className="absolute px-2 py-1 text-white bg-red-500 rounded top-4 left-4">
                    LIVE
                </div>
            )}
        </div>
    );
} 