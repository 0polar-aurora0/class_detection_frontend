/*
 * @Author: fuzhenghao
 * @Date: 2024-05-05 00:27:42
 * @LastEditTime: 2024-05-12 03:43:44
 * @LastEditors: fuzhenghao
 * @Description:
 * @FilePath: \class_detection_frontend\src\services\userInfoController.ts
 */

import { post } from '@/services/utils/index';

const login_commonApi = '/login';
const login_postApi = `${login_commonApi}/loginPost`;

export const queryLogin = (parmas: any) => {
  return post(login_postApi, parmas);
};
