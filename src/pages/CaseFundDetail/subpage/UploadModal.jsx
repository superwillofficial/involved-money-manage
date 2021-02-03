import React, { useCallback, Fragment, useEffect } from "react";
import { useObserver } from "mobx-react-lite";
import _ from "lodash";
import { Modal, Upload, Form, Button, message, Row, Col } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import { useStore } from "../store";

export default () => useObserver(() => {
  const store = useStore();
  // 弹窗标题
  const title = {
    upload: '案件影像上传',
  }[store.type];

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const onCancel = () => {
    store.closeModal(store.type);
  };

  const handleRemove = (file) => {
    console.log("you are removing:", file);
    return false;
  };

  useEffect(() => {
  }, []);

  // 表单布局
  const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 14 },
  };

  return (
    <Fragment>
      {store.modal[store.type] ? (
        <Modal
          width="45%"
          title={title}
          visible={store.modal[store.type] && title}
          footer={[<Button key="close" onClick={onCancel}>关闭</Button>]}
        >
          <Form
            colon={true}
            {...formItemLayout}
          >
            <Form.Item
              label="上传《判决书》"
              name="images"
            >
              <Upload
                action="https://yapi.miityun.org.cn/file"
                accept="image/*"
                listType="picture-card"
                // beforeUpload={handleBeforeUpload}
                onRemove={handleRemove}
                multiple={true}
              // fileList={!_.isEmpty(store.fileList) ? store.fileList : null}
              // customRequest={info => store.uploadFile(info)}
              // defaultFileList={
              //   !_.isEmpty(store.thumbFileList) ? store.thumbFileList : null
              // }
              >
                {uploadButton}
              </Upload>
            </Form.Item>
            <Form.Item
              label="上传《处罚决定书》"
              name="penalty-decision"
            >
              <Upload
                accept="image/*"
                listType="picture-card"
                // beforeUpload={handleBeforeUpload}
                // onRemove={handleRemove}
                multiple={true}
              // fileList={!_.isEmpty(store.fileList) ? store.fileList : null}
              // customRequest={info => store.uploadFile(info)}
              // defaultFileList={
              //   !_.isEmpty(store.thumbFileList) ? store.thumbFileList : null
              // }
              >
                {uploadButton}
              </Upload>
            </Form.Item>
            <Form.Item
              label="上传其他影像"
              name="others"
            >
              <Upload
                accept="image/*"
                listType="picture-card"
                // beforeUpload={handleBeforeUpload}
                // onRemove={handleRemove}
                multiple={true}
              // fileList={!_.isEmpty(store.fileList) ? store.fileList : null}
              // customRequest={info => store.uploadFile(info)}
              // defaultFileList={
              //   !_.isEmpty(store.thumbFileList) ? store.thumbFileList : null
              // }
              >
                {uploadButton}
              </Upload>
            </Form.Item>
          </Form>
        </Modal>
      ) : null}
    </Fragment>
  );
});