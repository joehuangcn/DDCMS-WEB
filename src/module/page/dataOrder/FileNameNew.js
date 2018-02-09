import React,{Component} from 'react'
import { Form, Input,Modal ,Select,Row,Col} from 'antd';
import { ajaxUtil} from '../../../util/AjaxUtils';
const FormItem = Form.Item;
const {Option} = Select;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};
class  FileNameInfoModal extends Component {
  constructor(props) {
    super(props);
    this.state={}
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
              renderSome= <Input placeholder={info} type="textarea"  rows={rows}/>; break;
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
    const {netList}=this.state;
    const {record,action} =this.props;
    const inputFormItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    return (
      <div>
            <Form>
            <Row >
              <Col>
                {this.handleRenderTab("input",formItemLayout,"文件名","fileName",true,record.fileName,[],0,'')}
              </Col>
             </Row>
            </Form>
      </div>
    );
  }
}
const DiffForm= Form.create()(FileNameInfoModal);

class FileNameNew extends Component{
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
      let bid=this.state.record.id?this.state.record.id:'';
      const text="fileName="+values.fileName
      +"&id="+bid
      +"&act="+this.state.action;
      ajaxUtil("urlencoded","file-type!saveFileType.action",text,this,(data,that) => {
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
          this.props.refresh();
      });

    });
  }

  render(){
    const { visible, confirmLoading }= this.state;
    return(
      <div className="modal test">
       <Modal  visible={visible} onOk={this.handleOk} onCancel={this.handleCancel}
              title="编辑" confirmLoading={confirmLoading} okText="保存" cancelText='取消' width={500}>
              <DiffForm ref={(ref) => this.form = ref}  record={this.state.record} action={this.state.action}
                />
       </Modal>
      </div>
    );
  }
}
export default FileNameNew;
