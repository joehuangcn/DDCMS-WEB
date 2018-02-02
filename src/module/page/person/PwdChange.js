import React,{Component} from 'react'
import { Form, Input, Button,Modal,Upload ,Icon,Select,Row,Col,InputNumber,Radio,Switch,DatePicker,message} from 'antd';
import { ajaxUtil} from '../../../util/AjaxUtils';
import UploadFile from '../../../component/uploadFile/UploadFile';
import uuid from 'node-uuid';
import Moment from 'moment';
const FormItem = Form.Item;
const {Option} = Select;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const radioList = [
  {key:'1',value:'激活'},
  {key:'0',value:'禁用'}
];
class  PwdInfoModal extends Component {
  constructor(props) {
    super(props);
    this.state={
    validateStatus:'success',
    errorMsg:null,
  }
  }

  handleNewConfirm=(e) =>{
    const {value}=e.target;
    let newOne=this.props.form.getFieldValue('newOne');
    if (value.length>newOne||value!==newOne.slice(0,value.length)) {
        this.setState({
          validateStatus:'error',
          errorMsg:"两次密码输入不一致",
        });
    }else{
      this.setState({
        validateStatus:'success',
        errorMsg:null,
      });
    }

  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const {validateStatus,errorMsg}=this.state;
    const inputFormItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span:16},
    };
    const textFormItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 10 },
    };
    return (
      <div>
            <Form>
             <Row >
             <Col>
                     <FormItem {...inputFormItemLayout } label="请输入旧密码">
                      {getFieldDecorator('oldOne',{
                        rules:[{ required:true, message:'旧密码不能为空',}],
                        initialValue:''
                      })(
                          <Input placeholder="旧密码" type="password" id="oldOne" />
                     )}
                     </FormItem>
            </Col>
            </Row>
            <Row>
            <Col>
                    <FormItem {...inputFormItemLayout } label="请输入新密码">
                     {getFieldDecorator('newOne',{
                       rules:[{ required:true, message:'新密码不能为空',}],
                       initialValue:'',
                     })(
                         <Input placeholder="新密码" type="password"  id="newOne" />
                    )}
                    </FormItem>
             </Col>
             </Row>
             <Row>
             <Col>
              <FormItem {...inputFormItemLayout } label="请再次输入新密码"
              validateStatus={validateStatus}
               help={errorMsg} >
               {getFieldDecorator('newConfirmOne',{
                 rules:[{ required:true, message:'新密码不能为空',}],
                 initialValue:'',

               })(
                   <Input placeholder="新密码" type="password" id="newConfirmOne" onChange={this.handleNewConfirm}/>
              )}
              </FormItem>
            </Col>
            </Row>
            </Form>
      </div>
    );
  }
}
const BusForm= Form.create()(PwdInfoModal);

class PwdChange extends Component{
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
      record:[],
      action:'add'
    });
  }
  // showModal =(action,record) => {
  //  this.setState({
  //    visible:true,
  //    record:record,
  //    action:action
  //  });
  // }

  handleOk=(e) =>{
    const form= this.form;
    form.validateFields(( err, values) => {
      if (err) {
        return;
      }
      this.setState({
        confirmLoading:true,
      });
      const text="old_password="+values.oldOne
      +"&new_password="+values.newOne
      ajaxUtil("urlencoded","personAction!updatePwd.action",text,this,(data,that) => {
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
      });

    });
  }

  render(){
    const { visible, confirmLoading }= this.state;
    return(
      <div>
       <Modal visible={visible} onOk={this.handleOk} onCancel={this.handleCancel} width={500}
              title="修改密码" confirmLoading={confirmLoading} okText="保存">
       <BusForm ref={(ref) => this.form = ref}/>
       </Modal>
      </div>
    );
  }
}
export default PwdChange;
