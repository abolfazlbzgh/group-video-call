let mediaStream;

export const getMediaStream = async () => {
    console.log('getMediaStream');
    if (!mediaStream) {
        mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    }
    return mediaStream;
};

export const releaseMediaStream = () => {
    console.log('releaseMediaStream');
    if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        mediaStream = null;
    }
};