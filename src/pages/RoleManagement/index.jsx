import React from 'react';
import Page from './subPage/index';
import Modal from './subPage/Modal';
import Store from './store';

export default () => {
  return (
    <Store>

      {/* 角色 */}
      <Page />

      {/* 新增/修改弹窗 */}
      <Modal />

    </Store>
  );
};
