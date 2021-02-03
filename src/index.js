import React from 'react';
import ReactDOM from 'react-dom';
import '@babel/polyfill';

import App from '@pages/App';
import { ConfigProvider } from 'antd';
import dayjs from 'dayjs';
import zhCN from 'antd/es/locale/zh_CN';

import '@assets/styles/style.less';

import GlobalStore from './stores';
import '@config/zh-ch';
dayjs.locale('zh-cn');

ReactDOM.render(
  <ConfigProvider locale={zhCN}>
    <GlobalStore>
      <App />
    </GlobalStore>
  </ConfigProvider>,
  document.getElementById('root')
);
