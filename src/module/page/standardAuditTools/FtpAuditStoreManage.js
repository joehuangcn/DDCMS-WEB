import React,{Component} from 'react'
import {Table,Menu,Form,Row,Col,Select,Button,Icon,TreeSelect,DatePicker,Dropdown,message,Modal,Popconfirm,Input} from 'antd'
import {ajaxUtil} from '../../../util/AjaxUtils';
import AuditStoreUpload from "./AuditStoreUpload";
import FtpAuditStoreNew from "./FtpAuditStoreNew";
import uuid from 'node-uuid';
const FormItem=Form.Item;
const Option = Select.Option;
class FtpAuditStoreManage extends Component {
  constructor(props){
    super(props);
    this.state={
      columns:[],
      data:[],
      secondColumns:[],
      loading:false,
      addBtnPermiss:false,
      pagination:{},
      selectedRowKeys:[],
      bizList:[],
      permission:[],
      startDate:'',endDate:'',query:'',queryKey:'',bizCodeParams:[],
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

  }

renderStatus=(value)=>{
  switch (value) {
    case "0":
        return '删除';
    case "1":
        return '在用';
    default:
        return "";
    }
}
  getDynColumnHead =() =>{
    // console.log(dynColumns);
    const firtColumns =[
      {title: '稽核项编码',dataIndex: 'auditId', key: 'auditId',width:150},
      {title: '稽核业务',dataIndex: 'auditName', key: 'auditName',width:150},
      { title: '稽核方式',dataIndex: 'auditWay',key: 'auditWay',width:100},
      {title: '厂家负责人',dataIndex: 'changjia',key: 'changjia',width:150},
      {title:'开始时间',dataIndex:'startTime',key:'startTime',width:150,},
      {title:'稽核频次',dataIndex:'auditRate',key:'auditRate',width:150,},
      { title: '状态',dataIndex: 'status', key: 'status',width:150,render:(text)=>(this.renderStatus(text))},
      { title: '失效时间', dataIndex: 'invalidTime',key: 'invalidTime',width:150},
      { title: '稽核原因', dataIndex:'auditReason',key: 'auditReason',width:100},
      { title: '局方负责人', dataIndex: 'jufang',  key: 'jufang',width:120},
      { title: '执行时间', dataIndex: 'executeTime',  key: 'executeTime',width:120,},
      { title: '更新时间', dataIndex: 'uploadTime',  key: 'uploadTime',width:100,}
    ];
    let action ={
      title:'操作',
      key:'action',
      width:120,
      fixed: 'right',
      render : (text, record) => {
        let permission=this.state.permission;
        let edit='inline';let deletes='inline';
        let activeDis=false; let activeColor="green";
        if(permission.indexOf('edit')===-1){
            edit='none'
        }
        if (permission.indexOf('del')===-1){
          deletes='none'
        }
        return(
        <span>
         <a  style={{display:edit}} onClick = {() => {
           this.newbiz.showModal("edit",record);
         }}>修改</a>
         <span className="ant-divider"/>
         <Popconfirm title="你确定要删除该记录?" okText="是" cancelText="否" disabled onConfirm={() => {
           ajaxUtil("urlencoded","ftp-audit-store-manage!dellist.action","id="+record.auditId+"&id1="+record.num,this,(data,that) => {
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
    const secondColumns =[
      { title: '脚本路径',dataIndex: 'path',key: 'path',width:100},
      {title: '执行命令',dataIndex: 'executeOrder',key: 'executeOrder',width:150},
      {title:'备注',dataIndex:'tips',key:'tips',width:150,},
      {title:'内容描述',dataIndex:'contents',key:'contents',width:150,}
    ];
    this.setState({
      columns:firtColumns,
      secondColumns:secondColumns
    });
  }

  expandedRowRender=(record)=>{
    const {secondColumns}=this.state;
    const data=[];
    data.push(record);
    return (
      <Table  rowKey={() =>uuid.v1()}
      columns={secondColumns}
       dataSource={data}
       pagination={false}
       />
    )
  }


  fetch = (params = {}) => {
     this.setState({loading:true});
     let page=0;
     if (params.page>1) {
       page=(params.page-1)*10;
     }
     let sort='t.auditId';
     if (typeof(params.sortField) !== "undefined" ) {
       sort=params.sortField;
     }
     let dir='ASC';
     if (typeof(params.sortOrder) !== "undefined" ) {
       dir=(params.sortOrder=="descend"?"desc":"asc");
     }
    //  const {config} = this.props;
    const {startDate,endDate,query,queryKey}=this.state;
     const text="startDate="+startDate
     +"&endDate="+endDate
     +"&query="+query
     +"&queryKey="+queryKey
     +"&sort="+sort
     +"&dir="+dir
     +"&start="+page+"&limit=10";
     ajaxUtil("urlencoded","ftp-audit-store-manage!getJsonList.action",text,this,(data,that)  => {
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
     let startDate=values.startDate===undefined||values.startDate==null?'':values.startDate.format('YYYY-MM-DD');
     let endDate=values.endDate===undefined||values.endDate==null?'':values.endDate.format('YYYY-MM-DD');
     let query=values.query===undefined?'':values.query;
     let queryKey=values.queryKey===undefined?'':values.queryKey;
     this.setState({startDate,endDate,query,queryKey},()=>{this.fetch()});
  })
}

handleReset=() =>{
  this.form.resetFields();
  this.setState({startDate:'',endDate:'',query:'',queryKey:''},()=>{this.fetch()});
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
   const {config,permission} = this.state;
   let synId='';
   let downflag='';
   const {query,startDate,endDate,queryKey}=this.state;
   let text="startDate="+startDate
   +"&endDate="+endDate
   +"&query="+query
   +"&queryKey="+queryKey
   if (e.key==='1') {
     if (this.state.selectedRowKeys.length<=0) {
        message.warning("请选择需要导出的列");
     }else{
       text+="&flag=selected&ids="+this.state.selectedRowKeys;
      //  this.help(text);
       window.location.href="/DDCMS/ftp-audit-store-manage!loadXLS.action?"+text;
     }
   }else if (e.key==='2') {
      text+="&flag=all&ids=";
      // this.help(text);
      window.location.href="/DDCMS/ftp-audit-store-manage!loadXLS.action?"+text;
   }
 }

 uploadMes=(e) =>{
   const {permission} = this.state;
   if (permission.indexOf('upLoad')==-1) {
     message.error("暂无该上传权限！！！！！！");
   }else {
   if (e.key==='1') {
      message.info("正在下载请稍后......");
       window.location.href="/DDCMS/file-handler!downloadAuditStoreTemplate.action";
   }else if (e.key==='2') {
      this.uploadXls.show("ftp-audit-store-manage!batchuploadAfterUp.action");
   }
 }
 }

 onSelectChange = (selectedRowKeys) => {

    this.setState({ selectedRowKeys });
  }
  // 打开新建窗口
  handleModal= () => {
    this.newbiz.show();
  }

  render(){
    const {columns,data,loading,pagination,selectedRowKeys,addBtnPermiss}=this.state;
    const rowSelection = {
     selectedRowKeys,
     onChange: this.onSelectChange,
      };
    return(
        <div>
          <SearchBut ref={(ref) => this.form = ref}   handleSearch={this.handleSearch}
                handleReset={this.handleReset} exportMes={e =>this.exportMes(e)} permission={this.state.permission}
                addBtnPermiss={addBtnPermiss} handleModal={this.handleModal} uploadMes={e=>this.uploadMes(e)}/>
        <Table rowKey='num' loading={loading} rowSelection={rowSelection} columns={columns} pagination={pagination} dataSource={data}
          onChange={this.handleTableChange}  expandedRowRender={this.expandedRowRender}  scroll={{x:'120%'}} />
          <AuditStoreUpload ref={(ref) => this.uploadXls=ref}/>
          <FtpAuditStoreNew  ref={(ref) => this.newbiz=ref} refresh={this.refresh}/>
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
   const menu = (
      <Menu onClick={this.props.exportMes}>
        <Menu.Item key="1">导出选中</Menu.Item>
        <Menu.Item key="2">导出全部</Menu.Item>
      </Menu>
      );
  const uploadMenu = (
      <Menu onClick={this.props.uploadMes}>
        <Menu.Item key="1">模板下载</Menu.Item>
        <Menu.Item key="2">批量导入</Menu.Item>
      </Menu>
      );
   return(
    <Form layout="inline"  >
       <Row gutter={4}>
          <Col span={2}>
            <Button type='primary' onClick={this.props.handleModal} disabled={this.props.addBtnPermiss}>新增</Button>
          </Col>
          <Col span={2}>
            <Dropdown overlay={uploadMenu} >
               <Button>
                 <Icon type="file-excel" />批量导入<Icon type="down" />
               </Button>
             </Dropdown>
        </Col>
        <Col span={4}>
         <FormItem {...formItemLayout} label="开始时间" >
           {getFieldDecorator("startDate")(
               <DatePicker className='1111' placeholder="开始时间" style={{width:150,marginLeft: 8}}/>
           )}
         </FormItem>
         </Col>
         <Col span={4}>
          <FormItem {...formItemLayout} label="结束时间">
            {getFieldDecorator("endDate")(
                <DatePicker  placeholder="结束时间" style={{width:150,marginLeft: 8}}/>
            )}
          </FormItem>
          </Col>
          <Col span={3} >
           <FormItem {...formItemLayout} label="">
             {getFieldDecorator("query")(
               <Select style={{ width: 150,marginLeft: 8 }} allowClear placeholder="选择查询字段">
                 <Option value="auditId">稽核项编码</Option>
                 <Option value="auditName">稽核业务名称</Option>
                 <Option value="auditWay">稽核方式</Option>
                 <Option value="changjia">厂家负责人</Option>
                 <Option value="jufang">局方负责人</Option>
                 <Option value="auditReason">稽核原因</Option>
               </Select>
             )}
           </FormItem>
           </Col>
           <Col span={3} >
            <FormItem {...formItemLayout} label="">
              {getFieldDecorator("queryKey")(
                <Input
                  placeholder="输入查询值"
                  style={{ width: 150 }} />
              )}
            </FormItem>
            </Col>
         <Col span={6} style={{ textAlign: 'right',}} >
           <Button type="primary" onClick={this.props.handleSearch}>查询</Button>
           <Button style={{ marginLeft: 8 }} onClick={this.props.handleReset}> 重置</Button>
           <div style={{display:expBtnPermiss}}>
           <Dropdown overlay={menu} style={{ marginLeft: 16}}>
              <Button>
                <Icon type="file-excel" />导出<Icon type="down" />
              </Button>
            </Dropdown>
            </div>
         </Col>
       </Row>
     </Form>
   );
  }
}
const SearchBut =Form.create()(StatSearch);
export default FtpAuditStoreManage;
