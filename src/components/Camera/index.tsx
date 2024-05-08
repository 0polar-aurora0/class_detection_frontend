import React, { useEffect, useRef } from 'react';

function VideoPlayer({ videoData }) {
  const videoRef = useRef(null);
  const mediaSourceRef = useRef(new MediaSource());

  useEffect(() => {
    const videoElement = videoRef.current;
    const mediaSource = mediaSourceRef.current;

    const onDataAvailable = (event) => {
      if (mediaSource.readyState === 'open') {
        const sourceBuffer = mediaSource.addSourceBuffer(
          'video/webm; codecs="vp8"',
        );
        sourceBuffer.appendBuffer(event.data);
      }
    };

    mediaSource.addEventListener('sourceopen', () => {
      console.log('MediaSource readyState:', mediaSource.readyState);
    });

    mediaSource.addEventListener('sourceended', () => {
      console.log('MediaSource ended');
    });

    mediaSource.addEventListener('sourceclose', () => {
      console.log('MediaSource closed');
    });

    if (videoElement && mediaSource.readyState === 'closed') {
      videoElement.src = URL.createObjectURL(mediaSource);
    }

    if (videoData) {
      videoData.on('data', onDataAvailable);
    }

    return () => {
      if (videoData) {
        videoData.off('data', onDataAvailable);
      }
    };
  }, [videoData]);

  return <video ref={videoRef} controls autoPlay />;
}

export default VideoPlayer;
