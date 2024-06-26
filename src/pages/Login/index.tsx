/*
 * @Author: wanglinxiang
 * @Date: 2024-05-02 02:18:57
 * @LastEditTime: 2024-05-18 18:52:25
 * @LastEditors: fuzhenghao
 * @Description:
 * @FilePath: \class_detection_frontend\src\pages\Login\index.tsx
 */

import { postRegister, queryLogin } from '@/services/userInfoController';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input, Modal, message } from 'antd';
import React, { useState } from 'react';
import { history } from 'umi';
import styles from './index.less';

type FieldType = {
  username: string;
  password: string;
  remember?: string;
};

const LoginPage: React.FC = () => {
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    let { resCode, resMes } = await queryLogin(values);
    if (resCode == 10000) {
      handleCancel();
      message.success(resMes);
      history.push('/home');
    } else {
      message.error(resMes);
    }
  };

  const onRegisterFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    let { resCode, resMes } = await postRegister(values);
    if (resCode == 10000) {
      handleCancel();
      message.success(resMes);
      history.push('/login');
    } else {
      message.error(resMes);
    }
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (
    errorInfo,
  ) => {
    history.push('/home');
    console.log('Failed:', errorInfo);
  };

  const transfer_register = () => {
    // console.log('transfer_register');
    setIsModalOpen(true);
  };

  async function submit() {
    history.push('/home');
    // try {
    //   const res = await fetch('/api/login', {
    //     method: 'POST',
    //     body: JSON.stringify({ email, password }),
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //   });
    //   if (res.status !== 200) {
    //     console.error(await res.text());
    //     return;
    //   }
    //   const data = await res.json();
    //   alert(`欢迎回来，${data.name}`);
    //   history.push('/posts/create');
    // } catch (err) {
    //   console.error(err);
    // }
  }

  return (
    <div className={styles.login_page}>
      <div className={styles.container}>
        <p className={styles.login_form_title}>欢迎登录</p>
        <Form
          name="basic"
          // labelCol={{ span: 8 }}
          // wrapperCol={{ span: 16 }}
          className={styles.login_form}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          title="欢迎登录"
        >
          <Form.Item<FieldType>
            name="username"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input placeholder="用户名" />
          </Form.Item>

          <Form.Item<FieldType>
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password placeholder="密码" />
          </Form.Item>

          <Form.Item<FieldType> name="remember" valuePropName="checked">
            <Checkbox>记住账号</Checkbox>
          </Form.Item>

          <Form.Item className={styles.login_form_submit}>
            <Button type="primary" htmlType="submit" block={true}>
              立即登录
            </Button>
          </Form.Item>
        </Form>
        <div className={styles.login_page_register}>
          <p>还没有注册?</p>
          <Button onClick={transfer_register} type="link">
            立即注册
          </Button>
        </div>
      </div>
      <Modal
        title="账号注册"
        open={isModalOpen}
        // onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          name="normal_register"
          className="register-form"
          initialValues={{ remember: true }}
          onFinish={onRegisterFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="用户名"
            />
          </Form.Item>
          {/* <Form.Item
            name="email"
            rules={[{ required: true, message: '请输入邮箱地址!' }]}
          >
            <Input
              prefix={<MailOutlined className="site-form-item-icon" />}
              type="email"
              placeholder="邮箱地址"
            />
          </Form.Item> */}
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="密码"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="register-form-button"
              block
            >
              注册
            </Button>
            已有账号？<a href="/login">现在登录!</a>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LoginPage;
