import React from 'react';
import Query from './subPage/Query';
import Table from './subPage/Table';
import Modal from './subPage/Modal';
import Store from './store';
import './index.less';

export default () => {
  return (
    <Store>

      {/* 查询块 */}
      <Query />

      {/* 表格 */}
      <Table />

      {/* 弹窗 */}
      <Modal />

    </Store>
  );
};
