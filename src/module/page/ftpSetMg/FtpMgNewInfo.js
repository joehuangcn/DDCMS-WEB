import React,{Component} from 'react'
import { Form, Input,Modal,Select,Row,Col} from 'antd';
import { ajaxUtil} from '../../../util/AjaxUtils';
import uuid from 'node-uuid';
const FormItem = Form.Item;
const {Option} = Select;
const {TextArea}= Input;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

class  FtpInfoModal extends Component {
  constructor(props) {
    super(props);
    this.state={
      netList:[]
    }
  }

  handleAuditType=(value) =>{
    const text="bizCode="+this.props.bizCode+"&auditType="+value+"&dataScope="+(this.props.form.getFieldValue('config.dataScope')===undefined?"":this.props.form.getFieldValue('config.dataScope'));
    ajaxUtil("urlencoded","business!findRelatNet.action",text,this,(data,that)=>{
      this.setState({netList:data.data});
    });
  }
  handleDataScop=(value) =>{
    const text="bizCode="+this.props.bizCode+"&dataScope="+value+"&auditType="+(this.props.form.getFieldValue('config.auditType')===undefined?'':this.props.form.getFieldValue('config.auditType'));
    ajaxUtil("urlencoded","business!findRelatNet.action",text,this,(data,that)=>{
      this.setState({netList:data.data});
    });
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const {netList}=this.state;
    const {record,auditTypeList,auditScopeList,dataTypeList} =this.props;
    return (
      <div>
            <Form>
            <Row gutter={12}>
            <Col span={12}>
              <FormItem {...formItemLayout } label="IP">
               {getFieldDecorator('config.ip',{
                 rules:[{ required:true, message:'IP不能为空',}],
                 initialValue:record.ip===undefined?"":record.ip
               })
               (
                 <Input placeholder="请输入"  style={{width:150}}/>
              )}
             </FormItem>
             </Col>
             <Col span={12}>
             <FormItem {...formItemLayout } label="端口">
              {getFieldDecorator('config.port',{
                rules:[{ required:true, message:'端口不能为空',}],
                initialValue:record.port===undefined?"":record.port
              })(
             <Input placeholder="请输入"  style={{width:150}}/>
             )}
            </FormItem>
            </Col>
            </Row>
            <Row gutter={12}>
            <Col span={12}>
              <FormItem {...formItemLayout } label="账号">
               {getFieldDecorator('config.ftpUser',{
                 rules:[{ required:true, message:'账号不能为空',}],
                 initialValue:record.ftpUser===undefined?"":record.ftpUser
               })
               (
                 <Input placeholder="请输入"  style={{width:150}}/>
              )}
             </FormItem>
             </Col>
             <Col span={12}>
             <FormItem {...formItemLayout } label="密码">
              {getFieldDecorator('config.passWord',{
                rules:[{ required:true, message:'密码不能为空',}],
                initialValue:record.passWord===undefined?"":record.passWord
              })(
             <Input placeholder="请输入"  style={{width:150}}/>
             )}
            </FormItem>
            </Col>
            </Row>
            <Row gutter={24}>
            <Col span ={12}>
                <FormItem {...formItemLayout } label="稽核范围">
                 {getFieldDecorator('config.dataScope',{
                   rules:[{ required:true, message:'稽核范围不能为空',}],
                   initialValue:record.dataScope===undefined?"":record.dataScope
                 })(
                   <Select  placeholder="请选择" style={{ width: 200 }} onChange={this.handleDataScop} allowClear={true}>
                     {auditScopeList.map(d=> <Option key={d.dicCode} value={d.dicCode}>{d.dicName}</Option>)}
                   </Select>
                )}
                </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout } label="稽核类型">
               {getFieldDecorator('config.auditType',{
                 rules:[{ required:true, message:'稽核类型不能为空',}],
                 initialValue:record.auditType===undefined?"":record.auditType
               })
               (
                 <Select  placeholder="请选择" style={{ width: 200 }} onChange={this.handleAuditType} allowClear={true}>
                   {auditTypeList.map(d=> <Option key={d.dicCode} value={d.dicCode}>{d.dicName}</Option>)}
                 </Select>
              )}
             </FormItem>
             </Col>
            </Row>
            <Row gutter={24}>
            <Col span ={12}>
                <FormItem {...formItemLayout } label="数据类型">
                 {getFieldDecorator('config.dataType',{
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
              <FormItem {...formItemLayout } label="同步平台">
               {getFieldDecorator('config.netCode',{
                 rules:[{ required:true, message:'同步平台不能为空',}],
                 initialValue:record.netCode===undefined?"":record.netCode
               })
               (
                 <Select  placeholder="请选择" style={{ width: 200 }} onChange={this.city} allowClear={true}>
                   {netList.map(d=> <Option key={d.netEleCode} value={d.netEleCode}>{d.netEleName}</Option>)}
                 </Select>
              )}
             </FormItem>
             </Col>
            </Row>
            <Row>
                <FormItem {...formItemLayout } label="同步上传路径">
                 {getFieldDecorator('config.upDir',{
                   initialValue:record.upDir
                 })(
                <TextArea rows={2}/>
                )}
               </FormItem>
            </Row>
            </Form>
      </div>
    );
  }
}
const FtpForm= Form.create()(FtpInfoModal);

class FtpMgNewInfo extends Component{
  constructor(props){
    super(props);
    this.state={
        visible:false,
    }
  }
  handleCancel = (e) => {
    this.form.resetFields();
    this.setState({visible:false});
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

  handleOk=(e) =>{
    const form= this.form;
    form.validateFields(( err, values) => {
      if (err) {
        return;
      }
      this.setState({
        confirmLoading:true,
      });
      let bid=this.state.record.configId?this.state.record.configId:'';
      const text="config.bizCode="+this.props.bizCode
      +"&config.ip="+values.config.ip
      +"&config.port="+values.config.port
      +"&config.ftpUser="+values.config.ftpUser
      +"&config.passWord="+values.config.passWord
      +"&config.auditType="+values.config.auditType
      +"&config.dataScope="+values.config.dataScope
      +"&config.netCode="+values.config.netCode
      +"&config.dataType="+values.config.dataType
      +"&config.upDir="+values.config.upDir
      +"&config.configId="+bid
      +"&act="+this.state.action;
      ajaxUtil("urlencoded","ftp-config!saveConfig.action",text,this,(data,that) => {
        let status=data.success;
        let message= data.message;
        this.setState({
          visible: false,
          confirmLoading: false,
        });
        this.form.resetFields();
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
          this.props.refresh();
      });

    });
  }

  render(){
    const { visible, confirmLoading }= this.state;
    const {auditTypeList,auditScopeList,dataTypeList,netList,bizCode}=this.props;
    return(
      <div>
       <Modal key={uuid.v1()} visible={visible} onOk={this.handleOk} onCancel={this.handleCancel} width={700}
              title="编辑" confirmLoading={confirmLoading} >
          <FtpForm ref={(ref) => this.form = ref} bizCode={bizCode} record={this.state.record} action={this.state.action}
            auditTypeList={auditTypeList} auditScopeList={auditScopeList}  dataTypeList={dataTypeList} netList={netList}
            />
       </Modal>
      </div>
    );
  }
}
export default FtpMgNewInfo;
