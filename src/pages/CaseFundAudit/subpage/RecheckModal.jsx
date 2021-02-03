import React, { useCallback, Fragment, useEffect } from "react";
import { useObserver } from "mobx-react-lite";
import _ from "lodash";
import { Modal, Radio, Form, Input, message, Row, Col } from "antd";
import { useHistory } from 'react-router-dom';
import { useStore } from "../store";

const FormItem = Form.Item;

export default () => useObserver(() => {
  const store = useStore();
  const [form] = Form.useForm();
  const history = useHistory();

  // 弹窗标题
  const title = {
    recheck: '资金处置复核',
  }[store.type];

  const onCancel = () => {
    form.resetFields();
    store.closeModal(store.type);
  };

  const onFinish = async () => {
    await form.validateFields();
    const res = await store.onAudit(form.getFieldsValue());
    res ? message.success('审核成功！') : message.error('审核失败');
    onCancel();
  };

  useEffect(() => {
    // 将审核通过按钮默认设定为 “通过”
    form.setFieldsValue({
      isAudit: store.consts.IS_AUDIT.YES,
    });
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
          width="35%"
          title={title}
          visible={store.modal[store.type] && title}
          onCancel={onCancel}
          onOk={onFinish}
        >
          <Form
            colon={true}
            form={form}
            {...formItemLayout}
          >
            <FormItem
              label="审核结果"
              name="isAudit"
            >
              <Radio.Group>
                <Radio value={store.consts.IS_AUDIT.YES}>通过</Radio>
                <Radio value={store.consts.IS_AUDIT.NO}>不通过</Radio>
              </Radio.Group>
            </FormItem>
            <FormItem
              label="审核意见"
              name="message"
              rules={[{ required: true, message: "审核意见必填" }]}
            >
              <Input.TextArea placeholder="请至少输入五个字符" />
            </FormItem>
          </Form>
        </Modal>
      ) : null}
    </Fragment>
  );
});
