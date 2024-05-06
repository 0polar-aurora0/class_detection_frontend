/*
 * @Author: fuzhenghao
 * @Date: 2024-04-29 01:30:11
 * @LastEditTime: 2024-05-06 16:52:44
 * @LastEditors: fuzhenghao
 * @Description:
 * @FilePath: \class_detection_frontend\.umirc.ts
 */
import { defineConfig } from '@umijs/max';
import { global_routes } from './src/routes';

const LocalServerPost = 'http://localhost:7001';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '学生课堂行为检测系统',
  },
  routes: global_routes,
  npmClient: 'cnpm',
  styles: [`#root { height: 100%; }`],
  proxy: {
    context: [ '/studentInfo'],
    target: LocalServerPost,
  },
});
