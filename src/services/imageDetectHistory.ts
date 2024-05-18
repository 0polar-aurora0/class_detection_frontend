/*
 * @Author: fuzhenghao
 * @Date: 2024-05-18 23:46:19
 * @LastEditTime: 2024-05-19 03:49:58
 * @LastEditors: fuzhenghao
 * @Description:
 * @FilePath: \class_detection_frontend\src\services\imageDetectHistory.ts
 */

// import { post } from '@/services/utils/index';
import { post } from './utils';

const imageDetectHistory_commonApi = '/detectionRequest';
const imageDetectHistory_postApi = `${imageDetectHistory_commonApi}/detectionHistoryPost`;
const imageDetectHistoryDelete_postApi = `${imageDetectHistory_commonApi}/detectionHistoryDelete`;

export const queryImageDetectHistory = (parmas: any) => {
  // let allHistoryWithStudent
  let allHistory = post(imageDetectHistory_postApi, parmas);
  return allHistory;
};

export const deleteImageDetectHistory = async (parmas: any) => {
  // let allHistoryWithStudent
  return post(imageDetectHistoryDelete_postApi, parmas);
};
