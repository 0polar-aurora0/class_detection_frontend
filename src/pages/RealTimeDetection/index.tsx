/*
 * @Author: fuzhenghao
 * @Date: 2024-04-29 01:30:11
 * @LastEditTime: 2024-05-07 13:27:06
 * @LastEditors: fuzhenghao
 * @Description:
 * @FilePath: \class_detection_frontend\src\pages\RealTimeDetection\index.tsx
 */
import { Camera } from '@/components/Camera';
import React from 'react';
import { WebSocketView } from './ws/ws';


const RealTimeDetectionPage: React.FC = () => {

  return (
    <>
      
      <WebSocketView></WebSocketView>
    </>
  );
};

export default RealTimeDetectionPage;
