import React from 'react';
import DetailPage from './subpage/index';
import Modal from './subpage/Modal';
import Store from './store';
import '../index.less';

export default () => {
  return (
    <Store>

      {/* 详情页面 */}
      <DetailPage />

      {/* 弹窗 */}
      <Modal />
      
    </Store>
  );
};
