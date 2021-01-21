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
        const suspect = text.map(el => el.partyName).join('、');
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
              to={`/case-detail/${record.id}`}
              onClick={() => {
                store.caseStore.setCase(record);
              }}
            >详情</Link>
            <Popconfirm
              title="确认要删除?"
            // onConfirm={() => deleteRole(item.id)}
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
      <Button
        type="primary"
        size="large"
        shape="round"
        className='button-bottom'
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