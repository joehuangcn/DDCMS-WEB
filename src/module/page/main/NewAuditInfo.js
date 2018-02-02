import React,{Component} from 'react';
import {Card,Icon,Tooltip,Button,Spin} from 'antd';
import {ajaxUtil} from '../../../util/AjaxUtils';
class NewAuditInfo extends Component{
  constructor(props){
    super(props);
    this.state={
      loading:false,
      auditTime:'',
      auditType:'',
      bizeCount:'',
      auditTotal:0,
      diffTotal:0,
      diffPer:'',
      auditScope:''
    }
  }

  componentDidMount(){
    this.fetchData();
  }

  fetchData=() =>{
    this.setState({loading:true});
    ajaxUtil("urlencoded","audit-stat!getNewAuditInfoForMain.action","",this,(data,that) => {
      let auditInfo=data.data;
      this.setState({
        auditTime:auditInfo.auditTime,
        auditType:auditInfo.auditType,
        bizeCount:auditInfo.bizeCount,
        auditTotal:auditInfo.auditTotal,
        diffTotal:auditInfo.diffTotal,
        diffPer:auditInfo.diffPer,
        auditScope:auditInfo.auditScope,
        loading:false
      });
    });
  }

  render(){
    const{loading,auditTime,auditScope,auditType,bizeCount,diffTotal,auditTotal,diffPer}=this.state;
    return (
      <Card title="最新稽核信息" extra={<Tooltip placement="topLeft" title="刷新" arrowPointAtCenter><a onClick={()=> {this.fetchData()}}><Icon type='sync'/></a></Tooltip>}>
        <div>
         <Spin spinning={loading}>
          <p>稽核日期: <span>{auditTime}</span></p>
          <p>稽核范围: <span>{auditScope}</span></p>
          <p>稽核类型: <span>{auditType}</span></p>
          <p>业务总量: <span>{bizeCount}</span></p>
          <p>稽核总量: <span>{auditTotal}</span></p>
          <p>差异总量: <span>{diffTotal}</span></p>
          <p>差异率: <span>{diffPer}</span></p>
          </Spin>
        </div>
        </Card>
    );
  }
}
export default NewAuditInfo;
