import React,{Component} from "react";
import { Form, Input,Modal,Select,Row,Col,Radio,Tabs,DatePicker,TreeSelect} from 'antd';
import { ajaxUtil} from '../../../util/AjaxUtils';
import UploadFile from '../../../component/uploadFile/UploadFile';
import uuid from 'node-uuid';
import Moment from 'moment';
const FormItem = Form.Item;
const Option=Select.Option;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const statuList=[
    {dicCode:'1',dicName:'高' },
    {dicCode:'2',dicName:'中' },
    {dicCode:'3',dicName:'低' },
  ];
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
          case 'tree':
                renderSome=<TreeSelect  placeholder='请选择' style={{ width: 400 }} allowClear  treeData={SourceList}/>;break;
          case 'treeSelect':
                renderSome=<TreeSelect placeholder='请选择' style={{ width: 400 }} allowClear  treeData={SourceList}
                              treeCheckable={true} showCheckedStrategy='SHOW_CHILD' />;break;
                  break;

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
    const {record,action,personList}=this.props;
    const file1="batchfile";
    const url="audit-rule!uploadFile.action";
    const deleteUrl="audit-rule!deletedFile.action";
    return(
      <div>
      <Form>
      <Row gutter={4}>
      <Col>
        {this.handleRenderTab("input",formItemLayout,"工单名称","workOrder.workOrderName",true,record.workOrderName,[],0,'')}
       </Col>
      </Row>
      <Row>
        {this.handleRenderTab("textarea",formItemLayout,"工单描述","workOrder.woContents",false,record.woContents,[],6,'')}
      </Row>
      <Row gutter={2}>
        <Col span={12}>
        {this.handleRenderTab("select",formItemLayout,"优先级","workOrder.priority",true,record.priority,statuList,0,'')}
       </Col>
       <Col span ={12}>
         {this.handleRenderTab("date",formItemLayout,"计划完成时间","workOrder.wishEndTime",false,record.wishEndTime,[],0,'')}
       </Col>
      </Row>
      <Row gutter={6}>
        <Col >
          {this.handleRenderTab("tree",formItemLayout,"审查人员1","workOrder.reviewPerson",false,record.reviewPerson,personList,0,'')}
        </Col>
        </Row>
        <Row gutter={6}>
        <Col >
          {this.handleRenderTab("tree",formItemLayout,"审查人员2","workOrder.reviewPersoRe",false,record.reviewPersoRe,personList,0,'')}
        </Col>
      </Row>
      <Row gutter={6}>
        <Col>
          {this.handleRenderTab("tree",formItemLayout,"指派人员","workOrder.commonReceiver",true,record.commonReceiver,personList,0,'')}
        </Col>
        </Row>
        <Row gutter={6}>
        <Col >
          {this.handleRenderTab("treeSelect",formItemLayout,"抄送人员","workOrder.commonCopyer",false,record.commonCopyer,personList,0,'')}
        </Col>
      </Row>

      <Row gutter={4}>
      <Col >
        {this.handleRenderTab("tree",formItemLayout,"确定结束人员","workOrder.checkEndPerson",false,record.checkEndPerson,personList,0,'')}
       </Col>
       </Row>
       <Row gutter={6}>
       <Col >
         <FormItem {...formItemLayout} label="上传附件">
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
     )
  };
}
const ComBizForm= Form.create()(BizAuditFormModal);

class SimpleOrder extends Component {
  constructor(props){
    super(props);
    this.state = {
    visible:false,
    auditTypeList:[],
    personList:[],
    };
  }

componentWillMount (){
  this.getInitList();
}

  getInitList =() =>{
    ajaxUtil("urlencoded","person!getPersonTree.action","node=0",this,(data,that)=>{
        this.setState({personList:data});
    });
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
        let uploadName=""; let uploadMd5="";
        if (values.upload.status==='done') {
            if (values.upload.response!==undefined && values.upload.response.success==='true') {
                uploadMd5=values.upload.response.bid;
                uploadName=values.upload.response.name;
            }
        }
        const {action}=this.state;
        let text="workOrder.workOrderName="+values.workOrder.workOrderName
        +"&workOrder.woContents="+values.workOrder.woContents
        +"&workOrder.priority="+values.workOrder.priority
        +"&workOrder.wishEndTime="+(values.workOrder.wishEndTime===undefined?"":values.workOrder.wishEndTime.format('YYYY-MM-DD'))
        +"&workOrder.reviewPerson.userId="+values.workOrder.reviewPerson
        +"&workOrder.reviewPersoRe.userId="+values.workOrder.reviewPersoRe
        +"&commonReceiver.id="+values.workOrder.commonReceiver
        +"&commonCopyer.id="+values.workOrder.commonCopyer
        +"&workOrder.checkEndPerson.userId="+values.workOrder.checkEndPerson
        +"&type=1";
        ajaxUtil("urlencoded","work-order!saveNew.action",text,this,(data,that) => {
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
    const { visible, confirmLoading,auditTypeList,record,action,personList}= this.state;
    return(
      <div>
       <Modal key={uuid.v1()} visible={visible} onOk={this.handleOk} onCancel={this.handleCancel}
              title="编辑" confirmLoading={confirmLoading}  afterClose={this.afterClose} width={700}
        >
        <ComBizForm ref={(ref) => this.form = ref}  record={record} action={action} personList={personList}/>
       </Modal>
      </div>
    );
  }
}

export default SimpleOrder;
