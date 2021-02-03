import React, { useCallback, useRef, Fragment, useEffect } from "react";
import { useObserver } from "mobx-react-lite";
import _ from "lodash";
import { Modal, message, Form, Input, Row, Col } from "antd";
import { useStore } from "../store";
import Store from "@stores/BaseStore";

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
    if (store.type == 'create'){
      await store.setNonTexAcct(data);
    } 
    else {
      await store.updateNonTexAcct(data);
    }
    
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
            initialValues={store.nonTex}
            {...formItemLayout}
          >

            <FormItem
              label='非税账户号'
              name="acctNo"
              rules={[{ required: true, message: "非税账户号必填" }]}
            >
              <Input placeholder='非税账户号' />
            </FormItem>
            <FormItem
              label='非税账户名称'
              name="acctName"
              rules={[{ required: true, message: "非税账户名称必填" }]}
            >
              <Input placeholder='非税账户名称' />
            </FormItem>
            <FormItem
              label='开户行名称'
              name="bankName"
              rules={[{ required: true, message: "开户行名称必填" }]}
            >
              <Input placeholder='开户行名称' />
            </FormItem>
            <FormItem
              label='开户行行号'
              name="bankCode"
            >
              <Input placeholder='开户行行号' />
            </FormItem>
            <FormItem
              label="备注"
              name="remark"
            >
              <Input placeholder="备注" />
            </FormItem>

          </Form>
        </Modal>
      ) : null}
    </Fragment>
  );
});
