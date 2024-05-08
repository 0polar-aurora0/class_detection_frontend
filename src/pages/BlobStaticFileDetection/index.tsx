/*
 * @Author: fuzhenghao
 * @Date: 2024-04-29 01:30:11
 * @LastEditTime: 2024-05-08 17:03:54
 * @LastEditors: fuzhenghao
 * @Description:
 * @FilePath: \class_detection_frontend\src\pages\BlobStaticFileDetection\index.tsx
 */
import Guide from '@/components/Guide';
import { trim } from '@/utils/format';
import { useModel } from '@umijs/max';
import styles from './index.less';
import React from 'react';

const BlobStaticFileDetectionPage: React.FC = () => {
  const { name } = useModel('global');
  return (
    <div className={styles.container}>
      <Guide name={trim(name)} />
    </div>
  );
};

export default BlobStaticFileDetectionPage;
