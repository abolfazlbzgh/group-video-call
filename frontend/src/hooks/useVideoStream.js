import { useEffect, useRef } from 'react';

const useVideoStream = (stream) => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current && stream) {
            console.log('Setting video stream:', stream);

            videoRef.current.srcObject = stream;

            const playVideo = () => {
                if (videoRef.current) {
                    console.log('Attempting to play video:', videoRef.current);
                    videoRef.current.play().then(() => {
                        console.log('Video is playing');
                    }).catch((error) => {
                        console.error('Error attempting to play video:', error);
                    });
                }
            };

            const handleLoadedMetadata = () => {
                console.log('Metadata loaded for video:', videoRef.current);
                playVideo();
            };

            const handleCanPlay = () => {
                console.log('Video can play:', videoRef.current);
                playVideo();
            };

            const handleError = (error) => {
                console.error('Video error:', error);
            };

            // Try to play video directly after setting srcObject
            playVideo();

            // Add event listeners
            videoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
            videoRef.current.addEventListener('canplay', handleCanPlay);
            videoRef.current.addEventListener('error', handleError);

            // Clean up event listeners
            return () => {
                if (videoRef.current) {
                    videoRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
                    videoRef.current.removeEventListener('canplay', handleCanPlay);
                    videoRef.current.removeEventListener('error', handleError);
                }
            };
        } else {
            console.warn('Video ref or stream is not available:', videoRef.current, stream);
        }
    }, [stream]);

    return videoRef;
};

export default useVideoStream;
