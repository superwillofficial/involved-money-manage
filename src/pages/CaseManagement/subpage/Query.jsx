import React, { Fragment, useState } from "react";
import { useObserver } from "mobx-react-lite";
import _ from "lodash";
import { Button, Form, Row, Col, DatePicker, Input, Radio } from "antd";
import moment from 'moment';
import { useStore } from "../store";
import { dataProcess } from '@utils/functions';
const FormItem = Form.Item;
export default () => useObserver(() => {
  const store = useStore();
  const [form] = Form.useForm();
  const [codeOrParty, setCodeOrParty] = useState('code');

  const onSearch = async () => {
    const data = dataProcess(form.getFieldsValue());
    await form.validateFields();
    codeOrParty === 'code' ? 
      await store.getCases(data) : await store.getCasesByParty(data);
  };

  const onReset = async () => {
    const data = form.resetFields();
    await store.getCases();
  };

  // 表单布局
  const formItemLayout = {
    labelCol: { span: 10 },
    wrapperCol: { span: 14 },
  };

  return (
    <Fragment>
      <Radio.Group
        name="radiogroup"
        defaultValue={'code'}
        className="radio-group"
        onChange={(e) => {
          setCodeOrParty(e.target.value);
        }}
      >
        <Radio value={'code'}>按案件号查找</Radio>
        <Radio value={'party'}>按当事人查找</Radio>
      </Radio.Group>

      <Form
        form={form}
        colon={true}
        {...formItemLayout}
      >
        <Row>
          {codeOrParty === 'code' ? (
            <Row>
              <FormItem
                label="案件号"
                name="code"
              >
                <Input placeholder="请输入" />
              </FormItem>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <FormItem
                label="选择日期"
                name="date"
              >
                <DatePicker.RangePicker
                  ranges={{
                    '今日': [moment(), moment()],
                    '本月': [moment().startOf('month'), moment().endOf('month')],
                  }}
                  format="YYYY-MM-DD"
                />
              </FormItem>
            </Row>
          ) : (
            <Row>
              <FormItem
                label="当事人姓名"
                name="name"
              >
                <Input placeholder="请输入" />
              </FormItem>
            </Row>
          )
          }
          &nbsp;&nbsp;&nbsp;&nbsp;
          <FormItem>
            <Button
              type="primary"
              shape="round"
              onClick={onSearch}
            >查询</Button>
          </FormItem>
          &nbsp;&nbsp;
          <FormItem>
            <Button
              shape="round"
              onClick={onReset}
            >重置</Button>
          </FormItem>
        </Row>
      </Form>
    </Fragment>
  );
});