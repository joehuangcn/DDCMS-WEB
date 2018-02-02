import React,{Component} from "react";
import { Form, Input,Modal,Select,Row,Col,Radio,DatePicker} from 'antd';
import { ajaxUtil} from '../../../util/AjaxUtils';
import UploadFile from '../../../component/uploadFile/UploadFile';
import uuid from 'node-uuid';
import Moment from 'moment';
const FormItem = Form.Item;
const Option=Select.Option;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

  const auditReasonList=[
      {dicCode:'1',dicName:'营业' },
      {dicCode:'2',dicName:'账务' },
      {dicCode:'3',dicName:'计费' },
      {dicCode:'4',dicName:'电渠' },
      {dicCode:'5',dicName:'开通' },
      {dicCode:'6',dicName:'集客' },
      {dicCode:'7',dicName:'报表' },
      {dicCode:'8',dicName:'经分' },
      {dicCode:'9',dicName:'客服' },
      {dicCode:'10',dicName:'Cboss'},
      {dicCode:'11',dicName:'其他'},
    ]
class SftpFormModal extends Component {

  constructor(props){
    super(props);
    this.state={
      fileList:[]
    }
  }

  handleRenderTab=(type,formItemLayout,label,name,required,initValue,SourceList,rows,info) =>{
    const {getFieldDecorator} = this.props.form;
    let renderSome;
    switch (type) {
      case 'input':
              renderSome=<Input placeholder="请输入" />
        break;
        case 'select':
              renderSome= <Select  placeholder="请选择" >
                              {SourceList.map(d=> <Option key={d.dicCode} value={d.dicCode}>{d.dicName}</Option>)}
                          </Select>
          break;
          case 'textarea':
              renderSome= <TextArea placeholder={info}  rows={rows}/>; break;
          case 'radio':
                renderSome=<RadioGroup>
                          {SourceList.map(d=> <Radio key={d.key} value={d.key}>{d.value}</Radio>)}
                    </RadioGroup>;break;
          case 'date':
                renderSome= <DatePicker  placeholder="请选择" style={{width:150}}/>; break;
          case 'none':
                renderSome= <Input style={{display:'none'}} disabled={true}/>; break;
      default:break;
    }
    return (
      <FormItem {...formItemLayout } label={label}>
       {getFieldDecorator(name,{
         rules:[{ required:required, message:label+'不能为空',}],
         initialValue:(type==="date"?(initValue?Moment(initValue):Moment()):(initValue===undefined?"":initValue))
       })(renderSome)}
     </FormItem>

   );
  }

  // normFile = (e,mes) => {
  //   const {fileList} =this.state;
  //   let files=fileList;
  //   if (mes==="done") {
  //     files.push(e);
  //   }else if (mes==="removed") {
  //     files=files.filter((files)=>{
  //       return files.bid!==e.bid;
  //     })
  //   }
  //   this.setState({fileList:files});
  //   this.props.form.setFieldsValue({'upload':files});
  // }

  normFile = (e) => {
  // console.log('Upload event:', e);
  //  if (Array.isArray(e)) {
  //    return e;
  //  }
  //  return e && e.fileList;

     const {fileList} =this.state;
     let files=fileList;
     if (e.status==="done") {
       files.push(e.response);
     }else if (e.status==="removed") {
       files=files.filter((file)=>{
         return file.bid!==e.response.bid;
       })
     }
     this.setState({fileList:files});
     return fileList;
   //   this.setState({fileList:files});
   //   this.props.form.setFieldsValue({'upload':files});
  }

  render () {
    const { getFieldDecorator} = this.props.form;
    const record = this.props.record;
    const action = this.props.action;
    const file1="batchfile";
    const url="audit-rule!uploadFile.action";
    const deleteUrl="audit-rule!deletedFile.action";
    const actions= {
      action :'DDCMS/'+url,
      muliple:true
    }
    return(
      <div>
      <Form>
      <Row gutter={4}>
      <Col span={12}>
        {this.handleRenderTab("input",formItemLayout,"标题","sftpfile.headline",true,record.headline,[],0,'')}
       </Col>
       <Col span={12}>
         {this.handleRenderTab("select",formItemLayout,"所属系统","sftpfile.sys",true,record.sys,auditReasonList,0,'')}
      </Col>
      </Row>
      <Row gutter={6}>
        <Col span ={12}>
          {this.handleRenderTab("input",formItemLayout,"局方负责人","sftpfile.jufang",true,record.jufang,[],0,'')}
        </Col>
        <Col span ={12}>
          {this.handleRenderTab("input",formItemLayout,"厂家负责人","sftpfile.changjia",true,record.changjia,[],0,'')}
        </Col>
      </Row>
      <Row gutter={6}>
        <Col span ={12}>
          {this.handleRenderTab("input",formItemLayout,"需求管理系统单号","sftpfile.listnumber",true,record.listnumber,[],0,'')}
        </Col>
        <Col span ={12}>
          {this.handleRenderTab("input",formItemLayout,"数据量","sftpfile.datasize",true,record.datasize,[],0,'')}
        </Col>
      </Row>
      <Row>
        {this.handleRenderTab("textarea",formItemLayout,"内容描述","sftpfile.comments",false,record.comments,[],2,'')}
      </Row>
      <Row>
        <FormItem {...formItemLayout} label="选择文件">
         {getFieldDecorator('upload', {
           valuePropName: 'fileList',
           initialValue:[],
          getValueFromEvent: this.normFile,
           })(
           <UploadFile name={file1} requestUrl={url} deleteUrl={deleteUrl}  muliple={true}/>

         )}
       </FormItem>
      </Row>
      </Form>
      </div>
     )
  };
}
const SftpForm= Form.create()(SftpFormModal);

class SftpFileNew extends Component {
  constructor(props){
    super(props);
    this.state = {
    visible:false,
    };
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
  handleOk = (e) => {
      const form= this.form;
      form.validateFields(( err, values) => {
        if (err) {
          return;
        }
        this.setState({
          confirmLoading:true,
        });
        let filename="";
        let filenameMd5="";
        const {action}=this.state;
        let id=(this.state.record.num==undefined?'':this.state.record.num);
        let text="sftpfile.headline="+values.sftpfile.headline
        +"&sftpfile.sys="+values.sftpfile.sys
        +"&sftpfile.jufang="+values.sftpfile.jufang
        +"&sftpfile.changjia="+values.sftpfile.changjia
        +"&sftpfile.listnumber="+values.sftpfile.listnumber
        +"&sftpfile.datasize="+values.sftpfile.datasize
        +"&sftpfile.comments="+values.sftpfile.comments
        +"&uploadtime="+Moment().format('YYYY-MM-DD')
        +"&flag="+action;
        for (var i = 0; i < values.upload.length; i++) {
          filename+=values.upload[i].name;
          filenameMd5+=values.upload[i].bid;
          if (i<values.upload.length-1) {
            filename+=",";
            filenameMd5+=",";
          }
        }
        text+="&filename="+filename+"&filenameMd5="+filenameMd5;
        ajaxUtil("urlencoded","sftpfile!filenumberNew.action",text,this,(data,that) => {
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
            this.props.refresh();
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
    const { visible, confirmLoading,record,action }= this.state;
    return(
      <div>
       <Modal key={uuid.v1()} visible={visible} onOk={this.handleOk} onCancel={this.handleCancel}
              title="编辑" confirmLoading={confirmLoading}  afterClose={this.afterClose} width={700}
        >
          <SftpForm ref={(ref) => this.form = ref}  record={record} action={action}/>
       </Modal>
      </div>
    );
  }
}

export default SftpFileNew;
