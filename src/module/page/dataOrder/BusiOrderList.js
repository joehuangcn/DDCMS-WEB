import React,{Component} from 'react';
import {ajaxUtil} from '../../../util/AjaxUtils';
import { Button, Icon,Popconfirm,message,DatePicker,Select,Input,TreeSelect,Table,Modal,Col,Row,Form} from 'antd';
import BusiNewInfo from './BusiNewInfo';
const Option = Select.Option;
const FormItem = Form.Item;
class BusiOrderList extends Component {
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
      diffTypeList:[],
      companyList:[],
      netList:[],
      busNetList:[],
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
      ajaxUtil("urlencoded","netelement!getBusiNetelem.action","bizCode="+bizCode,this,(data,that)=>{
        this.setState({netList:data.data});
      });
      ajaxUtil("urlencoded","bus-net-field!getFieldNamesByBizCode.action","bizCode="+bizCode,this,(data,that)=>{
        this.setState({busNetList:data.data});
      });
    }
  }

  getColums=()=>{
    const columns =[
        { title:'规则名称', dataIndex:'name' , key:'name'},
        { title:'关联网元', dataIndex:'netCode' , key:'netCode'},
        { title:'文件名格式', dataIndex:'fileNameStandard', key:'fileNameStandard'},
        { title:'去缀名规则', dataIndex:'removeRegulars' , key:'removeRegulars'},
        { title:'去重字段', dataIndex:'removeColumns' , key:'removeColumns'},
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
           ajaxUtil("urlencoded","file-format-manager!del.action","id="+record.id,this,(data,that) => {
             let status=data.success;
             let message= data.message;
               if (status==='true') {
                 Modal.success({ title: '消息', content: message,});
               }else {
                 Modal.error({ title: '消息',content: message,
                });
               }
              this.fetch();
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
    // ajaxUtil("urlencoded","dictionaryAction!getDictionaryListByType.action","name=DICT_AuditType",this,(data,that)=>{
    //   this.setState({auditTypeList:data.data});
    // });
    ajaxUtil("urlencoded","dictionaryAction!getDictionaryListByType.action","name=DICT_DataScope",this,(data,that)=>{
      this.setState({auditScopeList:data.data});
    });
    // ajaxUtil("urlencoded","dictionaryAction!getDictionaryListByType.action","name=DICT_DataType",this,(data,that)=>{
    //   this.setState({dataTypeList:data.data});
    // });
    // ajaxUtil("urlencoded","dictionaryAction!getDictionaryListByType.action","name=DICT_DiffType",this,(data,that)=>{
    //   this.setState({diffTypeList:data.data});
    // });
    // ajaxUtil("urlencoded","dictionaryAction!getDictionaryListByType.action","name=DICT_HANDCOMPANY",this,(data,that)=>{
    //   this.setState({companyList:data.data});
    // });
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
    let sort='name';
    if (typeof(params.sortField) !== "undefined" ) {
      sort=params.sortField;
    }
    let dir='ASC';
    if (typeof(params.sortOrder) !== "undefined" ) {
      dir=(params.sortOrder=="descend"?"desc":"asc");
    }
    const {auditType,dataScope}=this.state;
    const text="bizCode="+(bizCode==undefined?"":bizCode)
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
        ajaxUtil("urlencoded","file-format-manager!getJsonList.action",text,this,(data,that) => {
          const pagination = that.state.pagination;
          pagination.total = parseInt(data.totalProperty,10);
          this.setState({
              loading: false,
              data: data.root,
              pagination,
          });
        });
  }
  }
  handleModal= () =>{
    this.newbiz.show();
  }



  render(){
      const {auditScopeList,netList,busNetList} =this.state;
    return (
      <div>
      <Button type='primary' onClick={this.handleModal} disabled={this.state.addBtnPermiss}>新增</Button>
      <Button  onClick={this.fetch}><Icon type="sync" />刷新</Button>
      <Table rowKey="id" columns={this.state.columns}  loading={this.state.loading} dataSource={this.state.data}
      pagination={this.state.pagination} onChange={this.handleTableChange}  size="middle" />
      <BusiNewInfo ref={(ref) => this.newbiz=ref }  bizCode={this.state.bizCode}
          auditScopeList={auditScopeList}
          netList={netList} busNetList={busNetList} refresh={()=>this.fetch()} />
      </div>
    );
  }
}
export default BusiOrderList;
