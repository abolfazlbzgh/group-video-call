import React, { useRef, useEffect } from 'react';
import { useDraggable } from '../hooks/useDraggable';
import { drawCanvas } from '../utils/drawCanvas';

const getRandomPosition = (width, height) => {
    const padding = 50;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight / 2;
    const x = Math.random() * (screenWidth - width - 2 * padding) + padding;
    const y = Math.random() * (screenHeight - height - 2 * padding) + padding;
    return { x, y };
};

export default function CanvasPeer({ peer, index }) {
    const { x, y } = getRandomPosition(224, 224);
    const canvasRef = useDraggable(x, y);
    console.log('peer => ' , peer);
    console.log('peer username => ' , peer.username);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            drawCanvas(peer.stream, canvas);
        }
    }, [peer.stream, canvasRef]);

    return (
        <canvas
            ref={canvasRef}
            key={index}
            width="224"
            height="224"
            className="w-56 h-56 rounded-full shadow-xl"
        ></canvas>
    );
}
