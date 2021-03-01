import React, { Fragment, useEffect } from "react";
import { useObserver } from "mobx-react-lite";
import { Collapse, Tabs, Table, Badge } from "antd";
import { onColumn } from "@utils/table";
import { useStore } from "../store";

const { TabPane } = Tabs;
const { Panel } = Collapse;

const useColumns = () => {
  const store = useStore();
  return [
    onColumn('时间', "createTime"),
    onColumn("操作人", "operator"),
    onColumn("案件ID", "caseId"),
    onColumn("说明备注", "remark"),
    onColumn("操作前状态", "preStatus", {
      render: (text, record) => {
        return (
          <Badge
            status={store.consts.CASESTATUS_COLOR[text]}
            text={store.consts.CASESTATUS_DESC[text]}
          />
        );
      }
    }),
    onColumn("操作后状态", "curStatus", {
      render: (text, record) => {
        return (
          <Badge
            status={store.consts.CASESTATUS_COLOR[text]}
            text={store.consts.CASESTATUS_DESC[text]}
          />
        );
      }
    }),
  ];
};

export default () => useObserver(() => {
  const store = useStore();
  const caseProcedure = store.caseProcedure;
  const columns = useColumns();

  return (
    <Fragment>
      <Collapse defaultActiveKey={['1']} ghost={true}>
        <Panel
          className="button-top"
          header={<div className="title-font">案件流程</div>}
          key='1'
        >
          <Table
            rowKey="id"
            columns={columns}
            dataSource={caseProcedure}
            pagination={false}
          />
        </Panel>
      </Collapse>
    </Fragment>
  );
});