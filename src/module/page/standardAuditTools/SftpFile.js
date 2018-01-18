import React,{Component} from 'react'
import {Table,Menu,Form,Row,Col,Select,Button,Icon,TreeSelect,DatePicker,Dropdown,message,Modal,Popconfirm,Input} from 'antd'
import {ajaxUtil} from '../../../util/AjaxUtils';
import AuditStoreUpload from "./AuditStoreUpload";
import SftpFileNew from "./SftpFileNew";
import uuid from 'node-uuid';
const FormItem=Form.Item;
const Option = Select.Option;
class SftpFile extends Component {
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

renderStatus=(value,record)=>{
    if (value==='') {
      return value;
    }else {
      let values=value.split(",");
      let rendsome=[];
      let split=<span className="ant-divider"/>;
      for (var i = 0; i < values.length; i++) {
            let mes=values[i];
          let dow=<a className={values[i]} key={uuid.v1()} onClick={()=> {this.downloadFile(mes,record.listnumber)}}>下载 </a>;
        let del= <Popconfirm key={uuid.v1()} title="你确定要删除该条记录?" okText="是" cancelText="否" onConfirm={() => {
            ajaxUtil("urlencoded","sftpfile!del.action","downlistnumber="+record.listnumber+"&filename="+mes,this,(data,that) => {
               this.fetch();
                  })
                  }}>
              <a>删除</a>
          </Popconfirm>;
          rendsome.push(values[i]);
          rendsome.push(dow);
          rendsome.push(del);
          rendsome.push(<span key={uuid.v1()} className="ant-divider"/>);
      }
      // rendsome+="</div>";
      return <div>{rendsome}</div>;
    }
  }

  downloadFile=(value,listnumber) =>{
    let text="downlistnumber="+listnumber+"&filename="+value;
    console.log("vlaue---downloadfile",text);
    window.location.href="/DDCMS/sftpfile!download.action?"+text;
  }

  getDynColumnHead =() =>{
    // console.log(dynColumns);
    const firtColumns =[
      {title: '需求管理系统单号',dataIndex: 'listnumber', key: 'listnumber',width:150},
      {title: '标题',dataIndex: 'headline', key: 'headline',width:150},
      { title: '所属系统',dataIndex: 'sys',key: 'sys',width:100},
      {title: '创建用户',dataIndex: 'username',key: 'username',width:150},
      {title:'数据量',dataIndex:'datasize',key:'datasize',width:150,},
      {title:'局方负责人',dataIndex:'jufang',key:'jufang',width:150,},
      { title: '厂商负责人',dataIndex: 'changjia', key: 'changjia',width:150,},
      { title: '创建时间', dataIndex:'uploadtime',key: 'uploadtime',width:100},
      { title: '文件管理', dataIndex: 'filename',  key: 'filename',width:300,render:(text,record)=>(this.renderStatus(text,record))},
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
           ajaxUtil("urlencoded","sftpfile!dellist.action","id="+record.filename+"&id1="+record.listnumber,this,(data,that) => {
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
      {title:'内容描述',dataIndex:'comments',key:'comments',width:150,}
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
     let sort='sftpfile.uploadtime';
     if (typeof(params.sortField) !== "undefined" ) {
       sort=params.sortField;
     }
     let dir='DESC';
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
     ajaxUtil("urlencoded","sftpfile!getJsonList.action",text,this,(data,that)  => {
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

// exportMes=(e)=>{
//   console.log(e);
//    const {config,permission} = this.state;
//    let synId='';
//    let downflag='';
//    const {query,startDate,endDate,queryKey}=this.state;
//    let text="startDate="+startDate
//    +"&endDate="+endDate
//    +"&query="+query
//    +"&queryKey="+queryKey
//    if (e.key==='1') {
//      if (this.state.selectedRowKeys.length<=0) {
//         message.warning("请选择需要导出的列");
//      }else{
//        text+="&flag=selected&ids="+this.state.selectedRowKeys;
//       //  this.help(text);
//        window.location.href="/DDCMS/ftp-audit-store-manage!loadXLS.action?"+text;
//      }
//    }else if (e.key==='2') {
//       text+="&flag=all&ids=";
//       // this.help(text);
//       window.location.href="/DDCMS/ftp-audit-store-manage!loadXLS.action?"+text;
//    }
//  }


 exportMes=(e)=>{
    const {config,permission} = this.state;
    let synId='';
    let downflag='';
    const {query,startDate,endDate,queryKey}=this.state;
    let text="startDate="+startDate
    +"&endDate="+endDate
    +"&query="+query
    +"&queryKey="+queryKey;
    if (permission.indexOf('export')==-1) {
      message.error("暂无该导出权限！！！！！！");
    }else{
       // this.help(text);
       window.location.href="/DDCMS/sftpfile!loadXLS.action?"+text;
    }
  }

 uploadMes=(e) =>{
   const {permission} = this.state;
   if (permission.indexOf('upLoad')==-1) {
     message.error("暂无该上传权限！！！！！！");
   }else {
   if (e.key==='1') {
      message.info("正在下载请稍后......");
       window.location.href="/DDCMS/file-handler!downSftpUploadDemo.action";
   }else if (e.key==='2') {
      this.uploadXls.show("sftpfile!batchuploadAfterUp.action");
   }
 }
 }

 // uploadMes=(e) =>{
 //   const {permission} = this.state;
 //   if (permission.indexOf('upLoad')==-1) {
 //     message.error("暂无该上传权限！！！！！！");
 //   }else {
 //   if (e.key==='1') {
 //      message.info("正在下载请稍后......");
 //       window.location.href="/DDCMS/file-handler!downSftpUploadDemo.action";
 //   }else if (e.key==='2') {
 //      this.uploadXls.show("sftpfile!loadXLS.action");
 //   }
 // }
 // }

 onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
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
        <Table rowKey={() =>uuid.v1()} loading={loading} rowSelection={rowSelection} columns={columns} pagination={pagination} dataSource={data}
          onChange={this.handleTableChange}  expandedRowRender={this.expandedRowRender}  scroll={{x:'120%'}} />
          <AuditStoreUpload ref={(ref) => this.uploadXls=ref}/>
          <SftpFileNew  ref={(ref) => this.newbiz=ref} refresh={this.refresh}/>
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
                 <Option value="listnumber">单号</Option>
                 <Option value="jufang">局方负责人</Option>
                 <Option value="handlers">创建用户</Option>
                 <Option value="filename">文件名</Option>
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
export default SftpFile;
