import React,{Component} from 'react'
import {Table,Menu,Form,Row,Col,Select,Button,Icon,TreeSelect,DatePicker,Dropdown,Tooltip,message,Modal,Popconfirm,Input,Divider} from 'antd'
import {ajaxUtil} from '../../../util/AjaxUtils';
import SimpleOrder from "./SimpleOrder";
import AuditDiffOrder from "./AuditDiffOrder";
import uuid from 'node-uuid';
const FormItem=Form.Item;
const {TextArea}=Input;
const Option = Select.Option;
class WorkOrder extends Component{
  constructor(props){
    super(props);
    this.state={
      columns:[],
      data:[],
      dynColumns:[],
      loading:false,
      addBtnPermiss:false,
      pagination:{},
      selectedRowKeys:[],
      bizList:[],
      permission:[],
      title:'',isDone:'',
    }
  }

  componentWillMount(){
    this.getInitProps(this.props);
    this.getInitList();
  }

  componentDidMount(){
    this.getDynColumnHead();
    this.fetch();
  }
  componentWillReceiveProps(nextProps){
  }

  // 初始化
  getInitProps=(props)=>{
   //  console.log(props);
     const {state}=props.location;
     let permission=[];
     ajaxUtil("urlencoded","permiss!getUserBtnPermissByResid.action","resid="+state.id, this,(data,that)=>{
       permission=data.data;
       let addBtnPermiss=false;
       if (permission.indexOf('add')==-1) {
         addBtnPermiss=true;
       }
       this.setState({
         id:state.id,
         permission:permission,
         addBtnPermiss:addBtnPermiss
       });
     });
   }

  getInitList =() =>{
    ajaxUtil("urlencoded","business!getBusAfterNew.action","",this,(data,that)=>{
        this.setState({bizList:data});
    });
    // ajaxUtil("urlencoded","person!getPersonTree.action","node=0",this,(data,that)=>{
    //     this.setState({personList:data});
    // });
  }


  getDynColumnHead =() =>{
    // console.log(dynColumns);
    const firtColumns =[
      {title: '优先级',dataIndex: 'priority', key: 'priority',width:150,render:(text)=>(this.renderPriority(text))},
      {title: '工单名称',dataIndex: 'workOrderName', key: 'workOrderName',width:150},
      { title: '工单类型',dataIndex: 'workOrderType',key: 'workOrderType',width:100,render:(text)=>(this.renderType(text))},
      {title: '状态',dataIndex: 'status',key: 'status',width:150,render:(text)=>(this.renderStatus(text))},
      {title:'操作',dataIndex:'status',key:'do',width:150,render:(text,record) =>(this.renderDo(text,record))},
      {title:'预计截止时间',dataIndex:'wishEndTime',key:'wishEndTime',width:150,},
      { title: '完成时间',dataIndex: 'endTime', key: 'endTime',width:150},
      { title: '审核人1', dataIndex: 'reviewPerson',key: 'reviewPerson',width:150,render:(text)=>(this.renderReview(text))},
      { title: '审核人2', dataIndex:'reviewPersonRe',key: 'reviewPersonRe',width:100,render:(text)=>(this.renderReview(text))},
      { title: '指派人', dataIndex: 'toPerson',  key: 'toPerson',width:120,render:(text)=>(this.renderToPerson(text))},
      { title: '实际执行人', dataIndex: 'checkHandler',  key: 'checkHandler',width:100,render:(text)=>(this.renderReview(text))},
      { title: '结束人', dataIndex: 'checkEndPerson',  key: 'checkEndPerson',width:100,render:(text)=>(this.renderReview(text))},
      { title: '抄送对象', dataIndex: 'copyPerson',  key: 'copyPerson',width:100,render:(text)=>(this.renderToPerson(text))},
      { title: '提数日期', dataIndex: 'obtainDate',  key: 'obtainDate',width:100,},
      { title: '差异类型', dataIndex: 'diffCode',  key: 'diffCode',width:100,},
      { title: '附件', dataIndex: 'uploadfile',  key: 'uploadfile',width:100,render:(text,record)=>(this.renderUpfile(text,record))},
      { title: '稽核结果', dataIndex: 'workOrderType',  key: 'results',width:120,render:(text,record)=>(this.renderAuditResult(text,record))},
      { title: '差异明细excel', dataIndex: 'workOrderType',  key: 'excel',width:150,render:(text,record)=>(this.renderAuditDetail(text,record))},
      { title: '差异明细TXT', dataIndex: 'workOrderType',  key: 'txt',width:150,render:(text,record)=>(this.renderAuditDetail(text,record))},

    ];
    let action ={
      title:'操作',
      key:'action',
      width:100,
      render : (text, record) => {
        let permission=this.state.permission;
        let edit='inline';let deletes='inline';
        let activeDis=false; let activeColor="green";
        if(permission.indexOf('edit')===-1){
            edit='none'
        }
        if (permission.indexOf('del')===-1) {
          deletes='none'
        }
        return(
        <span>
         <Popconfirm title="你确定要删除该记录?" okText="是" cancelText="否" disabled onConfirm={() => {
           ajaxUtil("urlencoded","work-order!del.action","woid="+record.woid,this,(data,that) => {
             let status=data.success;
             let message= data.message;
               if (status==='true') {
                 Modal.success({ title: '消息', content: message,});
               }else {
                 Modal.error({ title: '消息',content: message,
                });
               }
              this.refresh();
           })

         }}>
         <a style={{color:'red',display:deletes}}>删除</a>
         </Popconfirm>
        </span>
      )
      },
    };
    firtColumns.push(action);
    this.setState({columns:firtColumns});
  }

  renderDo=(value,record) =>{
    let so;
    switch(record.status){
      case 0:
        so=(<div>
          <Tooltip placement="topLeft" title="审查通过" arrowPointAtCenter>
            <Button type="primary" shape="circle" size='small'  onClick={()=>{this.showCheckInfo("审查通过",1,record)}} ><Icon type="check"/></Button>
         </Tooltip>
         <Tooltip placement="topLeft" title="驳回" arrowPointAtCenter>
            <Button type="danger" shape="circle" size='small' onClick={()=>{this.showCheckInfo("驳回操作",-1,record)}} ><Icon type="rollback" /></Button>
        </Tooltip>
        </div>
      );
        break;
      case 1:
          so=(<div><Tooltip placement="topLeft" title="审查通过" arrowPointAtCenter>
            <Button type="primary" shape="circle" size='small'  onClick={()=>{this.showCheckInfo("执行操作",2,record)}} ><Icon type="check"/></Button>
         </Tooltip>
         <Tooltip placement="topLeft" title="驳回" arrowPointAtCenter>
            <Button type="danger" shape="circle" size='small' onClick={()=>{this.showCheckInfo("驳回操作",-1,record)}} ><Icon type="rollback" /></Button>
        </Tooltip></div>);
        break;
      case 2:
          so=<Tooltip placement="topLeft" title="执行" arrowPointAtCenter>
          <Button type="primary" shape="circle" icon="clock-circle-o" size='small' onClick={()=>{this.showCheckInfo("执行操作",4,record)}}/>
          </Tooltip>
        break;
      case 3:
        so=<Tooltip placement="topLeft" title="确定" arrowPointAtCenter>
        <Button type="primary" style={{backgroundColor:'green'}} shape="circle" icon="check" size='small' onClick={()=>{this.showCheckInfo("完成操作",4,record)}} />
        </Tooltip>
        break;
      case 4:
        so=<Tooltip placement="topLeft" title="结束" arrowPointAtCenter>
        <Button type="primary"  shape="circle" icon="close" size='small' onClick={()=>{this.showCheckInfo("结束操作",5,record)}}/></Tooltip>
        break;
      case 5:
        so=(<div>
          <Tooltip placement="topLeft" title="关闭" arrowPointAtCenter>
            <Button style={{backgroundColor:'#FF00FF'}} shape="circle" icon="poweroff" size='small' onClick={()=>{this.showCheckInfo("关闭操作",6,record)}}/>
         </Tooltip>
         <Tooltip placement="topLeft" title="不通过" arrowPointAtCenter>
              <Button type="danger" shape="circle" icon="rollback" size='small' onClick={()=>{this.showCheckInfo("结果审核不通过",3,record)}}/>
        </Tooltip>
        </div>)
        break;
      case -1:
        so=<Tooltip placement="topLeft" title="关闭" arrowPointAtCenter>
             <Button  style={{backgroundColor:'#FF00FF'}} shape="circle" icon="poweroff" size='small' onClick={()=>{this.showCheckInfo("关闭操作",6,record)}} />
         </Tooltip>
        break;
        default: break;
    };
    return so;
  }

// ---状态执行调用
  showCheckInfo=(text,updataStat,record) =>{
    this.newCheckMes.showCheckInfo(text,updataStat,record);
  }

renderPriority=(text) =>{
  switch (text) {
    case '1':
        return <span style={{color:'red'}}>高</span>;
    case '2':
        return <span style={{color:'orange'}}>中</span>;
    case '3':
        return <span style={{color:'#3CB371'}}>低</span>;
      break;
    default:

  }
}

renderType=(value) =>{
  switch (value) {
    case  1:
       return "一般工单";
    case 2:
        return "差异工单";
    case 3:
        return "自动派发模板";
  }
}



renderStatus=(text) =>{
  switch (text) {
    case -2:
        return '已配置';
    case -1:
      return '派单审核未通过';
    case 0:
      return '待审查';
   case 1:
     return '待审查';
   case 2:
     return '待执行';
   case 3:
     return '结果审核未通过';
   case 4:
     return '执行中';
   case 5:
     return '完成';
   case 6:
     return '关闭';
  }
}

renderReview=(text) =>{
  if (text===undefined) {
    return '';
  }else{
    return text.name;
  }
}

renderToPerson= (text) =>{
    if (text===undefined) {
      return "";
    }else {
      let ms='';
      for (var i = 0; i < text.length; i++) {
        ms+=text[i].name+",";
      }
      return ms;
    }
}

renderUpfile= (text,record) =>{
  if (text===undefined) {
    return "";
  }else if (text.value==='文件为空11') {
    return text.value;
  }else {
    return <span>{text.value} <Button shape='circle'  type="primary" size='small' onClick={()=>{this.handleDownloadFile(text.key,record.woid)}}>
        <Icon type="arrow-down" style={{fontSize:5}}/></Button></span>
  }
}

renderAuditResult= (text,record) =>{
  if (text===2) {
    return <span>稽核结果<Button shape='circle'  type="primary" size='small' onClick={()=>{this.handleAuditResult(record)}}>
          <Icon type="arrow-down" style={{fontSize:5}}/></Button></span>;
  }else {
    return "";
}
}

renderAuditDetail= (text,record) =>{
  if (text===2) {
      let diffCodes=record.diffCode.split(',');

      return  <span>{diffCodes.map((text) =>{return  <div key={text+'s'}>{text}<Button shape='circle'  type="primary" size='small' onClick={()=>{this.handleAuditDetail(text,record)}}>
            <Icon type="arrow-down" style={{fontSize:5}}/></Button> <span className="ant-divider"/> </div>  })}</span>
  }else {
    return "";
}
}
renderAuditDetailTxt= (text,record) =>{
  if (text===2) {
      let diffCodes=record.diffCode.split(',');

      return  <span>{diffCodes.map((text) =>{return  <div key={text+'t'}>{text}<Button shape='circle'  type="primary" size='small' onClick={()=>{this.handleAuditDetailTxt(text,record)}}>
            <Icon type="arrow-down" style={{fontSize:5}}/></Button> <span className="ant-divider"/> </div>  })}</span>
  }else {
    return "";
}
}


handleDownloadFile=(fileName,woid) =>{
  let text="filename="+fileName+"&bid="+woid;
  window.location.href="/DDCMS/work-order!download.action?"+text;
}
handleAuditResult=(record)=>{
  let text="bizcode=" + record.busType.bizCode + "&obtainDate=" + (record.obtainDate===undefined?'':record.obtainDate) + "&diffcode=" + record.diffCode + "&personId=" + record.toPerson[0].id + "&bizName=" + record.busType.bizName ;
      console.log(text);
      window.location.href="/DDCMS/work-order!loadAuditSumXLS.action?"+text;
}

handleAuditDetail=(diffCode,record) =>{
  let text="bizcode=" + record.busType.bizCode + "&obtainDate=" + (record.obtainDate===undefined?'':record.obtainDate) + "&diffcode=" +diffCode + "&personId=" + record.toPerson[0].id + "&bizName=" + record.busType.bizName
  + "&flag=downXls" ;
    window.location.href="/DDCMS/work-order!loadDiffXls.action?"+text;
}

handleAuditDetailTxt=(diffCode,record) =>{
  let text="bizcode=" + record.busType.bizCode + "&obtainDate=" + (record.obtainDate===undefined?'':record.obtainDate) + "&diffcode=" +diffCode + "&personId=" + record.toPerson[0].id + "&bizName=" + record.busType.bizName
  + "&flag=downTxt" ;
    window.location.href="/DDCMS/work-order!loadDiffXls.action?"+text;
}

  renderRate=(text) =>{
    if (text==""||text===undefined) {
       return "";
    }else
      return text+"%";
  }

  fetch = (params = {}) => {
     this.setState({loading:true});
     let page=0;
     if (params.page>1) {
       page=(params.page-1)*10;
     }
     let sort='';
     if (typeof(params.sortField) !== "undefined" ) {
       sort=params.sortField;
     }
     let dir='ASC';
     if (typeof(params.sortOrder) !== "undefined" ) {
       dir=(params.sortOrder=="descend"?"desc":"asc");
     }
    //  const {config} = this.props;
    const {title,isDone}=this.state;
    // let choic="";
    // for (var i = 0; i < bizCodeParams.length; i++) {
    //   choic+="&choiseCode="+bizCodeParams[i]
    // }
     const text="title="+title
     +"&isDone="+isDone
     +"&sort="+sort
     +"&dir="+dir
     +"&start="+page+"&limit=10";
     ajaxUtil("urlencoded","work-order!getList.action",text,this,(data,that)  => {
       const pagination = that.state.pagination;
       pagination.total = parseInt(data.total,10);
       this.setState({
           loading: false,
           data: data.data,
           pagination,
       });
     });
   }

   refresh=() =>{
     this.fetch();
   }
  handleSearch=(e) => {
   const form= this.form;
   form.validateFields(( err, values) => {
     if (err) {
       return;
     }
     console.log(values);
     let title=values.title===undefined?'':values.title;
     let isDone=values.isDone===undefined?'':values.endDate;
     this.setState({isDone,title},()=>{this.fetch()});
  })
}

handleReset=() =>{
  this.form.resetFields();
  this.setState({title:'',isDone:''},()=>{this.fetch()});
}

handleTableChange = (pagination, filters, sorter) => {
  const pager = {...this.state.pagination};
  pager.current=pagination.current;
  this.setState({
    pagination:pager,
  });
  this.fetch({
    results: pagination.pageSize,
    page: pagination.current,
    sortField: sorter.field,
    sortOrder: sorter.order,
    ...filters,
  });
}

exportMes=(e)=>{
  console.log(e);
   const {config,permission} = this.state;
   let synId='';
   let downflag='';
   const {cityCode,startDate,endDate,bizCodeParams}=this.state;
   let text="startDate="+startDate
   +"&endDate="+endDate
   +"&cityCode="+cityCode
   +"&choiseCode="+bizCodeParams
   if (e.key==='1') {
     if (this.state.selectedRowKeys.length<=0) {
        message.warning("请选择需要导出的列");
     }else{
       text+="&flag=selected&ids="+this.state.selectedRowKeys;
      //  this.help(text);
       window.location.href="/DDCMS/audit-rule!loadXLS.action?"+text;
     }
   }else if (e.key==='2') {
      text+="&flag=all&ids=";
      // this.help(text);
      window.location.href="/DDCMS/audit-rule!loadXLS.action?"+text;
   }
 }


 onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  }
  // 打开新建窗口
  handleModal= () => {
    this.newbiz.show();
  }

  ClickTest=(record, index, event)=>{
    this.mesDetail.showModal(record);
  }

  // 打开新建窗口
  handleDiffModal= () => {
    this.diffBiz.show();
  }
  // <UploadXls ref={(ref) => this.uploadXls=ref}  />
  // <AuditRuleSumNew  ref={(ref) => this.newbiz=ref} refresh={this.refresh}/>
  render(){
    const {columns,data,loading,pagination,selectedRowKeys,bizList,addBtnPermiss}=this.state;
    const rowSelection = {
     selectedRowKeys,
     onChange: this.onSelectChange,
      };
    return(
        <div>
          <SearchBut ref={(ref) => this.form = ref}  bizList={bizList} handleSearch={this.handleSearch}
                handleReset={this.handleReset} exportMes={e =>this.exportMes(e)} permission={this.state.permission}
                addBtnPermiss={addBtnPermiss} handleModal={this.handleModal} uploadMes={e=>this.uploadMes(e)} handleDiffModal={this.handleDiffModal}/>
        <Table rowKey='woid' loading={loading}  columns={columns} pagination={pagination} dataSource={data}
          onChange={this.handleTableChange}  scroll={{x:'250%'}}  onRowDoubleClick={this.ClickTest} />
      <SimpleOrder  ref={(ref) => this.newbiz=ref} refresh={this.refresh} />
      <AuditDiffOrder ref={(ref) => this.diffBiz=ref} refresh={this.refresh}  bizList={bizList}/>
      <MesDetail ref={(ref) => this.mesDetail=ref} />
      <CheckModalForm ref={(ref) => this.newCheckMes=ref}  modalTitle={this.state.modalTitle} />
        </div>);
  }
}


class StatSearch extends Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    const {permission}=this.props;
    let expBtnPermiss='inline';
    if (permission.indexOf('exp')===-1) {
      expBtnPermiss='none';
    }
   const formItemLayout = {
     labelCol: { span: 10 },
     wrapperCol: { span: 14 },
   };
   const cityItemLayout = {
     labelCol: { span: 7 },
     wrapperCol: { span: 7 },
   };
   return(
    <Form layout="inline">
       <Row gutter={4}>
        <Col span={4}>
          <Row>
          <Col span={12}>
            <Button type='primary' onClick={this.props.handleModal} disabled={this.props.addBtnPermiss}>派发一般工单</Button>
          </Col>
          <Col span={12}>
            <Button type='primary' onClick={this.props.handleDiffModal} disabled={this.props.addBtnPermiss}>派发差异工单</Button>
              </Col>
           </Row>
        </Col>
        <Col span={6} >
         <FormItem { ...cityItemLayout} label="业务名称">
           {getFieldDecorator("bizCodeParam")(
                 <TreeSelect  placeholder='选择业务'
                    style={{ width: 250 }} allowClear treeCheckable={true} showCheckedStrategy='SHOW_CHILD'
                 treeData={this.props.bizList}  onChange={this.handleBizTreeChange} />
           )}
         </FormItem>
         </Col>
        <Col span={4}>
         <FormItem {...formItemLayout} label="工单状态/模板">
           {getFieldDecorator("isDone")(
             <Select style={{ width: 150,marginLeft: 8 }} allowClear placeholder="选择查询类型">
               <Option value="0">加载未关闭的工单</Option>
               <Option value="1">加载已关闭的工单</Option>
               <Option value="2">加载自动派发模板</Option>
             </Select>
           )}
         </FormItem>
         </Col>
         <Col span={4} >
          <FormItem {...formItemLayout} label="工单名称">
            {getFieldDecorator("title")(
              <Input  placeholder="输入查询值" style={{ width: 150 }} />
            )}
          </FormItem>
          </Col>
         <Col span={6} style={{ textAlign: 'right',}} >
           <Button type="primary" onClick={this.props.handleSearch}>查询</Button>
           <Button style={{ marginLeft: 8 }} onClick={this.props.handleReset}> 重置</Button>
         </Col>
       </Row>
     </Form>
   );
  }
}
const SearchBut =Form.create()(StatSearch);


class MesDetail extends Component {
  constructor(props){
    super(props);
    this.state = {
    visible:false,
    record:[],
    };
  }

  showModal =(record) => {
   this.setState({
     visible:true,
     record:record,
   });
  }
  handleCancel = (e) => {
    this.setState({visible:false});
  }


  render() {
    const { visible, confirmLoading,record}= this.state;
    return(
      <div>
       <Modal key={uuid.v1()} visible={visible} onCancel={this.handleCancel}
              title="工单处理记录" confirmLoading={confirmLoading}  afterClose={this.afterClose}
            footer={[]}
        >
        <div>
        <div className="content">
          <Divider>工单内容</Divider>
        <h4>{record.woContents}</h4>
        </div>
        <div>
        <Divider>工单处理进度</Divider>
          <span>{record.dealResult}</span>
        </div>
        </div>
       </Modal>
      </div>
    );
  }
}

class ReturnInfoForm extends Component {
  render(){
    const {form}=this.props;
    const {getFieldDecorator}=form;
    return(
      <Form >
      <FormItem label="处理结果备注">
        {getFieldDecorator('comments')(<TextArea rows={4}/>)}
      </FormItem>
      </Form>
    );
  }
}
const ModalForm = Form.create()(ReturnInfoForm)
class CheckModalForm extends Component {
  constructor(props){
    super(props);
    this.state={
      modalTitle:'',
      visible:false
    }
  }

  showCheckInfo=(text,updateStat,record) =>{
    console.log('showCheckInfo',text);
    this.setState({
      visible:true,
      modalTitle:text,
      record:record,
      updateStat:updateStat
    });
  }
  hideModal=(e)=> {
    const form=this.form;
    this.setState({visible:false});
      form.resetFields();
  }

  afterClose=() =>{

  }
  handleOk=(e)=> {
    const form=this.form;
    const {record,updateStat}=this.state;
    this.setState({
      confirmLoading:true,
    });
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const text="workOrder.status="+updateStat+"&workOrder.woid="+record.woid+"&workOrder.dealResult="+values.comments;
      ajaxUtil("urlencoded","work-order!updateStatus.action",text,this,(data,that)=>{
          let status=data.success;
          let backMessage= data.message;
          this.setState({
            visible: false,
            confirmLoading: false,
          });

          if (status===true) {
            // Modal.success({
            //  title: '消息',
            //  content: backMessage,
            // });
            message.success(backMessage, 3);
          }else {
            message.error(backMessage, 3);
          }
      })
      form.resetFields();
    })

  }
  render(){
    const {modalTitle,visible,confirmLoading}=this.state;
  return (
    <Modal title={modalTitle} visible={visible} onCancel={this.hideModal} afterClose={this.afterClose}
     confirmLoading={confirmLoading} onOk={this.handleOk}>
      <ModalForm ref={(ref) => this.form = ref}  />
    </Modal>
  )
}
}

export default WorkOrder;
