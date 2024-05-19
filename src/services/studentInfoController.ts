/*
 * @Author: wanglinxiang
 * @Date: 2024-05-05 00:27:42
 * @LastEditTime: 2024-05-19 18:04:58
 * @LastEditors: fuzhenghao
 * @Description:
 * @FilePath: \class_detection_frontend\src\services\studentInfoController.ts
 */

import { post } from '@/services/utils/index';

const studentInfo_commonApi = '/studentInfoRequest';
const studentInfo_postApi = `${studentInfo_commonApi}/studentInfoPost`;
const updateStudentInfo_postApi = `${studentInfo_commonApi}/studentInfoUpdate`;
const addStudentInfo_postApi = `${studentInfo_commonApi}/studentInfoAdd`;
const deleteStudentInfo_postApi = `${studentInfo_commonApi}/studentInfoDelete`;

export const queryStudentInfo = (parmas: any) => {
  return post(studentInfo_postApi, parmas);
};

export const updateStudentInfo = (parmas: any) => {
  return post(updateStudentInfo_postApi, parmas);
};

export const addStudentInfo = (parmas: any) => {
  return post(addStudentInfo_postApi, parmas);
};

export const deleteStudentInfo = (parmas: any) => {
  return post(deleteStudentInfo_postApi, parmas);
};
