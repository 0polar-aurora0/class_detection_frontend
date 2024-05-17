/*
 * @Author: wanglinxiang
 * @Date: 2024-05-09 00:49:33
 * @LastEditTime: 2024-05-18 01:58:56
 * @LastEditors: fuzhenghao
 * @Description:
 * @FilePath: \class_detection_frontend\src\pages\RealTimeDetection\ws\ws.tsx
 */
import {
  defalut_camera_close_success,
  defalut_camera_open_success,
  defalut_close_ws_success,
  defalut_connection_connect_close_info,
  defalut_connection_connect_noconnect_info,
  defalut_connection_connect_success_info,
  defalut_wsServer,
} from '@/config/static';
import { TDetectData } from '@/interface';
import { Column } from '@ant-design/plots';
import {
  Button,
  Descriptions,
  Divider,
  Select,
  Space,
  Typography,
  message,
} from 'antd';
import moment from 'moment';
import React, { useCallback, useRef, useState } from 'react';
import styles from './ws.less';
const { Title } = Typography;

var time_start: moment.Moment;
var time_end: moment.Moment;

const CH_names = ['举手', '阅读', '写作', '使用手机', '低头', '靠在桌子上'];
const rectColor = ['blue', 'yellow', 'red'];

export const WebSocketView = () => {
  var loopCaptureFrameId: string | number | NodeJS.Timeout | undefined;
  let localStream: MediaStream | null = null;
  const videoRef: any = useRef(null);
  const canvasRef: any = useRef(null);
  const canvasOneRef: any = useRef(null);
  const canvasDetectRef: any = useRef(null);
  let [cameraState, setCameraState] = useState(false);
  let [detectData, setDetectData] = useState<any>({});
  let [ws, setws] = useState<WebSocket | null>(null);
  let [wsState, setwsState] = useState<number>(0);

  /**
   * @description: 截取并返回视频帧
   * @return {*}
   */
  function captureFrame(video: any, canvas: any) {
    try {
      let context = canvas.getContext('2d');

      // 将视频帧绘制到canvas上
      // context.drawImage(video, 0, 0, video.width, video.height);
      context.drawImage(video, 0, 0, 400, 300);

      // 获取canvas中的图像数据
      let imageData = canvas.toDataURL('image/jpeg');
      return imageData;
    } catch (error) {
      console.log({ error });
    }
  }

  let detectCanvasDraw = (data: TDetectData) => {
    let canvas = canvasDetectRef.current;
    let context = canvas.getContext('2d');
    let canvasSend = canvasRef.current;

    context.drawImage(canvasSend, 0, 0, 400, 300);
    let { imageInfo, detectTargetList, percentList, totalTargetNum } = data;

    for (let index = 0; index < detectTargetList.length; index++) {
      let detectLocalTarget = detectTargetList[index];
      // 将视频帧绘制到canvas上
      // context.drawImage(video, 0, 0, video.width, video.height);
      context.strokeStyle = rectColor[index / 3]; // 框线颜色
      context.lineWidth = 2; // 框线宽度

      let {
        corporation_x_min,
        corporation_y_min,
        corporation_x_max,
        corporation_y_max,
        chooseName,
        corporationList,
      } = detectLocalTarget;
      // 绘制一个框
      let width = corporation_x_max - corporation_x_min;
      let height = corporation_y_max - corporation_y_min;
      context.beginPath();
      context.rect(corporation_x_min, corporation_y_min, width, height); // x, y, 宽度, 高度
      context.closePath();
      context.stroke(); // 绘制框线
      // 设置字体样式
      context.font = '15px Arial';
      context.fillStyle = 'red';
      // 在Canvas上写字
      context.fillText(
        `${chooseName}:${corporationList}`,
        corporation_x_min,
        corporation_y_min,
      );
      console.log({ width, height });
    }
  };

  function loopCaptureFrame() {
    let video = videoRef.current;
    let canvas = canvasRef.current;
    let imageData = captureFrame(video, canvas);
    let base64 = imageData?.replace(/^data:image\/\w+;base64,/, '');
    let dataBuffer = (base64 && Buffer.from(base64, 'base64')) || null; //把base64码转成buffer对象，

    if (ws) {
      dataBuffer && ws.send(dataBuffer);
      time_start = moment();
      console.log(time_start.format('YYYY MM DD hh:mm:ss'));
      loopCaptureFrameId = setTimeout(loopCaptureFrame, 3000); // 1000毫秒 = 1秒
    } else {
      message.error(defalut_connection_connect_noconnect_info);
      clearTimeout(loopCaptureFrameId);
    }
  }

  const openCamera = async () => {
    // 获取本地媒体流（摄像头和麦克风）
    let localStream = await navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: false,
      })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        setCameraState(true);
        message.success(defalut_camera_open_success);
        return stream;
      });
  };

  let connectWSserver = () => {
    let ws = new WebSocket(defalut_wsServer);

    //ws连接监听
    ws.onopen = () => {
      message.success(defalut_connection_connect_success_info);
      setwsState(1);
    };
    //ws消息监听
    ws.onmessage = (event) => {
      // console.log('收到服务器消息：', event.data);
      let data = JSON.parse(event.data);
      console.log({ data });
      time_end = moment();
      let newDetctData = Object.assign(data, detectData);
      detectCanvasDraw(data); //启用帧绘制
      setDetectData(newDetctData);
    };
    //ws关闭监听
    ws.onclose = () => {
      message.info(defalut_connection_connect_close_info);
      setwsState(0);
    };

    setws(ws);
  };

  const closeCamera = () => {
    setCameraState(false);
    message.success(defalut_camera_close_success);
    clearTimeout(loopCaptureFrameId);
    videoRef.current.srcObject = null;
    closeWSserver();
    let canvas_canvasOneRef = canvasOneRef.current;
    let canvas_canvasRef = canvasRef.current;
    if (canvas_canvasOneRef) {
      clearCanvas(canvas_canvasOneRef);
    }
    if (canvas_canvasRef) {
      clearCanvas(canvas_canvasRef);
    }
  };

  // 清空Canvas元素的函数
  const clearCanvas = (canvas) => {
    const context = canvas.getContext('2d');
    if (context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  /**
   * @description: 关闭ws服务器
   * @return {*}
   */
  let closeWSserver = () => {
    ws?.close(1000, '关闭连接');
    message.info(defalut_close_ws_success);
    let canvas = canvasDetectRef.current;
    if (canvas) {
      clearCanvas(canvas);
    }
  };

  const config = {
    width: 500,
    height: 300,
    autoFit: true,
    paddingLeft: 0,
    xField: 'type',
    yField: 'value',
    data: detectData.percentList || [],
    // legend: false,
    // percent: true,
    style: {
      fill: ({ type }) => {
        if (type === '10-30分' || type === '30+分') {
          return '#22CBCC';
        }
        return '#2989FF';
      },
    },
    label: {
      text: (originData: { value: string }) => {
        const val = parseFloat(originData.value);
        if (val < 1) {
          return (val * 100).toFixed(1) + '%';
        }
        return '';
      },
      offset: 10,
    },
  };

  let upload_group_class = cameraState
    ? styles.upload_group_detect
    : styles.upload_group_unDetect;

  let buttonListShow = useCallback(() => {
    return !cameraState ? (
      <Button className={styles.upload_component} onClick={openCamera}>
        打开摄像头
      </Button>
    ) : (
      <>
        <Button className={styles.upload_component} onClick={closeCamera}>
          关闭摄像头
        </Button>
        {wsState === 1 ? (
          <Button className={styles.upload_component} onClick={closeWSserver}>
            关闭远程websocket服务器
          </Button>
        ) : (
          <Button className={styles.upload_component} onClick={connectWSserver}>
            连接远程websocket服务器
          </Button>
        )}
        <Button className={styles.upload_component} onClick={captureFrameShow}>
          获取实时帧
        </Button>
        <Button
          className={styles.upload_component}
          onClick={captureFrameLoopShow}
        >
          循环捕捉实时帧
        </Button>
      </>
    );
  }, [ws, cameraState, wsState]);

  let captureFrameShow = () => {
    let video = videoRef.current;
    let canvas = canvasOneRef.current;
    captureFrame(video, canvas);
    console.log({ detectData });
  };

  let captureFrameLoopShow = () => {
    if (ws?.readyState) {
      loopCaptureFrame();
    } else {
      message.error(defalut_connection_connect_noconnect_info);
    }
  };

  return (
    <div className={styles.container}>
      <Space
        size="large"
        split={
          <Divider style={{ height: '500px', width: '15px' }} type="vertical" />
        }
      >
        <div className={styles.realTime_detection_main}>
          <div className={upload_group_class}>{buttonListShow()}</div>
          <div className={styles.show}>
            <video
              className={styles.cameraVideo}
              ref={videoRef}
              width="400"
              height="300"
              autoPlay
              // style={{ display: !cameraState ? 'show' : 'none' }}
              playsInline
            />
            <canvas
              className={styles.cameraCanvas}
              ref={canvasRef}
              width="400"
              height="300"
              // style={{ display: !cameraState ? 'show' : 'none' }}
              // style={{ display: 'none' }}
            />
            <canvas
              className={styles.cameraCanvas}
              ref={canvasOneRef}
              width="400"
              height="300"
              // style={{ display: !cameraState ? 'show' : 'none' }}
              // style={{ display: 'none' }}
            />
            <canvas
              className={styles.cameraCanvas}
              ref={canvasDetectRef}
              width="400"
              height="300"
              // style={{ display: !cameraState ? 'show' : 'none' }}
              // style={{ display: 'none' }}
            />
          </div>
        </div>
        {cameraState ? (
          <div className={styles.detection_container}>
            <div className={styles.detection_info}>
              <Title level={3}>检测结果</Title>
              <Descriptions title="检测信息">
                <Descriptions.Item label="当前目标总数">
                  {detectData.totalTargetNum}
                </Descriptions.Item>
                <Descriptions.Item
                  label="当前选择目标"
                  contentStyle={{ marginTop: '-5px' }}
                >
                  <Select
                    // defaultValue="lucy"
                    // style={{ width: 120 }}
                    // onChange={handleChange}
                    variant="borderless"
                    placeholder="请选择目标"
                    // style={{ flex: 1 }}
                    options={
                      detectData?.choose_list
                        ? detectData?.choose_list.map(
                            (value: any, index: any) => {
                              return { value: index, label: value };
                            },
                          )
                        : []
                    }
                  />
                </Descriptions.Item>
                <Descriptions.Item label="目标学号">未注册</Descriptions.Item>
                <Descriptions.Item label="检测花费时间">
                  {time_start && time_end
                    ? `${moment
                        .duration(time_end.diff(time_start))
                        .asMilliseconds()}ms`
                    : ''}
                </Descriptions.Item>
                <Descriptions.Item label="当前检测开始时间">
                  {time_start?.format('YYYY MM DD hh:mm:ss')}
                </Descriptions.Item>
              </Descriptions>
              <Descriptions title="置信度比例">
                <Descriptions.Item label="图表">
                  <Column {...config} />
                </Descriptions.Item>
                <Descriptions.Item label="最高置信度">
                  {detectData?.conf_list}
                </Descriptions.Item>
                <Descriptions.Item label="匹配类型">
                  {CH_names[detectData?.cls_list] || ''}
                </Descriptions.Item>
              </Descriptions>
              <Descriptions title="目标位置">
                <Descriptions.Item label="X轴-左侧">
                  {detectData?.x_min}
                </Descriptions.Item>
                <Descriptions.Item label="X轴-右侧">
                  {detectData?.x_max}
                </Descriptions.Item>
                <Descriptions.Item label="Y轴-左侧">
                  {detectData?.y_min}
                </Descriptions.Item>
                <Descriptions.Item label="Y轴-右侧">
                  {detectData?.y_max}
                </Descriptions.Item>
              </Descriptions>
            </div>
          </div>
        ) : null}
      </Space>
    </div>
  );
};
