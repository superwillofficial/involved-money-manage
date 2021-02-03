import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useObserver } from "mobx-react-lite";
import _ from 'lodash';

import { Form, Button, Input, Row, Col, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import useStore from './store';
import Pic from '../../assets/images/icon-rec.png';
import './index.less';

const FormItem = Form.Item;

export default () => useObserver(() => {
  const store = useStore();
  const history = useHistory();
  const [form] = Form.useForm();

  const onFinish = useCallback((values) => {
    store.onLogin(values)
      .then(isSuccess => {
        if (isSuccess) {
          message.success('登录成功');
          history.push('/home');
        } else {
          message.error('账号或者密码错误');
        }
      });
  }, []);
  return (
    <div className="login-wrapper">
      <div className="login-header">
        <img className="icon-img" src={Pic} alt="" />
        <span className="divider"></span>
        <span className="system-name">{store.sysConsts.SYSYTEM_NAME}</span>
      </div>
      <Row className="login-main">
        <Col span={12}></Col>
        <Col span={12} className="login-main-right">
          <div className="login-main-right-title">欢迎回来</div>
          <Form
            form={form}
            onFinish={onFinish}
            wrapperCol={{ span: 18 }}>
            <FormItem
              name="username"
              rules={[{ required: true, message: '账号必填' }]}
            >
              <Input
                className="login-input"
                prefix={<UserOutlined />}
                placeholder="请输入登录账号"
              />
            </FormItem>
            <FormItem
              name="password"
              rules={[{ required: true, message: '密码必填' }]}
            >
              <Input.Password
                className="login-input"
                prefix={<LockOutlined />}
                placeholder="请输入登录密码"
              />
            </FormItem>
            <FormItem className="login-btn-wrapper">
              <Button
                type="round"
                htmlType="submit"
                className="login-btn">登录</Button>
            </FormItem>
          </Form>
        </Col>
      </Row>
    </div>
  );
});
