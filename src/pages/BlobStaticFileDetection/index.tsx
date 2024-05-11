/*
 * @Author: fuzhenghao
 * @Date: 2024-04-29 01:30:11
 * @LastEditTime: 2024-05-12 03:02:52
 * @LastEditors: fuzhenghao
 * @Description:
 * @FilePath: \class_detection_frontend\src\pages\BlobStaticFileDetection\index.tsx
 */
import { confidence_coefficient_data } from '@/mock/detection_function';
import { Column } from '@ant-design/plots';
import { useModel } from '@umijs/max';
import { Descriptions, Divider, Image, Select, Space, Typography } from 'antd';
import moment from 'moment';
import React from 'react';
import styles from './index.less';

const { Title } = Typography;

const BlobStaticFileDetectionPage: React.FC = () => {
  const { name } = useModel('global');
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

  return (
    <div className={styles.container}>
      <Space
        size="large"
        split={
          <Divider style={{ height: '500px', width: '15px' }} type="vertical" />
        }
      >
        <div className={styles.detection_sourse}>
          <Image
            width={900}
            height={500}
            src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
          />
        </div>
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
              <Descriptions.Item label="检测花费时间">0.06s</Descriptions.Item>
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
      </Space>
    </div>
  );
};

export default BlobStaticFileDetectionPage;
