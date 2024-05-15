/*
 * @Author: wanglinxiang
 * @Date: 2024-05-02 22:26:48
 * @LastEditTime: 2024-05-06 18:16:37
 * @LastEditors: wanglinxiang
 * @Description:
 * @FilePath: \class_detection_frontend\src\routes\index.ts
 */

export const global_routes = [
  {
    path: '/',
    redirect: '/Home',
  },
  {
    name: '后台管理主页',
    path: '/home',
    component: './Home',
  },
  {
    name: '图片/视频检测',
    path: '/blobStaticFileDetection',
    component: './BlobStaticFileDetection',
  },
  {
    name: '实时检测',
    path: '/realTimeDetection',
    component: './RealTimeDetection',
  },
  {
    name: '学生信息管理',
    path: '/studentInfoManage',
    component: './StudentInfoManage',
  },
  {
    name: '检测记录',
    path: '/detectionHistory',
    component: './DetectionHistory',
  },
  {
    name: '登录',
    path: '/login',
    component: 'Login',
    hideChildrenInMenu: true,
    layout: false,
  },
];
