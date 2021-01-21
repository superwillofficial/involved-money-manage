import React from 'react';
import InputPage from './subpage/index';
import Store from './store';
import '../index.less';

export default () => {
  return (
    <Store>

      {/* 输入界面 */}
      <InputPage />

    </Store>
  );
};
