/*
 * @Author: fuzhenghao
 * @Date: 2024-05-16 05:20:58
 * @LastEditTime: 2024-05-16 05:29:21
 * @LastEditors: fuzhenghao
 * @Description:
 * @FilePath: \class_detection_frontend\src\services\imageController.ts
 */
// import { post } from '@/services/utils/index';
import { fetchPostFormData } from './utils/fetchMethod';

const imageDetect_commonApi = '/detectionRequest';
const imageDetect_postApi = `${imageDetect_commonApi}/detectionPost`;

export const imageDetectUpload = (parmas: any) => {
  return fetchPostFormData(imageDetect_postApi, parmas);
};
