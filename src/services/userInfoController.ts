/*
 * @Author: fuzhenghao
 * @Date: 2024-05-05 00:27:42
 * @LastEditTime: 2024-05-13 11:21:02
 * @LastEditors: fuzhenghao
 * @Description:
 * @FilePath: \class_detection_frontend\src\services\userInfoController.ts
 */

import { post } from '@/services/utils/index';

const login_commonApi = '/loginRequest';
const login_postApi = `${login_commonApi}/loginPost`;

export const queryLogin = (parmas: any) => {
  return post(login_postApi, parmas);
};
