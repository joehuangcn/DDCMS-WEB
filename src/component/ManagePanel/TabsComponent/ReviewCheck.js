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
  labelCol: { span: 10 },
  wrapperCol: { span: 16 },
};
const passOrNotList = [
  {dicCode:'0',dicName:'同意上传'},
  {dicCode:'1',dicName:'不同意上传'}
];
class  NetInfoModal extends Component {
  constructor(props) {
    super(props);
  }

  handleRenderTab=(type,formItemLayout,label,name,required,initValue,SourceList,rows,info,disabled) =>{
    const {getFieldDecorator} = this.props.form;
    let renderSome;
    switch (type) {
      case 'input':
              renderSome=<Input placeholder="请输入" disabled={disabled}/>
        break;
        case 'select':
              renderSome= <Select  placeholder="请选择" >
                              {SourceList.map(d=> <Option key={d.dicCode} value={d.dicCode}>{d.dicName}</Option>)}
                          </Select>
          break;
          case 'textarea':
              renderSome= <TextArea placeholder={info} rows={rows}/>; break;
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
         initialValue:initValue===undefined?"":initValue
       })
       (
         renderSome
      )}
     </FormItem>

   );
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const {record,action} =this.props;
    const inputFormItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span:16},
    };
    const textFormItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 16 },
    };
    return (
      <div>
            <Form>
            <Row>
              <Col span={12}>
              {this.handleRenderTab("input",inputFormItemLayout,"业务名称","synReviewLog.bizName",true,record.BIZCODE,[],0,'',true)}
             </Col>
             <Col span={12}>
               {this.handleRenderTab("input",inputFormItemLayout,"差异代码","synReviewLog.diffCode",true,record.DIFFCODE,[],0,'',true)}
            </Col>
             </Row>
            <Row>
            <Col span={12}>
            {this.handleRenderTab("input",inputFormItemLayout,"稽核日期","synReviewLog.auditTime",false,record.AUDITTIME,[],0,'',true)}
             </Col>
             <Col span={12}>
             {this.handleRenderTab("input",inputFormItemLayout,"差异数量","synReviewLog.diffNum",false,record.DIFFNUM,[],0,'',true)}
              </Col>
             </Row>
             <Row>
             <Col span={12}>
                {this.handleRenderTab("select",inputFormItemLayout,"是否上传","synReviewLog.passOrNot",true,record.passOrNot,passOrNotList,0,'',false)}
              </Col>
             </Row>
             <Row>
             <Col>
              {this.handleRenderTab("textarea",textFormItemLayout,"审核意见","synReviewLog.reviewInfo",true,'',[],2,'',false)}
            </Col>
            </Row>
            </Form>
      </div>
    );
  }
}
const BusForm= Form.create()(NetInfoModal);

class ReviewCheck extends Component{
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
  showModal =(action,record,config) => {
  
   this.setState({
     visible:true,
     record:record,
     action:action,
     config:config,
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
      const {config,record}=this.state;
      const text="synReviewLog.bizName="+values.synReviewLog.bizName
      +"&synReviewLog.diffCode="+values.synReviewLog.diffCode
      +"&synReviewLog.auditTime="+values.synReviewLog.auditTime
      +"&synReviewLog.diffNum="+values.synReviewLog.diffNum
      +"&synReviewLog.passOrNot="+values.synReviewLog.passOrNot
      +"&synReviewLog.reviewInfo="+(values.synReviewLog.reviewInfo===undefined?"":values.synReviewLog.reviewInfo)
      +"&synReviewLog.statu="+values.synReviewLog.statu
      +"&synReviewLog.did="+record.DID
      +"&synReviewLog.auditType="+config.auditType
      +"&synReviewLog.auditScope="+config.dataScope;
      ajaxUtil("urlencoded","syn!synReview.action",text,this,(data,that) => {
        let status=data.success;
        let message= data.message;
        this.setState({
          visible: false,
          confirmLoading: false,
        });
        this.form.resetFields();
          if (status===true) {
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
    return(
      <div>
       <Modal visible={visible} onOk={this.handleOk} onCancel={this.handleCancel} width={500}
              title="审核" confirmLoading={confirmLoading} okText="保存">
       <BusForm ref={(ref) => this.form = ref}  record={this.state.record} action={this.state.action} />
       </Modal>
      </div>
    );
  }
}
export default ReviewCheck;
