import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LiveStreamViewer from './LiveStreamViewer';
import socket from '../../config/socket';
import notify from '../../utils/notify';

export default function LiveStreamPage() {
    const { streamerId } = useParams();
    const [streamData, setStreamData] = useState(null);
    const [isStreamActive, setIsStreamActive] = useState(false);

    useEffect(() => {
        console.log('LiveStreamPage mounted for streamer:', streamerId);

        const initializeStream = () => {
            console.log('Checking stream status...');
            socket.emit('check-stream-status', { streamerId }, (response) => {
                console.log('Stream status response:', response);
                if (response?.isActive) {
                    console.log('Stream is active, setting state...');
                    setIsStreamActive(true);
                    setStreamData(response.streamData);
                } else {
                    console.log('Stream is not active');
                    setIsStreamActive(false);
                }
            });

            // Join stream room
            console.log('Joining stream room...');
            socket.emit('join-stream', { streamerId });
        };

        // Initialize socket event listeners
        socket.on('stream-data', (data) => {
            console.log('Received stream data:', data);
            setStreamData(data);
            setIsStreamActive(true);
        });

        socket.on('stream-ended', () => {
            console.log('Stream ended event received');
            setIsStreamActive(false);
            notify('Stream has ended', 'info');
        });

        // Initial setup
        initializeStream();

        // Cleanup
        return () => {
            console.log('LiveStreamPage unmounting...');
            socket.off('stream-data');
            socket.off('stream-ended');
            socket.emit('leave-stream', { streamerId });
        };
    }, [streamerId]);

    console.log('Current stream state:', { isStreamActive, streamData });

    if (!isStreamActive) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <p className="text-xl text-gray-600">
                    {streamData ? 'Stream has ended' : 'Waiting for stream to start...'}
                </p>
            </div>
        );
    }

    return (
        <div className="container p-4 mx-auto">
            <LiveStreamViewer 
                streamerId={streamerId}
                streamData={streamData}
            />
        </div>
    );
}
