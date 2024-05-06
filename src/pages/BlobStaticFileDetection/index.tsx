/*
 * @Author: fuzhenghao
 * @Date: 2024-04-29 01:30:11
 * @LastEditTime: 2024-05-06 18:13:26
 * @LastEditors: fuzhenghao
 * @Description:
 * @FilePath: \class_detection_frontend\src\pages\BlobStaticFileDetection\index.tsx
 */
import Guide from '@/components/Guide';
import { trim } from '@/utils/format';
import { useModel } from '@umijs/max';
import styles from './index.less';

const BlobStaticFileDetectionPage: React.FC = () => {
  const { name } = useModel('global');
  return (
    <div className={styles.container}>
      <Guide name={trim(name)} />
    </div>
  );
};

export default BlobStaticFileDetectionPage;
