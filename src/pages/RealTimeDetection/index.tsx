/*
 * @Author: fuzhenghao
 * @Date: 2024-04-29 01:30:11
 * @LastEditTime: 2024-05-06 21:52:10
 * @LastEditors: fuzhenghao
 * @Description:
 * @FilePath: \class_detection_frontend\src\pages\RealTimeDetection\index.tsx
 */
import CameraComponent from '@/components/Camera';
import { WebSocketView } from './ws/ws';

const RealTimeDetectionPage: React.FC = () => {
  return (
    <>
      <CameraComponent></CameraComponent>
      <WebSocketView></WebSocketView>
    </>
  );
};

export default RealTimeDetectionPage;
