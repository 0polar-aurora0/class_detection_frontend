/*
 * @Author: fuzhenghao
 * @Date: 2024-05-15 17:46:14
 * @LastEditTime: 2024-05-20 18:23:12
 * @LastEditors: fuzhenghao
 * @Description:
 * @FilePath: \class_detection_frontend\src\utils\data.ts
 */

export function base64Handle(base64Data: any) {
  // 去除base64编码的前缀得到纯编码部分
  let data = base64Data.split(',')[1];
  // 将base64字符串转换为二进制字符串
  let binaryString = atob(data);
  // 将二进制字符串转换为buffer
  let buffer = Buffer.from(binaryString, 'binary');
  return buffer;
}

// 将 ArrayBuffer 转换为 Base64 编码的字符串
export function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}
