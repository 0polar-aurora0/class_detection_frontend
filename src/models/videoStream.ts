/*
 * @Author: wanglinxiang
 * @Date: 2024-05-07 01:30:07
 * @LastEditTime: 2024-05-07 01:32:18
 * @LastEditors: wanglinxiang
 * @Description: 
 * @FilePath: \class_detection_frontend\src\models\ws.ts
 */
import { useState } from 'react';

const useVideoStream = () => {
  const [videoStream, setVideoStream] = useState<any>(null);
  return {
    videoStream,
    setVideoStream,
  };
};

export default useVideoStream;
