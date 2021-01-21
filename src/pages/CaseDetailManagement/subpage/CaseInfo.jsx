import React, { Fragment } from "react";
import { useObserver } from "mobx-react-lite";
import { Row, Col } from "antd";
import { useStore } from "../store";

export default () => useObserver(() => {
  const store = useStore();
  const data = store.case;

  const lableCol = {
    span: 2,
    style: {
      fontWeight: 'bold',
      textAlign: 'end',
    },
  };

  const contentCol = {
    span: 7,
    style: {
      textAlign: 'start',
    },
  };

  return (
    <Fragment>
      <Row>
        <Col {...lableCol}>案件名称：</Col>
        <Col {...contentCol}>{data.caseName}</Col>
        <Col></Col>
        <Col {...lableCol}>办理单位：</Col>
        <Col {...contentCol}>{data.department}</Col>
      </Row>
      <Row>
        <Col {...lableCol}>受理民警：</Col>
        <Col {...contentCol}></Col>
        <Col></Col>
        <Col {...lableCol}>联系方式：</Col>
        <Col {...contentCol}></Col>
      </Row>
    </Fragment>
  );
});