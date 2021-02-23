import React, { useCallback, useEffect, Fragment } from "react";
import { useObserver } from "mobx-react-lite";

import { Popconfirm, Button, Table, message } from "antd";
import { onColumn } from "@utils/table";
import { useStore } from "../store";

const useActions = () => {
  const store = useStore();
  const onEdit = useCallback(record => {
    return () => {
      store
        .setValue('type', 'edit')
        .setValue('detail', record)
        .openModal('edit');
    };
  }, []);

  const onDelete = useCallback(async (record) => {
    const res = await store.onOrgDelete(record.id);
    res.code === 0 ? message.success('删除成功') : message.error('删除失败');
  }, []);

  return {
    onEdit,
    onDelete
  };
};

const useColumns = () => {
  const { onEdit, onDelete } = useActions();
  const store = useStore();

  return [
    onColumn("机构id", "id"),
    onColumn("机构编码", "dictKey"),
    onColumn("机构名称", "dictValue"),
    onColumn("操作", "operator", {
      render: (text, record) => {
        return (
          <Fragment>
            <Button type="link" onClick={onEdit(record)}>
              编辑
            </Button>
            <Popconfirm title="确认删除?" onConfirm={() => onDelete(record)}>
              <Button type="link" danger>
                删除
              </Button>
            </Popconfirm>
          </Fragment>
        );
      }
    })
  ];
};

const usePagination = () => {
  const store = useStore();

  useEffect(() => {
    store.onOrgList();
  }, []);

  return {
    showQuickJumper: true,
    showSizeChanger: true,
    total: store.orgList.length,
  };
};

export default () =>
  useObserver(() => {
    const columns = useColumns();
    const store = useStore();
    const pagination = usePagination();
    const data = store.orgList;
    return (
      <Fragment>
        <div className="content-block-box-row">
          <Button
            type="primary"
            onClick={() => {
              store
                .setValue("type", "create")
                .setValue("detail", {})
                .openModal("create");
            }}
          >
            新增
          </Button>
        </div>
        <Table
          rowKey="id"
          bordered={true}
          columns={columns}
          dataSource={data}
          pagination={pagination}
        />
      </Fragment>
    );
  });
