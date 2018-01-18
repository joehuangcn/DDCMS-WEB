import React,{Component} from 'react'
import { Form, Input,Modal,Select,Row,Col,Radio} from 'antd';
import { ajaxUtil} from '../../../util/AjaxUtils';
import uuid from 'node-uuid';
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

  handleAuditType=(value) =>{
    const text="bizCode="+this.props.bizCode+"&auditType="+value+"&dataScope="+(this.props.form.getFieldValue('diffMethod.dataScope')===undefined?"":this.props.form.getFieldValue('diffMethod.dataScope'));
    ajaxUtil("urlencoded","business!findRelatNet.action",text,this,(data,that)=>{
      this.setState({netList:data.data});
    });
  }
  handleDataScop=(value) =>{
    const text="bizCode="+this.props.bizCode+"&dataScope="+value+"&auditType="+(this.props.form.getFieldValue('diffMethod.auditType')===undefined?'':this.props.form.getFieldValue('diffMethod.auditType'));
    ajaxUtil("urlencoded","business!findRelatNet.action",text,this,(data,that)=>{
      this.setState({netList:data.data});
    });
  }


  handleRenderTab=(type,formItemLayout,label,name,required,initValue,SourceList,rows,info) =>{
    const {getFieldDecorator} = this.props.form;
    let renderSome;
    switch (type) {
      case 'input':
              renderSome=<Input placeholder="请输入"  style={{width:100}}/>
        break;
        case 'select':
              renderSome= <Select  placeholder="请选择" >
                              {SourceList.map(d=> <Option key={d.dicCode} value={d.dicCode}>{d.dicName}</Option>)}
                          </Select>
          break;
          case 'textarea':
              renderSome= <Input placeholder={info} type="textarea"  rows={rows}/>;
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

  render() {
    const {getFieldDecorator} = this.props.form;
    const {netList}=this.state;
    const {record,action,bizList,deptList,auditTypeList,auditScopeList,taskTypeList,dataTypeList,diffTypeList,companyList} =this.props;
    const ddd=this.handleRenderTab("input",formItemLayout,"差异代码","diffMethod.diffCode",true,record.diffCode,[],0,'');
    const inputFormItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 6 },
    };
    return (
      <div>
            <Form>
            <Row gutter={12}>
            <Col span={12}>
              {this.handleRenderTab("input",formItemLayout,"差异代码","diffMethod.diffCode",true,record.diffCode,[],0,'')}
             </Col>
             <Col span={12}>
               {this.handleRenderTab("input",formItemLayout,"差异名称","diffMethod.diffName",true,record.diffName,[],0,'')}
            </Col>
            </Row>
            <Row gutter={24}>
            <Col span ={12}>
                <FormItem {...formItemLayout } label="稽核范围">
                 {getFieldDecorator('diffMethod.dataScope',{
                   rules:[{ required:true, message:'稽核范围不能为空',}],
                   initialValue:record.dataScope===undefined?"":record.dataScope
                 })(
                   <Select  placeholder="请选择" style={{ width: 180 }} onChange={this.handleDataScop}>
                     {auditScopeList.map(d=> <Option key={d.dicCode} value={d.dicCode}>{d.dicName}</Option>)}
                   </Select>
                )}
                </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout } label="稽核类型">
               {getFieldDecorator('diffMethod.auditType',{
                 rules:[{ required:true, message:'稽核类型不能为空',}],
                 initialValue:record.auditType===undefined?"":record.auditType
               })
               (
                 <Select  placeholder="请选择" style={{ width: 200 }} onChange={this.handleAuditType} >
                   {auditTypeList.map(d=> <Option key={d.dicCode} value={d.dicCode}>{d.dicName}</Option>)}
                 </Select>
              )}
             </FormItem>
             </Col>
            </Row>
            <Row gutter={4}>
            <Col span={8}>
            {this.handleRenderTab("input",inputFormItemLayout,"失效天数","diffMethod.diffOverDue",false,record.diffOverDue,[],0,'')}
             </Col>
             <Col span={8}>
              {this.handleRenderTab("input",inputFormItemLayout,"同步阀值","diffMethod.synThreshold",false,record.synThreshold,[],0,'')}
            </Col>
            <Col span={8}>
            {this.handleRenderTab("select",formItemLayout,"差异类型","diffMethod.diffType",true,record.diffType,diffTypeList,0,'')}
             </Col>
            </Row>
            <Row gutter={24}>
            <Col span ={12}>
              {this.handleRenderTab("select",formItemLayout,"数据类型","diffMethod.dataType",true,record.dataType,dataTypeList,0,'')}
            </Col>
            <Col span={12}>
              {this.handleRenderTab("select",formItemLayout,"牵头处理单位","diffMethod.handle_company",true,record.handle_company,companyList,0,'')}
             </Col>
            </Row>
            <Row gutter={24}>
            <Col span ={12}>
              {this.handleRenderTab("select",formItemLayout,"是否需要审核","diffMethod.needAudit",true,record.needAudit,needAuditList,0,'')}
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout }  key='flatChoice' label="同步平台">
               {getFieldDecorator('diffMethod.netEleCode',{
                 rules:[{ required:true, message:'同步平台不能为空',}],
                 initialValue:record.netelecode===undefined?[]:record.netelecode.split(',')
               })
               (
                 <Select mode="multiple"  placeholder="请选择" style={{ width: 200 }} onChange={this.city} >
                    {netList.map(d=> <Option key={d.netEleCode} value={d.netEleCode}>{d.netEleName}</Option>)}
                 </Select>
              )}
             </FormItem>
             </Col>
            </Row>
            <Row gutter={24}>
            <Col span ={12}>
              {this.handleRenderTab("select",formItemLayout,"同步文件改名","diffMethod.needRename",true,record.needRename,needAuditList,0,'')}
            </Col>
            <Col span={12}>
              {this.handleRenderTab("select",formItemLayout,"操作类型","diffMethod.operType",true,record.operType,operTypeList,0,'')}
             </Col>
            </Row>
            <Row>
              {this.handleRenderTab("textarea",formItemLayout,"差异算法","diffMethod.diffMethods",true,record.diffMethods,[],3,
              '提示:差异算法为一致量稽核时，差异代码固定填写YZL00')}
            </Row>
            <Row>
              {this.handleRenderTab("textarea",formItemLayout,"差异字段名称","diffMethod.columnChinese",false,record.columnChinese,[],2,
              '每个字段注释以逗号分隔,最后一个字段不需要逗号')}
            </Row>
            <Row>
              {this.handleRenderTab("textarea",formItemLayout,"同步前影响","diffMethod.beforeSyn",false,record.beforeSyn,[],2,'')}
            </Row>
            <Row>
              {this.handleRenderTab("textarea",formItemLayout,"差异处理意见","diffMethod.diffDeal",false,record.diffDeal,[],2,'')}
            </Row>
            <Row>
              {this.handleRenderTab("textarea",formItemLayout,"客服解释口径","diffMethod.csExplan",false,record.csExplan,[],2,'')}
            </Row>
            <Row>
              {this.handleRenderTab("textarea",formItemLayout,"差异解决方法","diffMethod.diff_handle_method",false,record.diff_handle_method,[],3,'')}
            </Row>
            <Row>
              {this.handleRenderTab("textarea",formItemLayout,"用户是否感知","diffMethod.is_user_known",false,record.is_user_known,[],2,'')}
            </Row>
            </Form>
      </div>
    );
  }
}
const DiffForm= Form.create()(DiffInfoModal);

class DiffNewMs extends Component{
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
      let bid=this.state.record.diffId?this.state.record.diffId:'';
      const text="diffMethod.bizCode="+this.props.bizCode
      +"&diffMethod.diffCode="+values.diffMethod.diffCode
      +"&diffMethod.diffName="+values.diffMethod.diffName
      +"&diffMethod.auditType="+values.diffMethod.auditType
      +"&diffMethod.dataScope="+values.diffMethod.dataScope
      +"&diffMethod.diffOverDue="+values.diffMethod.diffOverDue
      +"&diffMethod.synThreshold="+values.diffMethod.synThreshold
      +"&diffMethod.diffType="+values.diffMethod.diffType
      +"&diffMethod.dataType="+values.diffMethod.dataType
      +"&diffMethod.handle_company="+values.diffMethod.handle_company
      +"&diffMethod.needAudit="+values.diffMethod.needAudit
      +"&diffMethod.netelecode="+values.diffMethod.netelecode
      +"&diffMethod.needRename="+values.diffMethod.needRename
      +"&diffMethod.operType="+values.diffMethod.operType
      +"&diffMethod.diffMethods="+values.diffMethod.diffMethods
      +"&diffMethod.columnChinese="+values.diffMethod.columnChinese
      +"&diffMethod.beforeSyn="+values.diffMethod.beforeSyn
      +"&diffMethod.diffDeal="+values.diffMethod.diffDeal
      +"&diffMethod.csExplan="+values.diffMethod.csExplan
      +"&diffMethod.diff_handle_method="+values.diffMethod.diff_handle_method
      +"&diffMethod.is_user_known="+values.diffMethod.is_user_known
      +"&diffMethod.diffId="+bid
      +"&act="+this.state.action;
      ajaxUtil("urlencoded","business!saveDiff.action",text,this,(data,that) => {
        let status=data.success;
        let message= data.message;
        this.setState({
          visible: false,
          confirmLoading: false,
        });
        // this.form.resetFields();
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
    const {auditTypeList,auditScopeList,dataTypeList,netList,bizCode,diffTypeList,companyList}=this.props;
    return(
      <div>
       <Modal key={uuid.v1()} visible={visible} onOk={this.handleOk} onCancel={this.handleCancel} width={700}
              title="编辑" confirmLoading={confirmLoading} okText="保存">
          <DiffForm ref={(ref) => this.form = ref} bizCode={bizCode} record={this.state.record} action={this.state.action}
            auditTypeList={auditTypeList} auditScopeList={auditScopeList}  dataTypeList={dataTypeList} netList={netList}
            diffTypeList={diffTypeList} companyList={companyList}
            />
       </Modal>
      </div>
    );
  }
}
export default DiffNewMs;
