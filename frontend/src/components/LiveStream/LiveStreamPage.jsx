import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LiveStreamViewer from './LiveStreamViewer';
import socket from '../../config/socket';

export default function LiveStreamPage() {
    const { streamerId } = useParams();
    const [streamData, setStreamData] = useState(null);

    useEffect(() => {
        socket.on('stream-data', (data) => {
            setStreamData(data);
        });

        // Join stream room
        socket.emit('join-stream', { streamerId });

        return () => {
            socket.off('stream-data');
            socket.emit('leave-stream', { streamerId });
        };
    }, [streamerId]);

    if (!streamData) {
        return <div>Loading stream...</div>;
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
