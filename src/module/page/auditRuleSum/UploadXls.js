import React,{Component} from "react";
import { Form, Input, Button,Modal,Upload ,Icon,Select } from 'antd';
import { ajaxUtil} from '../../../util/AjaxUtils';
import UploadFile from '../../../component/uploadFile/UploadFile';
import uuid from 'node-uuid';
const FormItem = Form.Item;
const Option=Select.Option;
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
};
class BizAuditFormModal extends Component {
  checkchange =() =>{
  }
  render () {
    const { getFieldDecorator} = this.props.form;
    // const record = this.props.record;
    // const action = this.props.action;
    const {auditTypeList}=this.props;
    const file1="batchfile";
    const url="audit-rule!uploadFile.action";
    const deleteUrl="audit-rule!deletedFile.action";
    return(
      <div>
      <Form>
          <FormItem {...formItemLayout } label="导入条数">
           {getFieldDecorator('listqty',{
             rules:[{ required:true, message:'导入条数不能为空',}],
             initialValue:'',
           })(
          <Input placeholder="请输入文件导入的记录条数" />
          )}
         </FormItem>
       <FormItem {...formItemLayout} label="业务范围">
          {getFieldDecorator('businessType', {
            rules:[{ required:true, message:'业务范围不能为空',}],
            initialValue:'',
            })(
              <Select  placeholder="请选择" >
                      {auditTypeList.map(d=> <Option key={d.dicCode} value={d.dicCode}>{d.dicName}</Option>)}
              </Select>
          )}
        </FormItem>
        <span>(注:文件批量导入必须使用模板格式!!!)</span>
        <FormItem {...formItemLayout} label="选择文件">
           {getFieldDecorator('upload', {
             valuePropName: 'fileList',
             initialValue:[],
             })(
             <UploadFile name={file1} requestUrl={url} deleteUrl={deleteUrl} muliple={false}/>
           )}
         </FormItem>
      </Form>
      </div>
     )
  };
}
const ComBizForm= Form.create()(BizAuditFormModal);

class UploadXls extends Component {
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
      record:["bussinessName":"","businessCode":"","jufang":"","remarks":""],
      action:'add'
    });
  }
  componentWillMount(){
    this.getdic();
  }

  getdic=() =>{
    ajaxUtil("urlencoded","dictionaryAction!getDictionaryListByType.action","name=DICT_AuditType",this,(data,that)=>{
        this.setState({auditTypeList:data.data});
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
        let uploadBid="";
        let uploadName="";
        if (values.upload.response.success === "true") {
           uploadBid=values.upload.response.bid;
           uploadName=values.upload.response.name;
        }

        const text="listqty="+values.listqty
        +"&businessType="+values.businessType
        +"&uploadBid="+uploadBid
        +"&uploadName="+uploadName;
        ajaxUtil("urlencoded","audit-rule!batchuploadAfterUp.action",text,this,(data,that) => {
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
    const form1= this.form;
  }

  onUpChange = (info) =>{

  }
  afterClose = () => {
    this.form.resetFields();
  }

  render() {
    const { visible, confirmLoading,auditTypeList }= this.state;
    return(
      <div>
       <Modal key={uuid.v1()} visible={visible} onOk={this.handleOk} onCancel={this.handleCancel}
              title="编辑" confirmLoading={confirmLoading}  afterClose={this.afterClose}
        >
          <ComBizForm ref={(ref) => this.form = ref} auditTypeList={auditTypeList} />
       </Modal>
      </div>
    );
  }
}

export default UploadXls;
