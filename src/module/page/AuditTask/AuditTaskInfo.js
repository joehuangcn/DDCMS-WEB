import React,{Component} from 'react'
import { Form, Input, Button,Modal,Upload ,Icon,Select,Row,Col,TreeSelect,DatePicker,InputNumber,Radio,Switch} from 'antd';
import { ajaxUtil} from '../../../util/AjaxUtils';
import UploadFile from '../../../component/uploadFile/UploadFile';
import uuid from 'node-uuid';
import Moment from 'moment';
const FormItem = Form.Item;
const {Option} = Select;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};
const timeFormItemLayout = {
  labelCol: { span: 11 },
  wrapperCol: { span: 2 },
};

const minuteTypeList=[<Option key="*" value="*">每分钟</Option>];
const hourTypeList=[<Option key="*" value="*">每分钟</Option>];
const dayTypeList=[<Option key="*" value="*">每日</Option>];
const monthTypeList=[<Option key="*" value="*">每月</Option>];
for(let i=0;i<60;i++){
  minuteTypeList.push(<Option key={i} value={i}>{i<10?'0'+i:i}</Option>);
  if(i<24){
  hourTypeList.push(<Option key={i} value={i}>{i<10?'0'+i:i}</Option>);
  }
  if (i<31) {
  dayTypeList.push(<Option key={i} value={i}>{i+'日'}</Option>);
  }
  if (i>0&&i<13) {
  monthTypeList.push(<Option key={i} value={i}>{i+'月'}</Option>);
  }
}
dayTypeList.push(<Option key="L" value="L">最后一天</Option>);




class AuditTaskFormModal extends Component {

  constructor(props){
    super(props);
    this.state={
      gatherStatu:true,
      orderStatu:true,
      auditStatu:true,
      netFieldList:[],
      gatherChecked:false,
      orderChecked:false,
      auditChecked:false
    }
  }
  getFiles(type,record,selectList,mes,getFieldDecorator,formItemLayout){
    let item;
    switch (type) {
      case "input":
        item=<FormItem {...formItemLayout } label={mes}>
          {getFieldDecorator('auditTask.bizCode',{
            rules:[{ required:true, message:{mes}+'不能为空',}],
            initialValue:record.businessCode
         })(
        <Input placeholder="请选择" />
        )}
       </FormItem>
        break;
      default:
    }
    return item;
  }

gethandleSwith=(value) =>{
  ajaxUtil("urlencoded","audit-tasks!getdataGatherCount.action","bizCode="+value,this,(data,that)=>{
    let numArray=data.message.split(',');
    let gatherStatu=false;
    let orderStatu=false;
    let auditStatu=false;
    if (parseInt(numArray[0],10)==0) {
      gatherStatu=false
    }
    if (parseInt(numArray[1],10)==0) {
      orderStatu=false
    }
    if (parseInt(numArray[2],10)==0) {
      auditStatu=false
    }
    this.setState({gatherStatu,orderStatu,auditStatu});
  });
}
handleBizTreeChange=(value) => {
  // let bizList=this.props.bizList;
    // console.log(this.props.form);
    // console.log(this.props.form.getFieldValue('auditTask.bizCode'));
  // this.props.form.setFieldsValue({'auditTask.auditTaskName':value});
  this.gethandleSwith(value);
  ajaxUtil("urlencoded","bus-net-field!getFieldNamesByBizCode.action","bizCode="+value,this,(data,that)=>{
    this.setState({netFieldList:data.data});
  });
}
handleMinuteChange=(value)=>{
let dateF=this.handleTimeChange(value,1);
this.props.form.setFieldsValue({'auditTask.dateE':dateF});
}
handleHourChange=(value)=>{
let dateF=this.handleTimeChange(value,2);
this.props.form.setFieldsValue({'auditTask.dateE':dateF});
}
handleDayChange=(value)=>{
let dateF=this.handleTimeChange(value,3);
this.props.form.setFieldsValue({'auditTask.dateE':dateF});
}
handleMonthChange=(value)=>{
let dateF=this.handleTimeChange(value,4);
this.props.form.setFieldsValue({'auditTask.dateE':dateF});
}

handleTimeChange=(value,type)=>{
  let hour= this.props.form.getFieldValue('hour');
  let minute= this.props.form.getFieldValue('minute');
  let day= this.props.form.getFieldValue('day');
  let month= this.props.form.getFieldValue('month');
  let dateF="";
  switch (type) {
    case 1:
      dateF="0 "+value+" "+hour+" "+day+" "+month+" ?";break;
    case 2:
      dateF="0 "+minute+" "+value+" "+day+" "+month+" ?";break;
    case 3:
      dateF="0 "+minute+" "+hour+" "+value+" "+month+" ?";break;
    case 4:
     dateF="0 "+minute+" "+hour+" "+day+" "+value+" ?"; break;
    default:
  }
  return dateF;
}

handleGatherStatu=(checked) =>{
  this.setState({gatherChecked:checked})
}
handleOrderStatu=(checked) =>{
  this.setState({orderChecked:checked})
}
handleAuditStatu=(checked) =>{
  this.setState({auditChecked:checked})
}
componentWillMount(){
if (this.props.action==='edit') {
  this.gethandleSwith(this.props.record.bizCode);
    let gatherChecked=this.props.record.dataGatherStatu==="1"?true:false
    let orderChecked=this.props.record.dataOrderStatu==='1'?true:false
    let auditChecked=this.props.record.dataAuditStatu==="1"?true:false
    this.setState({gatherChecked,orderChecked,auditChecked})
 }
}
  render(){
  const {getFieldDecorator} = this.props.form;
  const {gatherStatu,orderStatu,auditStatu,gatherChecked,orderChecked,auditChecked}=this.state;
  const {record,action,bizList,deptList,auditTypeList,dataScopeList,taskTypeList,dataTypeList,menu} =this.props;
  return(
    <div>
    <Form>
      <Row gutter={24}>
      <Col span={12}>
        <FormItem {...formItemLayout } label="业务">
         {getFieldDecorator('auditTask.bizCode',{
           rules:[{ required:true, message:'业务不能为空',}],
           initialValue:record.bizCode===undefined?"":record.bizCode
         })
         (
           <TreeSelect  placeholder='选择业务'
              style={{ width: 200 }} allowClear
           treeData={bizList}  onChange={this.handleBizTreeChange} />
        )}
       </FormItem>
       </Col>
       <Col span={12}>
       <FormItem {...formItemLayout } label="任务名称">
        {getFieldDecorator('auditTask.auditTaskName',{
          rules:[{ required:true, message:'任务名称不能为空',}],
          initialValue:record.taskName===undefined?"":record.taskName
        })(
       <Input placeholder="请输入任务名称"  style={{width:150}}/>
       )}
      </FormItem>
      </Col>
      </Row>
      <Row gutter={24}>
      <Col span ={12}>
          <FormItem {...formItemLayout } label="任务类型">
           {getFieldDecorator('auditTask.taskType',{
             rules:[{ required:true, message:'任务类型不能为空',}],
             initialValue:record.taskType===undefined?"":record.taskType
           })(
             <Select  placeholder="请选择任务类型" style={{ width: 200 }} onChange={this.city} allowClear={true}>
               {taskTypeList.map(d=> <Option key={d.dicCode} value={d.dicCode}>{d.dicName}</Option>)}
             </Select>
          )}
          </FormItem>
      </Col>
      <Col span={12}>
        <FormItem {...formItemLayout } label="部门">
         {getFieldDecorator('auditTask.dept.deptId',{
           rules:[{ required:true, message:'部门不能为空',}],
           initialValue:record.dept===undefined?"":record.dept.deptId
         })
         (
           <TreeSelect  placeholder='选择部门' style={{ width: 200 }} allowClear  treeData={deptList}  onChange={this.deptTreeChange}/>
        )}
       </FormItem>
       </Col>
      </Row>
      <Row gutter={24}>
      <Col span ={12}>
          <FormItem {...formItemLayout } label="稽核范围">
           {getFieldDecorator('auditTask.dataScope',{
             rules:[{ required:true, message:'稽核范围不能为空',}],
             initialValue:record.dataScope===undefined?"":record.dataScope
           })(
             <Select  placeholder="请选择" style={{ width: 200 }} onChange={this.city} allowClear={true}>
               {dataScopeList.map(d=> <Option key={d.dicCode} value={d.dicCode}>{d.dicName}</Option>)}
             </Select>
          )}
          </FormItem>
      </Col>
      <Col span={12}>
        <FormItem {...formItemLayout } label="稽核类型">
         {getFieldDecorator('auditTask.auditType',{
           rules:[{ required:true, message:'稽核类型不能为空',}],
           initialValue:record.auditType===undefined?"":record.auditType
         })
         (
           <Select  placeholder="请选择" style={{ width: 200 }} onChange={this.city} allowClear={true}>
             {auditTypeList.map(d=> <Option key={d.dicCode} value={d.dicCode}>{d.dicName}</Option>)}
           </Select>
        )}
       </FormItem>
       </Col>
      </Row>
      <Row gutter={24}>
      <Col span ={12}>
          <FormItem {...formItemLayout } label="数据类型">
           {getFieldDecorator('auditTask.dataType',{
             rules:[{ required:true, message:'数据类型不能为空',}],
             initialValue:record.dataType===undefined?"":record.dataType
           })(
             <Select  placeholder="请选择" style={{ width: 200 }} onChange={this.city} allowClear={true}>
               {dataTypeList.map(d=> <Option key={d.dicCode} value={d.dicCode}>{d.dicName}</Option>)}
             </Select>
          )}
          </FormItem>
      </Col>
      <Col span={12}>
        <FormItem {...formItemLayout } label="所属模块">
         {getFieldDecorator('auditTask.module.mid',{
           rules:[{ required:true, message:'所属模块不能为空',}],
           initialValue:record.module===undefined?"":record.module.id
         })
         (
           <TreeSelect  placeholder='请选择'
              style={{ width: 200 }} allowClear
           treeData={menu}  onChange={this.deptTreeChange}/>
        )}
       </FormItem>
       </Col>
      </Row>
      <Row gutter={24}>
     <Col span ={12}>
         <FormItem {...formItemLayout } label="数据提取日">
          {getFieldDecorator('auditTask.obtainDataTime',{
            rules:[],
            initialValue:record.obtainDataTime===undefined?Moment():Moment.unix(record.obtainDataTime)
          })(
              <DatePicker  placeholder="提数时间" />
         )}
         </FormItem>
     </Col>
     <Col span={12}>
       <FormItem {...formItemLayout } label="线程数量">
        {getFieldDecorator('auditTask.threadNum',{
          initialValue:record.threadNum===undefined?1:record.threadNum
        })
        (
          <InputNumber min={1}  max={5} />
       )}
      </FormItem>
      </Col>
     </Row>
     <Row gutter={24}>
     <Col span ={12}>
         <FormItem {...formItemLayout } label="优先级">
          {getFieldDecorator('auditTask.priority',{
            initialValue:record.priority===undefined?"":record.priority
          })(
            <Select  placeholder="请选择" style={{ width: 200 }} onChange={this.city} allowClear={true}>
              <Option key="1" value="1">高级</Option>
              <Option key="2" value="2">中级</Option>
              <Option key="3" value="3">低级</Option>
            </Select>
         )}
         </FormItem>
     </Col>
     <Col span={12}>
       <FormItem {...formItemLayout } label="是否为二次比对">
        {getFieldDecorator('auditTask.tempCheck',{
          initialValue:record.tempCheck===undefined||record.tempCheck==""?"1":record.tempCheck
        })
        (
          <Select  placeholder="请选择" style={{ width: 200 }} onChange={this.city} allowClear={true}>
            <Option key="0" value="0">是</Option>
            <Option key="1" value="1">不是</Option>
          </Select>
       )}
      </FormItem>
      </Col>
     </Row>
     <Row >
     <Col span ={6}>
         <FormItem {...timeFormItemLayout } label="分设置">
          {getFieldDecorator('minute',{
            initialValue:"*"
          })(
            <Select  placeholder="请选择" style={{ width: 100 }} onChange={this.handleMinuteChange} allowClear={true}>
              {minuteTypeList}
            </Select>
         )}
         </FormItem>
     </Col>
     <Col span ={6}>
         <FormItem {...timeFormItemLayout } label="时设置">
          {getFieldDecorator('hour',{
            initialValue:"*"
          })(
            <Select  placeholder="请选择" style={{ width: 100 }} onChange={this.handleHourChange} allowClear={true}>
              {hourTypeList}
            </Select>
         )}
         </FormItem>
     </Col>
     <Col span ={6}>
         <FormItem {...timeFormItemLayout } label="日设置">
          {getFieldDecorator('day',{
            initialValue:"*"
          })(
            <Select  placeholder="请选择" style={{ width: 100 }} onChange={this.handleDayChange} allowClear={true}>
              {dayTypeList}
            </Select>
         )}
         </FormItem>
     </Col>
     <Col span ={6}>
         <FormItem {...timeFormItemLayout } label="月设置">
          {getFieldDecorator('month',{
            initialValue:"*"
          })(
            <Select  placeholder="请选择" style={{ width: 100 }} onChange={this.handleMonthChange} allowClear={true}>
              {monthTypeList}
            </Select>
         )}
         </FormItem>
     </Col>
     </Row>
     <FormItem {...formItemLayout } label="时间表达式">
      {getFieldDecorator('auditTask.dateE',{
        rules:[{ }],
        initialValue:record.dateE===undefined?"0 * * * * ?":record.dateE
      })(
     <Input placeholder="请输入时间表达式"  style={{width:150}}/>
     )}
    </FormItem>
    <Row gutter={6} >
    <Col span ={8}>
        <FormItem {...timeFormItemLayout } label={gatherStatu?'数据采集(未配置)':'数据采集(已配置)'}>
         {getFieldDecorator('auditTask.dataGatherStatu',{
           initialValue:record.dataGatherStatu==="1"?true:false
         })(
           <Switch  checked={gatherChecked} disabled={gatherStatu} checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />}
            onChange={this.handleGatherStatu} />
        )}
        </FormItem>
    </Col>
    <Col span ={8}>
        <FormItem {...timeFormItemLayout } label={orderStatu?'数据预处理(未配置)':'数据预处理(已配置)'}>
         {getFieldDecorator('auditTask.dataOrderStatu',{
           initialValue:record.dataOrderStatu==='1'?true:true
         })(
            <Switch  checked={orderChecked} disabled={orderStatu} checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />}
             onChange={this.handleOrderStatu}/>
        )}
        </FormItem>
    </Col>
    <Col span ={8}>
        <FormItem {...timeFormItemLayout } label={auditStatu?'数据比对(未配置)':'数据比对(已配置)'}>
         {getFieldDecorator('auditTask.dataAuditStatu',{
           rules:[],
           initialValue:record.dataAuditStatu==="1"?true:false
         })(
          <Switch   checked={auditChecked} disabled={auditStatu} checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />}
            onChange={this.handleAuditStatu}/>
        )}
        </FormItem>
    </Col>
    </Row>
    <Row gutter={24}>
    <Col span={12}>
      <FormItem {...formItemLayout } label="差异分析">
       {getFieldDecorator('auditTask.diffAnaly',{
         rules:[{ }],
         initialValue:record.diffAnaly==undefined?"":record.diffAnaly
       })
       (
         <Select placeholder="请选择" style={{ width: 200 }} allowClear={true} >
            <Option key='1' value='1'>需要</Option>
            <Option key='0' value='0'>不需要</Option>
         </Select>
      )}
     </FormItem>
     </Col>
    <Col span ={12}>
        <FormItem {...formItemLayout } label="时间维度">
         {getFieldDecorator('auditTask.timeAnaly',{
           rules:[{}],
           initialValue:record.timeAnaly===undefined?"":record.timeAnaly
         })(
           <Select  placeholder="请选择任务类型" style={{ width: 200 }} onChange={this.city} allowClear={true}>
             {this.state.netFieldList.map(d=> <Option key={d.fieldCode} value={d.fieldCode}>{d.fieldName}</Option>)}
           </Select>
        )}
        </FormItem>
    </Col>
    </Row>
    <Row gutter={24}>
    <Col span ={12}>
        <FormItem {...formItemLayout } label="渠道维度">
         {getFieldDecorator('auditTask.chanelAnaly',{
           rules:[{}],
           initialValue:record.chanelAnaly===undefined?"":record.chanelAnaly
         })(
           <Select  placeholder="请选择..." style={{ width: 200 }} onChange={this.city} allowClear={true}>
             {this.state.netFieldList.map(d=> <Option key={d.fieldCode} value={d.fieldCode}>{d.fieldName}</Option>)}
           </Select>
        )}
        </FormItem>
    </Col>
    <Col span ={12}>
        <FormItem {...formItemLayout } label="子业务维度">
         {getFieldDecorator('auditTask.subAnaly',{
           rules:[{}],
           initialValue:record.subAnaly===undefined?"":record.subAnaly
         })(
           <Select  placeholder="请选择..." style={{ width: 200 }} onChange={this.city} allowClear={true}>
             {this.state.netFieldList.map(d=> <Option key={d.fieldCode} value={d.fieldCode}>{d.fieldName}</Option>)}
           </Select>
        )}
        </FormItem>
    </Col>
    </Row>
    </Form>
    </div>
  );
}
}

const ComBizForm= Form.create()(AuditTaskFormModal);

class AuditTaskInfo extends Component{
  constructor(props){
    super(props);
    this.state = {
    visible:false,
    bizList:[],
    deptList:[],
    menu:[]
    };
  }
  componentWillMount(){
        this.getBusTree();
    }
    getBusTree=() =>{
        ajaxUtil("urlencoded","business!getBusAfterNew.action","",this,(data,that)=>{
            this.setState({bizList:data});
        });
        ajaxUtil("urlencoded","dept!getDeptTreeSelect.action","",this,(data,that)=>{
            this.setState({deptList:data});
        });
        ajaxUtil("urlencoded","module!getMenuSelect.action","parentCode=0&statu=1",this,(data,that) => {
            // console.log(data);
            this.setState({menu:data});
        });
    }

  show = () => {
    this.setState({
      visible:true,
      record:["taskName":"","bizCode":"","auditType":"","dataType":"","dataScope":"",],
      action:'add'
    });
  }
 showModal =(action,record) => {
   this.setState({
     visible:true,
     record:record,
     action:action
   });
 }

    handleOk = (e) => {
      const form= this.form;
      form.validateFields(( err, values) => {
        if (err) {
          return;
        }
        console.log("----values",values);

        this.setState({
          confirmLoading:true,
        });
        let obtainDataTime="";
        if (values.auditTask.obtainDataTime!==undefined && values.auditTask.taskType!=='task_fix'){
          obtainDataTime=values.auditTask.obtainDataTime.format('YYYY-MM-DD')
        }
        let bid=this.state.record.taskId?this.state.record.taskId:'';
        const text="auditTask.bizCode="+values.auditTask.bizCode
        +"&auditTask.taskName="+values.auditTask.auditTaskName
        +"&auditTask.auditType="+values.auditTask.auditType
        +"&auditTask.chanelAnaly="+values.auditTask.chanelAnaly
        +"&auditTask.dataAuditStatu="+(values.auditTask.dataAuditStatu?1:0)
        +"&auditTask.dataGatherStatu="+(values.auditTask.dataGatherStatu?1:0)
        +"&auditTask.dataOrderStatu="+(values.auditTask.dataOrderStatu?1:0)
        +"&auditTask.dataScope="+values.auditTask.dataScope
        +"&auditTask.dataType="+values.auditTask.dataType
        +"&auditTask.dateE="+values.auditTask.dateE
        +"&auditTask.dept.deptId="+values.auditTask.dept.deptId
        +"&auditTask.diffAnaly="+values.auditTask.diffAnaly
        +"&auditTask.module.mid="+values.auditTask.module.mid
        +"&auditTask.obtainDataTime="+obtainDataTime
        +"&auditTask.priority="+values.auditTask.priority
        +"&auditTask.subAnaly="+values.auditTask.subAnaly
        +"&auditTask.taskType="+values.auditTask.taskType
        +"&auditTask.tempCheck="+values.auditTask.tempCheck
        +"&auditTask.threadNum="+values.auditTask.threadNum
        +"&auditTask.timeAnaly="+values.auditTask.timeAnaly
        +"&auditTask.taskId="+bid
        +"&act="+this.state.action;
        ajaxUtil("urlencoded","audit-tasks!saveTask.action",text,this,(data,that) => {
          let status=data.success;
          let message= data.message;
          this.setState({
            visible: false,
             confirmLoading: false,
            });
            if (status==='true') {
              Modal.success({
               title: '消息',
               content: message,
              });
            }else {
              Modal.error({
                title: '消息',
                content: message,
             });
            }
        });

      });
    }

  handleCancel = (e) => {
    this.setState({visible:false});
    this.props.doTimer();
    const form1= this.form;
  }

  onUpChange = (info) =>{

  }
  afterClose = () => {
    this.form.resetFields();
  }

  render() {
    const { visible, confirmLoading }= this.state;
    const{auditTypeList,taskTypeList,auditScopeList,dataTypeList}=this.props;
    return(
      <div>
       <Modal key={uuid.v1()} visible={visible} onOk={this.handleOk} onCancel={this.handleCancel} width={700}
              title="编辑" confirmLoading={confirmLoading}  afterClose={this.afterClose}
        >
          <ComBizForm ref={(ref) => this.form = ref} record={this.state.record} action={this.state.action}
            auditTypeList={auditTypeList}    bizList={this.state.bizList} deptList={this.state.deptList} dataScopeList={auditScopeList}
            taskTypeList={taskTypeList} dataTypeList={dataTypeList} menu={this.state.menu}
            />
       </Modal>
      </div>
    );
  }
}

export default AuditTaskInfo;
