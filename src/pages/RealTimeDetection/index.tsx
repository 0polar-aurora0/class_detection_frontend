/*
 * @Author: wanglinxiang
 * @Date: 2024-04-29 01:30:11
 * @LastEditTime: 2024-05-15 11:17:41
 * @LastEditors: fuzhenghao
 * @Description:
 * @FilePath: \class_detection_frontend\src\pages\RealTimeDetection\index.tsx
 */
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
