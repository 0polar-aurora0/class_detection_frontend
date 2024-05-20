/*
 * @Author: wanglinxiang
 * @Date: 2024-04-29 01:30:11
 * @LastEditTime: 2024-05-20 14:12:29
 * @LastEditors: fuzhenghao
 * @Description:
 * @FilePath: \class_detection_frontend\src\pages\BlobStaticFileDetection\index.tsx
 */
import { UploadOutlined } from '@ant-design/icons';
import { Column } from '@ant-design/plots';
// import { useModel } from '@umijs/max';
import { names_CN } from '@/config/static';
import { imageDetectUpload } from '@/services/imageController';
import type { UploadProps } from 'antd';
import {
  Button,
  Descriptions,
  Divider,
  Select,
  Space,
  Typography,
  Upload,
} from 'antd';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import styles from './index.less';

const { Title } = Typography;

const BlobStaticFileDetectionPage: React.FC = () => {
  let [resList, setResList] = useState<any>([]);
  let [detectState, setDetectState] = useState(false);
  let [selectValue, SetSelectValue] = useState<number>(0);
  let canvasRef = useRef<any>(null);

  useEffect(() => {
    if (resList.length > 0) {
      console.log('开始绘制图像');
      let { imageName } = resList[0];
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      // 加载本地图片
      const image = new Image();
      let imgSrc = `http://localhost:7001/public/${imageName}`;
      console.log({ imgSrc });
      image.src = imgSrc;
      const drawImage = () => {
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      };

      if (image.complete) {
        drawImage();
      } else {
        image.onload = drawImage;
      }
    }
  }, [resList]);

  let image_props: UploadProps = {
    name: 'file',
    customRequest: async (options) => {
      const { file, onSuccess, onError } = options;

      await imageDetectUpload({ file }).then((result) => {
        console.log({ result });
        if (result.resCode === 10000) {
          onSuccess(result.resMes, file);
          setDetectState(true);
          setResList(result.resultImageLists);
        } else {
          onError(result.resMes, file);
        }
      });

      // let context = canvasRef.current.getContext('2d');
      // let canvasSend = canvasRef.current;
      // context.drawImage(canvasSend, 0, 0, 400, 300);
      // let { imageInfo, detectTargetList, percentList, totalTargetNum } = data;
      // for (let index = 0; index < detectTargetList.length; index++) {
      //   let detectLocalTarget = detectTargetList[index];
      //   // 将视频帧绘制到canvas上
      //   // context.drawImage(video, 0, 0, video.width, video.height);
      //   context.strokeStyle = rectColor[index / 3]; // 框线颜色
      //   context.lineWidth = 2; // 框线宽度
      //   let {
      //     corporation_x_min,
      //     corporation_y_min,
      //     corporation_x_max,
      //     corporation_y_max,
      //     chooseName,
      //     corporationList,
      //   } = detectLocalTarget;
      //   // 绘制一个框
      //   let width = corporation_x_max - corporation_x_min;
      //   let height = corporation_y_max - corporation_y_min;
      //   context.beginPath();
      //   context.rect(corporation_x_min, corporation_y_min, width, height); // x, y, 宽度, 高度
      //   context.closePath();
      //   context.stroke(); // 绘制框线
      //   // 设置字体样式
      //   context.font = '15px Arial';
      //   context.fillStyle = 'red';
      //   // 在Canvas上写字
      //   context.fillText(
      //     `${chooseName}:${corporationList}`,
      //     corporation_x_min,
      //     corporation_y_min,
      //   );
      //   console.log({ width, height });
      // }
    },
    // headers: {
    //   authorization: 'authorization-text',
    // },
  };

  let video_props: UploadProps = {
    name: 'file',
    // action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
    customRequest: async (options) => {
      const { file, onSuccess, onError } = options;
      await imageDetectUpload({ file }).then((result) => {
        console.log({ result });
        if (result.resCode === 10000) {
          onSuccess(result.resMes, file);
          setDetectState(true);
          setResList(result.resultImageLists);
        } else {
          onError(result.resMes, file);
        }
      });
    },
  };

  let upload_group_class = detectState
    ? styles.upload_group_detect
    : styles.upload_group_unDetect;

  let detectInfoShowCompoment = () => {
    if (resList.length < 0) {
      return null;
    }
    if (resList.length === 1) {
      if (resList[0].imageInfo) {
        let showInfo = resList[0].imageInfo;
        let { detectTargetList, percentList, totalTargetNum } = showInfo;
        const config = {
          width: 500,
          height: 300,
          autoFit: true,
          paddingLeft: 0,
          xField: 'type',
          yField: 'value',
          data: percentList,
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
        let selectOption = [{ value: 0, label: '全部' }];
        for (let index = 0; index < detectTargetList.length; index++) {
          const element = detectTargetList[index];
          selectOption.push({
            label: element.chooseName,
            value: index + 1,
          });
        }

        return (
          <>
            <Title level={3}>检测结果</Title>

            <Descriptions title="检测信息">
              <Descriptions.Item
                label="当前选择目标"
                contentStyle={{ marginTop: '-5px' }}
              >
                <Select
                  value={selectValue}
                  // style={{ width: 120 }}
                  // onChange={handleChange}
                  variant="borderless"
                  placeholder="请选择目标"
                  // style={{ flex: 1 }}
                  options={selectOption}
                  onSelect={(value) => {
                    SetSelectValue(value);
                  }}
                />
              </Descriptions.Item>
              <Descriptions.Item label="当前目标总数">
                {totalTargetNum}
              </Descriptions.Item>
              <Descriptions.Item label="检测花费时间">0.06s</Descriptions.Item>
              <Descriptions.Item label="当前检测开始时间">
                {moment().format('YYYY MM DD h:mm:ss')}
              </Descriptions.Item>
              {selectValue === 0 ? null : (
                <>
                  <Descriptions.Item label="目标学号">
                    {showInfo.detectTargetList[selectValue - 1]?.student_id}
                  </Descriptions.Item>
                </>
              )}
            </Descriptions>
            <Descriptions title="置信度比例">
              <Descriptions.Item label="图表">
                <Column {...config} />
              </Descriptions.Item>
              {selectValue === 0 ? null : (
                <>
                  <Descriptions.Item label="最高置信度">
                    {showInfo.detectTargetList[selectValue - 1].confidence}
                  </Descriptions.Item>
                  <Descriptions.Item label="匹配类型">
                    {
                      names_CN[
                        showInfo.detectTargetList[selectValue - 1].type_value
                      ]
                    }
                  </Descriptions.Item>
                </>
              )}
            </Descriptions>
            {selectValue === 0 ? null : (
              <Descriptions title="目标位置">
                <Descriptions.Item label="X轴-左侧">
                  {showInfo.detectTargetList[selectValue - 1].corporation_x_max}
                </Descriptions.Item>
                <Descriptions.Item label="X轴-右侧">
                  {showInfo.detectTargetList[selectValue - 1].corporation_x_min}
                </Descriptions.Item>
                <Descriptions.Item label="Y轴-左侧">
                  {showInfo.detectTargetList[selectValue - 1].corporation_y_max}
                </Descriptions.Item>
                <Descriptions.Item label="Y轴-右侧">
                  {showInfo.detectTargetList[selectValue - 1].corporation_y_min}
                </Descriptions.Item>
              </Descriptions>
            )}
          </>
        );
      } else {
        return <p>未检测到相关信息</p>;
      }
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
        <div className={styles.detection_sourse}>
          <div className={styles.detection_sourse_main}>
            <div className={upload_group_class}>
              <Upload className={styles.upload_component} {...image_props}>
                <Button icon={<UploadOutlined />}>进行图片检测</Button>
              </Upload>
              <Upload className={styles.upload_component} {...video_props}>
                <Button icon={<UploadOutlined />}>进行视频检测</Button>
              </Upload>
            </div>
            {detectState ? (
              <>
                {/* <Image className={styles.imageShow} src={file.url} /> */}
                <canvas
                  className={styles.cameraCanvas}
                  ref={canvasRef}
                  width="400"
                  height="300"
                  // style={{ display: !cameraState ? 'show' : 'none' }}
                  // style={{ display: 'none' }}
                />
              </>
            ) : (
              <div className={styles.imageUnShow}>请选择你要检测的功能</div>
            )}
          </div>
        </div>
        {detectState ? (
          <div className={styles.detection_container}>
            <div className={styles.detection_info}>
              {detectInfoShowCompoment()}
            </div>
          </div>
        ) : null}
      </Space>
    </div>
  );
};

export default BlobStaticFileDetectionPage;
