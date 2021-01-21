import React, { useRef, Fragment, useEffect } from 'react';
import { Modal, Select, Form, Input } from 'antd';
import _ from 'lodash';
import { useObserver } from "mobx-react-lite";
import { useStore } from '../store';
import '../index.less';

const FormItem = Form.Item;
const Option = Select.Option;

export default () => useObserver(() => {
  const store = useStore();
  const formRef = useRef({});
  const { optionStore, consts } = store;
  const { VISIBLE_TYPE, VISIBLE_TYPE_DESC } = consts;

  useEffect(() => {
    // optionStore.getCenterBranchs();
  }, []);
  // 弹窗标题
  const title = {
    addRole: '新增角色',
    editRole: '编辑角色',
  }[store.type];
  // const searchCenterBranchs = (value) => {
  //   optionStore.getCenterBranchs({ name: value });
  // };
  // const getCurrentOrg = (code) => {
  //   const { centerBranchs } = optionStore;
  //   return centerBranchs.find(item => item.code === code);
  // };
  // 关闭弹窗
  const handleClose = () => {
    formRef.current.resetFields();
    store
      .setValue('currentRole', {})
      .setValue('type', undefined)
      .closeModal(store.type);

  };
  // 确认弹窗
  const onOk = () => {
    // const organizationInfo = store.organizationInfo;
    formRef.current
      .validateFields()
      .then(values => {
        // const organization = getCurrentOrg(values.organizationCode);
        // 只存在一个机构
        values['organizationName'] = '晋江农商银行';
        values['organizationId'] = '314';
        values['organizationCode'] = '350582';
        store[store.type](values)
          .then(() => {
            store.showMsg('success', `${title}成功`);
          })
          .then(store.getRoles)
          .then(() => {
            console.log('formRef.current', formRef.current);
            handleClose();
          });
      });
  };
  return (
    <Fragment>
      {
        store.modal[store.type] ? (
          <Modal
            width="40%"
            title={title}
            visible={store.modal[store.type]}
            onOk={onOk}
            onCancel={handleClose}
          >
            <Form
              colon={true}
              ref={formRef}
              initialValues={store.currentRole}
            >
              <FormItem
                label="角色名称"
                name="roleName"
                rules={[{ required: true, message: '角色名称必填' }]}
              >
                <Input placeholder="角色名称" />
              </FormItem>

              <FormItem
                label="角色描述"
                name="description"
                rules={[{ required: true, message: '角色描述必填' }]}
              >
                <Input placeholder="角色描述" />
              </FormItem>
              {/* <FormItem
                label="所属机构"
                name="organizationCode"
                rules={[{ required: true, message: '所属机构必填' }]}
              >
                <Select
                  showSearch
                  allowClear
                  showArrow={false}
                  filterOption={false}
                  notFoundContent={null}
                  onSearch={searchCenterBranchs}
                  notFoundContent={null}
                  placeholder="所属机构"
                >
                  {
                    optionStore.centerBranchs.map(({ name, code }) =>
                      <Option key={code} value={code}>{name}</Option>)
                  }
                </Select>
              </FormItem> */}
              {/* <FormItem
                label="可见数据"
                name="visibleType"
                rules={[{ required: true, message: '可见数据类型必填' }]}
              >
                <Select
                  placeholder="可见数据类型">
                  {
                    _.map(VISIBLE_TYPE, v => <Option key={v} value={v}>
                      {VISIBLE_TYPE_DESC[v]}</Option>)
                  }
                </Select>
              </FormItem> */}
            </Form>
          </Modal>
        ) : null
      }
    </Fragment>
  );
});
