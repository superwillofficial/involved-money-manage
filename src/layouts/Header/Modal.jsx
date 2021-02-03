import React from 'react';
import { useObserver } from "mobx-react-lite";
import { Modal, Form, Input } from 'antd';
import { useStore } from '@stores';

const FormItem = Form.Item;
export default () => useObserver(() => {
  const store = useStore();
  const { appStore } = store;
  const [form] = Form.useForm();
  // 关闭弹窗
  const onCancel = () => {
    appStore.closeModal('changePassword');
    form.resetFields();
  };
  // 修改密码
  const onOk = () => {
    form
      .validateFields()
      .then(values => {
        appStore
          .onChangePassword(_.omit(values, ['confirm']))
          .then(() => {
            appStore.showMsg('success', '修改密码成功');
          }).then(onCancel);
      });
  };
  // 表单布局
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 14 },
  };
  return (
    <Modal
      width="560px"
      title="修改密码"
      visible={appStore.modal.changePassword}
      onOk={onOk}
      style={{ top: '20%' }}
      onCancel={onCancel}
    >
      <Form
        form={form}
        colon={true}
        {...layout}
      >
        <FormItem
          label="旧密码"
          name="oldPassword"
          hasFeedback
          rules={[{ required: true, message: '旧密码必填' }]}
        >
          <Input.Password placeholder="旧密码" />
        </FormItem>
        <FormItem
          label="新密码"
          name="newPassword"
          rules={[{ required: true, message: '新密码必填' }]}
        >
          <Input.Password placeholder="新密码" />
        </FormItem>
        <FormItem
          label="确认密码"
          name="confirm"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: '确认密码' },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject('两次输入的密码不同');
              }
            })
          ]}
        >
          <Input.Password placeholder="确认密码" />
        </FormItem>
      </Form>
    </Modal>
  );
});
