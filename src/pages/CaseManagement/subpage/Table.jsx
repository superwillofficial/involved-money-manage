import React, { useEffect, Fragment } from "react";
import { useObserver } from "mobx-react-lite";
import { Link, useHistory } from 'react-router-dom';
import _ from "lodash";
import { Button, Table, Popconfirm, Badge } from "antd";
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { onColumn } from "@utils/table";
import { useStore } from "../store";

const useColumns = () => {
  const store = useStore();

  return [
    onColumn("案件号", "caseNo"),
    onColumn("案件名称", "caseName"),
    // onColumn("受理部门id", "departmentId"),
    // onColumn("受理部门名称", "department"),
    onColumn("当事人", "partys", {
      render: (text, record) => {
        const suspect = text
          .filter(el => store.consts.PARTY_DESC[el.type] === '赔偿方')
          .map(el => el.partyName)
          .join('、');
        return (
          <Fragment>
            { _.isEmpty(suspect) ? (
              <Fragment>
                <span className='grey-font'>暂无当事人</span>
                &nbsp; &nbsp;
                <Button
                  type="primary"
                  shape="round"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    console.log('currentCase', record);
                    store.setValue('currentCase', record);
                    store.setValue('type', 'party').openModal('party');
                  }}
                >新增当事人</Button>
              </Fragment>
            ) : (
              <span>{suspect}</span>
            )
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
            text={store.consts.CASESTATUS_FOR_CASE_MANAGEMENT_TABLE_DESC[text]}
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
              to={`/case-detail/${record.id}`}
              onClick={() => {
                store.caseStore.setCase(record);
              }}
            >详情</Link>
            &nbsp;&nbsp;
            <Popconfirm
              title="确认要删除?"
              onConfirm={() => store.deleteCase(record.id)}
            >
              <Button type="link" icon={<DeleteOutlined />} danger />
            </Popconfirm>
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
      <Button
        type="primary"
        size="large"
        shape="round"
        className="button-bottom button-top"
        icon={<PlusOutlined />}
        onClick={() => {
          store.setValue('type', 'input').openModal('input');
        }}
      >案件录入</Button>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        pagination={pagination}
      />
    </Fragment>
  );
});