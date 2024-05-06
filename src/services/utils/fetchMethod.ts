/*
 * @Author: fuzhenghao
 * @Date: 2024-05-05 00:29:18
 * @LastEditTime: 2024-05-06 17:49:47
 * @LastEditors: fuzhenghao
 * @Description:
 * @FilePath: \class_detection_frontend\src\services\utils\fetchMethod.ts
 */

import { message } from 'antd';

export const fetchWithStatusHandler = async (
  ...args: Parameters<typeof fetch>
): Promise<Response> => {
  try {
    const response = await fetch(...args);
    httpError_handle(response);
    return response;
  } catch (e) {
    if (e instanceof Error) {
      return Promise.reject(e.message);
    }
    return Promise.reject(e);
  }
};

const httpError_handle = (response: Response) => {
  if (response.ok) return;
  if (response.status !== 401) {
    throw new Error(`${response.status}, ${response.statusText}`);
  }
};

export const formData_handle = (params?: Record<any, any>) => {
  const formData = new FormData();
  if (params) {
    Object.keys(params).forEach((key) => formData.append(key, params[key]));
  }
  return { body: formData };
};

export const readResponseAsJSON = async (response: Response) => {
  try {
    const { data, resCode, resMsg, ...rest } = await response.json();
    if (resCode !== 10000) {
      message.error(resMsg);
      throw new Error(resMsg);
    }
    return data;
  } catch (e) {
    if (e instanceof Error) {
      return Promise.reject(e.message);
    }
    return Promise.reject(e);
  }
};

export const post_formData = async (input: RequestInfo, params?: object) => {
  const method = 'POST';
  const { body } = formData_handle(params);

  const response = await fetchWithStatusHandler(input, {
    method,
    body,
  });
  const data = await readResponseAsJSON(response);
  return { data, success: true };
};
