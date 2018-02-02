import React,{Component} from "react";
import { Form, Input, Button,Modal,Upload ,Icon } from 'antd';
import { ajaxUtil} from '../../../util/AjaxUtils';
import UploadFile from '../../../component/uploadFile/UploadFile';
import uuid from 'node-uuid';
const FormItem = Form.Item;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
};
class BizAuditFormModal extends Component {
  checkchange =() =>{
  }
  render () {
    const { getFieldDecorator} = this.props.form;
    const record = this.props.record;
    const action = this.props.action;
    const file1="Myfile1";
    const file2="Myfile2";
    const url="business-audit-standard!uploadFile.action";
    const deleteUrl="audit-rule!deletedFile.action";
    return(
      <div>
      <Form>
          <FormItem {...formItemLayout } label="业务编码">
           {getFieldDecorator('businessAuditStandard.businessCode',{
             rules:[{ required:true, message:'业务编码不能为空',}],
             initialValue:record.businessCode
           })(
          <Input placeholder="请输入业务编码" />
          )}
         </FormItem>
         <FormItem {...formItemLayout } label="业务名称">
          {getFieldDecorator('businessAuditStandard.businessName',{
            rules:[{ required:true, message:'业务名称不能为空',}],
            initialValue:record.businessName
          })(
         <Input placeholder="请输入业务名称" />
         )}
        </FormItem>
        <FormItem {...formItemLayout } label="局方负责人">
         {getFieldDecorator('businessAuditStandard.jufang',{
           rules:[{ required:true, message:'负责人不能为空',}],
           initialValue:record.jufang
         })(
        <Input placeholder="请输入局方负责人" />
        )}
       </FormItem>
       <FormItem {...formItemLayout } label="备注">
        {getFieldDecorator('businessAuditStandard.remarks',{
          initialValue:record.remarks
        })(
       <TextArea rows={6}/>
       )}
      </FormItem>

       <FormItem {...formItemLayout} label="稽核方案">
          {getFieldDecorator('upload', {
            valuePropName: 'fileList',
            initialValue:[],
            })(
            <UploadFile name={file1} requestUrl={url} deleteUrl={deleteUrl} muliple={false}/>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="接口格式">
           {getFieldDecorator('upload1', {
             valuePropName: 'fileList1',
             initialValue:[],
             })(
             <UploadFile name={file2} requestUrl={url} deleteUrl={deleteUrl} muliple={false}/>
           )}
         </FormItem>
      </Form>
      </div>
     )
  };
}
const ComBizForm= Form.create()(BizAuditFormModal);

class NewBizAuditRule extends Component {
  constructor(props){
    super(props);
    this.state = {
    visible:false,
    };
  }
  show = () => {
    this.setState({
      visible:true,
      record:["bussinessName":"","businessCode":"","jufang":"","remarks":""],
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
        let auditPlanBid="";
        let auditPlanName="";
        let inFilterBid="";
        let inFilterName="";
        let upload=values.upload.response;
        let upload1=values.upload1.response;
        if (values.upload.status!=='removed'&& upload!==undefined && upload.success === "true") {
           auditPlanBid=upload.bid;
           auditPlanName=upload.name;
        }
        if (values.upload1.status!=='removed' && upload1!==undefined && upload1.success === "true") {
           inFilterBid=upload1.bid;
           inFilterName=upload1.name;
        }
        let bid=this.state.record.bid?this.state.record.bid:'';

        const text="businessAuditStandard.businessName="+values.businessAuditStandard.businessName
        +"&businessAuditStandard.businessCode="+values.businessAuditStandard.businessCode
        +"&businessAuditStandard.remarks="+values.businessAuditStandard.remarks
        +"&businessAuditStandard.jufang="+values.businessAuditStandard.jufang
        +"&flag="+this.state.action
        +"&businessAuditStandard.bid="+bid
        +"&uploadBid="+auditPlanBid
        +"&uploadName="+auditPlanName
        +"&inFilterBid="+inFilterBid
        +"&inFilterName="+inFilterName;
        ajaxUtil("urlencoded","business-audit-standard!save.action",text,this,(data,that) => {
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
          <ComBizForm ref={(ref) => this.form = ref} record={this.state.record} action={this.state.action} />
       </Modal>
      </div>
    );
  }
}

export default NewBizAuditRule;
