import React,{Component} from 'react'
import { Form, Input, Button,Modal,Upload ,Icon,Select,Row,Col,InputNumber,Radio,Switch,Steps, message,TreeSelect} from 'antd';
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
      tempWay:'',
      configList:props.configList,
      conditonList:props.conditonList,
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
        case 'tree':
                renderSome= <TreeSelect  placeholder='请选择' allowClear
                                treeData={SourceList} />

          break;
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


  handleSelectRenderTab=(type,formItemLayout,label,name,required,initValue,SourceList,rows,info,key,value) =>{
    const {getFieldDecorator} = this.props.form;
    let renderSome;
    switch (type) {
      case 'input':
              renderSome=<Input placeholder="请输入"/>
        break;
        case 'select':
              renderSome= <Select  placeholder="请选择">
                              {SourceList.map(d=> <Option key={eval('d.'+key)} value={eval('d.'+key)}>{eval('d.'+value)}</Option>)}
                          </Select>
          break;
          case 'upselect':
                renderSome= <Select  placeholder="请选择" onChange={this.onSelectChange}>
                                {SourceList.map(d=> <Option key={eval('d.'+key)} value={eval('d.'+key)}>{eval('d.'+value)}</Option>)}
                            </Select>
            break;
          case 'textarea':
              renderSome= <TextArea placeholder={info} rows={rows}/>; break;
        case 'tree':
                renderSome= <TreeSelect  placeholder='请选择' allowClear
                                treeData={SourceList} />

          break;
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
    ajaxUtil("urlencoded","data-source-config!getDataSourceConfig.action","flag="+value,this,(data,that) => {
        // console.log(data);
        this.setState({configList:data.data});
    });
    ajaxUtil("urlencoded","data-gather-conditions!getDataSourceConfigList.action","flag="+value,this,(data,that) => {
        // console.log(data);
        this.setState({conditonList:data.data});
    });
  }

  onSelectChange=(value) =>{
    console.log(value);
    const {configList,choiceWay}=this.state;
    console.log(configList);
    let some={};
    for (var i = 0; i < configList.length; i++) {
      if (configList[i].id===value) {
        some=configList[i];
        break;
      }
    }
    if (choiceWay==='L') { // 远程导入
      this.props.form.setFieldsValue({'dway':some.dway});
      this.props.form.setFieldsValue({'lhost':some.lhost});
      this.props.form.setFieldsValue({'lport':some.lport});
      this.props.form.setFieldsValue({'lusername':some.lusername});
      this.props.form.setFieldsValue({'lpassword':some.lpassword});
      this.props.form.setFieldsValue({'localway':some.localway});
    }else if(choiceWay==='D'){ // 数据库
    this.props.form.setFieldsValue({'dataType':some.dataType});
    this.props.form.setFieldsValue({'dbname':some.dbname});
    this.props.form.setFieldsValue({'dhost':some.dhost});
    this.props.form.setFieldsValue({'dport':some.dport});
    this.props.form.setFieldsValue({'dusername':some.dusername});
    this.props.form.setFieldsValue({'dpassword':some.dpassword});
  }else if(choiceWay==='F'){ // 文件上传
      this.props.form.setFieldsValue({'filepath':some.filePath});
    }

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
    const {choiceWay ,configList, conditonList}=this.state;
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
        <Row>
        <Col>
        {this.handleSelectRenderTab("upselect",inputFormItemLayout,"数据源列表","dsid",true,record.dsid,configList,0,'','id','dscname')}
       </Col>
       </Row>
      <div className="fileChoice" style={{display: choiceWay==='F'? 'block' : 'none'}}>
         <Row>
         <Col>
         {this.handleRenderTab("input",inputFormItemLayout,"文件夹路径","filepath",choiceWay==='F'?true:false,record.filepath,[],0,'')}
        </Col>
        </Row>
       </div>
       <div className="dbChoice" style={{display: choiceWay==='D'? 'block' : 'none'}}>
       <Row>
       <Col span={12}>
       {this.handleRenderTab("select",inputFormItemLayout,"数据库类型","dataType",choiceWay==='D'?true:false,record.dataType,DbList,0,'')}
       </Col>
       <Col span={12}>
       {this.handleRenderTab("input",inputFormItemLayout,"数据库实例","dbname",choiceWay==='D'?true:false,record.dbname,[],0,'')}
       </Col>
       </Row>
       <Row>
       <Col span={12}>
       {this.handleRenderTab("input",inputFormItemLayout,"主机或IP","dhost",choiceWay==='D'?true:false,record.dhost,[],0,'')}
       </Col>
       <Col span={12}>
       {this.handleRenderTab("input",inputFormItemLayout,"端口号","dport",choiceWay==='D'?true:false,record.dport,[],0,'')}
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
       <Col span={12}>
           {this.handleRenderTab("select",inputFormItemLayout,"协议类型","dway",choiceWay==='L'?true:false,record.dway,FtpList,0,'')}
       </Col>
       <Col span={12}>
           {this.handleRenderTab("input",inputFormItemLayout,"主机名或IP","lhost",choiceWay==='L'?true:false,record.lhost,[],0,'')}
       </Col>
       </Row>
       <Row>
        <Col span={12}>
           {this.handleRenderTab("input",inputFormItemLayout,"端口号","lport",choiceWay==='L'?true:false,record.lport,[],0,'')}
        </Col>
        <Col span={12}>
           {this.handleRenderTab("input",inputFormItemLayout,"用户名","lusername",choiceWay==='L'?true:false,record.lusername,[],0,'')}
        </Col>
       </Row>
       <Row>
        <Col span={12}>
           {this.handleRenderTab("input",inputFormItemLayout,"密码","lpassword",choiceWay==='L'?true:false,record.lpassword,[],0,'')}
        </Col>
        <Col span={12}>
           {this.handleRenderTab("input",inputFormItemLayout,"远程路径","localway",choiceWay==='L'?true:false,record.localway,[],0,'')}
        </Col>
       </Row>
      </div>
      </div>
    )
  }

  getFilesRest=() =>{
    const {choiceWay ,configList, conditonList}=this.state;
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
      <div className="fileChoiceRe" style={{display: choiceWay==='F'? 'block' : 'none'}}>
        <Row>
        <Col>
        {this.handleRenderTab("textarea",inputFormItemLayout,"采集条件","fGatherConditions",false,record.fGatherConditions,[],2,'')}
       </Col>
       </Row>
       </div>
       <div className="dbChoiceRe" style={{display: choiceWay==='D'? 'block' : 'none'}}>
       <Row>
       <Col >
       {this.handleRenderTab("textarea",inputFormItemLayout,"采集条件","dGatherConditions",false,record.dGatherConditions,[],2,'')}
       </Col>
       </Row>
       <Row>
       <Col >
       {this.handleRenderTab("input",inputFormItemLayout,"数据集本地保存路径","dlocalPath",false,record.dlocalPath,[],0,'')}
       </Col>
       <Row>
       <Col >
       {this.handleRenderTab("textarea",inputFormItemLayout,"数据集导入本地数据库","dinsertConditions",false,record.dinsertConditions,[],2,'')}
       </Col>
       </Row>
        <Button type="primary" onClick={() => this.next()}>连接测试</Button>
       </Row>
       </div>
       <div className="ftpChoice" style={{display: choiceWay==='L'? 'block' : 'none'}}>
         <Row>
          {this.handleRenderTab("input",inputFormItemLayout,"本地路径","localWay",false,record.localway,[],0,'')}
         </Row>
         <Row>
         <Col>
         {this.handleRenderTab("textarea",inputFormItemLayout,"采集条件","lGatherConditions",false,record.lGatherConditions,[],2,'')}
         </Col>
         </Row>
          <Button type="primary" onClick={() => this.next()}>连接测试</Button>
         </div>
      </div>
    )
  }
  render() {
    const {getFieldDecorator} = this.props.form;
    const {record,action,bizList,netList} =this.props;
    const inputFormItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span:16},
    };
    const textFormItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 10 },
    };
    const {current,conditonList}=this.state;
    return (
      <div>
        <Form>
        <Row>
          <Col span={12}>
          {this.handleRenderTab("input",inputFormItemLayout,"规则名称","ruleName",true,record.ruleName,[],0,'')}
         </Col>
         <Col span={12}>
         {this.handleRenderTab("tree",inputFormItemLayout,"选择业务","bizCode",true,record.bizCode,bizList,0,'')}
        </Col>
         </Row>
         <Row>
         <Col span={12}>
         {this.handleSelectRenderTab("select",inputFormItemLayout,"网元类型","netEleCode",true,record.netEleCode,netList,0,'','netEleCode','netEleName')}
        </Col>
        <Col span={12}>
        {this.handleRenderTab("input",inputFormItemLayout,"数据源名称","dscname",true,record.dscname,[],0,'')}
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
        <Row>
        <Col>
        {this.handleRenderTab("input",inputFormItemLayout,"采集条件名","name",true,record.name,[],0,'')}
       </Col>
       </Row>
       <Row>
       <Col>
       {this.handleSelectRenderTab("select",inputFormItemLayout,"采集条件列表","dgid",true,record.dgid,conditonList,0,'','id','name')}
      </Col>
      </Row>
        {this.getFilesRest()}
        </Form>
      </div>
    );
  }
}
const DataSourceForm= Form.create()(DataGatherInfoModal);
class DataGatherRuleNew extends Component{
  constructor(props){
    super(props);
    this.state={
        visible:false,
        bizList:[],
        netList:[],
        configList:[],
        conditonList:[],
    }
  }

  componentWillMount(){
        this.getBusTree();
    }
  getBusTree=() =>{
        ajaxUtil("urlencoded","business!getBusAfterNew.action","",this,(data,that)=>{
            this.setState({bizList:data});
        });
        ajaxUtil("urlencoded","netelement!getJsonList.action","",this,(data,that)=>{
            this.setState({netList:data.data});
        });
        ajaxUtil("urlencoded","data-source-config!getDataSourceConfig.action","",this,(data,that) => {
            // console.log(data);
            this.setState({configList:data.data});
        });
        ajaxUtil("urlencoded","data-gather-conditions!getDataSourceConfigList.action","",this,(data,that) => {
            // console.log(data);
            this.setState({conditonList:data.data});
        });
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
      let commonHead="ruleName="+values.ruleName+"&bizCode="+values.bizCode+"&netEleCode="+values.netEleCode
            +"&dscname="+values.dscname+"&gatherway="+values.gatherway+"&name="+values.name+"&dgid="+values.dgid
            +"&dsid="+values.dsid;
      let file="&filepath="+values.filepath;
      let db="&dataType="+values.dataType+"&dbname="+values.dbname+"&dhost="+values.dhost+"&dpassword="+values.dpassword
                +"&dport="+values.dport+"&dusername="+values.dusername;

      let ftp="&dway="+values.dway+"&lhost="+values.lhost+"&localway="+values.localway
              +"&lpassword="+values.lpassword+"&lport="+values.lport+"&lusername="+values.lusername;
      let text="";
      // if (values.gatherway==='F') {
      //   text=commonHead+file+dbTemp+ftpTemp;
      // }else if(values.gatherway==='D'){
      //   text=commonHead+fileTemp+db+ftpTemp;
      // }else if(values.gatherway==='L') {
      //     text=commonHead+fileTemp+dbTemp+ftp;
      // }
      text=commonHead+file+db+ftp;
      let id=this.state.record.id===undefined?'':this.state.record.id;
      text=text+"&act="+this.state.action+"&resid="+this.props.resid+"&id="+id;
      ajaxUtil("urlencoded","data-gather-rule!saveDataGatherRule.action",text,this,(data,that) => {
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
    const { visible, confirmLoading, bizList, netList, configList, conditonList}= this.state;
    const {resid}=this.props;
    return(
      <div>
       <Modal key={uuid.v1()} visible={visible} onOk={this.handleOk} onCancel={this.handleCancel} width={700}
              title="编辑" confirmLoading={confirmLoading} okText="保存">
        <DataSourceForm ref={(ref) => this.form = ref}  record={this.state.record} action={this.state.action}
        choiceWay={this.state.choiceWay} resid={resid}   bizList={bizList}  netList={netList}
          configList={configList} conditonList={configList}/>
       </Modal>
      </div>
    );
  }
}
export default DataGatherRuleNew;
