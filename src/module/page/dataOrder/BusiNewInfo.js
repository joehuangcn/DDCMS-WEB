import React,{Component} from 'react'
import { Form, Input,Modal ,Select,Row,Col,Radio,Divider} from 'antd';
import { ajaxUtil} from '../../../util/AjaxUtils';
const FormItem = Form.Item;
const {Option} = Select;


const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};
const needAuditList = [
  {dicCode:'N',dicName:'不需要'},
  {dicCode:'Y',dicName:'需要'},
];
const operTypeList = [
  {dicCode:'A',dicName:'新增'},
  {dicCode:'D',dicName:'删除'},
  {dicCode:'U',dicName:'更新'},
  {dicCode:'W',dicName:'全量'}
];
class  DiffInfoModal extends Component {
  constructor(props) {
    super(props);
    this.state={
      netList:props.netList
    }
  }
  componentWillReceiveProps(nextProps){
    const {netList}=nextProps;
    this.setState({netList});
  }

  handleDataScop=(value) =>{
    this.props.form.setFieldsValue({'netelecode':''});
    const text="bizCode="+this.props.bizCode+"&dataScope="+value;
    ajaxUtil("urlencoded","netelement!getBusiNetelem.action",text,this,(data,that)=>{
      this.setState({netList:data.data});
    });
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
              renderSome= <Input placeholder={info} type="textarea"  rows={rows}/>;
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

  handleRenderMutiSelect=(formItemLayout,label,name,required,initValue,SourceList)=>{
    const {getFieldDecorator} = this.props.form;
    return (
      <FormItem {...formItemLayout } label={label}>
       {getFieldDecorator(name,{
          rules:[{ required:required, message:label+'不能为空',}],
         initialValue:initValue?initValue.split(','):[]
       })
       (
         <Select mode="multiple"  placeholder="请选择" style={{ width: 120 }} >
            {SourceList.map(d=> <Option key={d.fieldCode} value={d.fieldCode}>{d.fieldName}</Option>)}
         </Select>
      )}
     </FormItem>
   );
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const {netList}=this.state;
    const {record,action,bizList,deptList,auditTypeList,auditScopeList,taskTypeList,dataTypeList,diffTypeList,companyList,busNetList} =this.props;
    const inputFormItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    const mutiItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 5 },
    };
    return (
      <div>
            <Form>
             <Divider>预处理规则配置</Divider>
            <Row gutter={12}>
            <Col span={12}>
              {this.handleRenderTab("input",formItemLayout,"规则名称","name",true,record.name,[],0,'')}
             </Col>
             <Col span={12}>
             <FormItem {...formItemLayout } label="稽核范围">
              {getFieldDecorator('dataScope',{
                rules:[{ required:true, message:'稽核范围不能为空',}],
                initialValue:record.dataScope===undefined?"":record.dataScope
              })(
                <Select  placeholder="请选择" style={{ width: 180 }} onChange={this.handleDataScop}>
                  {auditScopeList.map(d=> <Option key={d.dicCode} value={d.dicCode}>{d.dicName}</Option>)}
                </Select>
             )}
             </FormItem>
            </Col>
            </Row>
            <Row gutter={24}>
            <Col span={12}>
              <FormItem {...formItemLayout } label="网元类型">
               {getFieldDecorator('netelecode',{
                 rules:[{ required:true, message:'网元类型不能为空',}],
                 initialValue:record.netCode===undefined?"":record.netCode
               })
               (
                 <Select  placeholder="请选择" style={{ width: 200 }} allowClear={true} >
                   {netList.map(d=> <Option key={d.netelecode} value={d.netelecode}>{d.netelename}</Option>)}
                 </Select>
              )}
             </FormItem>
             </Col>
            </Row>
             <Divider>文件级校验</Divider>
            <Row gutter={4}>
            <Col span={12}>
            {this.handleRenderTab("input",inputFormItemLayout,"文件名格式","fileNameStandard",true,record.fileNameStandard,[],0,'')}
             </Col>
             <Col span={12}>
              {this.handleRenderTab("input",inputFormItemLayout,"转码命令","transcoding",false,record.transcoding,[],0,'')}
            </Col>
            </Row>
             <Divider>记录级校验</Divider>
            <Row gutter={2}>
            <Col span ={8}>
              {this.handleRenderMutiSelect(mutiItemLayout,"记录完整性","recordFull",false,record.recordFull,busNetList)}
            </Col>
            <Col span ={8}>
              {this.handleRenderMutiSelect(mutiItemLayout,"不为空规则","noNullColumns",false,record.noNullColumns,busNetList)}
            </Col>
            <Col span ={8}>
              {this.handleRenderMutiSelect(mutiItemLayout,"不含空格规则","noSpaceColumns",false,record.noSpaceColumns,busNetList)}
            </Col>
            </Row>
            <Row gutter={2}>
            <Col span ={8}>
              {this.handleRenderMutiSelect(mutiItemLayout,"主键唯一性","recordUnique",false,record.recordUnique,busNetList)}
                </Col>
                <Col span ={8}>
              {this.handleRenderMutiSelect(mutiItemLayout,"数据类型检查","dataType",false,record.dataType,busNetList)}
                </Col>
                <Col span ={8}>
              {this.handleRenderMutiSelect(mutiItemLayout,"数据值域检查","dataRang",false,record.dataRang,busNetList)}
            </Col>
            </Row>
            <Divider>源数据检查</Divider>
            <Row gutter={24}>
            <Col span ={12}>
            <FormItem {...formItemLayout } label="数据总量校验">
             {getFieldDecorator('checkCount',{
               rules:[{ required:false, message:'数据总量校验',}],
               initialValue:record.checkCount===undefined?"":record.checkCount
             })(
               <Input placeholder="如10%"/>
            )}
            </FormItem>
            </Col>
            </Row>

            <Divider>数据整理规则</Divider>
            <Row gutter={4}>
            <Col span ={12}>
              {this.handleRenderTab("input",formItemLayout,"去缀名规则","removeRegulars",true,record.removeRegulars,[],0,'')}
                </Col>
              <Col span ={12}>
              {this.handleRenderMutiSelect(mutiItemLayout,"去重规则","removeColumns",false,record.removeColumns,busNetList)}
                </Col>
            </Row>
            </Form>
      </div>
    );
  }
}
const DiffForm= Form.create()(DiffInfoModal);

class BusiNewInfo extends Component{
  constructor(props){
    super(props);
    this.state={
        visible:false,
        netList:props.netList,
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
    const text="bizCode="+this.props.bizCode+"&dataScope="+record.dataScope;
    // ajaxUtil("urlencoded","netelement!getBusiNetelem.action",text,this,(data,that)=>{
    //   this.setState({
    //     netList:data.data,
    //     visible:true,
    //     record:record,
    //     action:action
    //   });
    // });
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
      const text="bizcode="+this.props.bizCode
      +"&name="+values.name
      +"&dataScope="+values.dataScope
      +"&netelecode="+values.netelecode
      +"&fileNameStandard="+values.fileNameStandard
      +"&transcoding="+values.transcoding
      +"&recordFull="+values.recordFull
      +"&noNullColumns="+values.noNullColumns
      +"&noSpaceColumns="+values.noSpaceColumns
      +"&recordUnique="+values.recordUnique
      +"&dataType="+values.dataType
      +"&dataRang="+values.dataRang
      +"&checkCount="+values.checkCount
      +"&removeRegulars="+values.removeRegulars
      +"&removeColumns="+values.removeColumns
      +"&id="+bid
      +"&act="+this.state.action;
      ajaxUtil("urlencoded","file-format-manager!save.action",text,this,(data,that) => {
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
    const {auditScopeList,bizCode,busNetList}=this.props;
    return(
      <div className="modal test">
       <Modal  visible={visible} onOk={this.handleOk} onCancel={this.handleCancel}
              title="编辑" confirmLoading={confirmLoading} okText="保存" cancelText='取消' width={750}>
              <DiffForm ref={(ref) => this.form = ref} bizCode={bizCode} record={this.state.record} action={this.state.action}
               auditScopeList={auditScopeList}   netList={this.state.netList}
                    busNetList={busNetList}
                />
       </Modal>
      </div>
    );
  }
}
export default BusiNewInfo;
