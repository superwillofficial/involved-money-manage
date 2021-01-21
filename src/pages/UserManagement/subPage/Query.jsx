import React from "react";
import { useObserver } from "mobx-react-lite";

import _ from "lodash";
import { Button, Form, Input, Row, Col } from "antd";
import { useStore } from "../store";

const FormItem = Form.Item;

export default () => useObserver(() => {
  const store = useStore();
  const [form] = Form.useForm();
  // 查询
  const onSreach = () => {
    console.log(form.getFieldsValue(), '=form.getFieldsValue()=');
    store.getUsers(form.getFieldsValue());
  };
  // 重置
  const onReset = () => {
    form.resetFields();
    store.getUsers();
  };
  // 表单布局
  const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 14 },
  };
  return (
    <Form
      form={form}
      colon={true}
      {...formItemLayout}
      className="content-block-box-row"
    >
      <Row>
        <Col span={8}>
          <FormItem
            label="用户名"
            name="username"
            className="clear-form-item"
          >
            <Input placeholder="用户名"/>
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem className="clear-form-item">
            <Button
              type="primary"
              className="query-block-btn"
              onClick={onSreach}>
              查询
            </Button>

            <Button
              type="primary"
              onClick={onReset}
            >
              重置
            </Button>
          </FormItem>
        </Col>
      </Row>
    </Form>
  );
});
