import React from 'react';
import Query from './subpage/Query';
import Table from './subpage/Table';
import InputModal from './subpage/InputModal';
import PartyModal from './subpage/PartyModal';
import Store from './store';
import '../index.less';

export default () => {
  return (
    <Store>

      {/* 查询块 */}
      <Query />

      {/* 表格 */}
      <Table />

      {/* 案件录入弹窗 */}
      <InputModal />

      {/* 新增当事人弹窗 */}
      <PartyModal />

    </Store>
  );
};
