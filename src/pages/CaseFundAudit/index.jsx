import React from 'react';
import Query from './subpage/Query';
import Table from './subpage/Table';
import RecheckModal from './subpage/RecheckModal';
import Store from './store';
import '../index.less';

export default () => {
  return (
    <Store>

      {/* 查询块 */}
      <Query />

      {/* 表格 */}
      <Table />

      {/* 审核弹窗 */}
      <RecheckModal />

    </Store>
  );
};
