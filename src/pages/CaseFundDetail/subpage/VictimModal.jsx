import React, { useCallback, Fragment, useEffect } from "react";
import { useObserver } from "mobx-react-lite";
import _ from "lodash";
import { Modal, message, Form, Input, Select, Row, Col } from "antd";
import { 
  dataProcessingWhenCreatingVictim,
  dataProcessingWhenEditingVictim
} from "@utils/functions";
import { useStore } from "../store";

const FormItem = Form.Item;

export default () => useObserver(() => {
  const store = useStore();
  const [form] = Form.useForm();

  // 弹窗标题
  const title = {
    createVictim: '新增受害人',
    editVictim: '编辑受害人',
  }[store.type];

  const onCancel = () => {
    form.resetFields();
    store.closeModal(store.type);
  };

  const onFinish = async () => {
    const data = form.getFieldsValue();
    let res;
    if(title === '新增受害人') {
      res = await store.addParty(dataProcessingWhenCreatingVictim(data));
    } else {
      res = await store.editParty(dataProcessingWhenEditingVictim(data));
    }
    res ? message.success(`${title}成功`) : message.error(`${title}失败`);
    onCancel();
  };

  useEffect(() => {
    const currentVictim = store.currentVictim;
    form.setFieldsValue({
      name: currentVictim.partyName,
      gender: currentVictim.gender,
      idNo: currentVictim.idNumber,
      phone: currentVictim.phone,
      acctNo: currentVictim.accountNumber,
      bankName: currentVictim.bankName,
      acctName: currentVictim.accountName,
      bankCode: currentVictim.bankCode,
    });
  }, [store.modal[store.type] && title]);

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
              label='受害人姓名'
              name="name"
              rules={[{ required: true, message: "受害人姓名必填" }]}
            >
              <Input placeholder='受害人姓名' />
            </FormItem>
            <FormItem
              label='性别'
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
              label='身份证号'
              name="idNo"
              rules={[{ required: true, message: "身份证号必填" }]}
            >
              <Input placeholder='身份证号' />
            </FormItem>
            <FormItem
              label='联系电话'
              name="phone"
            >
              <Input placeholder='联系电话' />
            </FormItem>
            <FormItem
              label='银行账户号'
              name="acctNo"
              rules={[{ required: true, message: "银行账户号必填" }]}
            >
              <Input placeholder='银行账户号' />
            </FormItem>
            <FormItem
              label="开户行"
              name="bankName"
              rules={[{ required: true, message: "开户行必填" }]}
            >
              <Input placeholder="开户行" />
            </FormItem>
            <FormItem
              label="账户名"
              name="acctName"
              rules={[{ required: true, message: "账户名必填" }]}
            >
              <Input placeholder="账户名" />
            </FormItem>
            <FormItem
              label="开户行行号"
              name="bankCode"
            >
              <Input placeholder="开户行行号" />
            </FormItem>
          </Form>
        </Modal>
      ) : null}
    </Fragment>
  );
});
