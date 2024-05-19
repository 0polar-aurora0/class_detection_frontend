/*
 * @Author: wanglinxiang
 * @Date: 2024-04-29 01:30:11
 * @LastEditTime: 2024-05-19 15:04:21
 * @LastEditors: fuzhenghao
 * @Description:
 * @FilePath: \class_detection_frontend\src\pages\Home\index.tsx
 */
import Guide from '@/components/Guide';
import { trim } from '@/utils/format';
import { useModel } from '@umijs/max';

import React from 'react';
import styles from './index.less';

const HomePage: React.FC = () => {
  const { name } = useModel('global');
  return (
    <div className={styles.container}>
      <Guide name={trim(name)} />
      <div className={styles.introduce}>
        本系统使用YOLO
        v8为行为识别的网络模型，并基于React+Node.js+便携型Sqlit数据库技术，设计实现了学生课堂行为检测系统，系统设计中包括前端界面设计和后端的数据处理等。前端采用
        Umi.js为前端框架，Dva.js完善前端数据工作流，并使用Ant
        Design组件库；后端选择Midway.js为后端框架，使用Egg.js为内核，并使用内置的Typeorm进行数据库连通。实现了对学生课堂行为的实时检测功能，旨在帮助授课教师减少课堂上管理学生的压力，并通过学生长期行为记录帮助学生提高学习专注度。
      </div>
    </div>
  );
};

export default HomePage;
