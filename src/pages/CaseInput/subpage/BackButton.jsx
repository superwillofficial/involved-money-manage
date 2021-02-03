import React, { Fragment } from "react";
import { useHistory } from 'react-router-dom';
import { useObserver } from "mobx-react-lite";
import { Button } from "antd";

export default () => useObserver(() => {
  const history = useHistory();
  return (
    <Fragment>
      <Button
        type="primary"
        size="large"
        shape="round"
        className='button-bottom'
        onClick={() => history.push('/case-management')}
      >返回</Button>
    </Fragment>
  );
});