import React, { useEffect } from 'react';
import { useObserver } from "mobx-react-lite";
import { Card, Menu, Row, Popconfirm, Button } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useStore } from '../store';

export default () => useObserver(() => {
  const store = useStore();
  const { VISIBLE_TYPE } = store.consts;
  // 权限
  const getActions = () => {
    store.getMenus();
    // store.getOps();
  };
  // 切换角色
  const toggleRole = () => {
    store
      .getRoles()
      .then(getActions);
  };
  // 选中角色
  const onSelect = ({ selectedKeys }) => {
    store.setValue('roleSelectedKeys', selectedKeys);
    getActions();
  };
  // 新增角色
  const addRole = () => {
    store
      .setValue('currentRole', { visibleType: VISIBLE_TYPE.GROUP })
      .setValue('type', 'addRole')
      .openModal('addRole');
  };
  // 编辑角色
  const editRole = (currentRole) => {
    store
      .setValue('currentRole', currentRole)
      .setValue('type', 'editRole')
      .openModal('editRole');
  };
  // 删除角色
  const deleteRole = (id) => {
    store
      .deleteRole(id)
      .then(toggleRole);
  };
  // 查询角色
  useEffect(() => {
    toggleRole();
  }, []);
  return (
    <Card
      title="角色"
      extra={<PlusOutlined onClick={addRole}/>}
      className="role-card"
    >
      <Menu
        selectedKeys={store.roleSelectedKeys}
        onSelect={onSelect}
        style = {{ width: '100%', border: 'none', marginTop: '1px' }}>
        {
          store.roles.map((item) => {
            return (
              <Menu.Item key={item.roleCode}>
                <span>{ item.roleName }</span>
                {
                  store.roleSelectedKeys[0] == item.roleCode ? (
                    <Row className="role-card-actions">
                      <Button
                        type="link"
                        onClick={() => editRole(item)}
                        icon={<EditOutlined />} />
                      <Popconfirm
                        title="确认要删除?"
                        onConfirm={() => deleteRole(item.id)}>
                        <Button type="link" icon={<DeleteOutlined />} danger />
                      </Popconfirm>
                    </Row>
                  ) : null
                }
              </Menu.Item>
            );
          })
        }
      </Menu>
    </Card>
  );
});
