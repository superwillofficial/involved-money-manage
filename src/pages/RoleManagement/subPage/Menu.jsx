import React, { useCallback } from 'react';
import { useObserver } from "mobx-react-lite";
import { Card, Tree } from 'antd';

import { useStore } from '../store';

export default () => useObserver(() => {
  const store = useStore();
  // 树组件展开
  const onExpand = useCallback((expandedKeys) => {
    store.setValue('expandedMenuKeys', expandedKeys);
  }, []);
  // 获取自身及所有子节点key
  const getChildrenKeys = (node, keys = []) => {
    keys.push(node.actionCode);
    if (!(node.children && node.children.length)) return keys;
    for (let child of node.children) {
      getChildrenKeys(child, keys);
    }
    return keys;
  };
  // 获取自身及所有父节点key
  const getParentKeys = (node, keys = []) => {
    const parent = store.flatMenus.find(m => m.id === node.parentId);
    if (parent) {
      keys.push(parent.actionCode);
      getParentKeys(parent, keys);
    }
    return keys;
  };
  // 父节点的所有子节点都勾选 则勾选父节点
  const getNeedCheckParentKeys = (node, keys = [], copyCheckedMenuKeys = []) => {
    if (_.isEmpty(copyCheckedMenuKeys)) {
      copyCheckedMenuKeys = store.checkedMenuKeys;
    }
    const parent = store.flatMenus.find(m => m.id === node.parentId);
    // 拿到所有子节点
    if (parent) {
      const childrenKeys = parent.child.map(c => c.actionCode);
      const isCheck = childrenKeys.every(key => copyCheckedMenuKeys.includes(key));
      if (isCheck) {
        keys.push(parent.actionCode);
        copyCheckedMenuKeys.push(parent.actionCode);
      }
      getNeedCheckParentKeys(parent, keys, copyCheckedMenuKeys);
    }
    return keys;
  };
  // 父节点的所有子节点都勾选 则勾选父节点
  const getUnCheckParentKeys = (node, keys = []) => {
    const parent = store.flatMenus.find(m => m.id === node.parentId);
    // 拿到所有子节点
    if (parent) {
      const childrenKeys = parent.child.map(c => c.actionCode);
      const isUncheck = childrenKeys.every(key => (!store.checkedMenuKeys.includes(key))
        && (!store.halfCheckedMenuKeys.includes(key)));
      isUncheck && keys.push(parent.actionCode);
      getUnCheckParentKeys(parent, keys);
    }
    return keys;
  };
  // 点击复选框
  const onCheck = useCallback((
    { checked: checkedKeys, halfChecked },
    { checked, node }
  ) => {
    // 获取自身及所有子节点key
    const childrenKeys = getChildrenKeys(node);
    // 获取所有父节点
    const parentKeys = getParentKeys(node);
    // 判断是否勾选
    if (checked) {
      // 更新当前节点和所有子节点
      store.setValue('checkedMenuKeys', checkedKeys.concat(childrenKeys));
      // 父节点的所有子节点都勾选 则勾选父节点
      const needCheckedKeys = getNeedCheckParentKeys(node);
      const halfCheckedKeys = _.difference(halfChecked.concat(parentKeys), needCheckedKeys);
      store.setValue('halfCheckedMenuKeys', halfCheckedKeys);
      // 更新需要选中的父级
      store.setValue('checkedMenuKeys', store.checkedMenuKeys.concat(needCheckedKeys));
    } else {
      // 不勾选则清空所有子节点和所有父级链
      store.setValue(
        'checkedMenuKeys',
        _.difference(checkedKeys, childrenKeys.concat(parentKeys)),
      );
      // 当前节点的所有父级都选为半勾选
      store.setValue('halfCheckedMenuKeys', halfChecked.concat(parentKeys));
      // 父节点的所有子节点都未勾选 则不勾选父节点
      const unCheckedKeys = getUnCheckParentKeys(node);
      store.setValue(
        'halfCheckedMenuKeys',
        _.difference(store.halfCheckedMenuKeys, unCheckedKeys),
      );
    }
  }, []);
  // 树组件选中
  const onSelect = useCallback((selectedKeys) => {
    store.setValue('selectedMenuKeys', selectedKeys);
  }, []);
  return (
    <Card title="系统菜单权限">
      <Tree
        checkable={true}
        checkStrictly={true}
        onExpand={onExpand}
        expandedKeys={store.expandedMenuKeys}
        onCheck={onCheck}
        checkedKeys={{
          checked: store.checkedMenuKeys,
          halfChecked: store.halfCheckedMenuKeys,
        }}
        onSelect={onSelect}
        selectedKeys={store.selectedMenuKeys}
        treeData={store.menus}
      />
    </Card>
  );
});
