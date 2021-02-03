import React, { useCallback, Fragment, useEffect } from "react";
import { useObserver } from "mobx-react-lite";
import _ from "lodash";
import { Modal, message, Form, Input, Select } from "antd";
import { dataProcessingWhenCreatingVictim } from "@utils/functions";
import { useStore } from "../store";

const FormItem = Form.Item;

export default () => useObserver(() => {
  const store = useStore();
  const [form] = Form.useForm();

  // 弹窗标题
  const title = {
    create: '新增当事人',
    edit: '修改当事人',
  }[store.type];

  const onCancel = () => {
    form.resetFields();
    store.closeModal(store.type);
  };

  const onFinish = async () => {
    let res;
    if(title === '新增当事人') {
      const data = dataProcessingWhenCreatingVictim(form.getFieldsValue());
      res = await store.addParty(data);
    } else if(title === '修改当事人') {
      const data = {
        ...form.getFieldsValue(),
        type: store.consts.PARTY.SUSPECT,
      };
      res = await store.editParty(data);
    }
    res ? message.success(`${title}成功!!`) : message.error(`${title}失败`);
    onCancel();
  };

  useEffect(() => {
    if(store.modal[store.type] && title === '修改当事人') {
      const suspect = store.suspect;
      form.setFieldsValue({
        name: suspect.partyName,
        idNo: suspect.idNumber,
        gender: suspect.gender,
        phone: suspect.phone,
        acctName: suspect.accountName,
        acctNo: suspect.accountNumber,
        bankName: suspect.bankName,
      });
    }
  }, [store.modal[store.type]]);
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
              label={'当事人姓名'}
              name="name"
              rules={[{ required: true, message: "当事人姓名必填" }]}
            >
              <Input placeholder={'当事人姓名'} />
            </FormItem>
            <FormItem
              label="身份证号"
              name="idNo"
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
                  _.map(store.consts.GENDER, v => <Select.Option key={v} value={v}>
                    {store.consts.GENDER_DESC[v]}</Select.Option>)
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
