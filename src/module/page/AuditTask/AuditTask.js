import React,{Component} from 'react';
import { Button, Icon,Popconfirm,message,DatePicker,Select,Input,TreeSelect,Table,Modal } from 'antd';
import {ajaxUtil} from '../../../util/AjaxUtils';
import AuditTaskInfo from './AuditTaskInfo';
const {RangePicker} = DatePicker;
const {Option} = Select;
const {Search} =Input;

class AuditTask extends Component {
  constructor(props) {
    super(props);
    this.state={
      columns:[],
      loading:false,
      data:[],
      pagination:{},
      id:'',
      permission:[],
      auditTypeList:[],
      taskTypeList:[],
      auditScopeList:[],
      dataTypeList:[],
      addBtnPermiss:true,
      taskName:'',taskType:'',auditType:'',dataScope:'',dataType:''
    }
  }

  componentWillMount(){
    this.getInitProps(this.props);
    this.getSearchCondition();
  }

  componentDidMount(){
    this.setHead();
    this.fetch();
    this.doTimer();
    // this.fetch();
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  doTimer=()=>{
      this.timer=setInterval(()=>{this.reflash()},5000);
  }

// 渲染工作
setHead=() =>{
  const columns =[
      { title:'任务名称', dataIndex:'taskName' , key:'taskName',sorter: true},
      { title:'任务类型', dataIndex:'taskType' , key:'taskType',render:(text,record) =>(this.renderType(text))},
      { title:'任务状态', dataIndex:'taskStatu' ,sorter: true, key:'taskStatu',render:(text) =>(this.renderStatu(text))},
      { title:'流程状态', dataIndex:'flowStatu' , key:'flowStatu',render:(text) =>(this.renderFlowStatu(text))},
      { title:'数据提取日期', dataIndex:'obtainDataTime' , key:'obtainDataTime',render:(text) =>(this.renderTime(text))},
      { title:'开始时间', dataIndex:'startTime' , key:'startTime',render:(text) =>(this.renderTime(text))},
      { title:'结束时间', dataIndex:'endTime' , key:'endTime',render:(text) =>(this.renderTime(text))},
      { title:'异常信息', dataIndex:'errInfo' , key:'errInfo'}
  ];


  let action ={
    title:'操作',
    key:'action',
    render : (text, record) => {
      let permission=this.state.permission;
      let edit='true';let start='true';let deletes='true';
      let activeDis=false; let activeColor="green";
      if(permission.indexOf('edit')===-1){
          edit='none'
      }
      if (permission.indexOf('add')===-1) {
        start='none'
      }
      if (permission.indexOf('del')===-1) {
        deletes='none'
      }
      // if((record.taskType=='task_fix'&& record.taskStatu!=="3")|| record.taskStatu=="1"){
      //     activeDis=true;
      //     activeColor="grey";
      // }
      return(
      <span>
       <a  style={{display:edit}} onClick = {() => {
         this.newbiz.showModal("edit",record);
         clearInterval(this.timer);
       }}>修改</a>
       <span className="ant-divider"/>
       <Popconfirm title="你确定要启动该任务?" okText="是" cancelText="否" onConfirm={() => {
         if((record.taskType=='task_fix'&& record.taskStatu!=="3")|| record.taskStatu=="1"){
             message.error('非终止的定时(或运行中的)任务不能启动');
         }else{
         ajaxUtil("urlencoded","audit-tasks!startTask.action","taskId="+record.taskId,this,(data,that) => {
           let status=data.success;
           let message= data.message;
             if (status==='true') {
               Modal.success({  title: '消息',  content: message,});
             }else {
               Modal.error({ title: '消息',content: message,});
             }
            this.reflash();
         })
       }
       }}>
       <a style={{color:activeColor,display:start}} disabled={activeDis}>启动</a>
       </Popconfirm>
       <span className="ant-divider"/>
       <Popconfirm title="你确定要删除该任务?" okText="是" cancelText="否" disabled onConfirm={() => {
         if (record.taskStatu=='1'){
           message.error('运行中的任务不能删除');
         }else{
         ajaxUtil("urlencoded","audit-tasks!delTask.action","taskId="+record.taskId,this,(data,that) => {
           let status=data.success;
           let message= data.message;
             if (status==='true') {
               Modal.success({ title: '消息', content: message,});
             }else {
               Modal.error({ title: '消息',content: message,
              });
             }
            this.reflash();
         })
       }
       }}>
       <a style={{color:'red',display:deletes}}>删除</a>
       </Popconfirm>
      </span>
    )
    },
  };
  columns.push(action);
  this.setState({columns});

}

renderType=(value)=>{
  if (value==='task_fix') {
    return "定时任务";
  }else if(value=='task_tmp'){
    return "临时任务";
  }
}
renderTime=(value) =>{
  if (value===0) {
    return '';
  }else{
    let date = new Date(value * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
      let  Y = date.getFullYear() + '-';
      let  M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
      let   D = date.getDate()<10?'0'+date.getDate():date.getDate() ;
        // h = date.getHours() + ':';
        // m = date.getMinutes() + ':';
        // s = date.getSeconds();
        // return Y+M+D+h+m+s;
        return Y+M+D;
  }
}
renderStatu=(value)=>{
    let statu;
  switch (value) {
    case '0':
      statu="就绪"
      break;
      case '1':
        statu=<p style={{color:'#66FF00'}}>运行</p>;
        break;
      case '2':
        statu=<p style={{color:'#33CCFF'}}>结束</p>;
        break;
      case '3':
        statu=<p style={{color:'red'}}>终止</p>;
          break;
    default:
        statu=""
  }
  return statu;
}
renderFlowStatu=(value) =>{
  let statu;
 switch (value) {
  case '0':
    statu="初始化";break;
    case '1':
      statu="数据提取";break;
    case '2':
      statu="预处理";break;
    case '3':
      statu="配置校验";break;
    case '4':
        statu="入库"; break;
    case '5':
        statu="比对";break;
    case '6':
          statu="差异分析";break;
    case '7':
          statu="收入流失统计";break;
    case '8':
            statu="源数据清理";break;
    case '9':
            statu="导出数据";break;
    case '11':
            statu="数据自动同步";break;
  default:
      statu=""
}
  return statu;
 }

// 初始化
getInitProps=(props)=>{
 //  console.log(props);
   const {state}=props.location;
   let permission=[];
   ajaxUtil("urlencoded","permiss!getUserBtnPermissByResid.action","resid="+state.id, this,(data,that)=>{
     permission=data.data;
     let addBtnPermiss=false;
     if (permission.indexOf('add')==-1) {
       addBtnPermiss=true;
     }
     this.setState({
       id:state.id,
       permission:permission,
       addBtnPermiss:addBtnPermiss
     });
   });
 }
getSearchCondition=() => {
  let auditTypeList,taskTypeList, auditScopeList,dataTypeList;
  ajaxUtil("urlencoded","dictionaryAction!getDictionaryListByType.action","name=DICT_AuditTaskType",this,(data,that)=>{
    this.setState({taskTypeList:data.data});
  });
  ajaxUtil("urlencoded","dictionaryAction!getDictionaryListByType.action","name=DICT_AuditType",this,(data,that)=>{
    this.setState({auditTypeList:data.data});
  });
  ajaxUtil("urlencoded","dictionaryAction!getDictionaryListByType.action","name=DICT_DataScope",this,(data,that)=>{
    this.setState({auditScopeList:data.data});
  });
  ajaxUtil("urlencoded","dictionaryAction!getDictionaryListByType.action","name=DICT_DataType",this,(data,that)=>{
    this.setState({dataTypeList:data.data});
  });
}

// 请求查询method
fetch = ( params ={} ) => {
  console.log('params',params);
  this.setState({loading:true}) ;
  let page=0;
  if (params.page>1) {
    page=(params.page-1)*10;
  }
  let sort='auditTask.startTime';
  if (typeof(params.sortField) !== "undefined" ) {
    sort=params.sortField;
  }
  let dir='ASC';
  if (typeof(params.sortOrder) !== "undefined" ) {
    dir=(params.sortOrder=="descend"?"desc":"asc");
  }
  const {config} = this.props;
  const {taskName,taskType,auditType,dataScope,dataType}=this.state;
  const text="taskName="+(taskName==undefined?"":taskName)
  +"&taskType="+(taskType==undefined?"":taskType)
  +"&auditType="+(auditType==undefined?"":auditType)
  +"&dataScope="+(dataScope==undefined?"":dataScope)
  +"&dataType="+(dataType==undefined?"":dataType)
  +"&dir="+dir
  +"&sort="+sort
  +"&start="+page+"&limit=10";

  ajaxUtil("urlencoded","audit-tasks!getTaskJsonList.action",text,this,(data,that) => {
    const pagination = that.state.pagination;
    pagination.total = parseInt(data.total,10);
    this.setState({
        loading: false,
        data: data.data,
        pagination,
    });
  });
}

handleTableChange = (pagination, filters, sorter) => {
  const pager = {...this.state.pagination};
  pager.current=pagination.current;
  this.setState({
    pagination:pager,
  });
  this.fetch({
    results: pagination.pageSize,
    page: pagination.current,
    sortField: sorter.field,
    sortOrder: sorter.order,
    ...filters,
  });
}

// 工具条件请求查询

reflash=() =>{
  this.fetch();
  let pagination=this.state;
  pagination.current=1;
  this.setState({pagination});
}
// taskName:'',taskType:'',auditType:'',dataScope:'',dataType:''
handleAuditTypeChange=(value) =>{
  this.setState({auditType:value});
}
handleTaskTypeChange=(value) =>{
  this.setState({taskType:value});
}
handleAuditScopeChange=(value) =>{
  this.setState({dataScope:value});
}
handleDataTypeChange=(value)=>{
  this.setState({dataType:value})
}
handleSearch=(value) =>{
  this.setState({taskName:value},()=>{
    this.fetch()
  });
  // this.fetch();
  }
// 打开新建窗口
handleModal= () => {
  this.newbiz.show();
  clearInterval(this.timer);
}

  render() {
    const{auditTypeList,taskTypeList, auditScopeList,dataTypeList}=this.state;
    return(
      <div>
      <Button type='primary' onClick={this.handleModal} disabled={this.state.addBtnPermiss}>新增</Button>
      <Button  onClick={this.reflash}><Icon type="sync" />刷新</Button>
      <Select  placeholder="任务类型" style={{ width: 120 }} onChange={this.handleTaskTypeChange} allowClear={true}>
        {taskTypeList.map(d=> <Option key={d.dicCode} value={d.dicCode}>{d.dicName}</Option>)}
      </Select>
      <Select  placeholder="稽核类型" style={{ width: 120 }} onChange={this.handleAuditTypeChange} allowClear={true}>
        {auditTypeList.map(d=> <Option key={d.dicCode} value={d.dicCode}>{d.dicName}</Option>)}
      </Select>
      <Select  placeholder="稽核范围" style={{ width: 120 }} onChange={this.handleAuditScopeChange} allowClear={true}>
        {auditScopeList.map(d=> <Option key={d.dicCode} value={d.dicCode}>{d.dicName}</Option>)}
      </Select>
      <Select  placeholder="数据类型" style={{ width: 200 }} onChange={this.handleDataTypeChange} allowClear={true}>
        {dataTypeList.map(d=> <Option key={d.dicCode} value={d.dicCode}>{d.dicName}</Option>)}
      </Select>
     <Search
      placeholder="输入查询任务名称"
      style={{ width: 140 }}
      onSearch={this.handleSearch} />
    <Table rowKey='taskId' columns={this.state.columns}  loading={this.state.loading} dataSource={this.state.data}  onChange={this.handleTableChange} pagination={this.state.pagination}/>
    <AuditTaskInfo ref={(ref) => this.newbiz=ref }  auditTypeList={auditTypeList} auditScopeList={auditScopeList}
    dataTypeList={dataTypeList} taskTypeList={taskTypeList} doTimer={this.doTimer}/>
    </div>
    );
  }
}
export default AuditTask;
