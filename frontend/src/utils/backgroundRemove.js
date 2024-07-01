import { SelfieSegmentation } from '@mediapipe/selfie_segmentation';
import { Camera } from '@mediapipe/camera_utils';

let selfieSegmentation;
let camera;

const initializeSegmentation = (videoElement, canvasElement, onResultsCallback, forceReload = false) => {
    if (forceReload) {
        camera = null;
    }
    if (!selfieSegmentation) {
        selfieSegmentation = new SelfieSegmentation({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`;
            }
        });

        selfieSegmentation.setOptions({
            modelSelection: 1,
            selfieMode: true,
        });

    }
    selfieSegmentation.onResults(onResultsCallback);

    if (!camera) {
        camera = new Camera(videoElement, {
            onFrame: async () => {
                await selfieSegmentation.send({ image: videoElement });
            },
            width: videoElement.videoWidth,
            height: videoElement.videoHeight,
        });
        camera.start();
    }
};

const remove = (videoElement, canvasElement, background, forceReload = false) => {
    const onResultsCallback = results => {
        const canvasCtx = canvasElement.getContext('2d', { alpha: true });
        const width = canvasElement.width;
        const height = canvasElement.height;

        canvasCtx.save();
        canvasCtx.clearRect(0, 0, width, height);

        // Flip the canvas horizontally
        canvasCtx.scale(-1, 1);
        canvasCtx.translate(-width, 0);

        canvasCtx.drawImage(results.segmentationMask, 0, 0, width, height);

        // Only overwrite the pixels that are part of the person
        canvasCtx.globalCompositeOperation = 'source-in';
        // Flip the canvas horizontally back
        canvasCtx.scale(-1, 1);
        canvasCtx.translate(-width, 0);
        canvasCtx.drawImage(videoElement, 0, 0, width, height);

        canvasCtx.globalCompositeOperation = 'destination-atop';
        canvasCtx.fillStyle = background;
        canvasCtx.fillRect(0, 0, width, height);
        canvasCtx.restore();
    };

    initializeSegmentation(videoElement, canvasElement, onResultsCallback, forceReload);

    return canvasElement.captureStream();
};

export { remove };
