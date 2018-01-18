import React,{Component} from 'react'
import { Form, Input, Button,Modal,Upload ,Icon,Select,Row,Col,InputNumber,Radio,Switch} from 'antd';
import { ajaxUtil} from '../../../util/AjaxUtils';
import UploadFile from '../../../component/uploadFile/UploadFile';
import uuid from 'node-uuid';
import Moment from 'moment';
const FormItem = Form.Item;
const {Option} = Select;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};
const activityCodeList = [
  {dicCode:'T9001010',dicName:'个人业务'},
  {dicCode:'T90001011',dicName:'集团业务'},
  {dicCode:'T90001012',dicName:'物联网业务'},
];
const needList = [
  {dicCode:'N',dicName:'不需要'},
  {dicCode:'Y',dicName:'需要'},
];
const tmpCheckList = [
  {dicCode:'0',dicName:'反馈文件获取'},
  {dicCode:'1',dicName:'二次比对'},
  {dicCode:'2',dicName:'待下次取结果'},
];
const radioList = [
  {key:'1',value:'激活'},
  {key:'0',value:'禁用'}
];
const frequencyList = [
  {dicCode:'年',dicName:'年'},
  {dicCode:'月',dicName:'月'},
  {dicCode:'日',dicName:'日'},
];
class  BusInfoModal extends Component {
  constructor(props) {
    super(props);
    this.state={
      netList:props.netList
    }
  }
  componentWillReceiveProps(nextProps){
    const {netList}=nextProps;
    this.setState({netList});
  }

  handleAuditType=(value) =>{
    const text="bizCode="+this.props.bizCode+"&auditType="+value+"&dataScope="+(this.props.form.getFieldValue('business.dataScope')===undefined?"":this.props.form.getFieldValue('business.dataScope'));
    ajaxUtil("urlencoded","business!findRelatNet.action",text,this,(data,that)=>{
      this.setState({netList:data.data});
    });
  }
  handleDataScop=(value) =>{
    const text="bizCode="+this.props.bizCode+"&dataScope="+value+"&auditType="+(this.props.form.getFieldValue('business.auditType')===undefined?'':this.props.form.getFieldValue('business.auditType'));
    ajaxUtil("urlencoded","business!findRelatNet.action",text,this,(data,that)=>{
      this.setState({netList:data.data});
    });
  }


  handleRenderTab=(type,formItemLayout,label,name,required,initValue,SourceList,rows,info) =>{
    const {getFieldDecorator} = this.props.form;
    let renderSome;
    switch (type) {
      case 'input':
              renderSome=<Input placeholder="请输入"/>
        break;
        case 'select':
              renderSome= <Select  placeholder="请选择" >
                              {SourceList.map(d=> <Option key={d.dicCode} value={d.dicCode}>{d.dicName}</Option>)}
                          </Select>
          break;
          case 'textarea':
              renderSome= <TextArea placeholder={info}   rows={rows}/>; break;
          case 'radio':
                renderSome=<RadioGroup>
                          {SourceList.map(d=> <Radio key={d.key} value={d.key}>{d.value}</Radio>)}
                    </RadioGroup>;break;
      default:break;
    }
    return (
      <FormItem {...formItemLayout } label={label}>
       {getFieldDecorator(name,{
         rules:[{ required:required, message:label+'不能为空',}],
         initialValue:initValue?initValue:""
       })
       (
         renderSome
      )}
     </FormItem>

   );
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const {netList}=this.state;
    const {record,action,auditTypeList,bizJoinTypeList} =this.props;
    const inputFormItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 8 },
    };
    const textFormItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 10 },
    };
    return (
      <div>
            <Form>
            <Row gutter={12}>
            <Col span={12}>
              {this.handleRenderTab("input",formItemLayout,"业务编码","business.bizCode",true,record.bizCode,[],0,'')}
             </Col>
             <Col span={12}>
               {this.handleRenderTab("input",formItemLayout,"业务名称","business.bizName",true,record.bizName,[],0,'')}
            </Col>
            </Row>
            <Row gutter={24}>
            <Col span ={12}>
            {this.handleRenderTab("select",formItemLayout,"业务范围","business.bizScope",true,record.bizScope,auditTypeList,0,'')}
            </Col>
            <Col span={12}>
            {this.handleRenderTab("select",formItemLayout,"业务交易类型","business.activityCode",true,record.activityCode,activityCodeList,0,'')}
             </Col>
            </Row>
            <Row gutter={4}>
            <Col span={8}>
            {this.handleRenderTab("input",inputFormItemLayout,"应用域代码","business.domainCode",false,record.domainCode,[],0,'')}
             </Col>
             <Col span={8}>
              {this.handleRenderTab("input",inputFormItemLayout,"路由关键值","business.routeValue",false,record.routeValue,[],0,'')}
            </Col>
            <Col span={8}>
            {this.handleRenderTab("select",textFormItemLayout,"接入类型","business.joinType",true,record.joinType,bizJoinTypeList,0,'')}
             </Col>
            </Row>
            <Row gutter={4}>
            <Col span ={8}>
            {this.handleRenderTab("input",inputFormItemLayout,"资费/月","business.tariff",false,record.tariff,[],0,'')}
            </Col>
            <Col span={8}>
            {this.handleRenderTab("input",inputFormItemLayout,"稽核时间","business.auditTime",false,record.auditTime,[],0,'')}
             </Col>
             <Col span ={8}>
               {this.handleRenderTab("select",inputFormItemLayout,"稽核频率","business.auditFrequency",false,record.auditFrequency,frequencyList,0,'')}
             </Col>
            </Row>
            <Row gutter={24}>
            <Col span ={12}>
              {this.handleRenderTab("select",formItemLayout,"导出地市差异","business.cityFile",false,record.cityFile,needList,0,'')}
            </Col>
            <Col span ={12}>
              {this.handleRenderTab("select",formItemLayout,"差异比对方式","business.needTempCheck",false,record.needTempCheck,tmpCheckList,0,'')}
            </Col>
            </Row>
            <Row gutter={24}>
            <Col span ={12}>
              {this.handleRenderTab("input",formItemLayout,"所属业务","business.parentCode",false,record.parentCode,[],0,'')}
            </Col>
            <Col span={12}>
              {this.handleRenderTab("radio",formItemLayout,"业务状态","business.statu",true,record.statu,radioList,0,'')}
             </Col>
            </Row>
            <Row>
              {this.handleRenderTab("textarea",formItemLayout,"业务描述","business.des",false,record.des,[],2,'')}
            </Row>
            </Form>
      </div>
    );
  }
}
const BusForm= Form.create()(BusInfoModal);

class BusinessNewInfo extends Component{
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
      record:["statu":"0",],
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
      const text="business.bizCode="+values.business.bizCode
      +"&business.bizName="+values.business.bizName
      +"&business.bizScope="+values.business.bizScope
      +"&business.activityCode="+values.business.activityCode
      +"&business.domainCode="+values.business.domainCode
      +"&business.routeValue="+values.business.routeValue
      +"&business.joinType="+values.business.joinType
      +"&business.tariff="+values.business.tariff
      +"&business.auditTime="+values.business.auditTime
      +"&business.auditFrequency="+values.business.auditFrequency
      +"&business.cityFile="+values.business.cityFile
      +"&business.needTempCheck="+values.business.needTempCheck
      +"&business.des="+(values.business.dec===undefined?"":values.business.dec)
      +"&business.parentCode="+values.business.parentCode
      +"&business.statu="+values.business.statu
      +"&act="+this.state.action;
      ajaxUtil("urlencoded","business!save.action",text,this,(data,that) => {
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
    const {auditTypeList,bizCode,bizJoinTypeList}=this.props;
    return(
      <div>
       <Modal key={uuid.v1()} visible={visible} onOk={this.handleOk} onCancel={this.handleCancel} width={750}
              title="编辑" confirmLoading={confirmLoading} okText="保存">
          <BusForm ref={(ref) => this.form = ref} bizCode={bizCode} record={this.state.record} action={this.state.action}
            bizJoinTypeList={bizJoinTypeList} auditTypeList={auditTypeList}
            />
       </Modal>
      </div>
    );
  }
}
export default BusinessNewInfo;
