import React, { useCallback, useEffect, Fragment } from "react";
import { useObserver } from "mobx-react-lite";

import { Popconfirm, message, Button, Table } from 'antd';
import { onColumn } from '@utils/table';
import { useStore } from "../store";
import _ from 'lodash';

const useActions = () => {
  const store = useStore();
  // 修改用户
  const onEdit = useCallback((record) => {
    return () => {
      store
        .setValue('type', 'edit')
        .setValue('detail', {
          ...record,
          roleId: _.get(record, 'roleList[0].id', null),
        })
        .openModal('edit');
    };
  }, []);
  // 删除用户
  const onDelete = useCallback((id) => {
    return () => {
      store
        .onDelete(id)
        .then(isSuccess => {
          if (isSuccess) {
            message.success('删除成功');
            store.getUsers();
          } else {
            message.error('删除失败');
          }
        });
    };
  }, []);
  // 重置密码
  const onResetPw = useCallback((id) => {
    return () => {
      store
        .onResetPw(id)
        .then(isSuccess => {
          if (isSuccess) {
            message.success('重置密码成功');
            store.getUsers();
          } else {
            message.error('重置密码失败');
          }
        });
    };
  }, []);

  return {
    onEdit,
    onDelete,
    onResetPw,
  };
};

const useColumns = () => {
  const {
    onEdit,
    onDelete,
    onResetPw,
  } = useActions();
  return [
    onColumn('用户名', 'username'),
    onColumn('角色', 'roleList[0].roleName', {
      render: (text, record) => {
        return _.get(record, 'roleList[0].roleName', '');
      }
    }),
    onColumn('名称', 'name'),
    onColumn('手机号', 'phone'),
    onColumn('邮箱', 'email'),
    // onColumn('所属机构', 'organizationName'),
    onColumn('操作', 'operate', {
      render: (text, record) => {
        return (
          <Fragment>
            <Popconfirm
              title="确认重置密码？"
              onConfirm={onResetPw(record.id)}>
              <Button type="link">重置密码</Button>
            </Popconfirm>

            <Button type="link" onClick={onEdit(record)}>编辑</Button>

            <Popconfirm
              title="确认删除？"
              onConfirm={onDelete(record.id)}>
              <Button type="link" danger>删除</Button>
            </Popconfirm>
          </Fragment>
        );
      }
    }),
  ];
};

const usePagination = () => {
  const store = useStore();
  // 表格查询
  const onTableChange = (current, pageSize) => {
    store
      .setValue('page', { ...store.page, current, pageSize })
      .getUsers();
  };
  // 表格显示数改变
  const onShowSizeChange = (current, pageSize) => {
    store
      .setValue('page', { ...store.page, current, pageSize })
      .getUsers();
  };
  const showTotal = (total, range) => {
    return `共 ${total} 条，目前为第${range[0]}-${range[1]} 条`;
  };
  useEffect(() => {
    store.getUsers();
  }, []);
  return {
    showTotal,
    showQuickJumper: true,
    showSizeChanger: true,
    onChange: onTableChange,
    onShowSizeChange: onShowSizeChange,
    ...store.page,
  };
};

export default () => useObserver(() => {
  const store = useStore();
  // 表格列
  const columns = useColumns();
  // 表格分页
  const pagination = usePagination();
  // 新增用户弹窗
  return (
    <Fragment>
      <div className="content-block-box-row">
        <Button
          type="primary"
          onClick={() => {
            store
              .setValue('type', 'create')
              .setValue('detail')
              .openModal('create');
          }}
        >
          新增
        </Button>
      </div>
      <Table
        rowKey="id"
        bordered={true}
        columns={columns}
        dataSource={store.users}
        pagination={pagination}
      />
    </Fragment>
  );
});
