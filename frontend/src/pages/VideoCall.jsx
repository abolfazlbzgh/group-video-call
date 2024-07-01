import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { useLocation, useParams } from 'react-router-dom';
import { remove } from '../utils/backgroundRemove';
import { handleSocketEvents } from '../utils/socketHandlers';
import CanvasPeer from '../components/CanvasPeer';
import { useDraggable } from '../hooks/useDraggable';
import { SERVER_PORT } from '../config/config';

const socket = io(`${changeToServerPort(SERVER_PORT)}`);
function changeToServerPort(serverPort) {
    const urlObj = new URL(window.location.origin);
    urlObj.port = serverPort;
    return urlObj.toString();
}
export default function Meeting() {
    const location = useLocation();
    const { roomId } = useParams();
    const queryParams = new URLSearchParams(location.search);
    const bg = queryParams.get('bg');
    const bgVideo = queryParams.get('bgVideo');
    const userVideo = useRef();
    const userCanvasRef = useDraggable(100, 100); 
    const localStream = useRef();
    const peerConnections = useRef({});
    const iceCandidateBuffer = useRef({});
    const [peers, setPeers] = useState([]);

    useEffect(() => {
        const init = async () => {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localStream.current = stream;
            if (userVideo.current) {
                userVideo.current.srcObject = localStream.current;
                userVideo.current.onloadedmetadata = () => {
                    userVideo.current.play();
                    const canvasStream = remove(userVideo.current, userCanvasRef.current, bgVideo, true);

                    localStream.current = canvasStream;
                    socket.emit('join-room', { roomId, username: 'User' + Math.random().toString(36).substring(7) });
                    handleSocketEvents(socket, localStream, peerConnections, iceCandidateBuffer, setPeers);
                };
            }
        };
        init();

        return () => {
            if (localStream.current) {
                localStream.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    return (
        <div
            className="flex justify-center items-center overflow-hidden"
            style={{
                backgroundImage: `url(/Images/${bg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '100vh',
            }}
        >
            <div className="flex w-full flex-wrap p-4">
                <video
                    ref={userVideo}
                    autoPlay
                    playsInline
                    className="w-56 h-56 rounded-full bg-orange-500 border-4 shadow-lg hidden"
                />
                <canvas
                    ref={userCanvasRef}
                    width="224"
                    height="224"
                    className="w-56 h-56 rounded-full shadow-xl"
                ></canvas>

                {peers.map((peer, index) => (
                    <CanvasPeer key={index} peer={peer} index={index} />
                ))}
            </div>
        </div>
    );
}
