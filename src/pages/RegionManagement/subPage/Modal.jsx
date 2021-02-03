import React, { useCallback, useRef, Fragment, useEffect } from "react";
import { useObserver } from "mobx-react-lite";
import _ from "lodash";
import { Modal, Select, message, Form, Input, Row, Col } from "antd";
import { useStore } from "../store";

const FormItem = Form.Item;

export default () =>
  useObserver(() => {
    const store = useStore();
    const formRef = useRef({});
    const Option = Select.Option;

    useEffect(() => {
    }, []);

    // 关闭弹窗
    const onCancel = () => {
      formRef.current.resetFields();
      store.closeModal(store.type);
    };
    // 提交表单
    const onFinish = () => {
      formRef.current.validateFields().then(async values => {
        if (store._type === "create") {
          const res = await store.onOrgCreate(values);
          if (res.code === 0) {
            message.success('新增成功');
          } else {
            message.error('新增失败');
          }
          onCancel();
        } else if (store._type === "edit") {
          const data = _.assign(store.detail, values);
          const res = await store.onOrgUpdate(data);
          if (res.code === 0) {
            message.success('编辑成功');
          } else {
            message.error('编辑失败');
          }
          onCancel();
        }
      });
    };

    //表单布局
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 }
    };
    return (
      <Fragment>
        {store.modal[store.type] ? (
          <Modal
            width="65%"
            title={store.typeDesc}
            visible={store.modal[store.type]}
            onCancel={onCancel}
            onOk={onFinish}
          >
            <Form
              colon={true}
              ref={formRef}
              initialValues={store.detail}
              {...formItemLayout}
            >
              <Row>
                <Col span={8}>
                  <FormItem
                    label="名称"
                    name="name"
                    rules={[{ required: true, message: "名称必填" }]}
                  >
                    <Input placeholder="名称" />
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </Modal>
        ) : null}
      </Fragment>
    );
  });
