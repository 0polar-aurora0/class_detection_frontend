/*
 * @Author: fuzhenghao
 * @Date: 2024-05-06 21:37:30
 * @LastEditTime: 2024-05-09 00:04:27
 * @LastEditors: fuzhenghao
 * @Description:
 * @FilePath: \class_detection_frontend\src\pages\RealTimeDetection\ws\ws.tsx
 */
import { useModel } from '@umijs/max';
import { message } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

const WSServer = 'ws://localhost:7001';

export const WebSocketView = () => {
  const { videoStream } = useModel('videoStream');

  //Public API that will echo messages sent to it back to the client
  const [socketUrl, setSocketUrl] = useState('wss://localhost:7001/');
  const [messageHistory, setMessageHistory] = useState<MessageEvent<any>[]>([]);
  const videoRef = useRef(null);
  const videoRef_Server = useRef(null);
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  function mySetInterval(func: Function, delay: number) {
    // 定义一个闭包函数
    var interval = function () {
      // 执行传入的函数
      func();
      // 递归调用setTimeout
      setTimeout(interval, delay);
    };
    // 启动定时器
    setTimeout(interval, delay);
  }

  const mediaRecordStart = (mediaStream: any) => {
    // 创建一个MediaRecorder实例
    let mediaRecorder = new MediaRecorder(mediaStream, {
      mimeType: 'audio/webm', // 根据你的需求选择合适的MIME类型
    });

    // 创建一个空的ArrayBuffer用来存储数据
    let arrayBufferChunks: BlobPart[] | undefined = [];

    // 监听ondataavailable事件来接收数据
    mediaRecorder.ondataavailable = (event) => {
      arrayBufferChunks.push(event.data);
    };

    // 开始记录
    mediaRecorder.start();

    // 在适当的时候停止记录，合并ArrayBuffer
    mediaRecorder.onstop = () => {
      let blob = new Blob(arrayBufferChunks, { type: mediaRecorder.mimeType });
    };

    // 停止记录，可以在适当的时间点调用
    // mediaRecorder.stop();
  };

  const mediaLoopEmmit = (loopSpace: number) => {
    setInterval(() => {
      // mediaRecordStart();
    }, loopSpace);
  };

  useEffect(() => {
    const getCamera = async () => {
      let mediaDevices = navigator?.mediaDevices;
      if (mediaDevices) {
        let stream = await mediaDevices
          .getUserMedia({
            video: true,
          })
          .then(
            (video) => {
              videoRef.current.srcObject = video;
              console.log('VideoStream get');
              const mediaRecorder = new MediaRecorder(video);

              mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                  sendMessage(event.data);
                }
              };

              mediaRecorder.start(100); // Send data every 100ms
            },
            (error) => {
              console.error('摄像头打开失败:', error);
            },
          );
        console.log({ stream });
      }
    };
    getCamera();
  }, []);

  useEffect(() => {
    try {
      setSocketUrl(WSServer);
    } catch (error: any) {
      message.error(error);
    }
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));
    }
  }, [lastMessage]);

  const handleClickChangeSocketUrl = useCallback(
    () => setSocketUrl('ws://localhost:7001/'),
    [],
  );

  const onDataAvailable = (event) => {
    if (mediaSource.readyState === 'open') {
      const sourceBuffer = mediaSource.addSourceBuffer(
        'video/webm; codecs="vp8"',
      );
      sourceBuffer.appendBuffer(event.data);
    }
  };

  const handleClickSendMessage = useCallback(() => {}, []);

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline width="640" height="480" />
      <Camera
        videoData={() => {
          messageHistory.map((resBuffer) => {});
        }}
      ></Camera>
      <button onClick={handleClickChangeSocketUrl}>
        Click Me to change Socket Url
      </button>
      <button
        onClick={handleClickSendMessage}
        disabled={readyState !== ReadyState.OPEN}
      >
        Click Me to send 'Hello'
      </button>

      <ul>
        {messageHistory.map((message, idx) => (
          <span key={idx}>{message ? message.data : null}</span>
        ))}
      </ul>
    </div>
  );
};
