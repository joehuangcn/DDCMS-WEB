import React,{Component} from 'react';
import { Button, Icon,Popconfirm,message,DatePicker,Select,Input,TreeSelect,Table,Modal } from 'antd';
import {ajaxUtil} from '../../../util/AjaxUtils';
import DataGatherRuleNew from "./DataGatherRuleNew";
const {RangePicker} = DatePicker;
const {Option} = Select;
const {Search} =Input;
// ---------------------采集规则配置----------------------------------
class DataGatherRule extends Component {
  constructor(props){
    super(props);
    this.state={
      columns:[],
      loading:false,
      data:[],
      pagination:{pageSize:10},
      id:'',
      permission:[],
    };
  }

  componentWillMount(){
    this.getInitProps(this.props);

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

  // 渲染工作
  setHead=() =>{
    const columns =[
        { title:'采集规则名', dataIndex:'ruleName' , key:'ruleName'},
        { title:'网元名称', dataIndex:'bneName' , key:'bneName'},
        { title:'业务编码', dataIndex:'bizCode' , key:'bizCode'},
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
         <Popconfirm title="你确定要删除该记录?" okText="是" cancelText="否" disabled onConfirm={() => {
           ajaxUtil("urlencoded","data-gather-rule!delDSRbyID.action","id="+record.id,this,(data,that) => {
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
    columns.push(action);
    this.setState({columns});

  }

  renderStatu=(text) =>{
    switch (text) {
      case 'L':
        return "远程文件采集方式";
        break;
        case "D":
          return "数据库连接方式";
          break;
          case "F":
            return "文件导入方式";
            break;
      default:return "";

    }
  }

  // 请求查询method
  fetch = ( params ={} ) => {
    this.setState({loading:true}) ;
    let page=0;
    if (params.page>1) {
      page=(params.page-1)*10;
    }
    const {config} = this.props;
    const {query,queryKey}=this.state;
    const text="start="+page+"&limit=10";
    ajaxUtil("urlencoded","data-gather-rule!getGatherRuleList.action",text,this,(data,that) => {
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
  refresh=() =>{
    let pagination=this.state;
    pagination.current=1;
    this.setState({pagination},()=>{this.fetch();});
  }

  handleModal= () =>{
    this.newbiz.show();
  }
  render() {
    const{bizJoinTypeList,auditTypeList}=this.state;
    return(
      <div>
      <Button type='primary' onClick={this.handleModal} disabled={this.state.addBtnPermiss}>新增</Button>
      <Button  onClick={this.refresh}><Icon type="sync" />刷新</Button>
    <Table rowKey='id' columns={this.state.columns}  loading={this.state.loading} dataSource={this.state.data}
     onChange={this.handleTableChange} pagination={this.state.pagination} size="middle"/>
    <DataGatherRuleNew ref={(ref) => this.newbiz=ref }
       refresh={()=>this.refresh()} resid={this.state.id}/>
    </div>
    );
  }

}

export default DataGatherRule;
