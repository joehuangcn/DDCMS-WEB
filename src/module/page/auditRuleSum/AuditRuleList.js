import React,{Component} from 'react'
import {Table,Menu,Form,Row,Col,Select,Button,Icon,TreeSelect,DatePicker,Dropdown,message,Modal,Popconfirm} from 'antd'
import {ajaxUtil} from '../../../util/AjaxUtils';
import UploadXls from "./UploadXls";
import AuditRuleSumNew from "./AuditRuleSumNew";
import uuid from 'node-uuid';
const FormItem=Form.Item;
const Option = Select.Option;
class AuditRuleList extends Component{
  constructor(props){
    super(props);
    this.state={
      columns:[],
      data:[],
      dynColumns:props.dynColumns,
      loading:false,
      addBtnPermiss:false,
      pagination:{},
      selectedRowKeys:[],
      bizList:[],
      permission:[],
      startDate:'',endDate:'',bizCodeParams:[],
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

  }


  getDynColumnHead =() =>{
    // console.log(dynColumns);
    const firtColumns =[
      {title: '业务代码',dataIndex: 'businessCode', key: 'businessCode',width:150},
      {title: '业务名称',dataIndex: 'businessName', key: 'businessName',width:150},
      { title: '稽核类型',dataIndex: 'auditType',key: 'auditType',width:100},
      {title: '稽核主键',dataIndex: 'auditKey',key: 'auditKey',width:150},
      {title:'差异编码',dataIndex:'differenceCode',key:'differenceCode',width:150,},
      {title:'差异分类',dataIndex:'differenceClassify',key:'differenceClassify',width:150,},
      { title: '差异影响',dataIndex: 'differenceEffect', key: 'differenceEffect',width:150},
      { title: '差异处理规则', dataIndex: 'solveRule',key: 'solveRule',width:150},
      { title: '处理方', dataIndex:'solvePerson',key: 'solvePerson',width:100},
      { title: '更新时间', dataIndex: 'updateTime',  key: 'updateTime',width:120},
      { title: '备注', dataIndex: 'comments',  key: 'comments',width:100,}
    ];
    let action ={
      title:'操作',
      key:'action',
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
         <a  style={{display:edit}} onClick = {() => {
           this.newbiz.showModal("edit",record);
         }}>修改</a>
         <span className="ant-divider"/>
         <Popconfirm title="你确定要删除该记录?" okText="是" cancelText="否" disabled onConfirm={() => {
           ajaxUtil("urlencoded","audit-rule!dellist.action","id="+record.id,this,(data,that) => {
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
     let sort='t.businesscode,t.differencecode';
     if (typeof(params.sortField) !== "undefined" ) {
       sort=params.sortField;
     }
     let dir='ASC';
     if (typeof(params.sortOrder) !== "undefined" ) {
       dir=(params.sortOrder=="descend"?"desc":"asc");
     }
    //  const {config} = this.props;
    const {startDate,endDate,bizCodeParams}=this.state;
    let choic="";
    for (var i = 0; i < bizCodeParams.length; i++) {
      choic+="&choiseCode="+bizCodeParams[i]
    }
     const text="startDate="+startDate
     +"&endDate="+endDate
     +choic
     +"&sort="+sort
     +"&dir="+dir
     +"&start="+page+"&limit=10";
     ajaxUtil("urlencoded","audit-rule!getJsonList.action",text,this,(data,that)  => {
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
     let startDate=values.startDate===undefined||values.startDate==null?'':values.startDate.format('YYYY-MM-DD');
     let endDate=values.endDate===undefined||values.endDate==null?'':values.endDate.format('YYYY-MM-DD');
     let bizCodeParams=values.bizCodeParam===undefined?'':values.bizCodeParam;
     this.setState({startDate,endDate,bizCodeParams},()=>{this.fetch()});
  })
}

handleReset=() =>{
  this.form.resetFields();
  this.setState({startDate:'',endDate:'',bizCodeParams:[]},()=>{this.fetch()});
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

 uploadMes=(e) =>{
   const {permission} = this.state;
   if (permission.indexOf('upLoad')==-1) {
     message.error("暂无该上传权限！！！！！！");
   }else {
   if (e.key==='1') {
      message.info("正在下载请稍后......");
       window.location.href="/DDCMS/file-handler!downloadAuditRuleTemplate.action";
   }else if (e.key==='2') {
      this.uploadXls.show();
   }
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
                addBtnPermiss={addBtnPermiss} handleModal={this.handleModal} uploadMes={e=>this.uploadMes(e)}/>
        <Table rowKey='id' loading={loading} rowSelection={rowSelection} columns={columns} pagination={pagination} dataSource={data}
          onChange={this.handleTableChange}  scroll={{x:'120%'}} />
          <UploadXls ref={(ref) => this.uploadXls=ref}  />
          <AuditRuleSumNew  ref={(ref) => this.newbiz=ref} refresh={this.refresh}/>
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
        <Col span={4}>
          <Row>
          <Col span={12}>
            <Button type='primary' onClick={this.props.handleModal} disabled={this.props.addBtnPermiss}>新增</Button>
          </Col>
          <Col span={12}>
            <Dropdown overlay={uploadMenu} style={{ marginLeft: 8}}>
               <Button>
                 <Icon type="file-excel" />批量导入<Icon type="down" />
               </Button>
             </Dropdown>
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
         <FormItem {...formItemLayout} label="开始时间" >
           {getFieldDecorator("startDate")(
               <DatePicker className='1111' placeholder="开始时间" style={{width:150}}/>
           )}
         </FormItem>
         </Col>
         <Col span={4} >
          <FormItem {...formItemLayout} label="结束时间">
            {getFieldDecorator("endDate")(
                <DatePicker  placeholder="结束时间" style={{width:150}}/>
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
export default AuditRuleList;
