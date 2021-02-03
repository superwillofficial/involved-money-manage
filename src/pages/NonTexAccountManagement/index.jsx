import React from 'react';
import Query from './subpage/Query';
import Table from './subpage/Table';
import Modal from './subpage/Modal';
import Store from './store';
import '../index.less';

export default () => {
  return (
    <Store>

      {/* 表格 */}
      <Table />

      {/* 弹窗 */}
      <Modal />

    </Store>
  );
};
