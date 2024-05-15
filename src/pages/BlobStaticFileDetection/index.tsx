/*
 * @Author: wanglinxiang
 * @Date: 2024-04-29 01:30:11
 * @LastEditTime: 2024-05-15 12:04:23
 * @LastEditors: fuzhenghao
 * @Description:
 * @FilePath: \class_detection_frontend\src\pages\BlobStaticFileDetection\index.tsx
 */
import { confidence_coefficient_data } from '@/mock/detection_function';
import { UploadOutlined } from '@ant-design/icons';
import { Column } from '@ant-design/plots';
// import { useModel } from '@umijs/max';
import type { UploadProps } from 'antd';
import {
  Button,
  Descriptions,
  Divider,
  Image,
  message,
  Select,
  Space,
  Typography,
  Upload,
} from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import styles from './index.less';

const { Title } = Typography;

const BlobStaticFileDetectionPage: React.FC = () => {

  let [detectState, setDetectState] = useState(false);
  
  let props: UploadProps = {
    name: 'file',
    action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      setDetectState(true)
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const config = {
    width: 500,
    height: 300,
    autoFit: true,
    paddingLeft: 0,
    xField: 'type',
    yField: 'value',
    data: confidence_coefficient_data,
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



  let upload_group_class = detectState
    ? styles.upload_group_detect
    : styles.upload_group_unDetect;

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
              <Upload className={styles.upload_component} {...props}>
                <Button icon={<UploadOutlined />}>进行图片检测</Button>
              </Upload>
              <Upload className={styles.upload_component} {...props}>
                <Button icon={<UploadOutlined />}>进行视频检测</Button>
              </Upload>
            </div>
            {detectState ? (
              <Image
                className={styles.imageShow}
                src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
              />
            ) : (
              <div className={styles.imageUnShow}>请选择你要检测的功能</div>
            )}
          </div>
        </div>
        {detectState ? (
          <div className={styles.detection_container}>
            <div className={styles.detection_info}>
              <Title level={3}>检测结果</Title>
              <Descriptions title="检测信息">
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
                    options={[
                      { value: 0, label: '全部' },
                      { value: 1, label: '小明' },
                      { value: 2, label: '小张' },
                      { value: 3, label: '小李', disabled: true },
                    ]}
                  />
                </Descriptions.Item>
                <Descriptions.Item label="目标学号">未注册</Descriptions.Item>
                <Descriptions.Item label="检测花费时间">
                  0.06s
                </Descriptions.Item>
                <Descriptions.Item label="当前检测开始时间">
                  {moment().format('YYYY MM DD h:mm:ss')}
                </Descriptions.Item>
              </Descriptions>
              <Descriptions title="置信度比例">
                <Descriptions.Item label="图表">
                  <Column {...config} />
                </Descriptions.Item>
                <Descriptions.Item label="最高置信度">65%</Descriptions.Item>
                <Descriptions.Item label="匹配类型">玩手机</Descriptions.Item>
              </Descriptions>
              <Descriptions title="目标位置">
                <Descriptions.Item label="X轴-左侧">122</Descriptions.Item>
                <Descriptions.Item label="X轴-右侧">156</Descriptions.Item>
                <Descriptions.Item label="Y轴-左侧">228</Descriptions.Item>
                <Descriptions.Item label="Y轴-右侧">289</Descriptions.Item>
              </Descriptions>
            </div>
          </div>
        ) : null}
      </Space>
    </div>
  );
};

export default BlobStaticFileDetectionPage;
