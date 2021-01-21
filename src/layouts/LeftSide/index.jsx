import React from 'react';
import { useObserver } from "mobx-react-lite";
import { Layout } from 'antd';

import Menu from '../Menu';
import { useStore } from '../../stores';
import './index.less';

const { Sider } = Layout;

export default (props) => useObserver(() => {
  const store = useStore();
  return (
    <Sider className="sider-block" >
      <div className="header-block-menu">
        <Menu />
      </div>
    </Sider>
  );
});
