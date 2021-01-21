import React, { useCallback, useRef, Fragment, useEffect } from "react";
import { useObserver } from "mobx-react-lite";
import _ from "lodash";
import { Modal, message, Form, Input, Row, Col } from "antd";
import { useStore } from "../store";

const FormItem = Form.Item;

export default () => useObserver(() => {
  const store = useStore();

  useEffect(() => {

  }, []);
  // 表单布局
  const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 14 },
  };

  return (
    <Fragment>

    </Fragment>
  );
});
