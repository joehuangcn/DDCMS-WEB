import React,{Component} from 'react';
import {Row,Col,Card} from 'antd';
import {LineChart, Line,XAxis, YAxis, CartesianGrid, Tooltip, Legend,Cell} from 'recharts';
import {ajaxUtil} from '../../../util/AjaxUtils';

class Monitor extends Component {
  render(){
    return(
      <div style={{ background: '#ECECEC'}}>
      <Row gutter={16}>
        <Col span={18}>
          <Card title='稽核任务执行情况'>
          <TwoLineChart />
          </Card>
        </Col>
        <Col span={6}>
        <Card title='告警信息概要'>
          <AlarmMesInfo />
        </Card>
        </Col>
        </Row>
        <Row>
        <Col>
          <Card title='稽核记录吞吐量' >
          <SimpleChart  url="monitor!getTaskHandlingCapacityChartDataNew.action"  detail="执行次数"/>
          </Card>
          </Col>
        </Row>
        <Row>
        <Col>
        <Card  title='数据文件'>
          <SimpleChart url="monitor!getFileLogChartDataNew.action" detail="失败次数"/>
          </Card>
          </Col>
        </Row>
        </div>
    );
  }
}

class TwoLineChart extends Component {
  constructor(props) {
    super(props);
    this.state={
      data:[],
    }
  }

  componentDidMount(){
    // console.log('OK');
    this.fetch();
  }

  fetch=()=>{
    // const data = [
    //   {'name': '2018-01-16', "执行次数": 4000, "失败次数": 2400},
    //   {'name': '2018-01-17', "执行次数": 3000, "失败次数": 1398},
    //   {'name': '2018-01-18', "执行次数": 2000, "失败次数": 9800, },
    //   {'name': '2018-01-19', "执行次数": 2780, "失败次数": 3908, },
    //   {'name': '2018-01-20', "执行次数": 1890, "失败次数": 4800,},
    // ];
    // this.setState({data:data});

    ajaxUtil("urlencoded","monitor!getDateCountChartDataNew.action","",this,(data,that)=> {
      this.setState({data:data.message});
    });
  }

  render() {
    const {data}=this.state;
    return(
      <div>
      <LineChart width={700} height={300} data={data}>
        <XAxis dataKey="name"/>
        <YAxis/>
        <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
        <Tooltip/>
        <Legend />
        <Line type="monotone" dataKey="执行次数" stroke="#8884d8" />
        <Line type="monotone" dataKey="失败次数" stroke="#82ca9d" />
        </LineChart>
      </div>
    );
  }
}

class SimpleChart extends Component {
  constructor(props) {
    super(props);
    this.state={
      data:[],
      url:props.url,
      detail:props.detail,
    }
  }

  componentDidMount(){
    // console.log('OK');
    this.fetch();
  }

  fetch=()=>{
    // const data = [
    //   {'name': '2018-01-16', "执行次数": 4000, "失败次数": 2400},
    //   {'name': '2018-01-17', "执行次数": 3000, "失败次数": 1398},
    //   {'name': '2018-01-18', "执行次数": 2000, "失败次数": 9800, },
    //   {'name': '2018-01-19', "执行次数": 2780, "失败次数": 3908, },
    //   {'name': '2018-01-20', "执行次数": 1890, "失败次数": 4800,},
    // ];
    // this.setState({data:data});
      const {url}=this.props;
      // console.log(url);
    ajaxUtil("urlencoded",url,"",this,(data,that)=> {
      this.setState({data:data.message});
    });
  }

  render() {
    const {data,detail}=this.state;
    return(
      <div>
      <LineChart width={1000} height={300} data={data}>
        <XAxis dataKey="name"/>
        <YAxis/>
        <CartesianGrid stroke="#eee"/>
        <Tooltip/>

        <Line type="monotone" dataKey={detail} stroke="#8884d8" />
        </LineChart>
      </div>
    );
  }
}

class AlarmMesInfo extends Component {
  constructor(props){
    super(props);
    this.state={
      data:{},
    }
  }

  componentDidMount(){
    // console.log('OK');
    this.fetch();
  }

  fetch=()=>{
    ajaxUtil("urlencoded","sys-alert!summaryAlert.action","",this,(data,that)=> {
      this.setState({data:data.data[0]});
    });
  }

  render(){
    const {data}=this.state;
    return (
      <div>
        <h4>系统运行告警</h4>
        <Row>
          <Col span={12}>
            <span>待处理</span>
         </Col>
          <Col span={12}>
          <span style={{color:'orange'}} >{data.system} 条</span>
         </Col>
         </Row>
         <Row>
           <Col span={12}>
             <span>已处理</span>
          </Col>
           <Col span={12}>
           <span style={{color:'green'}}>{data.systemDeal} 条</span>
          </Col>
          </Row>
         <h4>业务稽核告警</h4>
         <Row>
           <Col span={12}>
             <span >待处理</span>
          </Col>
           <Col span={12}>
           <span style={{color:'orange'}}>{data.business} 条</span>
          </Col>
          </Row>
          <Row>
            <Col span={12}>
              <span>已处理</span>
           </Col>
            <Col span={12}>
            <span style={{color:'green'}}>{data.businessDeal} 条</span>
           </Col>
           </Row>
          <h4>文件计数告警</h4>
          <Row>
            <Col span={12}>
              <span>待处理</span>
           </Col>
            <Col span={12}>
            <span style={{color:'orange'}}>{data.fileAlarm} 条</span>
           </Col>
           </Row>
      </div>
    );
  }

}
export default Monitor;
