import { createPeerConnection, handleIceCandidateBuffering } from './utils';

export const handleSocketEvents = (socket, localStream, peerConnections, iceCandidateBuffer, setPeers) => {
  socket.on('user-connected', async ({ socketId, username }) => {
    console.log('User connected:', socketId);

    if (peerConnections.current[socketId]) return;

    const peerConnection = createPeerConnection(
      localStream.current,
      socketId,
      (candidate, to) => {
        socket.emit('send-ice-candidate', { candidate, to });
      },
      setPeers,
      username
    );

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    socket.emit('send-offer', { offer, to: socketId });

    peerConnections.current[socketId] = peerConnection;
    console.log('Offer sent to:', socketId);

    // Process buffered ICE candidates
    handleIceCandidateBuffering(peerConnection, iceCandidateBuffer.current[socketId]);
    delete iceCandidateBuffer.current[socketId];
  });

  socket.on('receive-offer', async ({ offer, from, username }) => {
    console.log('Received offer from:', from);

    if (peerConnections.current[from]) return;

    const peerConnection = createPeerConnection(
      localStream.current,
      from,
      (candidate, to) => {
        socket.emit('send-ice-candidate', { candidate, to });
      },
      setPeers,
      username
    );

    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    socket.emit('send-answer', { answer, to: from });

    peerConnections.current[from] = peerConnection;
    console.log('Answer sent to:', from);

    // Process buffered ICE candidates
    handleIceCandidateBuffering(peerConnection, iceCandidateBuffer.current[from]);
    delete iceCandidateBuffer.current[from];
  });

  socket.on('receive-answer', async ({ answer, from }) => {
    console.log('Received answer from:', from);

    const peerConnection = peerConnections.current[from];
    if (peerConnection) {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      console.log('Remote description set for:', from);
    } else {
      console.warn('Peer connection not found for:', from);
    }
  });

  socket.on('receive-ice-candidate', async ({ candidate, from }) => {
    console.log('Received ICE candidate from:', from);

    const peerConnection = peerConnections.current[from];
    if (peerConnection) {
      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      console.log('ICE candidate added for:', from);
    } else {
      console.warn('Peer connection not found for:', from);
      if (!iceCandidateBuffer.current[from]) {
        iceCandidateBuffer.current[from] = [];
      }
      iceCandidateBuffer.current[from].push(candidate);
      console.log('ICE candidate buffered for:', from);
    }
  });

  socket.on('user-disconnected', socketId => {
    console.log('User disconnected:', socketId);

    setPeers(peers => peers.filter(peer => peer.socketId !== socketId));

    const peerConnection = peerConnections.current[socketId];
    if (peerConnection) {
      peerConnection.close();
      console.log('Peer connection closed for:', socketId);
    }

    delete peerConnections.current[socketId];
  });
};
