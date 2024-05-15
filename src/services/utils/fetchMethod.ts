/*
 * @Author: wanglinxiang
 * @Date: 2024-05-05 00:29:18
 * @LastEditTime: 2024-05-13 11:10:14
 * @LastEditors: wanglinxiang
 * @Description:
 * @FilePath: \class_detection_frontend\src\services\utils\fetchMethod.ts
 */

/**
 * 处理过 http 状态码报错的 fetch 请求
 */
export const fetchWithStatusHandler = async (
  ...args: Parameters<typeof fetch>
): Promise<Response> => {
  try {
    const response = await fetch(...args)
    handleHttpError(response)
    return response
  } catch (e) {
    if (e instanceof Error) {
      return Promise.reject(e.message)
    }
    return Promise.reject(e)
  }
}
const handleHttpError = (response: Response) => {
  if (response.ok) return;
  if (response.status !== 200) {
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
  return response.json()
  // try {
  //   const { data, resCode, resMsg, ...rest } = await response.json();
  //   console.log({ data, resCode, resMsg, ...rest });
  //   if (resCode !== 10000) {
  //     message.error(resMsg);
  //     throw new Error(resMsg);
  //   }
  //   return data;
  // } catch (e) {
  //   if (e instanceof Error) {
  //     return Promise.reject(e.message);
  //   }
  //   return Promise.reject(e);
  // }
};

export const requestInitJSON = (params?: object | string) => {
  const headers = { 'Content-Type': 'application/json' };
  let body: string | undefined;
  if (typeof params === 'string') {
    body = params;
  } else {
    body = JSON.stringify(params);
  }
  return { headers, body };
};

export const fetchPost = async (
  input: RequestInfo,
  params?: object | string,
) => {
  const method = 'POST';
  const { headers, body } = requestInitJSON(params);

  const response = await fetchWithStatusHandler(input, {
    method,
    headers,
    body,
  });
  const data = await readResponseAsJSON(response);
  return data;
};
