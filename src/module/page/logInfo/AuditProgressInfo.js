import React,{Component} from 'react'
import {Table,Form,Row,Col,Button,Icon,DatePicker,message,Input,Select} from 'antd'
import {ajaxUtil} from '../../../util/AjaxUtils';
const FormItem=Form.Item;
const Option=Select.Option;
class AuditProgressInfo extends Component{
  constructor(props){
    super(props);
    this.state={
      columns:[],
      data:[],
      loading:false,
      pagination:{pageSize:15},
      selectedRowKeys:[],
      startTime:'',endTime:'',auditName:'',auditType:'',dataScope:'',
      permission:[],
      auditTypeList:[], auditScopeList:[],dataTypeList:[]
    }
  }

  componentWillMount(){
    this.getDynColumnHead();
    this.getAllInfoList();
  }

  componentDidMount(){
    this.fetch();
  }

  getDynColumnHead =() =>{
    // console.log(dynColumns);
    const firtColumns =[
      {title: '创建时间',dataIndex: 'createDate', key: 'createDate',width:150},
      {title: '任务状态',dataIndex: 'taskStatus', key: 'taskStatus',width:160,render:(text)=>(this.renderStatus(text))},
      { title: '流程状态',dataIndex: 'flowStatus',key: 'flowStatus',width:150,render:(text) =>(this.renderFlowStatu(text))},
      {title: '业务ID',dataIndex: 'taskId',key: 'taskId',width:150},
      {title:'业务CODE',dataIndex:'bizCode',key:'bizCode',width:200,},
      {title:'任务名称',dataIndex:'taskName',key:'taskName',width:150,render:(text)=>(this.renderRate(text))},
      {title:'数据类型',dataIndex:'dataType',key:'dataType',width:200,render:(text)=>(this.renderDataType(text))},
      {title:'稽核类型',dataIndex:'auditType',key:'auditType',width:200,render:(text)=>(this.renderauditType(text))},
      {title:'稽核范围',dataIndex:'dataScope',key:'dataScope',width:200,render:(text)=>(this.renderdataScope(text))},
    ]
    this.setState({columns:firtColumns});
  }

  getAllInfoList=() =>{
    let auditTypeList, auditScopeList,dataTypeList;
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

  renderStatus=(text) =>{
    let statu;
      switch (text) {
        case '0':
          statu="就绪"
          break;
          case '1':
            statu=<p style={{color:'#66FF00'}}>运行</p>;
            break;
          case '2':
            statu=<p style={{color:'#33CCFF'}}>结束</p>;
            break;
          case '3':
            statu=<p style={{color:'red'}}>终止</p>;
              break;
        default:
            statu=""
      }
      return statu;
  }

  renderFlowStatu =(text) =>{
    let statu;
   switch (text) {
    case '0':
      statu="初始化";break;
      case '1':
        statu="数据提取";break;
      case '2':
        statu="预处理";break;
      case '3':
        statu="配置校验";break;
      case '4':
          statu="入库"; break;
      case '5':
          statu="比对";break;
      case '6':
            statu="差异分析";break;
      case '7':
            statu="收入流失统计";break;
      case '8':
              statu="源数据清理";break;
      case '9':
              statu="导出数据";break;
      case '11':
              statu="地市差异统计";break;
    default:
        statu=""
  }
    return statu;
  }
  renderRate=(text) =>{
    if (text==="1") {
       return <span style={{color:'green'}}>成功</span>;
    }else
      return <span style={{color:'red'}} >失败</span>;
  }

  renderDataType=(text) =>{
    const {dataTypeList}=this.state;
    for (var i = 0; i < dataTypeList.length; i++) {
      if(dataTypeList[i].dicCode===text){
        return dataTypeList[i].dicName;
      }
    }
    return "";
  }
  renderauditType=(text) =>{
      const {auditTypeList}=this.state;
      for (var i = 0; i < auditTypeList.length; i++) {
        if(auditTypeList[i].dicCode===text){
          return auditTypeList[i].dicName;
        }
      }
      return "";
  }
  renderdataScope=(text)=>{
      const {auditScopeList}=this.state;
      for (var i = 0; i < auditScopeList.length; i++) {
        if(auditScopeList[i].dicCode===text){
          return auditScopeList[i].dicName;
        }
      }
      return "";
  }
  fetch = (params = {}) => {
     this.setState({loading:true});
     let page=0;
     if (params.page>1) {
       page=(params.page-1)*15;
     }
     let sort='createDate';
     if (typeof(params.sortField) !== "undefined" ) {
       sort=params.sortField;
     }
     let dir='DESC';
     if (typeof(params.sortOrder) !== "undefined" ) {
       dir=(params.sortOrder=="descend"?"desc":"asc");
     }
    //  const {config} = this.props;
    const {startTime,endTime, auditName,auditType,dataScope}=this.state;
     const text="startTime="+startTime+"&endTime="+endTime+"&auditName="+auditName
                +"&auditType="+auditType+"&dataScope="+dataScope
                +"&sort="+sort
                +"&dir="+dir
                +"&start="+page+"&limit=15";
     ajaxUtil("urlencoded","audit-process-log!list.action",text,this,(data,that)  => {
       const pagination = that.state.pagination;
       pagination.total = parseInt(data.total,10);
       this.setState({
           loading: false,
           data: data.data,
           pagination,
       });
     });
   }

  handleSearch=(e) => {
   const form= this.form;
   form.validateFields(( err, values) => {
     if (err) {
       return;
     }
     console.log(values);
    let startTime=values.startTime===undefined||values.startTime==null?'':values.startTime.format('YYYY-MM-DD');
     let endTime=values.endTime===undefined||values.endTime==null?'':values.endTime.format('YYYY-MM-DD');
      let auditName=values.auditName===undefined?'':values.auditName;
      let auditType=values.auditType===undefined?'':values.auditType;
      let dataScope=values.dataScope===undefined?'':values.dataScope;
     this.setState({startTime,endTime, auditName,auditType,dataScope},()=>{this.fetch()});
  })
}

handleReset=() =>{
  this.form.resetFields();
  this.setState({startTime:'',endTime:'', auditName:'',auditType:'',dataScope:''},()=>{this.fetch()});
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

 onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  }

  render(){
    const {columns,data,loading,pagination,selectedRowKeys,auditTypeList, auditScopeList,dataTypeList}=this.state;
    const {citys,bizList}=this.props;
    const rowSelection = {
     selectedRowKeys,
     onChange: this.onSelectChange,
      };
    return(
        <div>
        <SearchBut ref={(ref) => this.form = ref}  handleSearch={this.handleSearch}
        handleReset={this.handleReset} exportMes={e =>this.exportMes(e)} auditTypeList={auditTypeList} auditScopeList={auditScopeList}/>
        <Table rowKey='id' loading={loading} columns={columns} pagination={pagination} dataSource={data}
          onChange={this.handleTableChange} />
        </div>);
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
export default AuditProgressInfo;
