import { Modal } from 'antd';
import React, { PropsWithChildren } from 'react';

interface UpdateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
}

const UpdateForm: React.FC<PropsWithChildren<UpdateFormProps>> = (props) => {
  const { modalVisible, onCancel } = props;
  return (
    <Modal
      destroyOnClose
      title="修改"
      width={420}
      open={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      {props.children}
    </Modal>
  );
};
export default UpdateForm;
