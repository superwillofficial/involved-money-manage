import React, { Fragment, useEffect } from "react";
import { useObserver } from "mobx-react-lite";
import { Table, Button, message, Popconfirm, Card, Image, Tabs } from "antd";
import { useHistory } from 'react-router-dom';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { onColumn } from "@utils/table";
import { caseFundDetailProcessing, whileStatistics } from "@utils/functions";
import { useStore } from "../store";

const { TabPane } = Tabs;

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
  ];
};

export default () => useObserver(() => {
  const store = useStore();
  const history = useHistory();
  const fundData = caseFundDetailProcessing(store.fund);
  const statisticsData = whileStatistics(store.fund);
  const mainColumns = useMainColumns();
  const expandedColumns = useExpandedColumns();
  const imageArray = [
    {
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
      uid: '-2',
      name: 'image.png',
      status: 'done',
      url: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1413032001,3640357074&fm=26&gp=0.jpg',
    },
    {
      uid: '-3',
      name: 'image.png',
      status: 'done',
      url: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3564574551,3491080156&fm=26&gp=0.jpg',
    },
    {
      uid: '-4',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
      uid: '-xxx',
      percent: 50,
      name: 'image.png',
      status: 'uploading',
      url: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1023158044,974761325&fm=26&gp=0.jpg',
    },
  ];
  const uploadButton = (
    <div
      className="upload-button"
      onClick={() => {
        store.setValue('type', 'upload').openModal('upload');
      }}
    >
      <PlusOutlined
        className="plusoulined"
      />
      <div
        className="upload-font"
      >上传</div>
    </div>
  );

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
      <div className="title-font button-top button-bottom">资金处置方案</div>
      {store.case.status === store.consts.CASESTATUS.PAID ||
        store.case.status === store.consts.CASESTATUS.RECHECK_FAILED ?
        <>
          <Button
            type="primary"
            size="middle"
            shape="round"
            className="button-bottom-short"
            onClick={() => {
              store.setValue('type', 'fundMgt').openModal('fundMgt');
            }}
          >录入资金处理</Button>
          <span>&nbsp;&nbsp;</span>
        </> : null}
      {store.case.status === store.consts.CASESTATUS.PAID ||
        store.case.status === store.consts.CASESTATUS.RECHECK_FAILED ?
        <Button
          type="primary"
          size="middle"
          shape="round"
          className="button-bottom-short"
          onClick={async () => {
            const res = await store.onApply();
            res ? message.success('提交复核成功！') : message.error('提交复核失败');
            history.goBack();
          }}
        >提交复核</Button> : null}
      {store.case.status === store.consts.CASESTATUS.RECHECKING ?
        <Button
          type="primary"
          size="middle"
          shape="round"
          className="button-bottom-short"
          onClick={() => {
            store.setValue('type', 'recheck').openModal('recheck');
          }}
        >复核</Button> : null}
      <Tabs defaultActiveKey="statistics">
        <TabPane tab="资金处理统计" key="statistics">
          <Table
            rowKey={record => record.acctNo}
            columns={expandedColumns}
            dataSource={statisticsData}
            pagination={false}
          />
        </TabPane>
        <TabPane tab="资金处理明细" key="detail">
          <Table
            rowKey="subAcctId"
            columns={mainColumns}
            expandable={{ expandedRowRender }}
            dataSource={fundData}
            pagination={false}
          />
        </TabPane>
      </Tabs>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <div
          className="grey-font"
        >处置依据: &nbsp;</div>
        {store.case.status === store.consts.CASESTATUS.INPUTING ||
          store.case.status === store.consts.CASESTATUS.PAID ?
          _.map(imageArray, (item, index) =>
            <Card
              hoverable
              key={item.uid}
              className="image-card"
              cover={
                <Image
                  // width={200}
                  src={item.url}
                  placeholder={
                    <Image
                      preview={false}
                      src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200"
                      width={200}
                    />
                  }
                />
              }
              actions={[
                <Popconfirm
                  title="确认要删除?"
                  onConfirm={() => {
                    console.log("to be deleted:", item);
                  }}
                >
                  <DeleteOutlined />
                </Popconfirm>,
              ]}
            />
          ) :
          _.map(imageArray, (item, index) =>
            <Image
              key={item.uid}
              src={item.url}
              className="image-card"
              placeholder={
                <Image
                  preview={false}
                  src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200"
                  width={200}
                />
              }
            />
          )
        }
        {store.case.status === store.consts.CASESTATUS.INPUTING ||
          store.case.status === store.consts.CASESTATUS.PAID ? uploadButton : null}
      </div>
    </Fragment>
  );
});