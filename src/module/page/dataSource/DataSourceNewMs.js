import React,{Component} from 'react'
import { Form, Input, Button,Modal,Upload ,Icon,Select,Row,Col,InputNumber,Radio,Switch,Steps, message} from 'antd';
import { ajaxUtil} from '../../../util/AjaxUtils';
import UploadFile from '../../../component/uploadFile/UploadFile';
import uuid from 'node-uuid';
import Moment from 'moment';
const FormItem = Form.Item;
const {Option} = Select;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const Step=Steps.Step;
const DataGatherList=[
      {dicCode:'L',dicName:'远程文件采集方式'},
      {dicCode:'D',dicName:'数据库连接方式'},
      {dicCode:'F',dicName:'文件导入方式'}
    ];
    const DbList=[
          {dicCode:'O',dicName:'ORACLE'},
          {dicCode:'D',dicName:'DB2'},
          {dicCode:'M',dicName:'MYSQL'},
          {dicCode:'S',dicName:'SQLSERVER'}
        ];
    const FtpList=[
          {dicCode:'F',dicName:'FTP'},
          {dicCode:'S',dicName:'SFTP'},
          {dicCode:'L',dicName:'LFTP'}
        ];
    const steps = [{
      title: '基本信息',
    }, {
      title: '连接信息',
    }];
class  DataSourceInfoModal extends Component {
  constructor(props) {
    super(props);
    this.state={
      current:0,
      choiceWay:''
    }
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

  handleSelectWay=(value)=>{
    this.setState({choiceWay:value});
  }
    next=()=> {
    const current = this.state.current + 1;
    this.setState({ current });
  }
  prev=()=> {
   const current = this.state.current - 1;
   this.setState({ current });
 }

  handleChoice=(current) =>{
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
        //  {this.handleRenderTab("select",inputFormItemLayout,"数据采集方式","netElement.gatherway",true,record.gatherway,DataGatherList,0,'')}
    switch (current) {
      case 0:
        return (
          <div className="first-one">
            <Row>
              <Col>
              {this.handleRenderTab("input",inputFormItemLayout,"数据源名称","netElement.dscname",true,record.dscname,[],0,'')}
             </Col>
             </Row>
             <Row >
             <Col>
                   <FormItem {...inputFormItemLayout } label="数据采集方式">
                    {getFieldDecorator('netElement.gatherway',{
                      rules:[{ required:true, message:'数据采集方式不能为空',}],
                      initialValue:record.gatherway===undefined?"":record.gatherway
                    })(
                      <Select  placeholder="请选择"  onChange={this.handleSelectWay} allowClear={true}>
                        {DataGatherList.map(d=> <Option key={d.dicCode} value={d.dicCode}>{d.dicName}</Option>)}
                      </Select>
                   )}
                   </FormItem>
            </Col>
            </Row>
          </div>
        )
        break;
      case 1:
        const {choiceWay}=this.state;
        if (choiceWay==='F') {
          return (  <Row>
              <Col>
              {this.handleRenderTab("input",inputFormItemLayout,"文件夹路径","netElement.filePath",true,record.filePath,[],0,'')}
             </Col>
             </Row>);
        }else if(choiceWay==="D"){
          return(<div>
          <Row>
            <Col span={12}>
              {this.handleRenderTab("select",inputFormItemLayout,"数据库类型","netElement.dway",true,record.dway,DbList,0,'')}
            </Col>
            <Col span={12}>
              {this.handleRenderTab("input",inputFormItemLayout,"数据库实例","netElement.dbname",true,record.dbname,[],0,'')}
          </Col>
          </Row>
          <Row>
          <Col span={12}>
          {this.handleRenderTab("input",inputFormItemLayout,"主机/IP","netElement.dhost",true,record.dhost,[],0,'')}
          </Col>
          <Col span={12}>
          {this.handleRenderTab("input",inputFormItemLayout,"端口号","netElement.dport",true,record.dport,[],0,'')}
          </Col>
          </Row>
          <Row>
          <Col span={12}>
          {this.handleRenderTab("input",inputFormItemLayout,"用户名","netElement.dusername",true,record.dusername,[],0,'')}
          </Col>
          <Col span={12}>
          {this.handleRenderTab("input",inputFormItemLayout,"密码","netElement.dpassword",true,record.dpassword,[],0,'')}
          </Col>
          </Row></div>)
        }else if (choiceWay==='L') {
        return(<div>
          <Row>
            <Col span={12}>
              {this.handleRenderTab("select",inputFormItemLayout,"协议类型","netElement.dway",true,record.dway,FtpList,0,'')}
            </Col>
            <Col span={12}>
              {this.handleRenderTab("input",inputFormItemLayout,"远程路径","netElement.localway",true,record.localway,[],0,'')}
          </Col>
          </Row>
          <Row>
          <Col span={12}>
          {this.handleRenderTab("input",inputFormItemLayout,"主机/IP","netElement.lhost",true,record.lhost,[],0,'')}
          </Col>
          <Col span={12}>
          {this.handleRenderTab("input",inputFormItemLayout,"端口号","netElement.lport",true,record.lport,[],0,'')}
          </Col>
          </Row>
          <Row>
          <Col span={12}>
          {this.handleRenderTab("input",inputFormItemLayout,"用户名","netElement.lusername",true,record.lusername,[],0,'')}
          </Col>
          <Col span={12}>
          {this.handleRenderTab("input",inputFormItemLayout,"密码","netElement.lpassword",true,record.lpassword,[],0,'')}
          </Col>
          </Row></div>
        )
        }


      default:
    }
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
    const {current}=this.state;
    return (
      <div>
            <Form>
            <Steps current={current}>
              {steps.map(item => <Step key={item.title} title={item.title} />)}
            </Steps>
            <div className="steps-content">{this.handleChoice(current)}</div>
            <div className="steps-action" style={{ marginTop: '24px'}}>
               {
                 this.state.current < steps.length - 1
                 &&
                 <Button type="primary" onClick={() => this.next()}>下一步</Button>
               }
               {
                 this.state.current === steps.length - 1
                 &&
                 <Button type="primary" onClick={() => message.success('Processing complete!')}>Done</Button>
               }
               {
                 this.state.current > 0
                 &&
                 <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>上一步</Button>
           }
         </div>
        </Form>
      </div>
    );
  }
}
const DataSourceForm= Form.create()(DataSourceInfoModal);
class DataSourceNewMs extends Component{
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
       <Modal visible={visible} onOk={this.handleOk} onCancel={this.handleCancel} width={550}
              title="编辑" confirmLoading={confirmLoading} okText="保存">
        <DataSourceForm ref={(ref) => this.form = ref}  record={this.state.record} action={this.state.action} />
       </Modal>
      </div>
    );
  }
}
export default DataSourceNewMs;
