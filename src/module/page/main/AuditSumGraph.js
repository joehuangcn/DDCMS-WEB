import React,{Component} from 'react';
import {Card} from 'antd';
import  {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import {ajaxUtil} from '../../../util/AjaxUtils';
class AuditChart extends Component{
  constructor(props){
    super(props);
    this.state={
      data:[],
    }
  }
  componentDidMount(){
    ajaxUtil("urlencoded","audit-stat!getAuditSumLineChart.action","",this,(data,that) => {
      let chartList=data.data;
  
      this.setState({data:chartList});
    });
  }
  render(){
    const {data}=this.state;
    return(
      <Card title="总体稽核统计图">
      <LineChart width={750} height={200} data={data}
            margin={{top: 5, right: 30, left: 20, bottom: 5}}>
       <XAxis dataKey="name"/>
       <YAxis />
       <Tooltip/>
       <Legend />
       <Line type="monotone" dataKey="稽核业务量" stroke="	#00BFFF" activeDot={{r: 8}}/>
       <Line type="monotone" dataKey="稽核次数" stroke="	#FFA500" />
      </LineChart>
       </Card>
    );
  }
}
export default AuditChart;
