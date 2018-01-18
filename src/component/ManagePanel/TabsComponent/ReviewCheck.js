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
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const radioList = [
  {key:'1',value:'激活'},
  {key:'0',value:'禁用'}
];
class  NetInfoModal extends Component {
  constructor(props) {
    super(props);
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
    const {record,action} =this.props;
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
            <Row>
              <Col>
              {this.handleRenderTab("input",inputFormItemLayout,"网元编码","netElement.netEleCode",true,record.netEleCode,[],0,'')}
             </Col>
             </Row>
             <Row >
             <Col>
               {this.handleRenderTab("input",inputFormItemLayout,"网元名称","netElement.netEleName",true,record.netEleName,[],0,'')}
            </Col>
            </Row>
            <Row>
            <Col>
            {this.handleRenderTab("input",inputFormItemLayout,"sp名称","netElement.spName",false,record.spName,[],0,'')}
             </Col>
             </Row>
             <Row>
             <Col>
              {this.handleRenderTab("textarea",inputFormItemLayout,"网元描述","netElement.des",false,record.des,[],2,'')}
            </Col>
            </Row>
            <Row>
            <Col>
            {this.handleRenderTab("radio",inputFormItemLayout,"网元状态","netElement.statu",false,record.statu,radioList,0,'')}
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
      const text="netElement.netEleCode="+values.netElement.netEleCode
      +"&netElement.netEleName="+values.netElement.netEleName
      +"&netElement.spName="+values.netElement.spName
      +"&netElement.des="+(values.netElement.des===undefined?"":values.netElement.des)
      +"&netElement.statu="+values.netElement.statu
      +"&act="+this.state.action;
      ajaxUtil("urlencoded","netelement!save.action",text,this,(data,that) => {
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
