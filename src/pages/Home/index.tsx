/*
 * @Author: fuzhenghao
 * @Date: 2024-04-29 01:30:11
 * @LastEditTime: 2024-05-06 17:59:01
 * @LastEditors: fuzhenghao
 * @Description:
 * @FilePath: \class_detection_frontend\src\pages\Home\index.tsx
 */
import Guide from '@/components/Guide';
import { trim } from '@/utils/format';
import { useModel } from '@umijs/max';
import styles from './index.less';


const HomePage: React.FC = () => {
  const { name } = useModel('global');
  return (
    <div className={styles.container}>
      <Guide name={trim(name)} />
    </div>
  );
};

export default HomePage;
