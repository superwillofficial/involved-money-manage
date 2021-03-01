import React, { useEffect, Fragment } from "react";
import { useObserver } from "mobx-react-lite";
import { Link, useHistory } from 'react-router-dom';
import _ from "lodash";
import { Button, Table, Popconfirm, Badge } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import { onColumn } from "@utils/table";
import { useStore } from "../store";

const useColumns = () => {
  const store = useStore();

  return [
    onColumn("子账号", "acctNo"),
    onColumn("申请时间", "applyTime"),
    onColumn("结束时间", "stopTime"),
    onColumn("状态", "status", {
      render: (text, record) => {
        return (
          <Badge
            status={store.consts.SUBACCOUNT_STATUS_COLOR[text]}
            text={store.consts.SUBACCOUNT_STATUS_DESC[text]}
          />
        );
      }
    }),
  ];
};

const usePagination = () => {
  const store = useStore();
  //表格查询
  const onTableChange = (current, pageSize) => {
    store.setValue("page", { ...store.page, current, pageSize }).getSubAccts();
  };
  //表格显示数改变
  const onShowSizeChange = (current, pageSize) => {
    store.setValue("page", { ...store.page, current, pageSize }).getSubAccts();
  };
  const showTotal = (total, range) => {
    return `共${total}条记录，第${total[0]}到${total[1]}条`;
  };
  return {
    showQuickJumper: true,
    showSizeChanger: true,
    showTotal: showTotal,
    onChange: onTableChange,
    onShowSizeChange: onShowSizeChange,
    ...store.page
  };
};

export default () => useObserver(() => {
  const columns = useColumns();
  const store = useStore();
  const pagination = usePagination();

  const data = _.filter(store.subAccts, (el) => {
    return el.status !== -1;
  });
  return (
    <Fragment>
      <div className="title-text">子账号明细</div>
      <Button
        type="primary"
        size="large"
        shape="round"
        className='button-bottom'
        onClick={() => store.setValue('accountType', 'main')}
      >返回</Button>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        pagination={pagination}
      />
    </Fragment>
  );
});