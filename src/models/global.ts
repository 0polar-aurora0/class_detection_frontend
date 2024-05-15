/*
 * @Author: wanglinxiang
 * @Date: 2024-04-29 01:30:11
 * @LastEditTime: 2024-05-02 02:33:43
 * @LastEditors: wanglinxiang
 * @Description: 
 * @FilePath: \class_detection_frontend\src\models\global.ts
 */
// 全局共享数据示例
import { DEFAULT_NAME } from '@/constants';
import { useState } from 'react';

const useUser = () => {
  const [name, setName] = useState<string>(DEFAULT_NAME);
  return {
    name,
    setName,
  };
};

export default useUser;
