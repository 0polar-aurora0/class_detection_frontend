/*
 * @Author: fuzhenghao
 * @Date: 2024-05-09 00:49:33
 * @LastEditTime: 2024-05-13 12:10:42
 * @LastEditors: fuzhenghao
 * @Description:
 * @FilePath: \class_detection_frontend\src\pages\RealTimeDetection\ws\ws.tsx
 */
import React, { useEffect, useRef } from 'react';

export const WebSocketView = () => {
  const videoRef = useRef();
  let localStream: MediaStream;

  useEffect(() => {
    const startWebRTC = async () => {
      try {
        // 获取本地媒体流（摄像头和麦克风）
        localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });

        // 在本地视频元素中显示本地流
        videoRef.current.srcObject = localStream;

        // 创建Peer Connection
        const peerConnection = new RTCPeerConnection();

        // 将本地流添加到Peer Connection
        localStream
          .getTracks()
          .forEach((track) => peerConnection.addTrack(track, localStream));

        // 处理远程流
        peerConnection.ontrack = (event) => {
          // 将远程视频流添加到远程视频元素中
          videoRef.current.srcObject = event.streams[0];
        };

        // 建立连接
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        // 发送offer到服务器
        const offerData = {
          type: 'offer',
          sdp: peerConnection.localDescription,
        };
        const response = await fetch('http://localhost:7001/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(offerData),
        });

        const { answer } = await response.json();
        await peerConnection.setRemoteDescription(answer);
      } catch (error) {
        console.error('Error starting WebRTC:', error);
      }
    };

    startWebRTC();

    // return () => {
    //   // 关闭媒体流
    //   localStream.getTracks().forEach((track) => track.stop());
    // };
  }, []);

  return <video ref={videoRef} autoPlay playsInline />;
};
