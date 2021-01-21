import React from 'react';
import { useObserver } from "mobx-react-lite";
import { useHistory } from 'react-router-dom';

import {
  Menu,
  Avatar,
  Dropdown,
  message,
} from 'antd';
import { RightOutlined } from '@ant-design/icons';

import avatar from '../../assets/images/avatar.png';
import { useStore } from '@stores';
import './UserCenter.less';

const MenuItem = Menu.Item;
const MenuDivider = Menu.Divider;

/**
 * 个人资料
 */
const MenuComponent = () => useObserver(() => {
  const store = useStore();
  const { appStore } = store;
  const history = useHistory();
  const onClick = ({ key }) => {};

  const menus = [
    {
      key: 'changePasssword',
      icon: 'edit',
      text: '修改密码',
      className: 'changePasssword',
      onChange: () => {
        appStore.openModal('changePassword');
      },
    },
    {
      key: 'logout',
      icon: 'iconyonghu-tuichu',
      text: '退出登录',
      className: 'logout',
      onChange: () => {
        localStorage.clear();
        history.push('/login');
        message.success('退出登录');
      },
    },
  ];
  return (
    <Menu onClick={onClick} className="menu">
      {menus.map((menu, index) => {
        if (menu.key === 'divider') {
          return <MenuDivider className="menu-divider" key={index}/>;
        }
        return (
          <MenuItem className={`${menu.className} menu-item`} key={menu.key}
            onClick={() => { menu.onChange ? menu.onChange() : null; } }
          >
            <i className={`menu-item-icon iconfont ${menu.icon}`} />
            {menu.text}
          </MenuItem>
        );
      })}
    </Menu>
  );
});

let DropDown =  (props) => useObserver(() => {
  const store = useStore();
  const appStore = store.appStore;

  return (
    <Dropdown
      className="dropdown"
      placement="bottomLeft"
      overlay={<MenuComponent {...props} />}
      overlayClassName="overlay-container"
      getPopupContainer={() => document.querySelector('.user-drop-down')}
    >
      <span className="user-drop-down">
        <Avatar src={avatar} className="user-img" />
        <span className="user-name">{appStore.user.name || 'momo.zxy'}</span>
        <RightOutlined className="icon-allow" />
      </span>
    </Dropdown>
  );
});

export default DropDown;
