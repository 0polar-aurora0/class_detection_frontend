/*
 * @Author: wanglinxiang
 * @Date: 2024-05-05 01:23:48
 * @LastEditTime: 2024-05-19 18:19:41
 * @LastEditors: fuzhenghao
 * @Description:
 * @FilePath: \class_detection_frontend\src\pages\DetectionHistory\index.tsx
 */
import { names_CN } from '@/config/static';
import services from '@/services';
import {
  deleteImageDetectHistory,
  queryImageDetectHistory,
} from '@/services/imageDetectHistory';
import {
  ActionType,
  FooterToolbar,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Drawer, message, Select } from 'antd';
import React, { useRef, useState } from 'react';
import CreateForm from './components/CreateForm';
import UpdateForm, { FormValueType } from './components/UpdateForm';

const { addUser, queryUserList, deleteUser, modifyUser } =
  services.UserController;

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.UserInfo) => {
  const hide = message.loading('正在添加');
  try {
    await addUser({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('正在配置');
  try {
    await modifyUser(
      {
        userId: fields.id || '',
      },
      {
        name: fields.name || '',
        nickName: fields.nickName || '',
        email: fields.email || '',
      },
    );
    hide();

    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.UserInfo[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await deleteUser({
      userId: selectedRows.find((row) => row.id)?.id || '',
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const StudentInfoManage: React.FC<unknown> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] =
    useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<API.UserInfo>();
  const [selectedRowsState, setSelectedRows] = useState<API.UserInfo[]>([]);

  const deleteLocalRecord = async (record_id: string) => {
    console.log({ record_id });
    await deleteImageDetectHistory({ record_id }).then(
      ({ resCode, resMes }) => {
        if (resCode === 10000) {
          message.success(resMes);
          actionRef.current?.reload();
        }
      },
    );
  };

  const columns: ProDescriptionsItemProps<any>[] = [
    {
      title: '唯一标识id',
      dataIndex: 'record_id',
      valueType: 'text',
    },
    {
      title: '文件id',
      dataIndex: 'result_file_id',
      valueType: 'text',
    },
    {
      title: '学生id',
      dataIndex: 'student_id',
    },
    {
      title: '检测时间',
      dataIndex: 'gedetection_timeStamp',
      hideInForm: true,
    },
    {
      title: '检测图片id',
      dataIndex: 'image_id',
      hideInForm: true,
    },
    {
      title: '检测录像id',
      dataIndex: 'video_id',
      hideInForm: true,
    },
    {
      title: '检测结果',
      dataIndex: 'detect_result_type',
      hideInForm: true,
      render: (_, record) => {
        return names_CN[_];
      },
      renderFormItem: () => {
        return <Select></Select>
      }
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          {/* <a
            onClick={() => {
              handleUpdateModalVisible(true);
              setStepFormValues(record);
            }}
          >
            查看检测文件
          </a>
          <Divider type="vertical" />
          <a href="">查看当前学生信息</a> */}

          <Button
            type="text"
            danger
            onClick={() => deleteLocalRecord(record.record_id)}
          >
            删除当前记录
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <ProTable<API.UserInfo>
        headerTitle="帧检测记录管理"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        // toolBarRender={() => [
        //   <Button
        //     key="1"
        //     type="primary"
        //     onClick={() => handleModalVisible(true)}
        //   >
        //     新建
        //   </Button>,
        // ]}
        request={async (params, sorter, filter) => {
          const { data, success } = await queryImageDetectHistory({
            ...params,
            // FIXME: remove @ts-ignore
            // @ts-ignore
            sorter,
            filter,
          });
          return {
            data: data || [],
            success,
          };
        }}
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
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
          </Button>
          <Button type="primary">批量审批</Button>
        </FooterToolbar>
      )}
      <CreateForm
        onCancel={() => handleModalVisible(false)}
        modalVisible={createModalVisible}
      >
        <ProTable<API.UserInfo, API.UserInfo>
          onSubmit={async (value) => {
            const success = await handleAdd(value);
            if (success) {
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          rowKey="id"
          type="form"
          columns={columns}
        />
      </CreateForm>
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={async (value) => {
            const success = await handleUpdate(value);
            if (success) {
              handleUpdateModalVisible(false);
              setStepFormValues({});
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
        />
      ) : null}

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

export default StudentInfoManage;
