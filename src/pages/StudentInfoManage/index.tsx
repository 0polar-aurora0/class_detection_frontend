import services from '@/services';
import {
  addStudentInfo,
  deleteStudentInfo,
  updateStudentInfo,
} from '@/services/studentInfoController';
import { uuid } from '@/services/utils/uuid';
import {
  ActionType,
  FooterToolbar,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Divider, Drawer } from 'antd';
import React, { useRef, useState } from 'react';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';

const { queryStudentInfo } = services.StudentInfoController;

const DetectionHistory: React.FC<unknown> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] =
    useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState<any>({});
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<API.UserInfo>();
  const [selectedRowsState, setSelectedRows] = useState<API.UserInfo[]>([]);
  const columns: ProDescriptionsItemProps<any>[] = [
    {
      title: '标识id',
      dataIndex: 'id',
      tip: '标识id是唯一的 key',
      hideInForm: true,
      isEditable: false,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '名称为必填项',
          },
        ],
        initialValue: stepFormValues.id,
      },
    },
    {
      title: '学生id',
      dataIndex: 'student_id',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '名称为必填项',
          },
        ],
        initialValue: stepFormValues.student_id,
      },
    },
    {
      title: '检测特征',
      dataIndex: 'detection_face_feature',
      valueType: 'text',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '头像',
      dataIndex: 'avator',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <Button
            type="link"
            // danger
            onClick={() => {
              handleUpdateModalVisible(true);
              setStepFormValues(record);
            }}
          >
            修改学生信息
          </Button>
          {/* <Divider type="vertical" />
          <a href="">查看检测记录</a> */}
          <Divider type="vertical" />
          <Button
            type="text"
            danger
            onClick={() => {
              deleteStudentInfo(record).then(() => {
                actionRef.current.reload();
              });
            }}
          >
            删除学生信息
          </Button>
        </>
      ),
    },
  ];

  const request = async (
    params: {
      keyword?: string | undefined;
      current?: number | undefined;
      pageSize?: number | undefined;
    },
    sorter: any,
    filter: any,
  ) => {
    const { data, success } = await queryStudentInfo({
      ...params,
      sorter,
      filter,
    });

    return {
      data: data || [],
      success,
    };
  };

  return (
    <>
      <ProTable
        headerTitle="学生信息表单管理"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            key="1"
            type="primary"
            onClick={() => handleModalVisible(true)}
          >
            新建
          </Button>,
        ]}
        request={request}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              项&nbsp;&nbsp;
            </div>
          }
        >
          <Button
            onClick={async () => {
              await deleteStudentInfo(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
          </Button>
          {/* <Button type="primary">批量审批</Button> */}
        </FooterToolbar>
      )}
      <CreateForm
        onCancel={() => handleModalVisible(false)}
        modalVisible={createModalVisible}
      >
        <ProTable
          onSubmit={async (value) => {
            let newStudentInfo = {
              id: uuid(10),
              detection_face_feature: null,
              avator: uuid(10),
              ...value,
            };
            const success = await addStudentInfo(newStudentInfo);
            if (success) {
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
            console.log({ value });
          }}
          rowKey="id"
          type="form"
          columns={columns}
        />
      </CreateForm>

      <UpdateForm
        onCancel={() => handleUpdateModalVisible(false)}
        modalVisible={updateModalVisible}
      >
        <ProTable
          onSubmit={async (value) => {
            updateStudentInfo({
              ...stepFormValues,
              ...value,
            }).then(() => {
              handleUpdateModalVisible(false);
              setStepFormValues({});
              if (actionRef.current) {
                actionRef.current.reload();
              }
            });
          }}
          rowKey="id"
          type="form"
          columns={columns}
        />
      </UpdateForm>

      <Drawer
        width={600}
        open={!!row}
        onClose={() => {
          setRow(undefined);
        }}
        closable={false}
      >
        {row?.name && (
          <ProDescriptions<API.UserInfo>
            column={2}
            title={row?.name}
            request={async () => ({
              data: row || {},
            })}
            params={{
              id: row?.name,
            }}
            columns={columns}
          />
        )}
      </Drawer>
    </>
  );
};

export default DetectionHistory;
