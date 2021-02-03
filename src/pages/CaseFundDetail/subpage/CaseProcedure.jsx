import React, { Fragment } from "react";
import { useObserver } from "mobx-react-lite";
import { Collapse, Tabs, Table } from "antd";
import { onColumn } from "@utils/table";
import { useStore } from "../store";

const { TabPane } = Tabs;
const { Panel } = Collapse;

// TODO
const useColumns = (party) => {
  const store = useStore();
  return [
    onColumn('时间', "partyName"),
    onColumn("操作人", "gender"),
    onColumn("当前进度", "idNumber"),
  ];
};

export default () => useObserver(() => {
  const store = useStore();
  const caseData = store.case;
  const columns = useColumns();
  // TODO
  return (
    <Fragment>
      <Collapse defaultActiveKey={['1']} ghost={true}>
        <Panel
          className="button-top"
          header={<div className="title-font">案件流程</div>}
          key='1'
        >
          <Table
            rowKey=""
            columns={columns}
            // dataSource={}
            pagination={false}
          />
        </Panel>
      </Collapse>
    </Fragment>
  );
});