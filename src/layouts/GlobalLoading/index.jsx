import React from 'react';
import { useObserver } from "mobx-react-lite";

import { Spin } from 'antd';
import { useStore } from '@stores';
import './index.less';

const GlobalLoading = () => useObserver(() => {
  const store = useStore();
  if (store.requestStore.inRequest) {
    return (
      <div className="global-mark">
        <Spin size="large"/>
      </div>
    );
  }
  return null;
});

export default GlobalLoading;
