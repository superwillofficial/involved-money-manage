import React, { useEffect, Fragment } from "react";
import { useObserver } from "mobx-react-lite";
import _ from "lodash";
import { Table } from "antd";
import { onColumn } from "@utils/table";
import { useStore } from "../store";
import { GENDER_DESC, PARTY_DESC } from "@config/consts";

const useColumns = () => {
  return [
    onColumn("嫌疑人id", "partyId"),
    onColumn("嫌疑人姓名", "partyName"),
    onColumn("开户银行", "bankName"),
    onColumn("银行账户", "accountNumber"),
    onColumn("银行户名", "accountName"),
    onColumn("性别", "gender", {
      render: text => GENDER_DESC[text]
    }),
    onColumn("身份证号", "IdNumber"),
  ];
};

export default () => useObserver(() => {
  const columns = useColumns();
  const store = useStore();
  const data = _.filter(store.case.party,
    el => PARTY_DESC[el.type] === '受偿方') || [];
  return (
    <Fragment>
      <Table
        rowKey="partyId"
        bordered={true}
        columns={columns}
        dataSource={data}
        pagination={false}
      />
    </Fragment>
  );
});