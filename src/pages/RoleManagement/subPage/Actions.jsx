import React, { Fragment } from 'react';
import { useObserver } from "mobx-react-lite";
import { Row, Col, Button } from 'antd';
import Menu from './Menu';
import { useStore } from '../store';

export default () => useObserver(() => {
  const store = useStore();
  // 保存菜单权限
  const onSaveMenus = () => {
    store.saveMenus();
  };
  return (
    <Fragment>
      <Row className="action-group">
        <Col span={12}>
          <Menu />
        </Col>
      </Row>
      <Row className="action-btn-group">
        <Col span={12}>
          <Button
            type="primary"
            onClick={onSaveMenus}>
            保存
          </Button>
        </Col>
      </Row>
    </Fragment>
  );
});
