import React,{Component} from 'react';
import { Button, Icon,Popconfirm,message,DatePicker,Select,Input,TreeSelect,Table,Modal,Form,Col,Row } from 'antd';
import {ajaxUtil} from '../../../util/AjaxUtils';

const {RangePicker} = DatePicker;
const {Option} = Select;
const {Search} =Input;
const FormItem=Form.Item;
// ---------------------采集规则配置----------应该是重复了------------------------
class FileFormatConfig extends Component {
  constructor(props){
    super(props);
    this.state={
      columns:[],
      loading:false,
      data:[],
      pagination:{pageSize:15},
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

  // 渲染工作
  setHead=() =>{
    const columns =[
        { title:'规则名称', dataIndex:'name' , key:'name',width:150},
        { title:'文件名格式', dataIndex:'fileNameStandard' , key:'fileNameStandard',width:150},
        { title:'去缀名规则', dataIndex:'removeRegulars' , key:'removeRegulars',width:150},
        { title:'去重字段', dataIndex:'removeColumns' , key:'removeColumns',width:300},
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
           ajaxUtil("urlencoded","file-format-manager!delDSRbyID.action","id="+record.id,this,(data,that) => {
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
    console.log('params',params);
    this.setState({loading:true}) ;
    let page=0;
    if (params.page>1) {
      page=(params.page-1)*15;
    }
    const {config} = this.props;
    const {query,queryKey}=this.state;
    const text="start="+page+"&limit=15";
    ajaxUtil("urlencoded","file-format-manager!getJsonListNew.action",text,this,(data,that) => {
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

    </div>
    );
  }

}

class StatSearch extends Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    const {auditTypeList, auditScopeList}=this.props;
   const formItemLayout = {
     labelCol: { span: 10 },
     wrapperCol: { span: 14 },
   };
   const cityItemLayout = {
     labelCol: { span: 7 },
     wrapperCol: { span: 7 },
   };
   return(
    <Form layout="inline"  >
       <Row gutter={4}>
       <Col span={4} >
        <FormItem {...formItemLayout} label="稽核类型">
          {getFieldDecorator("auditType")(
            <Select  placeholder="选择" style={{ width: 150 }} allowClear={true}>
              {auditTypeList.map(d=> <Option key={d.dicCode} value={d.dicCode}>{d.dicName}</Option>)}
            </Select>
          )}
        </FormItem>
        </Col>
        <Col span={4} >
         <FormItem {...formItemLayout} label="稽核范围">
           {getFieldDecorator("dataScope")(
             <Select  placeholder="选择" style={{ width: 150 }}  allowClear={true}>
               {auditScopeList.map(d=> <Option key={d.dicCode} value={d.dicCode}>{d.dicName}</Option>)}
             </Select>
           )}
         </FormItem>
         </Col>
         <Col span={4}>
          <FormItem {...formItemLayout} label="开始时间" >
            {getFieldDecorator("startTime")(
                <DatePicker  placeholder="开始时间"/>
            )}
          </FormItem>
          </Col>
          <Col span={4} >
           <FormItem {...formItemLayout} label="结束时间">
             {getFieldDecorator("endTime")(
                 <DatePicker  placeholder="结束时间" />
             )}
           </FormItem>
           </Col>
         <Col span={4}>
          <FormItem {...formItemLayout} label="任务名称">
            {getFieldDecorator("auditName")(
                <Input  placeholder="任务名称" style={{width:120}}/>
            )}
          </FormItem>
          </Col>
         <Col span={4} >
           <Button type="primary" onClick={this.props.handleSearch}>查询</Button>
           <Button style={{ marginLeft: 8 }} onClick={this.props.handleReset}> 重置</Button>
         </Col>
       </Row>
     </Form>
   );
  }
}
const SearchBut =Form.create()(StatSearch);

export default FileFormatConfig;
