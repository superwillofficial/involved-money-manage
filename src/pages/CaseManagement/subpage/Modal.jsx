import React, { useCallback, useRef, Fragment, useEffect } from "react";
import { useObserver } from "mobx-react-lite";
import _ from "lodash";
import { Modal, message, Form, Input, Row, Col } from "antd";
import { useStore } from "../store";

const FormItem = Form.Item;

export default () => useObserver(() => {
  const store = useStore();
  const [form] = Form.useForm();

  const onCancel = () => {
    form.resetFields();
    store.closeModal(store.type);
  };
  const onFinish = async () => {
    const data = form.getFieldsValue();
    await store.setCase(data);
    onCancel();
  };
  useEffect(() => {

  }, []);
  // 表单布局
  const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 14 },
  };

  return (
    <Fragment>
      {store.modal[store.type] ? (
        <Modal
          width="45%"
          title={store.typeDesc}
          visible={store.modal[store.type]}
          onCancel={onCancel}
          onOk={onFinish}
        >
          <Form
            colon={true}
            form={form}
            {...formItemLayout}
          >

            <FormItem
              label='案件号'
              name="caseNo"
              rules={[{ required: true, message: "案件号必填" }]}
            >
              <Input placeholder='案件号' />
            </FormItem>
            <FormItem
              label='案件名称'
              name="caseName"
              rules={[{ required: true, message: "案件名称必填" }]}
            >
              <Input placeholder='案件名称' />
            </FormItem>
            <FormItem
              label='办理单位'
              name="department"
              rules={[{ required: true, message: "办理单位必填" }]}
            >
              <Input placeholder='办理单位' />
            </FormItem>
            <FormItem
              label='受理民警'
              name="policeName"
              rules={[{ required: true, message: "受理民警必填" }]}
            >
              <Input placeholder='受理民警' />
            </FormItem>
            <FormItem
              label="联系电话"
              name="phone"
              rules={[{ required: true, message: "联系电话必填" }]}
            >
              <Input placeholder="联系电话" />
            </FormItem>

          </Form>
        </Modal>
      ) : null}
    </Fragment>
  );
});
