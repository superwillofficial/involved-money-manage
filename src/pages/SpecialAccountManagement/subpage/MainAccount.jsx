import React, { useEffect, Fragment } from "react";
import { useObserver } from "mobx-react-lite";
import _ from "lodash";
import { Button, Table, Badge } from "antd";
import { onColumn } from "@utils/table";
import { useStore } from "../store";

const useColumns = () => {
  const store = useStore();

  return [
    onColumn("账户名", "acctName"),
    onColumn("账户号", "acctNo"),
    onColumn("开户行名称", "bankName"),
    onColumn("cid", "bankUri"),
    onColumn("状态", "status", {
      render: (text, record) => {
        return (
          <Badge
            status={store.consts.SIGNMENT_STATUS_COLOR[text]}
            text={store.consts.SIGNMENT_STATUS_DESC[text]}
          />
        );
      }
    }),
    onColumn("操作", "operation", {
      render: (text, record) => {
        return (
          <Fragment>
            {store.consts.SIGNMENT_STATUS_DESC[record.status] == '已签约' &&
              <>
                <Button
                  type="link"
                >解约</Button>
                <Button
                  type="link"
                  onClick={() => {
                    store.setValue('currentAcct', record);
                    store.setValue('accountType', 'sub');
                    store.getSubAccts(record.id);
                  }}
                >子账户管理</Button>
                <Button
                  type="link"
                >详情</Button>
              </>
            }
            {store.consts.SIGNMENT_STATUS_DESC[record.status] == '未签约' &&
              <Button
                type="link"
              >签约</Button>
            }
          </Fragment>
        );
      }
    }),
  ];
};

export default () => useObserver(() => {
  const columns = useColumns();
  const store = useStore();
  useEffect(() => {
    store.getMainAccts();
  }, []);
  const data = _.filter(store.mainAccts, (el) => {
    return el.status !== -1;
  });
  return (
    <Fragment>
      <div className="title-text">主账号管理</div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        pagination={false}
      />
    </Fragment>
  );
});