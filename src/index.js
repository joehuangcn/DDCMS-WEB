import React from 'react';
import ReactDOM from 'react-dom';
import {LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
moment.locale('zh-cn');
ReactDOM.render(<LocaleProvider locale={zhCN}><App /></LocaleProvider>, document.getElementById('root'));
registerServiceWorker();