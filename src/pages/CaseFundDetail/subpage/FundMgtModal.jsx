import React, { Fragment, useEffect } from "react";
import { useObserver } from "mobx-react-lite";
import _ from "lodash";
import { Table, Button, message, Popconfirm, Modal } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { onColumn } from "@utils/table";
import { caseFundDetailProcessing, whileStatistics } from "@utils/functions";
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
    onColumn("操作", "operation", {
      render: (text, record) => {
        if (store.case.status === store.consts.CASESTATUS.PAID ||
          store.case.status === store.consts.CASESTATUS.RECHECK_FAILED) {
          return (
            <Button
              type="link"
              onClick={() => {
                store.setValue('currentSubAcct', record.subAcctId);
                store.setValue('type', 'newSplit').openModal('newSplit');
              }}
            >新增资金处理</Button>
          );
        }
      }
    }),
  ];
};

const useExpandedColumns = () => {
  const store = useStore();
  return [
    onColumn("类型", "type", {
      render: (text, record) =>
        store.consts.PAYMENT_TYPE_DESC[text]
    }),
    onColumn("收款人", "partyName"),
    onColumn("收款账号", "acctNo"),
    onColumn("开户行", "bankName"),
    onColumn("账户名", "acctName"),
    onColumn("金额", "amount"),
    onColumn("操作", "operation", {
      render: (text, record, index) => {
        if (store.case.status === store.consts.CASESTATUS.PAID ||
          store.case.status === store.consts.CASESTATUS.RECHECK_FAILED) {
          return (
            <Fragment>
              <EditOutlined
                onClick={() => {
                  console.log("currentFundManagement", record);
                  store.setValue('currentFundManagement', record);
                  store.setValue("indexOfSubAcct", index);
                  store.setValue('type', 'editSplit').openModal('editSplit');
                }}
              />
              &nbsp; &nbsp;
              <DeleteOutlined />
            </Fragment>
          );
        }
      }
    }),
  ];
};

export default () => useObserver(() => {
  const store = useStore();
  const fundData = caseFundDetailProcessing(store.fund);
  const mainColumns = useMainColumns();
  const expandedColumns = useExpandedColumns();
  // 弹窗标题
  const title = {
    fundMgt: '涉案资金处置',
  }[store.type];

  const onCancel = () => {
    store.closeModal(store.type);
  };

  const onFinish = async () => {
    const res = await store.onDistribution();
    res ? message.success('资金处理录入成功!!') : message.error('资金处理录入失败!');
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
        dataSource={record.outcomeList || []}
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
            <Popconfirm
              key="restore"
              title="确认要还原? 数据将不被保存!"
              onConfirm={() => {
                store.setValue('fund', store.originalFund);
              }}
            >
              <Button
                shape="primary"
                danger
              >还原</Button>
            </Popconfirm>,
            <Popconfirm
              key="close"
              title="确认要关闭? 数据将不被保存"
              onConfirm={() => {
                store.setValue('fund', store.originalFund);
                onCancel();
              }}
            >
              <Button>关闭</Button>
            </Popconfirm>,
            <Button
              key="submit"
              shape="primary"
              onClick={onFinish}
            >提交</Button>
          ]}
        >
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
