import React,{Component} from 'react'
import { Form, Input, Button,Modal,Upload ,Icon,Select,Row,Col,InputNumber,Radio,Switch,Divider} from 'antd';
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
const fileList = [
  {dicCode:'all',dicName:'上传全部此类差异'},
  {dicCode:'file',dicName:'上传指定文件'}
];
class  NetInfoModal extends Component {
  constructor(props) {
    super(props);
    this.state={
      show:'none',
    }
  }

  handleRenderTab=(type,formItemLayout,label,name,required,initValue,SourceList,rows,info,disabled) =>{
    const {getFieldDecorator} = this.props.form;
    let renderSome;
    switch (type) {
      case 'input':
              renderSome=<Input placeholder="请输入" disabled={disabled}/>
        break;
        case 'select':
              renderSome= <Select  placeholder="请选择" onSelect={this.selectCheck} >
                              {SourceList.map(d=> <Option key={d.dicCode} value={d.dicCode}>{d.dicName}</Option>)}
                          </Select>
          break;
          case 'textarea':
              renderSome= <TextArea placeholder={info} rows={rows} disabled={disabled} />; break;
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

  selectCheck=(value,option) =>{
      if (value==="file") {
          this.setState({show:'inline'});
      }
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const {record,action} =this.props;
    const {show}=this.state;
    const inputFormItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span:16},
    };
    const textFormItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 16 },
    };
    const file1="batchfile";
    const url="audit-rule!uploadFile.action";
    const deleteUrl="audit-rule!deletedFile.action";

    return (
      <div>
            <Form>
            <Row>
              <Col span={12}>
              {this.handleRenderTab("input",inputFormItemLayout,"业务名称","synReviewLog.bizName",false,record.BIZCODE,[],0,'',true)}
             </Col>
             <Col span={12}>
               {this.handleRenderTab("input",inputFormItemLayout,"差异代码","synReviewLog.diffCode",false,record.DIFFCODE,[],0,'',true)}
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
               <Divider>同步审核意见</Divider>
               <Row>
               <Col span={24}>
                {this.handleRenderTab("textarea",textFormItemLayout,"","synReviewLog.reviewInfo",false,record.REVIEWINFO,[],2,'',true)}
              </Col>
              </Row>
              <Divider>同步操作选项</Divider>
             <Row>
             <Col span={18}>
                {this.handleRenderTab("select",inputFormItemLayout,"上传范围","synReviewLog.synScope",true,'',fileList,0,'',false)}
              </Col>
             </Row>
             <Row>
             <Col style={{display:show}} span={18}>
                 <FormItem {...inputFormItemLayout} label="选择文件">
                    {getFieldDecorator('upload', {
                      valuePropName: 'fileList',
                      initialValue:[],
                      })(
                      <UploadFile name={file1} requestUrl={url} deleteUrl={deleteUrl} muliple={false}/>
                    )}
                  </FormItem>
            </Col>
            </Row>
            </Form>
      </div>
    );
  }
}
const BusForm= Form.create()(NetInfoModal);

class SynCheck extends Component{
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
    console.log(config);
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
      // this.setState({
      //   confirmLoading:true,
      // });
      const {config,record}=this.state;
      let uploadBid="";
      let uploadName="";
      if (values.upload.response!==undefined && values.upload.response.success === "true") {
         uploadBid=values.upload.response.bid;
         uploadName=values.upload.response.name;
      }

      const text="bizcode="+record.BIZCODE
      +"&diffCode="+record.DIFFCODE
      +"&obtainDataTime="+record.OBTAINDATATIME
      +"&needRename="+record.needRename
      +"&operType="+record.operType
      +"&diffnum="+record.DIFFNUM
      +"&auditTime="+record.AUDITTIME
      +"&cityCode="+record.CITYCODE
      +"&synType="+values.synReviewLog.passOrNot
      +"&DID="+record.DID
      +"&auditType="+config.auditType
      +"&dataScope="+config.dataScope
      +"&dataType="+config.dataType
      +"&fileName="+uploadName+"&fileNameMd5="+uploadBid;
      // ajaxUtil("urlencoded","syn!submitSynNew.action",text,this,(data,that) => {
      //   let status=data.success;
      //   let message= data.message;
      //   this.setState({
      //     visible: false,
      //     confirmLoading: false,
      //   });
      //   this.form.resetFields();
      //     if (status===true) {
      //       Modal.success({
      //        title: '消息',
      //        content: message,
      //       });
      //     }else {
      //       Modal.error({
      //         title: '消息',
      //         content: message,
      //      });
      //     }
      //     this.props.refresh();
      // });
        console.log(text);
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
export default SynCheck;
