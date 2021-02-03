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
    onColumn("账户名", "acctName"),
    onColumn("账户号", "acctNo"),
    onColumn("开户行名称", "bankName"),
    onColumn("开户行行号", "bankCode"),
    onColumn("说明", "remark"),
    onColumn("状态", "status", {
      render: (text, record) => {
        return (
          <Badge
            status={store.consts.ENABLE_COLOR[text]}
            text={store.consts.ENABLE_DESC[text]}
          />
        );
      }
    }),
    onColumn("操作", "operation", {
      render: (text, record) => {
        return (
          <Fragment>
            {record.status == "0" ?
              <Button
                type = "link"
                onClick={() => {
                  store.disableAcct(record.id);
                }}
              >停用</Button> : ""
            }
            {record.status == "1" ?
              <Button
                type = "link"
                onClick={() => {
                  store.enableAcct(record.id);
                }}
              >启用</Button> : undefined
            }
            {record.status == "1" ?
              <Button
                type = "link"
                onClick={() => {
                  store._nonTex = record;
                  store.setValue('type', 'edit').openModal('edit');
                }}
              >编辑</Button> : undefined
            }
            {/* {record.status == "1" ?
              <Button
                type = "link"
                onClick={() => {
                  store.removeAcct(record.id);
                }}
              >删除</Button> : undefined
            } */}
          </Fragment>
        );
      }
    }),
  ];
};

export default () => useObserver(() => {
  const columns = useColumns();
  const store = useStore();
  const history = useHistory();
  useEffect(() => {
    store.getNonTexAccts();
  }, []);
  const data = _.filter(store.nonTexAccts, (el) => {
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
          store.setValue('nonText', {});
          store.setValue('type', 'create').openModal('create');
        }}
      >新增非税账户</Button>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        pagination={false}
      />
    </Fragment>
  );
});