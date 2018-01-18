import React,{Component} from 'react';
import {Row,Col,Card} from 'antd';
import NewAuditInfo from './NewAuditInfo';
import AuditChart from './AuditSumGraph';
import OrderMes from './OrderMes';
import NewNoticeInfo from './NewNoticeInfo';
class Main extends Component {
  render(){
    return(
      <div style={{ background: '#ECECEC'}}>
      <Row gutter={16}>
        <Col span={6}>
            <div>
              <NewAuditInfo />
              <NewNoticeInfo />
            </div>
        </Col>
        <Col span={18}>
          <AuditChart />
          <OrderMes />
        </Col>
        </Row>
        </div>
    );
  }
}
export default Main;
