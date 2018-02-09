import React,{Component} from 'react';
import {ajaxUtil} from '../../../util/AjaxUtils';
import { Button, Icon,Popconfirm,message,DatePicker,Select,Input,TreeSelect,Table,Modal,Col,Row,Form} from 'antd';
import FtpMgNewInfo from './FtpMgNewInfo';
const Option = Select.Option;
const FormItem = Form.Item;
class FtpSetList extends Component {
  constructor(props) {
    super(props);
    this.state={
      columns:[],
      pagination:{},
      loading:false,
      data:[],
      bizCode:props.bizCode,
      auditTypeList:[],
      auditScopeList:[],
      dataTypeList:[],
      netList:[]
    }
  }

  componentWillMount(){
    this.getColums();
    this.getConditionList();
  }

  componentWillReceiveProps(nextProps) {
    const {bizCode}=nextProps;
    if (bizCode!==this.state.bizCode) {
      this.fetch({bizCode:bizCode});
      this.getBusNet(bizCode);
    }
  }

  getColums=()=>{
    const columns =[
        { title:'稽核类型', dataIndex:'auditTypeName' , key:'auditTypeName'},
        { title:'稽核范围', dataIndex:'dataScopeName' , key:'dataScopeName'},
        { title:'同步平台', dataIndex:'netCode', key:'netCode'},
        { title:'IP地址', dataIndex:'ip' , key:'ip'},
        { title:'端口', dataIndex:'port' , key:'port'},
        { title:'同步路径', dataIndex:'upDir' , key:'upDir'},
    ];
    let action ={
      title:'操作',
      key:'action',
      render : (text, record) => {
        let permission=this.props.permission;
        let edit='true';let start='true';let deletes='true';
        let activeDis=false; let activeColor="green";
        if(permission.indexOf('edit')===-1){
            edit='none'
        }
        if (permission.indexOf('del')===-1) {
          deletes='none'
        }
        // if((record.taskType=='task_fix'&& record.taskStatu!=="3")|| record.taskStatu=="1"){
        //     activeDis=true;
        //     activeColor="grey";
        // }
        return(
        <span>
         <a  style={{display:edit}} onClick = {() => {
           this.newbiz.showModal("edit",record);
         }}>修改</a>
         <span className="ant-divider"/>
         <Popconfirm title="你确定要删除该配置项?" okText="是" cancelText="否" disabled onConfirm={() => {

           ajaxUtil("urlencoded","ftp-config!delConfig.action","cId="+record.configId,this,(data,that) => {
             let status=data.success;
             let message= data.message;
               if (status==='true') {
                 Modal.success({ title: '消息', content: message,});
               }else {
                 Modal.error({ title: '消息',content: message,
                });
               }
              this.reflash();
           })

         }}>
         <a style={{color:'red',display:deletes}}>删除</a>
         </Popconfirm>
        </span>
      )
      },
    };
    columns.push(action);
    this.setState({columns});

  }

  getConditionList =() =>{
    ajaxUtil("urlencoded","dictionaryAction!getDictionaryListByType.action","name=DICT_AuditType",this,(data,that)=>{
      this.setState({auditTypeList:data.data});
    });
    ajaxUtil("urlencoded","dictionaryAction!getDictionaryListByType.action","name=DICT_DataScope",this,(data,that)=>{
      this.setState({auditScopeList:data.data});
    });
    ajaxUtil("urlencoded","dictionaryAction!getDictionaryListByType.action","name=DICT_DataType",this,(data,that)=>{
      this.setState({dataTypeList:data.data});
    });
  }

  getBusNet=(bizCode) =>{
    ajaxUtil("urlencoded","business!findRelatNet.action","bizCode="+bizCode,this,(data,that)=>{
      this.setState({netList:data.data});
    });
  }

  handleAuditTypeChange=(value) =>{
    this.setState({auditType:value},()=>{this.fetch()});
  }
  handleAuditScopeChange=(value) =>{
    this.setState({dataScope:value},()=>{this.fetch()});
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
  // 请求查询method
  fetch = ( params ={} ) => {
    this.setState({loading:true});
    let bizCode="";
    if (params.bizCode!==undefined) {
      bizCode=params.bizCode;
      this.setState({bizCode:params.bizCode });
    }else{
      bizCode=this.props.bizCode;
    }
    let page=0;
    if (params.page>1) {
      page=(params.page-1)*10;
    }
    let sort='config.configId';
    if (typeof(params.sortField) !== "undefined" ) {
      sort=params.sortField;
    }
    let dir='ASC';
    if (typeof(params.sortOrder) !== "undefined" ) {
      dir=(params.sortOrder=="descend"?"desc":"asc");
    }
    const {auditType,dataScope}=this.state;
    const text="bizCode="+(bizCode==undefined?"":bizCode)
    +"&auditType="+(auditType==undefined?"":auditType)
    +"&dataScope="+(dataScope==undefined?"":dataScope)
    +"&dir="+dir
    +"&sort="+sort
    +"&start="+page+"&limit=10";
    if (bizCode===undefined||bizCode==='') {
      this.setState({
          loading: false,
          data: [],
          pagination:{}
      });
    }else{
        ajaxUtil("urlencoded","ftp-config!getConfigJsonList.action",text,this,(data,that) => {
          const pagination = that.state.pagination;
          pagination.total = parseInt(data.total,10);
          this.setState({
              loading: false,
              data: data.data,
              pagination,
          });
        });
  }
  }
  handleModal= () =>{
    const {bizCode}=this.state;
    if (bizCode==='') {
        message.error("请先选择业务！！！");
    }else{
    this.newbiz.show();
    }
  }

  render(){
      const {auditTypeList,auditScopeList,dataTypeList,netList} =this.state;
    return (
      <div>
      <Button type='primary' onClick={this.handleModal} disabled={this.props.addBtnPermiss}>新增</Button>
      <Button  onClick={this.fetch}><Icon type="sync" />刷新</Button>
      <Select  placeholder="稽核类型" style={{ width: 120, textAlign: 'right'  }} onChange={this.handleAuditTypeChange} allowClear={true}>
        {auditTypeList.map(d=> <Option key={d.dicCode} value={d.dicCode}>{d.dicName}</Option>)}
      </Select>
      <Select  placeholder="稽核范围" style={{ width: 120 , textAlign: 'right' }} onChange={this.handleAuditScopeChange} allowClear={true}>
        {auditScopeList.map(d=> <Option key={d.dicCode} value={d.dicCode}>{d.dicName}</Option>)}
      </Select>
      <Table rowKey="configId" columns={this.state.columns}  loading={this.state.loading} dataSource={this.state.data}
      pagination={this.state.pagination} onChange={this.handleTableChange} />
      <FtpMgNewInfo ref={(ref) => this.newbiz=ref }  bizCode={this.state.bizCode} auditTypeList={auditTypeList}
          auditScopeList={auditScopeList} dataTypeList={dataTypeList} netList={netList}  refresh={()=>this.fetch()}/>
      </div>
    );
  }
}
export default FtpSetList;
