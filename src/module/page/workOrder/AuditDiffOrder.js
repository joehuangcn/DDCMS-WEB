import React,{Component} from "react";
import { Form, Input, Button,Modal,Upload ,Icon,Select,Row,Col,InputNumber,Radio,Switch,Tabs,DatePicker,TreeSelect} from 'antd';
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
const statuList=[
    {dicCode:'1',dicName:'高' },
    {dicCode:'2',dicName:'中' },
    {dicCode:'3',dicName:'低' },
  ];

class BizAuditFormModal extends Component {

  constructor(props){
    super(props);
    this.state={
      activeKey:"0",
      panes:[],
      obTimeList:[],
      diffList:[],
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
          case 'tree':
                renderSome=<TreeSelect  placeholder='请选择' style={{ width: 400 }} allowClear  treeData={SourceList}/>;break;
          case 'treeSelect':
                renderSome=<TreeSelect placeholder='请选择' style={{ width: 400 }} allowClear  treeData={SourceList}
                                treeCheckable={true} showCheckedStrategy='SHOW_CHILD' />;break;
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
    const { getFieldDecorator} = this.props.form;
    const {record,action,personList,bizList}=this.props;
    const {panes,obTimeList,diffList}=this.state;
    const file1="batchfile";
    const url="audit-rule!uploadFile.action";
    const deleteUrl="audit-rule!deletedFile.action";
    return(
      <div>
      <FormItem {...formItemLayout } label="业务">
       {getFieldDecorator('auditTask.bizCode'+index,{
         rules:[{ required:true, message:'业务不能为空',}],
         initialValue:'',
       })
       (
         <TreeSelect  placeholder='选择业务'
           allowClear onChange={this.handleBizTreeChange}
         treeData={bizList}/>
      )}
     </FormItem>
  <Row gutter={2}>
    <Col span={12}>
    {this.handleRenderTab("select",formItemLayout,"优先级","workOrder.priority"+index,true,record.priority,statuList,0,'')}
   </Col>
   <Col span ={12}>
     {this.handleRenderTab("date",formItemLayout,"计划完成时间","workOrder.wishEndTime"+index,false,record.wishEndTime,[],0,'')}
   </Col>
  </Row>
  <Row gutter={6}>
    <Col >
      {this.handleRenderTab("tree",formItemLayout,"审查人员1","workOrder.reviewPerson"+index,false,record.reviewPerson,personList,0,'')}
    </Col>
    </Row>
    <Row gutter={6}>
    <Col >
      {this.handleRenderTab("tree",formItemLayout,"审查人员2","workOrder.reviewPersoRe"+index,false,record.reviewPersoRe,personList,0,'')}
    </Col>
  </Row>
  <Row gutter={6}>
    <Col>
      {this.handleRenderTab("treeSelect",formItemLayout,"指派人员","workOrder.commonReceiver"+index,true,record.commonReceiver,personList,0,'')}
    </Col>
    </Row>
    <Row gutter={6}>
    <Col >
      {this.handleRenderTab("treeSelect",formItemLayout,"抄送人员","workOrder.commonCopyer"+index,false,record.commonCopyer,personList,0,'')}
    </Col>
  </Row>
  <Row gutter={4}>
  <Col >
    {this.handleRenderTab("tree",formItemLayout,"确定结束人员","workOrder.checkEndPerson"+index,false,record.checkEndPerson,personList,0,'')}
   </Col>
   </Row>
   <Row>
   <Col >
    <FormItem {...formItemLayout} label="提数日期" >
      {getFieldDecorator("obDate"+index)(
        <Select   placeholder="提数日期" allowClear={true}>
            {obTimeList.map(d =><Option key={d.obtainDate} value={d.obtainDate}>{d.obtainDate}</Option>)}
        </Select>
      )}
    </FormItem>
    </Col>
     </Row>
      <Row>
     <Col >
      <FormItem {...formItemLayout} label="差异代码" >
        {getFieldDecorator("diffCode"+index)(
          <Select   placeholder="差异代码" allowClear={true}   mode="multiple" >
              {diffList.map(d =><Option key={d.key} value={d.key}>{d.value}</Option>)}
          </Select>
        )}
      </FormItem>
      </Col>
       </Row>
   <Row gutter={6}>
   <Col >
     <FormItem {...formItemLayout} label="上传附件">
        {getFieldDecorator('upload'+index, {
          valuePropName: 'fileList',
          initialValue:[],
          })(
          <UploadFile name={file1} requestUrl={url} deleteUrl={deleteUrl} muliple={false}/>
        )}
      </FormItem>
    </Col>
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

 handleBizTreeChange=(value) => {
   // let bizList=this.props.bizList;
     // console.log(this.props.form);
     // console.log(this.props.form.getFieldValue('auditTask.bizCode'));
   // this.props.form.setFieldsValue({'auditTask.auditTaskName':value});
  //  console.log(value);
  //  this.gethandleSwith(value);
   ajaxUtil("urlencoded","cy-detail!getObtaindatatimeByBizCode.action","bizCode="+value,this,(data,that)=>{
     this.setState({obTimeList:data.data});
   });
   ajaxUtil("urlencoded","cy-detail!getDiffCodeForAnalyzeGroupbyKV.action","bizCode="+value,this,(data,that)=>{
     this.setState({diffList:data});
   });
 }

  render () {
    const { getFieldDecorator} = this.props.form;
    const {record,action,personList,bizList}=this.props;
    const {panes,obTimeList,diffList}=this.state;
    const file1="batchfile";
    const url="audit-rule!uploadFile.action";
    const deleteUrl="audit-rule!deletedFile.action";
    return(
      <div>
      <Form>
      <Row gutter={4}>
      <Col>
        {this.handleRenderTab("input",formItemLayout,"工单名称","workOrder.workOrderName",true,record.workOrderName,[],0,'')}
       </Col>
      </Row>
      <Row>
        {this.handleRenderTab("textarea",formItemLayout,"工单描述","workOrder.woContents",false,record.woContents,[],6,'')}
        <Col style={{ display:'none'}}>
        {this.handleRenderTab("none",formItemLayout,"panes","tabNum",false,this.state.panes.length,[],0,'')}
        {this.handleRenderTab("none",formItemLayout,"nums","tableKeys",false,this.state.panes,[],0,'')}
        </Col>
      </Row>
      <div style={{ display:action==="edit"?'none':'block'}}>
          <Button type="primary" onClick={this.add}>新增业务</Button>
      </div>
      <Tabs  hideAdd onChange={this.onChange} activeKey={this.state.activeKey}  type="editable-card"
          onEdit={this.onEdit} >
          <TabPane tab='业务0' key='0' closable={false}>
              <FormItem {...formItemLayout } label="业务">
               {getFieldDecorator('auditTask.bizCode',{
                 rules:[{ required:true, message:'业务不能为空',}],
                 initialValue:'',
               })
               (
                 <TreeSelect  placeholder='选择业务'
                   allowClear onChange={this.handleBizTreeChange}
                 treeData={bizList}/>
              )}
             </FormItem>
          <Row gutter={2}>
            <Col span={12}>
            {this.handleRenderTab("select",formItemLayout,"优先级","workOrder.priority",true,record.priority,statuList,0,'')}
           </Col>
           <Col span ={12}>
             {this.handleRenderTab("date",formItemLayout,"计划完成时间","workOrder.wishEndTime",false,record.wishEndTime,[],0,'')}
           </Col>
          </Row>
          <Row gutter={6}>
            <Col >
              {this.handleRenderTab("tree",formItemLayout,"审查人员1","workOrder.reviewPerson",false,record.reviewPerson,personList,0,'')}
            </Col>
            </Row>
            <Row gutter={6}>
            <Col >
              {this.handleRenderTab("tree",formItemLayout,"审查人员2","workOrder.reviewPersoRe",false,record.reviewPersoRe,personList,0,'')}
            </Col>
          </Row>
          <Row gutter={6}>
            <Col>
              {this.handleRenderTab("treeSelect",formItemLayout,"指派人员","workOrder.commonReceiver",true,record.commonReceiver,personList,0,'')}
            </Col>
            </Row>
            <Row gutter={6}>
            <Col >
              {this.handleRenderTab("treeSelect",formItemLayout,"抄送人员","workOrder.commonCopyer",false,record.commonCopyer,personList,0,'')}
            </Col>
          </Row>
          <Row gutter={4}>
          <Col >
            {this.handleRenderTab("tree",formItemLayout,"确定结束人员","workOrder.checkEndPerson",false,record.checkEndPerson,personList,0,'')}
           </Col>
           </Row>
           <Row>
           <Col >
            <FormItem {...formItemLayout} label="提数日期" >
              {getFieldDecorator("obDate")(
                <Select   placeholder="提数日期" allowClear={true}>
                    {obTimeList.map(d =><Option key={d.obtainDate} value={d.obtainDate}>{d.obtainDate}</Option>)}
                </Select>
              )}
            </FormItem>
            </Col>
             </Row>
              <Row>
             <Col >
              <FormItem {...formItemLayout} label="差异代码" >
                {getFieldDecorator("diffCode")(
                  <Select   placeholder="差异代码" allowClear={true}   mode="multiple" >
                      {diffList.map(d =><Option key={d.key} value={d.key}>{d.value}</Option>)}
                  </Select>
                )}
              </FormItem>
              </Col>
               </Row>
           <Row gutter={6}>
           <Col >
             <FormItem {...formItemLayout} label="上传附件">
                {getFieldDecorator('upload', {
                  valuePropName: 'fileList',
                  initialValue:[],
                  })(
                  <UploadFile name={file1} requestUrl={url} deleteUrl={deleteUrl} muliple={false}/>
                )}
              </FormItem>
            </Col>
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

class AuditDiffOrder extends Component {
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

  componentWillMount(){
    this.getdic();
  }

  getdic=() =>{
    // ajaxUtil("urlencoded","dictionaryAction!getDictionaryListByType.action","name=DICT_AuditType",this,(data,that)=>{
    //     this.setState({auditTypeList:data.data});
    // });

    ajaxUtil("urlencoded","person!getPersonTree.action","node=0",this,(data,that)=>{
        this.setState({personList:data});
    });
  }

  handleOk = (isMode) => {
      const form= this.form;
      form.validateFields(( err, values) => {
        if (err) {
          return;
        }
        let tableKeys=values.tableKeys;
        let mes="";
        for (var i = 0; i < tableKeys.length; i++) {
          let j= tableKeys[i];

          let uploadName=""; let uploadMd5="";
          if (  eval('values.upload.status'+j)==='done') {
              if ( eval('values.upload'+j+'.response')!==undefined && eval('values.upload.response'+j+'.success')==='true') {
                  uploadMd5=eval('values.upload'+j+'.response.bid');
                  uploadName=eval('values.upload'+j+'.response.name');
              }
          }
          mes+="&priority"+j+"="+eval('values.workOrder.priority'+j)
              +"&busType.mid"+j+"="+eval('values.auditTask.bizCode'+j)
              +"&wishEndTime"+j+"="+eval('values.workOrder.wishEndTime'+j)
              +"&reviewPerson.userId"+j+"="+eval('values.workOrder.reviewPerson'+j)
              +"&reviewPersonRe.userId"+j+"="+eval('values.workOrder.reviewPersoRe'+j)
              +"&differExecuter.id"+j+"="+eval('values.workOrder.commonReceiver'+j)
              +"&differCopyer.id"+j+"="+eval('values.workOrder.commonCopyer'+j)
              +"&checkEndPerson.userId"+j+"="+eval('values.workOrder.checkEndPerson'+j)
              +"&obtainDate"+j+"="+((eval('values.obDate'+j)===undefined|| eval('values.obDate'+j)==='暂无数据')?'':(eval('values.obDate'+j)))
              +"&diffCode"+j+"="+eval('values.diffCode'+j)
              +"&uploadMd5"+j+"="+uploadMd5
              +"&uploadName"+j+"="+uploadName;
        }
        // console.log(values);

        let uploadName=""; let uploadMd5="";
        if (values.upload.status==='done') {
            if (values.upload.response!==undefined && values.upload.response.success==='true') {
                uploadMd5=values.upload.response.bid;
                uploadName=values.upload.response.name;
            }
        }

        this.setState({
          confirmLoading:true,
        });
        const {action}=this.state;
        // tableKeys.unshift("0");
        // let num=values.tabNum;
        // num++;
        let text="workOrder.workOrderName="+values.workOrder.workOrderName
        +"&workOrder.woContents="+values.workOrder.woContents
        +"&workOrder.busType.bizCode="+values.auditTask.bizCode
        +"&workOrder.priority="+values.workOrder.priority
        +"&workOrder.wishEndTime="+(values.workOrder.wishEndTime===undefined?"":values.workOrder.wishEndTime.format('YYYY-MM-DD'))
        +"&workOrder.reviewPerson.userId="+values.workOrder.reviewPerson
        +"&workOrder.reviewPersoRe.userId="+values.workOrder.reviewPersoRe
        +"&differExecuter.id="+values.workOrder.commonReceiver
        +"&differCopyer.id="+values.workOrder.commonCopyer
        +"&workOrder.checkEndPerson.userId="+values.workOrder.checkEndPerson
        +"&workOrder.obtainDate="+((values.obDate===undefined||values.obDate==='暂无数据')?'':values.obDate)
        +"&differCode="+values.diffCode
        +"&tableKeys="+values.tableKeys
        +"&uploadMd5="+uploadMd5+"&uploadName="+uploadName
        +"&type=2&isMode="+isMode;
        text=text+mes;
        ajaxUtil("urlencoded","work-order!saveNew.action",text,this,(data,that) => {
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

  handleAuto=() =>{
    this.handleOk(1);
  }
  handleSend=() =>{
    this.handleOk(0);
  }

  render() {
    const { visible, confirmLoading,personList,record,action,loading }= this.state;
    const {bizList}=this.props;
    return(
      <div>
       <Modal key={uuid.v1()} visible={visible} onOk={this.handleSend} onCancel={this.handleCancel}
              title="编辑" confirmLoading={confirmLoading}  afterClose={this.afterClose} width={700}
              footer={[
                <Button key="back" onClick={this.handleAuto}>保存模板自动派发</Button>,
               <Button key="submit" type="primary" loading={loading} onClick={this.handleSend}>
                 派发
               </Button>,
               <Button key="cancel" onClick={this.handleCancel}>取消</Button>,
       ]}
        >
          <ComBizForm ref={(ref) => this.form = ref} record={record} action={action} bizList={bizList} personList={personList}/>
       </Modal>
      </div>
    );
  }
}

export default AuditDiffOrder;
