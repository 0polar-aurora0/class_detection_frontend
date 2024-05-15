/*
 * @Author: wanglinxiang
 * @Date: 2024-05-09 00:49:33
 * @LastEditTime: 2024-05-16 07:36:10
 * @LastEditors: fuzhenghao
 * @Description:
 * @FilePath: \class_detection_frontend\src\pages\RealTimeDetection\ws\ws.tsx
 */
import { Column } from '@ant-design/plots';
import {
  Button,
  Descriptions,
  Divider,
  message,
  Select,
  Space,
  Typography,
} from 'antd';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import styles from './ws.less';
const { Title } = Typography;

var time_start: moment.Moment;
var time_end: moment.Moment;

const CH_names = ['举手', '阅读', '写作', '使用手机', '低头', '靠在桌子上'];

export const WebSocketView = () => {
  let localStream: MediaStream | null = null;
  let ws: WebSocket | null;
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const canvasOneRef = useRef(null);
  const canvasDetectRef = useRef(null);
  let [cameraState, setCameraState] = useState(false);
  let [detectData, setDetectData] = useState<any>();
  var loopCaptureFrameId: string | number | NodeJS.Timeout | undefined;

  // 更新对象属性的方法
  // const handleProPChange = (name: any, value: any) => {
  //   setDetectData({ ...detectData, [name]: value });
  // };

  //获取摄像头权限
  const getCameraPermission = async () => {
    // 获取本地媒体流（摄像头和麦克风）
    let localStream = await navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: false,
      })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        setCameraState(true);
        return stream;
      });
  };

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
      // console.log('Captured frame:', imageData);
      return imageData;
    } catch (error) {
      console.log({ error });
    }
  }

  let detectCanvasDraw = (data: Object) => {
    let canvas = canvasDetectRef.current;
    let context = canvas.getContext('2d');
    let canvasSend = canvasRef.current;

    context.drawImage(canvasSend, 0, 0, 400, 300);
    console.log({ data });

    let imageName = data?.imageName;
    let resultInfo = data?.resultInfo;

    // let resultInfo_obj = Object.fromEntries(resultInfo.entries());

    if (resultInfo && resultInfo?.location_list) {
      // handleProPChange('target_nums', resultInfo.target_nums);

      for (let index = 0; index < resultInfo.location_list.length; index++) {
        let position = resultInfo.location_list[0];
        // 将视频帧绘制到canvas上
        // context.drawImage(video, 0, 0, video.width, video.height);
        context.strokeStyle = 'blue'; // 框线颜色
        context.lineWidth = 2; // 框线宽度
        let x_min = position[0];
        let y_min = position[1];
        let x_max = position[2];
        let y_max = position[3];
        // let left_top = [x_min, y_min];
        // let left_bottom = [x_min, y_max];
        // let right_top = [x_max, y_min];
        // let right_bottom = [x_max, y_max];
        // 绘制一个框

        let width = x_max - x_min;
        let height = y_max - y_min;
        context.beginPath();
        console.log({
          x_min,
          y_min,
          width,
          height,
        });

        // context.moveTo(left_top[0], left_top[1]);
        context.rect(x_min, y_min, x_max - x_min, y_max - y_min); // x, y, 宽度, 高度
        context.closePath();
        context.stroke(); // 绘制框线

        // 设置字体样式
        context.font = '30px Arial';
        context.fillStyle = 'red';

        // 在Canvas上写字
        context.fillText(`${position}`, x_min + width / 2, y_min);
        setDetectData({
          x_min,
          y_min,
          x_max,
          y_max,
          width,
          height,
          target_nums: resultInfo?.target_nums,
          choose_list: resultInfo?.choose_list,
          conf_list: resultInfo?.conf_list[0],
          cls_list: resultInfo?.cls_list[0],
          cls_percents: resultInfo?.cls_percents,
        });
      }
    }

    console.log({ detectData });
  };

  function loopCaptureFrame() {
    let video = videoRef.current;
    let canvas = canvasRef.current;
    let imageData = captureFrame(video, canvas);
    let base64 = imageData?.replace(/^data:image\/\w+;base64,/, '');
    var dataBuffer = Buffer.from(base64, 'base64') || null; //把base64码转成buffer对象，

    if (ws) {
      dataBuffer && ws.send(dataBuffer);
      time_start = moment();
      console.log(time_start.format('YYYY MM DD hh:mm:ss'));
      loopCaptureFrameId = setTimeout(loopCaptureFrame, 3000); // 1000毫秒 = 1秒
    } else {
      message.error('websocket/socket.io/webRTC均未连接');
      clearTimeout(loopCaptureFrameId);
    }
  }

  const startDetect = () => {
    getCameraPermission();
    loopCaptureFrame();
  };

  const closeDetect = () => {
    setCameraState(false);
    clearTimeout(loopCaptureFrameId);
    videoRef.current.srcObject = null;
  };

  let confidence_coefficient_data = () => {
    let list: { type: string; value: any; }[] = [];
    CH_names.map((value, index) => {
      list.push({
        type: value,
        value: detectData?.cls_percents[index] || 0,
      });
    });
    return list
  };

  const config = {
    width: 500,
    height: 300,
    autoFit: true,
    paddingLeft: 0,
    xField: 'type',
    yField: 'value',
    data: confidence_coefficient_data(),
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

  let cameraFunctionButton = () => {
    return !cameraState ? (
      <Button className={styles.upload_component} onClick={startDetect}>
        摄像头实时检测
      </Button>
    ) : (
      <Button className={styles.upload_component} onClick={closeDetect}>
        关闭摄像头实时检测
      </Button>
    );
  };
  let captureFrameShow = () => {
    let video = videoRef.current;
    let canvas = canvasOneRef.current;
    captureFrame(video, canvas);
  };

  let framRateFunctionButton = () => {
    return cameraState ? (
      <Button className={styles.upload_component} onClick={captureFrameShow}>
        实时帧
      </Button>
    ) : null;
  };

  useEffect(() => {
    //进入页面先建立websocket连接
    ws = new WebSocket('ws://localhost:7001');
    ws.onmessage = (event) => {
      console.log('收到服务器消息：', event.data);
      let data = JSON.parse(event.data);
      // console.log({ data });
      time_end = moment();
      console.log(time_end.format('YYYY MM DD hh:mm:ss'));

      // setDetectData(data);
      //启用一帧绘制
      detectCanvasDraw(data);
    };
  }, []);

  // let optionList = () => {
  //   let listInfo: [];
  //   if (detectData?.choose_list) {
  //     detectData?.choose_list.map((value, index)=>{

  //       listInfo.push({value,})
  //     })
  //   }
  //   return listInfo
  // }

  return (
    <div className={styles.container}>
      <Space
        size="large"
        split={
          <Divider style={{ height: '500px', width: '15px' }} type="vertical" />
        }
      >
        <div className={styles.realTime_detection_main}>
          <div className={upload_group_class}>
            {cameraFunctionButton()}
            {framRateFunctionButton()}
          </div>
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
                  {detectData?.target_nums}
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
