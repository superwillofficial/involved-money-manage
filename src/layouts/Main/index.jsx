import React from 'react';

import { Layout } from 'antd';
import LeftSide from '../LeftSide';
import Content from '../Content';
import Footer from '../Footer';
import './index.less';

export default () => {
  return (
    <Layout className="main-block">

      {/* 左侧 */}
      {/* <LeftSide /> */}

      <Layout className="main-block">
        {/* 主体 */}
        <Content />

        {/* 尾部 */}
        <Footer />
      </Layout>
    </Layout>
  );
};
