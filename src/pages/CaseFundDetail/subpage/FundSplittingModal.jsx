import React, { useCallback, Fragment, useEffect, useState } from "react";
import { useObserver } from "mobx-react-lite";
import _ from "lodash";
import { Modal, Select, Form, Input, Row, Col } from "antd";
import { fundDistPrc } from "@utils/functions";
import { useStore } from "../store";

const FormItem = Form.Item;
const { Option } = Select;

export default () => useObserver(() => {
  const store = useStore();
  const [form] = Form.useForm();
  const [paymentType, setPaymentType] = useState(store.consts.TO_VICTIM);
  const [inputDisabled, setInputDisabled] = useState(true);
  // 弹窗标题
  const title = {
    newSplit: '新增资金拆分',
    editSplit: '编辑资金拆分',
  }[store.type];

  const onCancel = () => {
    form.resetFields();
    store.closeModal(store.type);
    store.setValue('type', 'fundMgt').openModal('fundMgt');
  };

  const onFinish = async () => {
    await form.validateFields();
    const data = form.getFieldsValue();
    console.log(data);
    let fund = [...store.fund];
    if (title === '新增资金拆分') {
      const index = _.findIndex(fund, (el) => {
        return el.subAcctId === store.currentSubAcct;
      });
      fund[index].outcomeList.push(data);
    } else if (title === '编辑资金拆分') {
      const index = _.findIndex(fund, (el) => {
        return el.subAcctId === store.currentFundManagement.subAcctId;
      });
      fund[index].outcomeList[store.indexOfSubAcct] = data;
    }
    store.setValue('fund', fund);

    onCancel();
  };

  const handleChange = (value) => {
    // 支付类型变更时，清空其它输入控件已有输入
    form.resetFields([
      'partyId',
      'acctNo',
      'acctName',
      'nontextId',
      'bankName',
      'bankCode',
      'amount',
      'remark',
    ]);
    setPaymentType(value);

    // TODO:
    // 仅当支付类型不在以下三项时，账户信息才允许修改
    // if (
    //   paymentType === store.consts.TO_VICTIM ||
    //   paymentType === store.consts.TO_SUSPECT ||
    //   paymentType === store.consts.TO_TREASURY
    // ) {
    //   setInputDisabled(true);
    // } else {
    //   setInputDisabled(false);
    // }
  };

  useEffect(() => {
    if (store.modal[store.type] && title === '编辑资金拆分') {
      setPaymentType(parseInt(store.currentFundManagement.type, 10));
      form.setFieldsValue({
        type: parseInt(store.currentFundManagement.type, 10),
        partyId: store.currentFundManagement.partyId,
        nontextId: store.currentFundManagement.nontextId,
        acctNo: store.currentFundManagement.acctNo,
        acctName: store.currentFundManagement.acctName,
        bankName: store.currentFundManagement.bankName,
        bankCode: store.currentFundManagement.bankCode,
        amount: store.currentFundManagement.amount,
        remark: store.currentFundManagement.remark,
      });
    }
  }, [store.modal[store.type] && title === '编辑资金拆分']);

  useEffect(() => {
    if (store.modal[store.type] && title === '新增资金拆分') {
      // 默认退还给受害人
      setPaymentType(store.consts.PAYMENT_TYPE.TO_VICTIM);
      form.setFieldsValue({
        type: store.consts.PAYMENT_TYPE.TO_VICTIM,
      });
    }
  }, [store.modal[store.type] && title === '新增资金拆分']);

  useEffect(() => {
    store.getNonTexAccts();
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
              label="支付类型"
              name="type"
              rules={[{ required: true, message: "支付类型必填" }]}
            >
              <Select
                onChange={handleChange}
                placeholder="请选择..."
              >
                {
                  _.map(store.consts.PAYMENT_TYPE, v => <Select.Option key={v} value={v}>
                    {store.consts.PAYMENT_TYPE_DESC[v]}</Select.Option>)
                }
              </Select>
            </FormItem>
            {
              paymentType === store.consts.PAYMENT_TYPE.TO_VICTIM ? (
                <FormItem
                  label="受害人"
                  name="partyId"
                  rules={[{ required: true, message: "受害人必填" }]}
                >
                  <Select
                    onSelect={(value, obj) => {
                      const party = store.case.partys.filter(
                        el => String(el.partyId) === obj.key)[0];
                      form.setFieldsValue({
                        acctNo: party.accountNumber,
                        acctName: party.accountName,
                        bankName: party.bankName,
                        bankCode: party.bankCode,
                      });
                    }}
                    placeholder="请选择..."
                  >
                    {
                      _.map(
                        store.case.partys.filter(el => store.consts.PARTY_DESC[el.type] === '受偿方'),
                        v => <Select.Option key={v.partyId} value={v.partyName}>
                          {v.partyName}</Select.Option>
                      )
                    }
                  </Select>
                </FormItem>
              ) : null
            }
            {
              paymentType === store.consts.PAYMENT_TYPE.TO_SUSPECT ? (
                <FormItem
                  label="嫌疑人"
                  name="partyId"
                  rules={[{ required: true, message: "嫌疑人必填" }]}
                >
                  <Select
                    onSelect={(value, obj) => {
                      const party = store.case.partys.filter(
                        el => String(el.partyId) === obj.key)[0];
                      form.setFieldsValue({
                        acctNo: party.accountNumber,
                        acctName: party.accountName,
                        bankName: party.bankName,
                        bankCode: party.bankCode,
                      });
                    }}
                    placeholder="请选择..."
                  >
                    {
                      _.map(
                        store.case.partys.filter(el => store.consts.PARTY_DESC[el.type] === '赔偿方'),
                        v => <Select.Option key={v.partyId} value={v.partyName}>
                          {v.partyName}</Select.Option>
                      )
                    }
                  </Select>
                </FormItem>
              ) : null
            }
            {
              paymentType === store.consts.PAYMENT_TYPE.TO_TREASURY ? (
                <FormItem
                  label="非税账户"
                  name="nontextId"
                  rules={[{ required: true, message: "非税账户必填" }]}
                >
                  <Select
                    onSelect={(value, obj) => {
                      const nonTexAcct = store.nonTexAccts.filter(
                        el => el.acctNo === obj.key)[0];
                      form.setFieldsValue({
                        acctNo: nonTexAcct.acctNo,
                        acctName: nonTexAcct.acctName,
                        bankName: nonTexAcct.bankName,
                        bankCode: nonTexAcct.bankCode,
                      });
                    }}
                    placeholder="请选择..."
                  >
                    {
                      _.map(
                        store.nonTexAccts,
                        v => <Select.Option key={v.acctNo} value={v.id}>
                          {v.acctName}</Select.Option>
                      )
                    }
                  </Select>
                </FormItem>
              ) : null
            }
            <FormItem
              label="账户号"
              name="acctNo"
            >
              <Input placeholder="账户号" disabled={inputDisabled} />
            </FormItem>
            <FormItem
              label="账户名"
              name="acctName"
            >
              <Input placeholder="账户名" disabled={inputDisabled} />
            </FormItem>
            <FormItem
              label="开户行"
              name="bankName"
            >
              <Input placeholder="开户行" disabled={inputDisabled} />
            </FormItem>
            <FormItem
              label="开户行行号"
              name="bankCode"
            >
              <Input placeholder="开户行行号" disabled={inputDisabled} />
            </FormItem>
            <FormItem
              label="金额"
              name="amount"
            >
              <Input placeholder="金额" />
            </FormItem>
            <FormItem
              label="备注"
              name="remark"
            >
              <Input.TextArea placeholder="请输入" />
            </FormItem>
          </Form>
        </Modal>
      ) : null}
    </Fragment>
  );
});
