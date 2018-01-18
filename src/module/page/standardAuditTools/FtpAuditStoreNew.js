import React,{Component} from "react";
import { Form, Input, Button,Modal,Upload ,Icon,Select,Row,Col,InputNumber,Radio,Switch,Tabs,DatePicker} from 'antd';
import { ajaxUtil} from '../../../util/AjaxUtils';
import UploadFile from '../../../component/uploadFile/UploadFile';
import uuid from 'node-uuid';
import Moment from 'moment';
const FormItem = Form.Item;
const Option=Select.Option;
const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const statuList=[
    {dicCode:'0',dicName:'删除' },
    {dicCode:'1',dicName:'在用' },
  ];
  const auditReasonList=[
      {dicCode:'1',dicName:'CRM程序问题' },
      {dicCode:'2',dicName:'数据问题' },
      {dicCode:'3',dicName:'帐处理程序问题' },
      {dicCode:'4',dicName:'出账前固定稽核' },
      {dicCode:'5',dicName:'指标保障' },
      {dicCode:'6',dicName:'收入保障' },
    ]
class BizAuditFormModal extends Component {

  constructor(props){
    super(props);
    this.state={
    }
  }

  handleRenderTab=(type,formItemLayout,label,name,required,initValue,SourceList,rows,info) =>{
    const {getFieldDecorator} = this.props.form;
    let renderSome;
    switch (type) {
      case 'input':
              renderSome=<Input placeholder="请输入" />
        break;
        case 'select':
              renderSome= <Select  placeholder="请选择" >
                              {SourceList.map(d=> <Option key={d.dicCode} value={d.dicCode}>{d.dicName}</Option>)}
                          </Select>
          break;
          case 'textarea':
              renderSome= <TextArea placeholder={info}  rows={rows}/>; break;
          case 'radio':
                renderSome=<RadioGroup>
                          {SourceList.map(d=> <Radio key={d.key} value={d.key}>{d.value}</Radio>)}
                    </RadioGroup>;break;
          case 'date':
                renderSome= <DatePicker  placeholder="请选择" style={{width:150}}/>; break;
          case 'none':
                renderSome= <Input style={{display:'none'}} disabled={true}/>; break;
      default:break;
    }
    return (
      <FormItem {...formItemLayout } label={label}>
       {getFieldDecorator(name,{
         rules:[{ required:required, message:label+'不能为空',}],
         initialValue:(type==="date"?(initValue?Moment(initValue):Moment()):(initValue===undefined?"":initValue))
       })
       (
         renderSome
      )}
     </FormItem>

   );
  }
  render () {
    const { getFieldDecorator} = this.props.form;
    const record = this.props.record;
    const action = this.props.action;
    return(
      <div>
      <Form>
      <Row gutter={4}>
      <Col span={12}>
        {this.handleRenderTab("input",formItemLayout,"稽核项编码","ftpAuditStoreManage.auditId",true,record.auditId,[],0,'')}
       </Col>
       <Col span={12}>
         {this.handleRenderTab("input",formItemLayout,"稽核项业务名称","ftpAuditStoreManage.auditName",true,record.auditName,[],0,'')}
      </Col>
      </Row>
      <Row>
        {this.handleRenderTab("textarea",formItemLayout,"内容描述","ftpAuditStoreManage.contents",false,record.contents,[],4,'')}
      </Row>
      <Row gutter={6}>
        <Col span ={12}>
          {this.handleRenderTab("input",formItemLayout,"稽核方式","ftpAuditStoreManage.auditWay",false,record.auditWay,[],0,'')}
        </Col>
        <Col span ={12}>
          {this.handleRenderTab("input",formItemLayout,"厂家负责人","ftpAuditStoreManage.changjia",false,record.changjia,[],0,'')}
        </Col>
      </Row>
      <Row gutter={6}>
        <Col span ={12}>
          {this.handleRenderTab("date",formItemLayout,"开始时间","ftpAuditStoreManage.startTime",false,record.startTime,[],0,'')}
        </Col>
        <Col span ={12}>
          {this.handleRenderTab("date",formItemLayout,"失效时间","ftpAuditStoreManage.invalidTime",false,record.invalidTime,[],0,'')}
        </Col>
      </Row>
      <Row gutter={6}>
        <Col span ={12}>
          {this.handleRenderTab("input",formItemLayout,"稽核频次","ftpAuditStoreManage.auditRate",false,record.auditRate,[],0,'')}
        </Col>
        <Col span ={12}>
          {this.handleRenderTab("input",formItemLayout,"脚本路径","ftpAuditStoreManage.path",false,record.path,[],0,'')}
        </Col>
      </Row>

      <Row gutter={4}>
      <Col span={12}>
        {this.handleRenderTab("select",formItemLayout,"状态","ftpAuditStoreManage.status",true,record.status,statuList,0,'')}
       </Col>
       <Col span={12}>
         {this.handleRenderTab("input",formItemLayout,"执行时间","ftpAuditStoreManage.executeTime",false,record.executeTime,[],0,'')}
        </Col>
      </Row>
      <Row>
        {this.handleRenderTab("textarea",formItemLayout,"备注","ftpAuditStoreManage.tips",false,record.tips,[],2,'')}
      </Row>
      <Row gutter={6}>
        <Col span ={12}>
          {this.handleRenderTab("select",formItemLayout,"稽核原因","ftpAuditStoreManage.auditReason",true,record.auditReason,auditReasonList,0,'')}
        </Col>
        <Col span ={12}>
          {this.handleRenderTab("input",formItemLayout,"局方负责人","ftpAuditStoreManage.jufang",false,record.jufang,[],0,'')}
        </Col>
      </Row>
      <Row>
        {this.handleRenderTab("textarea",formItemLayout,"执行命令","ftpAuditStoreManage.executeOrder",false,record.executeOrder,[],2,'')}
      </Row>
      </Form>
      </div>
     )
  };
}
const ComBizForm= Form.create()(BizAuditFormModal);

class FtpAuditStoreNew extends Component {
  constructor(props){
    super(props);
    this.state = {
    visible:false,
    auditTypeList:[],
    };
  }
  show = () => {
    this.setState({
      visible:true,
      record:[],
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
        this.setState({
          confirmLoading:true,
        });
        const {action}=this.state;
        let id=(this.state.record.num==undefined?'':this.state.record.num);
        let text="ftpAuditStoreManage.auditId="+values.ftpAuditStoreManage.auditId
        +"&ftpAuditStoreManage.auditName="+values.ftpAuditStoreManage.auditName
        +"&ftpAuditStoreManage.contents="+values.ftpAuditStoreManage.contents
        +"&ftpAuditStoreManage.auditWay="+values.ftpAuditStoreManage.auditWay
        +"&ftpAuditStoreManage.changjia="+values.ftpAuditStoreManage.changjia
        +"&ftpAuditStoreManage.auditRate="+values.ftpAuditStoreManage.auditRate
        +"&ftpAuditStoreManage.path="+values.ftpAuditStoreManage.path
        +"&ftpAuditStoreManage.status="+values.ftpAuditStoreManage.status
        +"&ftpAuditStoreManage.tips="+values.ftpAuditStoreManage.tips
        +"&ftpAuditStoreManage.startTime="+(values.ftpAuditStoreManage.startTime===undefined?"":values.ftpAuditStoreManage.startTime.format('YYYY-MM-DD'))
        +"&ftpAuditStoreManage.invalidTime="+(values.ftpAuditStoreManage.invalidTime===undefined?"":values.ftpAuditStoreManage.invalidTime.format('YYYY-MM-DD'))
        +"&ftpAuditStoreManage.auditReason="+values.ftpAuditStoreManage.auditReason
        +"&ftpAuditStoreManage.jufang="+values.ftpAuditStoreManage.jufang
        +"&ftpAuditStoreManage.executeTime="+values.ftpAuditStoreManage.executeTime
        +"&ftpAuditStoreManage.executeOrder="+values.ftpAuditStoreManage.executeOrder
        +"&uploadtime="+Moment().format('YYYY-MM-DD')
        +"&flag="+action+"&ftpAuditStoreManage.num="+id;
        ajaxUtil("urlencoded","ftp-audit-store-manage!filenumber.action",text,this,(data,that) => {
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
            this.props.refresh();
        });

      });
    }

  handleCancel = (e) => {
    this.setState({visible:false});
    const form1= this.form;
  }

  onUpChange = (info) =>{

  }
  afterClose = () => {
    this.form.resetFields();
  }

  render() {
    const { visible, confirmLoading,auditTypeList,record,action }= this.state;
    return(
      <div>
       <Modal key={uuid.v1()} visible={visible} onOk={this.handleOk} onCancel={this.handleCancel}
              title="编辑" confirmLoading={confirmLoading}  afterClose={this.afterClose} width={700}
        >
          <ComBizForm ref={(ref) => this.form = ref}  record={record} action={action}/>
       </Modal>
      </div>
    );
  }
}

export default FtpAuditStoreNew;
