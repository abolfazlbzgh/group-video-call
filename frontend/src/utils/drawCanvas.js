const drawCanvas = (stream, canvas) => {
  console.log('drawCanvas' , stream , canvas);
    if (!(stream instanceof MediaStream)) {
      console.error('The provided stream is not a MediaStream:', stream);
      return;
    }
  
    const video = document.createElement('video');
    video.srcObject = stream;
    video.onloadedmetadata = () => {
      console.log('drawCanvas onloadedmetadata');
      video.play();
      const ctx = canvas.getContext('2d', { alpha: true });
      const drawFrame = () => {
        if (video.paused || video.ended) return;
  
        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
  
        // Fill with transparent color to clear the canvas
        ctx.fillStyle = 'rgba(0, 0, 0, 0)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
  
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        ctx.restore();
        requestAnimationFrame(drawFrame);
      };
      drawFrame();
    };
  };
  
  export { drawCanvas };
  