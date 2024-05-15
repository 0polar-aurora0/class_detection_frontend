/*
 * @Author: wanglinxiang
 * @Date: 2024-05-03 01:42:32
 * @LastEditTime: 2024-05-04 23:56:11
 * @LastEditors: wanglinxiang
 * @Description:
 * @FilePath: \class_detection_frontend\src\layouts\index.tsx
 */
import { PageContainer } from '@ant-design/pro-components';
import { Outlet } from '@umijs/max';

const LayoutPage: React.FC = (props: any) => {
  const { children } = props;

  return (
    <PageContainer ghost>
      <Outlet />
    </PageContainer>
  );
};

export default LayoutPage;
