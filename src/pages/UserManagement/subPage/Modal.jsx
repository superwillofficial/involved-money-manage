import React, { useCallback, useRef, Fragment, useEffect } from "react";
import { useObserver } from "mobx-react-lite";
import _ from "lodash";
import { Modal, Select, message, Form, Input, Row, Col } from "antd";
import { useStore } from "../store";

const FormItem = Form.Item;
const { Option } = Select;

export default () => useObserver(() => {
  const store = useStore();
  const formRef = useRef({});
  const { GENDER_DESC, GENDER } = store.consts;
  const { optionStore } = store;
  // 关闭弹窗
  const onCancel = () => {
    formRef.current.resetFields();
    store.closeModal(store.type);
  };
  const getCurrentRole = (id) => {
    const { roles } = store;
    return roles.find(item => item.id === id);
  };
  const getCurrentOrg = (code) => {
    const { orgs } = store;
    return orgs.find(item => item.code === code);
  };
  // 提交表单
  const onFinish = useCallback(() => {
    // const organizationInfo = store.organizationInfo;
    console.log(formRef.current
      .validateFields());
    formRef.current
      .validateFields()
      .then(values => {
        const role = getCurrentRole(values.roleId);
        // const organization = getCurrentOrg(values.orgId);
        // values.roleList = role;
        values.roleCode = role.roleCode;
        // 选取已有组织
        values['organizationName'] = '晋江农商银行';
        values['organizationCode'] = '350582';
        values['organizationId'] = '314';
        values = _.omit(values, ['roleId']);
        console.log(values);
        store[`on${_.upperFirst(store.type)}`](values)
          .then(isSuccess => {
            if (isSuccess) {
              message.success(`${store.typeDesc}成功`);
              store.getUsers();
              onCancel();
            } else {
              message.error(`服务错误, ${store.message}`);
            }
          });
      });
  }, []);

  useEffect(() => {
    // optionStore.getBranchs({ limit: 50 });
    store.getRoles();
    // store.getOrgs();
  }, []);
  // 表单布局
  const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 14 },
  };
  // const { ORGNAIZATION_LEVEL, ORGNAIZATION_LEVEL_DESC } = store.consts;
  return (
    <Fragment>
      {
        store.modal[store.type] ? (
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
                    label="用户名"
                    name="username"
                    rules={[
                      { required: true, message: '用户名必填' },
                      ({ getFieldValue }) => ({
                        validator(rule, value) {
                          const reg = /^[a-zA-Z0-9]+$/g;
                          if (reg.test(value)) {
                            return Promise.resolve();
                          }
                          return Promise.reject('用户名仅支持输入英文字母以及数字');
                        }
                      })
                    ]}
                  >
                    <Input placeholder="用户名" />
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem
                    label="角色"
                    name="roleId"
                    rules={[{ required: true, message: '角色必填' }]}
                  >
                    <Select placeholder="角色">
                      {
                        store.roles.map(item =>
                          <Option key={item.id} value={item.id}>{item.roleName}</Option>)
                      }
                    </Select>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <FormItem
                    label="手机号"
                    name="phone"
                  >
                    <Input placeholder="手机号" />
                  </FormItem>
                </Col>

                <Col span={8}>
                  <FormItem
                    label="邮箱"
                    name="email"
                  >
                    <Input placeholder="邮箱" />
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <FormItem
                    label="名称"
                    name="name"
                    rules={[
                      { required: true, message: '名称必填' }
                    ]}
                  >
                    <Input placeholder="名称" />
                  </FormItem>
                </Col>
              </Row>
              {/* <Row>
                <Col span={8}>
                  <FormItem
                    label="所属机构"
                    name="orgId"
                    rules={[{ required: true, message: '所属机构必填' }]}
                  >
                    <Select
                      showSearch
                      allowClear
                      showArrow={true}
                      optionFilterProp="children"
                      filterOption={(input, option) => option.children.indexOf(input) >= 0}
                      notFoundContent={null}
                      placeholder="机构"
                    >
                      {
                        store.orgs.map(({ name, code, id }) =>
                          <Option key={id} value={code}>{name}</Option>)
                      }
                    </Select>
                  </FormItem>
                </Col>
              </Row> */}
            </Form>
          </Modal>
        ) : null
      }
    </Fragment>
  );
});
