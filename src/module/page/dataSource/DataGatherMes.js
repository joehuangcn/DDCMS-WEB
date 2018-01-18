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
class  DataGatherInfoModal extends Component {
  constructor(props) {
    super(props);
    this.state={
      choiceWay:props.choiceWay,
      tempWay:''
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
    const values=this.props.form.getFieldsValue();
    console.log("json -dataSource",values);
    let text="dataType="+values.dataType+"&dbname="+values.dbname+"&dhost="+values.dhost+"&dpaaword="+values.dpassword
              +"&dport="+values.dport+"&dscname="+values.dscname+"&dusername="+values.dusername+"&dway="+values.dway
              +"&filePath="+values.filePath+"&gatherway="+values.gatherway+"&lhost="+values.lhost+"&localway="+values.localway
              +"&lpassword="+values.lpassword+"&lport="+values.lport+"&lusername="+values.lusername;
    message.info("连接测试中请稍后....");
    ajaxUtil("urlencoded","data-source-config!testDataSourceConfig.action",text,this,(data,that)=>{
      let status=data.success;
      let message= data.message;
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
    })
  }

  getFields=() =>{
    const {choiceWay}=this.state;
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
    return(
      <div>
      <div className="fileChoice" style={{display: choiceWay==='F'? 'block' : 'none'}}>
        <Row>
        <Col>
        {this.handleRenderTab("textarea",inputFormItemLayout,"采集条件","fGatherConditions",choiceWay==='F'?true:false,record.fGatherConditions,[],0,'')}
       </Col>
       </Row>
       </div>
       <div className="dbChoice" style={{display: choiceWay==='D'? 'block' : 'none'}}>
       <Row>
       <Col >
       {this.handleRenderTab("input",inputFormItemLayout,"采集条件","dGatherConditions",choiceWay==='D'?true:false,record.dGatherConditions,[],0,'')}
       </Col>
       </Row>
       <Row>
       <Col span={12}>
       {this.handleRenderTab("input",inputFormItemLayout,"用户名","dusername",choiceWay==='D'?true:false,record.dusername,[],0,'')}
       </Col>
       <Col span={12}>
       {this.handleRenderTab("input",inputFormItemLayout,"密码","dpassword",choiceWay==='D'?true:false,record.dpassword,[],0,'')}
       </Col>
       </Row>
       </div>
       <div className="ftpChoice" style={{display: choiceWay==='L'? 'block' : 'none'}}>
         <Row>
             {this.handleRenderTab("input",inputFormItemLayout,"本地路径","localWay",choiceWay==='L'?true:false,record.localway,[],0,'')}
         </Row>
         <Row>
         <Col>
         {this.handleRenderTab("textarea",inputFormItemLayout,"采集条件","lGatherConditions",choiceWay==='L'?true:false,record.lGatherConditions,[],0,'')}
         </Col>
         </Row>
         </div>
      </div>
    )
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
        <Row>
          <Col>
          {this.handleRenderTab("input",inputFormItemLayout,"采集条件名称","dscname",true,record.dscname,[],0,'')}
         </Col>
         </Row>
         <Row >
         <Col>
               <FormItem {...inputFormItemLayout } label="数据采集方式">
                {getFieldDecorator('gatherway',{
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
        {this.getFields()}
        </Form>
      </div>
    );
  }
}
const DataSourceForm= Form.create()(DataGatherInfoModal);
class DataGatherMes extends Component{
  constructor(props){
    super(props);
    this.state={
        visible:false,
    }
  }
  handleCancel = (e) => {
    this.form.resetFields();
    this.setState({visible:false,choiceWay:''});
  }

  show = () => {
    this.setState({
      visible:true,
      record:[],
      action:'add',
      choiceWay:''
    });
  }
  showModal =(action,record) => {
   this.setState({
     visible:true,
     record:record,
     action:action,
     choiceWay:record.gatherway
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
      let commonHead="dscname="+values.dscname+"&gatherway="+values.gatherway;
      let file="&filePath="+values.filePath; let fileTemp="&filePath=";
      let db="&dataType="+values.dataType+"&dbname="+values.dbname+"&dhost="+values.dhost+"&dpassword="+values.dpassword
                +"&dport="+values.dport+"&dusername="+values.dusername;
      let dbTemp="&dataType=&dbname=&dhost=&dpassword=&dport=&dusername=";
      let ftp="&dway="+values.dway+"&lhost="+values.lhost+"&localway="+values.localway
              +"&lpassword="+values.lpassword+"&lport="+values.lport+"&lusername="+values.lusername;
      let ftpTemp="&dway=&lhost=&localway=&lpassword=&lport=&lusername=";
      let text="";
      if (values.gatherway==='F') {
        text=commonHead+file+dbTemp+ftpTemp;
      }else if(values.gatherway==='D'){
        text=commonHead+fileTemp+db+ftpTemp;
      }else if(values.gatherway==='L') {
          text=commonHead+fileTemp+dbTemp+ftp;
      }
      let id=this.state.record.id===undefined?'':this.state.record.id;
      text=text+"&act="+this.state.action+"&resid="+this.props.resid+"&id="+id;
      ajaxUtil("urlencoded","data-gather-conditions!saveDataGatherConditions.action",text,this,(data,that) => {
        let status=data.success;
        let message= data.message;
        this.setState({
          visible: false,
          confirmLoading: false,
          choiceWay:''
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

  render(){
    const { visible, confirmLoading }= this.state;
    const {resid}=this.props;
    return(
      <div>
       <Modal key={uuid.v1()} visible={visible} onOk={this.handleOk} onCancel={this.handleCancel} width={550}
              title="编辑" confirmLoading={confirmLoading} okText="保存">
        <DataSourceForm ref={(ref) => this.form = ref}  record={this.state.record} action={this.state.action} choiceWay={this.state.choiceWay} resid={resid}/>
       </Modal>
      </div>
    );
  }
}
export default DataGatherMes;
