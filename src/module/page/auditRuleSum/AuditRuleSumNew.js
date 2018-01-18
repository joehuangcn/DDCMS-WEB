import React,{Component} from "react";
import { Form, Input, Button,Modal,Upload ,Icon,Select,Row,Col,InputNumber,Radio,Switch,Tabs,DatePicker} from 'antd';
import { ajaxUtil} from '../../../util/AjaxUtils';
import UploadFile from '../../../component/uploadFile/UploadFile';
import uuid from 'node-uuid';
import Moment from 'moment';
const FormItem = Form.Item;
const Option=Select.Option;
const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
class BizAuditFormModal extends Component {

  constructor(props){
    super(props);
    this.state={
      activeKey:"0",
      panes:[],
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
       })
       (
         renderSome
      )}
     </FormItem>

   );
  }

  handleTabContent=(index) =>{
    return(
      <div>
      <Row gutter={24}>
        <Col span ={12}>
          {this.handleRenderTab("input",formItemLayout,"差异编码","auditRule.differenceCode"+index,false,"",[],0,'')}
        </Col>
        <Col span ={12}>
          {this.handleRenderTab("input",formItemLayout,"差异分类","auditRule.differenceClassify"+index,false,"",[],0,'')}
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span ={12}>
          {this.handleRenderTab("input",formItemLayout,"差异影响","auditRule.differenceEffect"+index,false,"",[],0,'')}
        </Col>
        <Col span ={12}>
          {this.handleRenderTab("input",formItemLayout,"处理方","auditRule.solvePerson"+index,false,"",[],0,'')}
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span ={12}>
          {this.handleRenderTab("date",formItemLayout,"更新时间","auditRule.updateTime"+index,false,"",[],0,'')}
        </Col>
      </Row>
      <Row>
        {this.handleRenderTab("textarea",formItemLayout,"差异处理规则","auditRule.solveRule"+index,false,"",[],2,'')}
      </Row>
      <Row>
        {this.handleRenderTab("textarea",formItemLayout,"备注","auditRule.comments"+index,false,"",[],2,'')}
      </Row>
      </div>
    )
  }

  add=() =>{
    const {panes}=this.state;
    let index=1;
    while (panes.indexOf(index.toString())!==-1){
           index++;
       }
    panes.push(index.toString());
    this.setState({
      activeKey:index.toString(),
        panes:panes
      });
  }
  onChange = (activeKey) => {
   this.setState({ activeKey });
 }
  onEdit = (targetKey, action) => {
    this[action](targetKey);
  }
 remove=(targetKey)=>{
   const {panes,activeKey}=this.state;
   let newActiveKey=activeKey;
   let lastIndex;
   panes.forEach((pane,i)=>{
     if (pane===targetKey) {
       lastIndex=i-1;
     }
   });
   const newPanes=panes.filter(panes=> panes!==targetKey);
   if (lastIndex>=0 && activeKey===targetKey) {
      newActiveKey=panes[lastIndex];
   }
   if (lastIndex<0) {
     newActiveKey="0";
   }
   this.setState({
     activeKey:newActiveKey,
      panes:newPanes
   })
 }

  render () {
    const { getFieldDecorator} = this.props.form;
    const record = this.props.record;
    const action = this.props.action;
    const {auditTypeList}=this.props;
    const {panes}=this.state;
    return(
      <div>
      <Form>
      <Row gutter={12}>
      <Col span={12}>
        {this.handleRenderTab("select",formItemLayout,"业务范围","auditRule.businessType",true,record.businessType,auditTypeList,0,'')}
       </Col>
       <Col span={12}>
         {this.handleRenderTab("input",formItemLayout,"业务编码","auditRule.businessCode",true,record.businessCode,[],0,'')}
      </Col>
      </Row>
      <Row gutter={24}>
      <Col span ={12}>
        {this.handleRenderTab("input",formItemLayout,"业务名称","auditRule.businessName",true,record.businessName,[],0,'')}
      </Col>
      <Col span={12}>
        {this.handleRenderTab("input",formItemLayout,"稽核类型","auditRule.auditType",false,record.auditType,[],0,'')}
       </Col>
      </Row>
      <Row gutter={4}>
      <Col span={12}>
        {this.handleRenderTab("input",formItemLayout,"稽核主键","auditRule.auditKey",false,record.auditKey,[],0,'')}
       </Col>
       <Col style={{ display:'none'}}>
       {this.handleRenderTab("none",formItemLayout,"panes","tabNum",false,this.state.panes.length,[],0,'')}
       {this.handleRenderTab("none",formItemLayout,"nums","tableKeys",false,this.state.panes,[],0,'')}
       </Col>
      </Row>
      <div style={{ display:action==="edit"?'none':'block'}}>
          <Button type="primary" onClick={this.add}>新增差异</Button>
      </div>
      <Tabs  hideAdd onChange={this.onChange} activeKey={this.state.activeKey}  type="editable-card"
          onEdit={this.onEdit} >
          <TabPane tab='差异分类0' key='0' closable={false}>
          <Row gutter={24}>
            <Col span ={12}>
              {this.handleRenderTab("input",formItemLayout,"差异编码","auditRule.differenceCode",false,record.differenceCode,[],0,'')}
            </Col>
            <Col span ={12}>
              {this.handleRenderTab("input",formItemLayout,"差异分类","auditRule.differenceClassify",false,record.differenceClassify,[],0,'')}
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span ={12}>
              {this.handleRenderTab("input",formItemLayout,"差异影响","auditRule.differenceEffect",false,record.differenceEffect,[],0,'')}
            </Col>
            <Col span ={12}>
              {this.handleRenderTab("input",formItemLayout,"处理方","auditRule.solvePerson",false,record.solvePerson,[],0,'')}
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span ={12}>
              {this.handleRenderTab("date",formItemLayout,"更新时间","auditRule.updateTime",false,record.updateTime,[],0,'')}
            </Col>
          </Row>
          <Row>
            {this.handleRenderTab("textarea",formItemLayout,"差异处理规则","auditRule.solveRule",false,record.solveRule,[],2,'')}
          </Row>
          <Row>
            {this.handleRenderTab("textarea",formItemLayout,"备注","auditRule.comments",false,record.comments,[],2,'')}
          </Row>
          </TabPane>
            {panes.map(pane =><TabPane tab={"差异分类"+pane} key={pane}>{this.handleTabContent(pane)}</TabPane>)}
      </Tabs>
      </Form>
      </div>
     )
  };
}
const ComBizForm= Form.create()(BizAuditFormModal);

class AuditRuleSumNew extends Component {
  constructor(props){
    super(props);
    this.state = {
    visible:false,
    auditTypeList:[],
    };
  }
  show = () => {
    this.setState({
      visible:true,
      record:["bussinessName":"","businessCode":"","jufang":"","remarks":""],
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

  componentWillMount(){
    this.getdic();
  }

  getdic=() =>{
    ajaxUtil("urlencoded","dictionaryAction!getDictionaryListByType.action","name=DICT_AuditType",this,(data,that)=>{
        this.setState({auditTypeList:data.data});
    });
  }

  handleOk = (e) => {
      const form= this.form;
      form.validateFields(( err, values) => {
        if (err) {
          return;
        }
        let tableKeys=values.tableKeys;
        let mes="";
        for (var i = 0; i < tableKeys.length; i++) {
          let j= tableKeys[i];
          mes+="&auditRule.differenceCode"+j+"="+eval('values.auditRule.differenceCode'+j)
              +"&auditRule.differenceClassify"+j+"="+eval('values.auditRule.differenceClassify'+j)
              +"&auditRule.differenceEffect"+j+"="+eval('values.auditRule.differenceEffect'+j)
              +"&auditRule.solvePerson"+j+"="+eval('values.auditRule.solvePerson'+j)
              +"&auditRule.updateTime"+j+"="+(eval('values.auditRule.updateTime'+j)?"":eval('values.auditRule.updateTime'+j).format('YYYY-MM-DD'))
              +"&auditRule.solveRule"+j+"="+eval('values.auditRule.solveRule'+j)
              +"&auditRule.comments"+j+"="+eval('values.auditRule.comments'+j);
        }

        this.setState({
          confirmLoading:true,
        });
        const {action}=this.state;
        let id=(this.state.record.id==undefined?'':this.state.record.id);
        // if (values.upload.success === "true") {
        //    uploadBid=values.upload.bid;
        //    uploadName=values.upload.name;
        // }
        tableKeys.unshift("0");
        let num=values.tabNum;
        num++;
        let text="auditRule.businessType="+values.auditRule.businessType
        +"&auditRule.businessCode="+values.auditRule.businessCode
        +"&auditRule.businessName="+values.auditRule.businessName
        +"&auditRule.auditType="+values.auditRule.auditType
        +"&auditRule.auditKey="+values.auditRule.auditKey
        +"&auditRule.differenceCode="+values.auditRule.differenceCode
        +"&auditRule.differenceClassify="+values.auditRule.differenceClassify
        +"&auditRule.differenceEffect="+values.auditRule.differenceEffect
        +"&auditRule.solvePerson="+values.auditRule.solvePerson
        +"&auditRule.updateTime="+(values.auditRule.updateTime===undefined?"":values.auditRule.updateTime.format('YYYY-MM-DD'))
        +"&auditRule.solveRule="+values.auditRule.solveRule
        +"&auditRule.comments="+values.auditRule.comments
        +"&tabNum="+num
        +"&tableKeys="+tableKeys.toString()
        +"&flag="+action+"&auditRule.id="+id;
        text=text+mes;
        ajaxUtil("urlencoded","audit-rule!filenumber.action",text,this,(data,that) => {
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
    const { visible, confirmLoading,auditTypeList,record,action }= this.state;
    return(
      <div>
       <Modal key={uuid.v1()} visible={visible} onOk={this.handleOk} onCancel={this.handleCancel}
              title="编辑" confirmLoading={confirmLoading}  afterClose={this.afterClose} width={700}
        >
          <ComBizForm ref={(ref) => this.form = ref} auditTypeList={auditTypeList} record={record} action={action}/>
       </Modal>
      </div>
    );
  }
}

export default AuditRuleSumNew;
