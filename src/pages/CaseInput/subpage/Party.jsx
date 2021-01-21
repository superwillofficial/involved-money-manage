import React, { useCallback, Fragment, useEffect } from "react";
import { useObserver } from "mobx-react-lite";
import _ from "lodash";
import { Table, Button, Collapse } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import { onColumn } from "@utils/table";
import { useStore } from "../store";
import { GENDER_DESC, PARTY_DESC } from "@config/consts";

const useColumns = (party) => {
  return [
    onColumn(`${party}姓名`, "name"),
    onColumn("身份证号", "IdNo"),
    onColumn("性别", "gender", {
      render: text => GENDER_DESC[text]
    }),
    onColumn("联系电话", "phone"),
    onColumn("银行户名", "acctName"),
    onColumn("银行账户", "acctNo"),
    onColumn("开户银行", "bankName"),
    onColumn("登记账号与当事人类型", "acctType"),
  ];
};

export default () => useObserver(() => {
  const store = useStore();
  const suspectColumns = useColumns('嫌疑人');
  const victimColumns = useColumns('受害人');
  const suspectData = _.filter(store.party,
    el => PARTY_DESC[el.type] === '赔偿方') || [];
  const victimData = _.filter(store.party,
    el => PARTY_DESC[el.type] === '受偿方') || [];

  return (
    <Fragment>
      <Collapse defaultActiveKey={['1', '2']}>
        <Collapse.Panel header="嫌疑人信息" key="1">
          <Button
            type="primary"
            shape="circle"
            size="small"
            className='button-bottom-short'
            icon={<PlusOutlined />}
            onClick={() => {
              store.setValue('type', 'suspect').openModal('suspect');
            }}
          />
          <Table
            rowKey="IdNo"
            bordered={true}
            columns={suspectColumns}
            dataSource={suspectData}
            pagination={false}
          />
        </Collapse.Panel>
        <Collapse.Panel header="受害人信息" key="2">
          <Button
            type="primary"
            shape="circle"
            size="small"
            className='button-bottom-short'
            icon={<PlusOutlined />}
            onClick={() => {
              store.setValue('type', 'victim').openModal('victim');
            }}
          />
          <Table
            rowKey="IdNo"
            bordered={true}
            columns={victimColumns}
            dataSource={victimData}
            pagination={false}
          />
        </Collapse.Panel>
      </Collapse>
    </Fragment>
  );
});
