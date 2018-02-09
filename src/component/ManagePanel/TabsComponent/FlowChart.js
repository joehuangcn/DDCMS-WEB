import React,{Component} from 'react'
import { Form, Button,Modal,Divider,Card,Spin} from 'antd';
import UploadFile from '../../../component/uploadFile/UploadFile';
import {ajaxUtil} from '../../../util/AjaxUtils';
import uuid from 'node-uuid';
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
};

class FlowChart extends Component {

    constructor(props) {
      super(props);
      this.state={
        visible:false,
        spinning:false,
      }
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

          const text="uploadBid="+uploadBid+"&uploadName="+uploadName;
          ajaxUtil("urlencoded","flow-chart!uploadCheck.action",text,this,(data,that) => {
            let status=data.success;
            let message= data.info;
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
    }

    handleSearch=() =>{
      this.setState({visible:true});
    }

    handleRefresh=() =>{
      this.setState({spinning:true});
      setTimeout(()=>{this.setState({spinning:false})}, 1000);
    }

    setTime=() =>{

    }

    render() {
      const {config} = this.props;
      const {visible,confirmLoading,spinning}=this.state;
      return (
        <div>
        <Button type="primary" onClick={this.handleSearch}>上传新图片</Button>
        <Card  hoverable  cover={<img alt="example" src={"/DDCMS/flowchart/"+config.bizCode+".jpg"} />} >
        </Card>
        <Modal key={uuid.v1()} visible={visible} onOk={this.handleOk} onCancel={this.handleCancel}
               title="上传流程图" confirmLoading={confirmLoading}  afterClose={this.afterClose}
         >
           <ComBizForm ref={(ref) => this.form = ref}/>
        </Modal>
        </div>
      );
    }
  }

  class BizAuditFormModal extends Component {
    checkchange =() =>{
    }
    render () {
      const { getFieldDecorator} = this.props.form;
      // const record = this.props.record;
      // const action = this.props.action;
      // const {auditTypeList}=this.props;
      const file1="Myfile";
      const url="flow-chart!uploadFile.action";
      const deleteUrl="flow-chart!deletedFile.action";
      return(
        <div>
        <Form>
          <Divider>上传图片格式为jpg, 请用业务代码命名,例:1005.jpg</Divider>
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


export default FlowChart;
