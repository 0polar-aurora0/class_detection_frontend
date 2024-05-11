import { DescriptionsProps } from 'antd';

/*
 * @Author: fuzhenghao
 * @Date: 2024-05-11 23:44:09
 * @LastEditTime: 2024-05-12 01:29:19
 * @LastEditors: fuzhenghao
 * @Description:
 * @FilePath: \class_detection_frontend\src\mock\detection_function.ts
 */
export const confidence_coefficient_data = [
  { type: '玩手机', value: 0.65 },
  { type: '举手', value: 0.15 },
  { type: '阅读', value: 0.05 },
  { type: '写作', value: 0.1 },
  { type: '低头', value: 0.1 },
  { type: '靠桌子', value: 0.05 },
];

export const items: DescriptionsProps['items'] = [
  {
    key: 'student',
    label: '1235',
    children: 'Zhou Maomao',
  },
  {
    key: '2',
    label: 'Telephone',
    children: '1810000000',
  },
  {
    key: '3',
    label: 'Live',
    children: 'Hangzhou, Zhejiang',
  },
  {
    key: '4',
    label: 'Address',
    span: 2,
    children: 'No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China',
  },
  {
    key: '5',
    label: 'Remark',
    children: 'empty',
  },
  {
    key: '6',
    label: 'Remark',
    children: 'empty',
  },
 
];
