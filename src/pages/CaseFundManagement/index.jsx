import React from 'react';
import Query from './subpage/Query';
import Table from './subpage/Table';
import ConfirmModal from './subpage/ConfirmModal';
import Store from './store';
import '../index.less';

export default () => {
  return (
    <Store>

      {/* 查询块 */}
      <Query />

      {/* 表格 */}
      <Table />

      {/* 确认缴费弹窗 */}
      <ConfirmModal />

    </Store>
  );
};
