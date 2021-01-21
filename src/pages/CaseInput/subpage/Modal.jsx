import React, { useCallback, Fragment, useEffect } from "react";
import { useObserver } from "mobx-react-lite";
import _ from "lodash";
import { Modal, message, Form, Input, Select } from "antd";
import { useStore } from "../store";

const FormItem = Form.Item;

export default () => useObserver(() => {
  const store = useStore();
  const [form] = Form.useForm();

  const onCancel = () => {
    form.resetFields();
    store.closeModal(store.type);
  };

  const onFinish = () => {
    let allParty = store.party;
    const data = form.getFieldsValue();
    let info = {};
    if(store.type === 'suspect') {
      info = { 
        ...data,
        type: 1,
      };
    } else {
      info = { 
        ...data,
        type: 2,
      };
    }
    allParty.push(info);
    store.setValue('party', allParty);
    console.log('store.case===', store.party);
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
          title={`新增${store.typeDesc}`}
          visible={store.modal[store.type]}
          onCancel={onCancel}
          onOk={onFinish}
        >
          <Form
            colon={true}
            form={form}
            initialValues={store.detail}
            {...formItemLayout}
          >

            <FormItem
              label={`${store.typeDesc}姓名`}
              name="name"
              rules={[{ required: true, message: "姓名必填" }]}
            >
              <Input placeholder={`${store.typeDesc}姓名`} />
            </FormItem>
            <FormItem
              label="身份证号"
              name="IdNo"
              rules={[
                { required: true, message: '用户名必填' },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    const reg = /^[0-9]{18}$/g;
                    if (reg.test(value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject('请输入正确的 18 位身份证号');
                  }
                })
              ]}
            >
              <Input placeholder="身份证号" />
            </FormItem>
            <FormItem
              label="性别"
              name="gender"
              rules={[{ required: true, message: "性别必填" }]}
            >
              <Select
                placeholder="请选择性别"
              >
                {
                  _.map(store.consts.GENDER, v => <Option key={v} value={v}>
                    {store.consts.GENDER_DESC[v]}</Option>)
                }
              </Select>
            </FormItem>
            <FormItem
              label="联系电话"
              name="phone"
            >
              <Input placeholder="联系电话" />
            </FormItem>
            <FormItem
              label="银行户名"
              name="acctName"
            >
              <Input placeholder="银行户名" />
            </FormItem>
            <FormItem
              label="银行账户"
              name="acctNo"
            >
              <Input placeholder="银行账户" />
            </FormItem>
            <FormItem
              label="开户银行"
              name="bankName"
            >
              <Input placeholder="开户银行" />
            </FormItem>
            <FormItem
              label="登记账号与当事人类型"
              name="acctType"
            >
              <Input placeholder="登记账号与当事人类型" />
            </FormItem>

          </Form>
        </Modal>
      ) : null}
    </Fragment>
  );
});
