import React,{Component} from "react";
import { Form, Input,Modal,Select,DatePicker } from 'antd';
import { ajaxUtil} from '../../../util/AjaxUtils';
import UploadFile from '../../../component/uploadFile/UploadFile';
import uuid from 'node-uuid';
import Moment from 'moment';
const FormItem = Form.Item;
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
        <span>(注:文件批量导入必须使用模板格式!!!)</span>
        <FormItem {...formItemLayout} label="选择文件">
           {getFieldDecorator('upload', {
             valuePropName: 'fileList',
             initialValue:[],
             })(
             <UploadFile name={file1} requestUrl={url} deleteUrl={deleteUrl} muliple={false}/>
           )}
         </FormItem>
         <FormItem {...formItemLayout} label="时间">
            {getFieldDecorator('batchDate', {
              rules:[{ required:true, message:'导入时间不能为空',}],
              initialValue:Moment(),
              })(
              <DatePicker  placeholder="请选择" style={{width:150}}/>
            )}
          </FormItem>
      </Form>
      </div>
     )
  };
}
const ComBizForm= Form.create()(BizAuditFormModal);

class WholeNetUpload extends Component {
  constructor(props){
    super(props);
    this.state = {
    visible:false,
    auditTypeList:[],
      type:'',
    };
  }
  show = (type) => {
    this.setState({
      visible:true,
      record:[],
      action:'add',
      type:type,
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
        let uploadBid="";
        let uploadName="";
        if (values.upload.response.success === "true") {
           uploadBid=values.upload.response.bid;
           uploadName=values.upload.response.name;
        }
        const {type}=this.state;
        const text="listqty="+values.listqty+"&batchDate="+values.batchDate.format('YYYY-MM-DD')+"&type="+type
        +"&uploadBid="+uploadBid
        +"&uploadName="+uploadName;
        ajaxUtil("urlencoded","whole-network!batchuploadAfterUp.action",text,this,(data,that) => {
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
    const { visible, confirmLoading }= this.state;
    return(
      <div>
       <Modal key={uuid.v1()} visible={visible} onOk={this.handleOk} onCancel={this.handleCancel}
              title="编辑" confirmLoading={confirmLoading}  afterClose={this.afterClose}
        >
          <ComBizForm ref={(ref) => this.form = ref} />
       </Modal>
      </div>
    );
  }
}

export default WholeNetUpload;
