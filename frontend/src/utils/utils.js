export const createPeerConnection = (stream, socketId, sendIceCandidate, setPeers, username) => {
  const peerConnection = new RTCPeerConnection();

  stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

  peerConnection.onicecandidate = event => {
    if (event.candidate) {
      console.log('Sending ICE candidate to:', socketId);
      sendIceCandidate(event.candidate, socketId);
    }
  };

  peerConnection.ontrack = event => {
    console.log('Received track from:', socketId);
    setPeers(peers => [...peers, { socketId, stream: event.streams[0], username }]);
  };

  return peerConnection;
};

export const handleIceCandidateBuffering = (peerConnection, candidateBuffer) => {
  if (candidateBuffer) {
    candidateBuffer.forEach(async candidate => {
      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    });
  }
};
