import React, { useEffect, Fragment } from "react";
import { useObserver } from "mobx-react-lite";
import { Link, useHistory } from 'react-router-dom';
import _ from "lodash";
import { Button, Table, message, Badge } from "antd";
import { onColumn } from "@utils/table";
import { useStore } from "../store";

const useColumns = () => {
  const store = useStore();

  return [
    onColumn("案件号", "caseNo"),
    onColumn("案件名称", "caseName"),
    // onColumn("受理部门id", "departmentId"),
    onColumn("受理单位", "department"),
    onColumn("嫌疑人", "partys", {
      render: (text, record) => {
        const suspect = text
          .filter(el => store.consts.PARTY_DESC[el.type] === '赔偿方')
          .map(el => el.partyName)
          .join('、');
        return (
          <Fragment>
            { _.isEmpty(suspect) ?
              <span className='grey-font'>暂无当事人</span> :
              <span>{suspect}</span>
            }
          </Fragment>
        );
      }
    }),
    onColumn("被害人", "partys", {
      render: (text, record) => {
        const victim = text
          .filter(el => store.consts.PARTY_DESC[el.type] === '受偿方')
          .map(el => el.partyName)
          .join('、');
        return (
          <Fragment>
            { _.isEmpty(victim) ?
              <span className='grey-font'>暂无当事人</span> :
              <span>{victim}</span>
            }
          </Fragment>
        );
      }
    }),
    onColumn("状态", "status", {
      render: (text, record) => {
        return (
          <Badge
            status={store.consts.CASESTATUS_COLOR[text]}
            text={store.consts.CASESTATUS_DESC[text]}
          />
        );
      }
    }),
    // onColumn("创建时间", "createTime"),
    onColumn("操作", "operation", {
      render: (text, record) => {
        return (
          <Fragment>
            <Link
              to={'/case-fund-detail'}
              onClick={() => {
                store.caseStore.setCase(record);
              }}
            >详情</Link>
            &nbsp;&nbsp;
            {record.status === store.consts.CASESTATUS.UNPAID ?
              <Button
                type="link"
                onClick={async () => {
                  const res = await store.onConfirm(record.id);
                  res ? message.success('确认入账成功！') : message.error('确认入账失败');
                }}
              >确认入账</Button> : null}
            &nbsp;&nbsp;
            {record.status === store.consts.CASESTATUS.PAID ||
              record.status === store.consts.CASESTATUS.RECHECK_FAILED ?
              <Link
                to={'/case-fund-detail'}
                onClick={() => {
                  store.caseStore.setCase(record);
                }}
              >资金处置分配</Link> : null}
          </Fragment>
        );
      }
    }),
  ];
};

const usePagination = () => {
  const store = useStore();
  //表格查询
  const onTableChange = (current, pageSize) => {
    store.setValue("page", { ...store.page, current, pageSize }).getCases();
  };
  //表格显示数改变
  const onShowSizeChange = (current, pageSize) => {
    store.setValue("page", { ...store.page, current, pageSize }).getCases();
  };

  useEffect(() => {
    store.getCases();
  }, []);

  return {
    showQuickJumper: true,
    showSizeChanger: true,
    onChange: onTableChange,
    onShowSizeChange: onShowSizeChange,
    ...store.page
  };
};

export default () => useObserver(() => {
  const columns = useColumns();
  const store = useStore();
  const pagination = usePagination();
  const history = useHistory();
  const data = _.filter(store.cases, (el) => {
    return el.status !== -1;
  });
  return (
    <Fragment>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        pagination={pagination}
      />
    </Fragment>
  );
});