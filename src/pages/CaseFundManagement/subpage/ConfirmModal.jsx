import React, { Fragment, useEffect } from "react";
import { useObserver } from "mobx-react-lite";
import _ from "lodash";
import { Table, Button, message, Modal } from "antd";
import { onColumn } from "@utils/table";
import { forPaymentConfirm } from "@utils/functions";
import { useStore } from "../store";

const useMainColumns = () => {
  const store = useStore();
  return [
    onColumn("嫌疑人姓名", "partyName", {
      render: (text, record) => {
        return (
          <Button type="link">{text}</Button>
        );
      }
    }),
    onColumn("子账号", "subAcctId"),
    onColumn("身份证号码", "idNumber"),
    onColumn("金额", "amount"),
  ];
};

const useExpandedColumns = () => {
  return [
    onColumn("进账账户号", "acctNo"),
    onColumn("账户名", "acctName"),
    onColumn("开户行", "bankName"),
    onColumn("单笔进账金额", "amount"),
    onColumn("缴费时间", "depositTime"),
  ];
};

export default () => useObserver(() => {
  const store = useStore();
  const fundData = forPaymentConfirm(store.fund);
  const mainColumns = useMainColumns();
  const expandedColumns = useExpandedColumns();
  // 弹窗标题
  const title = {
    confirm: '确认入账',
  }[store.type];

  const onCancel = () => {
    store.closeModal(store.type);
  };

  const onFinish = async () => {
    const res = await store.onConfirm(store.currentCase.id);
    res ? message.success('确认入账成功！') : message.error('确认入账失败');
    onCancel();
  };

  useEffect(() => {

  }, []);

  const expandedRowRender = (record) => {
    return (
      <Table
        rowKey="acctNo"
        size="small"
        title={() => <div className="sub-table-title">账户信息</div>}
        dataSource={record.incomeList || []}
        columns={expandedColumns}
        pagination={false}
      />
    );
  };

  return (
    <Fragment>
      {store.modal[store.type] ? (
        <Modal
          width="85%"
          title={title}
          visible={store.modal[store.type] && title}
          onCancel={onCancel}
          onOk={onFinish}
          footer={[
            <Button
              key="close"
              onClick={() => {
                onCancel();
              }}
            >取消</Button>,
            <Button
              key="submit"
              shape="primary"
              onClick={onFinish}
            >确认入账</Button>
          ]}
        >
          <Button
            type="primary"
            size="large"
            shape="round"
            className='button-bottom'
            onClick={async () => {
              const res = await store.onSync(store.currentCase.id);
              res ? message.success('同步进账信息成功！') : message.error('同步进账信息失败');
            }}
          >同步进账信息</Button>
          <Table
            rowKey="subAcctId"
            columns={mainColumns}
            expandable={{
              expandedRowRender,
              onExpand: (expanded, record) => { console.log('onExpand', expanded, record); }
            }}
            dataSource={fundData}
            pagination={false}
          />
        </Modal>
      ) : null}
    </Fragment>
  );
});
