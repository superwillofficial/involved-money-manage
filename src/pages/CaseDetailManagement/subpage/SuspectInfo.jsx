import React, { useEffect, Fragment } from "react";
import { useObserver } from "mobx-react-lite";
import _ from "lodash";
import { Table, Popconfirm, Button } from "antd";
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { onColumn } from "@utils/table";
import { useStore } from "../store";

const useColumns = () => {
  const store = useStore();
  return [
    onColumn("当事人", "partyName", {
      render: (text, record) => {
        return (
          <Button type="link">{text}</Button>
        );
      }
    }),
    onColumn("性别", "gender", {
      render: text => store.consts.GENDER_DESC[text]
    }),
    onColumn("身份证号", "idNumber"),
    onColumn("退款账户", "accountNumber"),
    onColumn("开户银行", "bankName"),
    onColumn("账户名", "accountName"),
    onColumn("联系电话", "phone"),
    onColumn("操作", "operation", {
      render: (text, record) => {
        return (
          <Fragment>
            <Button
              type="link"
              onClick={() => {
                store
                  .setValue('suspect', record)
                  .setValue('type', 'edit')
                  .openModal('edit');
              }}
            >修改</Button>
            <Button type="link">打印缴款单</Button>
            <Button type="link">分配子账户</Button>
            <Popconfirm
              title="确认要删除?"
              onConfirm={async () => await store.onDelete(record.partyId)}
            >
              <Button type="link" icon={<DeleteOutlined />} danger />
            </Popconfirm>
          </Fragment>
        );
      }
    }),
  ];
};

export default () => useObserver(() => {
  const columns = useColumns();
  const store = useStore();
  const data = _.filter(store.case.partys,
    el => store.consts.PARTY_DESC[el.type] === '赔偿方') || [];
  return (
    <Fragment>
      <Button
        type="primary"
        shape="circle"
        size="small"
        className='button-bottom-short'
        icon={<PlusOutlined />}
        onClick={() => {
          store.setValue('type', 'create').openModal('create');
        }}
      />
      <Table
        rowKey="partyId"
        columns={columns}
        dataSource={data}
        pagination={false}
      />
    </Fragment>
  );
});