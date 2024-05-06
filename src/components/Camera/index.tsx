/*
 * @Author: fuzhenghao
 * @Date: 2024-05-06 17:57:26
 * @LastEditTime: 2024-05-06 17:57:46
 * @LastEditors: fuzhenghao
 * @Description: 
 * @FilePath: \class_detection_frontend\src\components\Camera\index.tsx
 */

import React, { useEffect, useRef } from 'react';
 
const CameraComponent = () => {
  const videoRef = useRef(null);
 
  useEffect(() => {
    const getCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
      } catch (error) {
        console.error('Error accessing the camera:', error);
      }
    };
    getCamera();
  }, []);
 
  return (
    <div>
      <video ref={videoRef} autoPlay playsInline width="640" height="480" />
    </div>
  );
};
 
export default CameraComponent;