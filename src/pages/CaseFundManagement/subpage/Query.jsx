import React, { Fragment, useState, useEffect } from "react";
import { useObserver } from "mobx-react-lite";
import _ from "lodash";
import { Button, Form, Col, DatePicker, Input, Radio, Select } from "antd";
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

  const defaultDisplay = async () => {
    // 默认显示 3-待缴费、4-确认缴费、5-提交复核、6-复核不通过
    await store.getCases({
      status: store.consts.CASESTATUS_FOR_CASE_FUND_MGT_QUERY.ALL,
    });
  };

  const onReset = async () => {
    form.resetFields();
    defaultDisplay();
  };

  useEffect(() => {
    defaultDisplay();
  }, []);

  // 表单布局
  const formItemLayout = {
    labelAlign: 'left',
    labelCol: {
      span: 4,
      offset: 0,
    },
    wrapperCol: {
      span: 16,
      offset: 0,
    },
    layout: 'inline',
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
        className="margin-bottom-long"
        {...formItemLayout}
      >
        {codeOrParty === 'code' ? (
          <Fragment>
            <Col span={6}>
              <FormItem
                label="案件号"
                name="code"
              >
                <Input placeholder="请输入" />
              </FormItem>
            </Col>
            <Col span={6}>
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
            </Col>
            <Col span={6}>
              <FormItem
                label="状态"
                name="status"
              >
                <Select
                  placeholder="请选择状态"
                >
                  {
                    _.map(_.omit(store.consts.CASESTATUS_FOR_CASE_FUND_MGT_QUERY, [
                      'ALL',
                    ]), v => <Select.Option key={v} value={v}>
                      {store.consts.CASESTATUS_DESC[v]}</Select.Option>
                    )
                  }
                </Select>
              </FormItem>
            </Col>
          </Fragment>
        ) : (
          <Col span={6}>
            <FormItem
              label="当事人"
              name="name"
              rules={[{ required: true, message: "请输入要查询的当事人姓名" }]}
            >
              <Input placeholder="请输入" />
            </FormItem>
          </Col>
        )
        }
        <Col span={1}>
          <FormItem>
            <Button
              type="primary"
              shape="round"
              onClick={onSearch}
            >查询</Button>
          </FormItem>
        </Col>
        <Col span={1}>
          <FormItem>
            <Button
              shape="round"
              onClick={onReset}
            >重置</Button>
          </FormItem>
        </Col>
      </Form>
    </Fragment>
  );
});