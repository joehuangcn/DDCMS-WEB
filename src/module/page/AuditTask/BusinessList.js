import React,{Component} from 'react';
import { Button, Icon,Popconfirm,message,DatePicker,Select,Input,TreeSelect,Table,Modal } from 'antd';
import {ajaxUtil} from '../../../util/AjaxUtils';
import BusinessNewInfo from './BusinessNewInfo';
const {RangePicker} = DatePicker;
const {Option} = Select;
const {Search} =Input;

class BusinessList extends Component {
  constructor(props){
    super(props);
    this.state={
      columns:[],
      loading:false,
      data:[],
      pagination:{},
      id:'',
      permission:[],
      bizJoinTypeList:[],
      auditTypeList:[],
      query:'',
      queryKey:'',
    };
  }

  componentWillMount(){
    this.getInitProps(this.props);
    this.getConditionList();
  }

  componentDidMount(){
    this.setHead();
    this.fetch();
    // this.timer=setInterval(()=>{this.reflash()},5000);
    // this.fetch();
  }
  // 初始化
  getInitProps=(props)=>{
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

   getConditionList =() =>{
     ajaxUtil("urlencoded","dictionaryAction!getDictionaryListByType.action","name=DICT_BizJoinType",this,(data,that)=>{
       this.setState({bizJoinTypeList:data.data});
     });
     ajaxUtil("urlencoded","dictionaryAction!getDictionaryListByType.action","name=DICT_AuditType",this,(data,that)=>{
       this.setState({auditTypeList:data.data});
     });
   }
  // 渲染工作
  setHead=() =>{
    const columns =[
        { title:'业务名称', dataIndex:'bizName' , key:'bizName',sorter: true},
        { title:'业务编码', dataIndex:'bizCode' , key:'bizCode',},
        { title:'业务范围', dataIndex:'bizScope' ,sorter: true, key:'bizScope'},
        { title:'业务资费', dataIndex:'tariff' , key:'tariff',},
        { title:'接入类型', dataIndex:'joinType' , key:'joinType',},
        { title:'业务描述', dataIndex:'des' , key:'des',},
        { title:'业务状态', dataIndex:'statu' , key:'statu',render:(text) =>(this.renderStatu(text))},
    ];


    let action ={
      title:'操作',
      key:'action',
      render : (text, record) => {
        let permission=this.state.permission;
        let edit='true';let start='true';let deletes='true';
        let activeDis=false; let activeColor="green";
        if(permission.indexOf('edit')===-1){
            edit='none'
        }
        if (permission.indexOf('add')===-1) {
          start='none'
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
         <Popconfirm title="你确定要删除该业务?" okText="是" cancelText="否" disabled onConfirm={() => {
           ajaxUtil("urlencoded","business!del.action","id="+record.bizCode+"&resid="+this.state.id,this,(data,that) => {
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

  renderStatu=(text) =>{
    if (text==='0') {
      return(<p style={{color:'red'}}>无效</p>)
    }else{
        return (<p style={{color:'green'}}>有效</p>)
    }
  }

  // 请求查询method
  fetch = ( params ={} ) => {
    this.setState({loading:true}) ;
    let page=0;
    if (params.page>1) {
      page=(params.page-1)*10;
    }
    let sort='bizCode';
    if (typeof(params.sortField) !== "undefined" ) {
      sort=params.sortField;
    }
    let dir='ASC';
    if (typeof(params.sortOrder) !== "undefined" ) {
      dir=(params.sortOrder=="descend"?"desc":"asc");
    }
    const {config} = this.props;
    const {query,queryKey}=this.state;
    const text="query="+(query==undefined?"":query)
    +"&queryKey="+(queryKey==undefined?"":queryKey)
    +"&dir="+dir
    +"&sort="+sort
    +"&start="+page+"&limit=10";

    ajaxUtil("urlencoded","business!getJsonList.action",text,this,(data,that) => {
      const pagination = that.state.pagination;
      pagination.total = parseInt(data.total,10);
      this.setState({
          loading: false,
          data: data.data,
          pagination,
      });
    });
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
  reflash=() =>{
    this.fetch();
    let pagination=this.state;
    pagination.current=1;
    this.setState({pagination});
  }

  handleModal= () =>{
    this.newbiz.show();
  }
  handelSeChange=(value) =>{
    this.setState({queryKey:value});
  }
  handleSearch=(value) =>{
    this.setState({query:value},()=>{
      this.fetch()
    });
    // this.fetch();
    }

  render() {
    const{bizJoinTypeList,auditTypeList}=this.state;
    return(
      <div>
      <Button type='primary' onClick={this.handleModal} disabled={this.state.addBtnPermiss}>新增</Button>
      <Button  onClick={this.reflash}><Icon type="sync" />刷新</Button>
      <Select placeholder="条件选择" style={{ width: 120 }} onChange={this.handelSeChange} allowClear={true}>
          <Option value="bizName">业务名称</Option>
          <Option value="bizCode">业务编码</Option>
          <Option value="bizScope">业务范围</Option>
          <Option value="joinType">接入类型</Option>
      </Select>
     <Search
      placeholder="输入查询值"
      style={{ width: 140 }}
      onSearch={this.handleSearch} />
    <Table rowKey='bizCode' columns={this.state.columns}  loading={this.state.loading} dataSource={this.state.data}
     onChange={this.handleTableChange} pagination={this.state.pagination} size="middle"/>
    <BusinessNewInfo ref={(ref) => this.newbiz=ref }  bizCode={this.state.bizCode} bizJoinTypeList={bizJoinTypeList} auditTypeList={auditTypeList}
       refresh={()=>this.fetch()} />
    </div>
    );
  }

}

export default BusinessList;
