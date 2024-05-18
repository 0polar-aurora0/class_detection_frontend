/*
 * @Author: wanglinxiang
 * @Date: 2024-05-05 00:27:42
 * @LastEditTime: 2024-05-18 18:10:41
 * @LastEditors: fuzhenghao
 * @Description:
 * @FilePath: \class_detection_frontend\src\services\userInfoController.ts
 */

import { post } from '@/services/utils/index';

const login_commonApi = '/loginRequest';
const login_postApi = `${login_commonApi}/loginPost`;
const login_register_postApi = `${login_commonApi}/logiRegesterPost`;

export const queryLogin = (parmas: any) => {
  return post(login_postApi, parmas);
};

export const postRegister = (parmas: any) => {
  return post(login_register_postApi, parmas);
};
