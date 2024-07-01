import React, { useEffect, useRef, useState } from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import { remove } from '../utils/backgroundRemove';
import { getMediaStream } from '../utils/MediaStreamService';
import Button from '../components/Button';

const backgroundColors = ['#DDB9C3', '#C61817', '#9F9F9F', '#ffffff', '#9C0B53', '#712D2C', '#895D30', '#DED4D2', '#D02E00', '#000000'];
const backgroundImages = [
    'url(/Images/bg-1.jpg)',
    'url(/Images/bg-2.jpg)',
    'url(/Images/bg-3.jpg)',
    'url(/Images/bg-4.jpg)',
];
export default function Join() {
    const navigate = useNavigate();
    const { roomId } = useParams();
    const userVideo = useRef();
    const userCanvasRef = useRef();
    const localStream = useRef();
    const [canvasBackground, setCanvasBackground] = useState(backgroundColors[0]);
    const [pageBackground, setPageBackground] = useState(backgroundImages[0]);
    const [selectedColor, setSelectedColor] = useState(backgroundColors[0]);
    const [selectedImage, setSelectedImage] = useState(backgroundImages[0]);

    useEffect(() => {
        createVideo();
    }, [canvasBackground]);
    useEffect(() => {
        return () => {
            // Clean up
            if (localStream.current) {
                localStream.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const createVideo = async () => {
        const stream = await getMediaStream();
        localStream.current = stream;
        if (userVideo.current && localStream.current) {
            userVideo.current.srcObject = localStream.current;
            userVideo.current.onloadedmetadata = () => {
                userVideo.current.play();
                const canvasStream = remove(userVideo.current, userCanvasRef.current, canvasBackground);
                localStream.current = canvasStream;
            };
        }
    };

    const handleColorSelect = (color) => {
        setCanvasBackground(color);
        setSelectedColor(color);
    };
    const startMeeting = () => {
        const imageUrl = selectedImage.split('/').pop().replace(')', ''); // Extract the image file name
        navigate(`/video-call/${roomId}?bg=${imageUrl}&bgVideo=${encodeURIComponent(selectedColor)}`);
    };

    const handleImageSelect = (image) => {
        setPageBackground(image);
        setSelectedImage(image);
    };

    return (
        <div className={`flex justify-center items-center`} style={{ backgroundImage: pageBackground, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh' }}>

            <div className='flex flex-col p-4 bg-white/30 m-4 backdrop-blur-sm rounded-lg shadow-lg gap-4'>

                <div className='flex flex-col w-full justify-center items-center' >
                    <video
                        ref={userVideo}
                        autoPlay
                        playsInline
                        className="w-56 h-56 rounded-full shadow-lg hidden"
                    />
                    <canvas ref={userCanvasRef} width="224" height="224" className="w-56 h-56 rounded-full shadow-xl"></canvas>
                    <div>
                        <h3 className='font-bold text-lg text-black/80 mt-4'>Select Webcam Background:</h3>
                        <div className='flex flex-wrap'>
                            {backgroundColors.map((color, index) => (
                                <div
                                    key={index}
                                    className={`w-10 h-10 m-1 rounded-full cursor-pointer ${selectedColor === color ? 'border-4 border-black/80' : ''}`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => handleColorSelect(color)}
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className='font-bold text-lg text-black/80 mt-4'>Select Page Background:</h3>
                    <div className='flex flex-wrap'>
                        {backgroundImages.map((image, index) => (
                            <div
                                key={index}
                                className={`w-10 h-10 rounded-full bg-cover m-1 cursor-pointer ${selectedImage === image ? 'border-4 border-black/80' : ''}`}
                                style={{ backgroundImage: image }}
                                onClick={() => handleImageSelect(image)}
                            ></div>
                        ))}
                    </div>
                </div>

                <Button
                    title={'Start Meeting'}
                    onClick={startMeeting}
                    disabled={false}
                />
            </div>

        </div>
    )
}
