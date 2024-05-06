/*
 * @Author: fuzhenghao
 * @Date: 2024-05-05 00:27:42
 * @LastEditTime: 2024-05-06 15:27:23
 * @LastEditors: fuzhenghao
 * @Description:
 * @FilePath: \class_detection_frontend\src\services\studentInfoController.ts
 */

import { post } from '@/services/utils/index';

const studentInfo_commonApi = '/studentInfo'
const studentInfo_postApi = `${studentInfo_commonApi}/studentInfoPost`;

export const queryStudentInfo = (parmas: any) => {
  return post(studentInfo_postApi, parmas);
};
