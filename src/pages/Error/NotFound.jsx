import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Result, Button } from 'antd';
import './index.less';

export default () => {
  const hisotry = useHistory();
  const onBackHome = useCallback(() => {
    hisotry.push('/home');
  }, []);
  return (
    <Result
      status="404"
      title="404"
      subTitle="没有找到页面"
      extra={
        <Button
          type="primary"
          className="back-home-btn"
          onClick={onBackHome}>
          回到主页
        </Button>
      }
    />
  );
};
