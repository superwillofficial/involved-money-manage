import React from "react";
import { useObserver } from "mobx-react-lite";

import _ from "lodash";
import { Button, Form, Input, Row, Col, Select } from "antd";
import { useStore } from "../store";

const FormItem = Form.Item;
const Option = Select.Option;

export default () =>
  useObserver(() => {
    const store = useStore();
    const [form] = Form.useForm();

    //查询
    const onSearch = () => {
      let { name } = form.getFieldsValue();
      // console.log(name);
      const current = 1;
      const pageSize = 20;
      store
        .setValue("page", { ...store.page, current, pageSize })
        .onOrgList(name);
    };
    //表单布局
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 }
    };
    return (
      <Form form={form} colon={true} {...formItemLayout}>
        <Row>
          <Col span={8}>
            <FormItem label="名称" name="name">
              <Input placehodler="名称" />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem>
              <Button type="primary" onClick={onSearch}>
                查询
              </Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  });
