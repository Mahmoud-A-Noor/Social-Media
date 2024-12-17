import React, { createContext, useContext, useState } from 'react';

const LiveStreamContext = createContext();

export const useLiveStreamContext = () => {
    return useContext(LiveStreamContext);
};

export const LiveStreamProvider = ({ children }) => {
    const [liveStreamText, setLiveStreamText] = useState('');
    const [streamVisibility, setStreamVisibility] = useState('public');
    const [streamFeeling, setStreamFeeling] = useState(null);
    const [isReactionsVisible, setIsReactionsVisible] = useState(false);

    const value = {
        liveStreamText,
        setLiveStreamText,
        streamVisibility,
        setStreamVisibility,
        streamFeeling,
        setStreamFeeling,
        isReactionsVisible,
        setIsReactionsVisible,
    };

    return (
        <LiveStreamContext.Provider value={value}>
            {children}
        </LiveStreamContext.Provider>
    );
}; 