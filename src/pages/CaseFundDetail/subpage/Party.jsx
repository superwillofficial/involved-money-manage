import React, { Fragment } from "react";
import { useObserver } from "mobx-react-lite";
import { Row, Col, Tabs, Table, Button } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import { onColumn } from "@utils/table";
import { useStore } from "../store";

const { TabPane } = Tabs;

const useColumns = (party) => {
  const store = useStore();
  return [
    onColumn(`${party === 'suspect' ? '嫌疑人' : '受害人'}`, "partyName", {
      render: (text, record) => {
        return (
          <Button type="link">{text}</Button>
        );
      }
    }),
    onColumn("性别", "gender", {
      render: text => store.consts.GENDER_DESC[text]
    }),
    onColumn("身份证号码", "idNumber"),
    onColumn(`${party === 'suspect' ? '退' : '收'}款账户`, "accountNumber"),
    onColumn("开户行", "bankName"),
    onColumn("账户名", "accountName"),
    onColumn("联系电话", "phone"),
    onColumn("操作", "operation", {
      render: (text, record) => {
        if (party === 'victim') {
          return (
            <Fragment>
              {store.case.status === store.consts.CASESTATUS.PAID ||
                store.case.status === store.consts.CASESTATUS.RECHECK_FAILED ?
                <Button
                  type="link"
                  onClick={() => {
                    store.setValue('currentVictim', record);
                    store.setValue('type', 'editVictim').openModal('editVictim');
                  }}
                >修改</Button> : null}
              {store.case.status === store.consts.CASESTATUS.PAID ||
                store.case.status === store.consts.CASESTATUS.RECHECK_FAILED ?
                <Button
                  type="link"
                  onClick={() => {
                    store.deleteParty([record.partyId]);
                  }}
                >删除</Button> : null}
            </Fragment>
          );
        }
      }
    }),
  ];
};

export default () => useObserver(() => {
  const store = useStore();
  const caseData = store.case;
  const suspectColumns = useColumns('suspect');
  const victimColumns = useColumns('victim');
  const suspectData = _.filter(caseData.partys,
    el => store.consts.PARTY_DESC[el.type] === '赔偿方') || [];
  const victimData = _.filter(caseData.partys,
    el => store.consts.PARTY_DESC[el.type] === '受偿方') || [];

  return (
    <Fragment>
      <div className="title-font">当事人</div>
      <Tabs defaultActiveKey="suspect">
        <TabPane tab="嫌疑人" key="suspect">
          <Table
            rowKey="partyId"
            columns={suspectColumns}
            dataSource={suspectData}
            pagination={false}
          />
        </TabPane>
        <TabPane tab="受害人" key="victim">
          {store.case.status === store.consts.CASESTATUS.PAID ||
            store.case.status === store.consts.CASESTATUS.RECHECK_FAILED ?
            <Button
              type="primary"
              size="middle"
              shape="round"
              className='button-bottom'
              icon={<PlusOutlined />}
              onClick={() => {
                store.setValue('type', 'createVictim').openModal('createVictim');
              }}
            >添加受害人</Button> : null}
          <Table
            rowKey="partyId"
            columns={victimColumns}
            dataSource={victimData}
            pagination={false}
          />
        </TabPane>
      </Tabs>
    </Fragment>
  );
});