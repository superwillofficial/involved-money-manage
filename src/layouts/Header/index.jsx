import React from 'react';
import { useObserver } from "mobx-react-lite";

import { Layout } from 'antd';
import Menu from '../Menu';
import UserCenter from './UserCenter';
import LoadingBar from './LoadingBar';
import Modal from './Modal';
import { SYSYTEM_NAME } from '@config/sysConsts';
import './index.less';
import Pic from '../../assets/images/avatar.png';

const { Header } = Layout;

export default (props) => useObserver(() =>{
  return (
    <Header className="header-block">

      <div className="header-block-title">
        {/* <img className="header-block-title-logo" src={Pic} alt="Logo" /> */}
        {SYSYTEM_NAME}
      </div>

      {/* 菜单栏 */}
      <div className="header-block-menu">
        <Menu />
      </div>

      {/* 用户中心 */}
      <div className="header-block-action">
        <UserCenter />
      </div>

      {/* 加载进度条 */}
      {/* <LoadingBar /> */}

      {/* 修改密码弹窗 */}
      <Modal />

    </Header>
  );
});
