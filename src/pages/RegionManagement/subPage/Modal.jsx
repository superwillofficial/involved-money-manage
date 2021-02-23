import React, { useCallback, Fragment, useEffect } from "react";
import { useObserver } from "mobx-react-lite";
import _ from "lodash";
import { Modal, Select, message, Form, Input } from "antd";
import { useStore } from "../store";

const FormItem = Form.Item;

export default () => useObserver(() => {
  const store = useStore();
  const [form] = Form.useForm();

  // 弹窗标题
  const title = {
    create: '新增机构',
    edit: '修改机构',
  }[store.type];

  useEffect(() => {
    if(store.modal[store.type] && title === '修改机构') {
      const detail = store.detail;
      form.setFieldsValue({
        value: detail.dictValue,
      });
    }
  }, [store.modal[store.type]]);

  // 关闭弹窗
  const onCancel = () => {
    form.resetFields();
    store.closeModal(store.type);
  };

  // 提交表单
  const onFinish = async () => {
    await form.validateFields();
    if (title === "新增机构") {
      const res = await store.onOrgCreate(form.getFieldsValue());
      res.code === 0 ? message.success('新增成功') : message.error('新增失败');
      onCancel();
    } else if (title === "修改机构") {
      const res = await store.onOrgUpdate(form.getFieldsValue());
      res.code === 0 ? message.success('编辑成功') : message.error('编辑失败');
      onCancel();
    }
  };

  return (
    <Fragment>
      {store.modal[store.type] ? (
        <Modal
          width="35%"
          title={title}
          visible={store.modal[store.type] && title}
          onCancel={onCancel}
          onOk={onFinish}
        >
          <Form
            colon={true}
            form={form}
          >
            <FormItem
              label="名称"
              name="value"
              rules={[{ required: true, message: "名称必填" }]}
            >
              <Input placeholder="名称" />
            </FormItem>
          </Form>
        </Modal>
      ) : null}
    </Fragment>
  );
});
