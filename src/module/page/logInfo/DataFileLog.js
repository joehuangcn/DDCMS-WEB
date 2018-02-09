import React,{Component} from 'react'
import {Table,Form,Row,Col,Button,Icon,DatePicker,message,Input,Select} from 'antd'
import {ajaxUtil} from '../../../util/AjaxUtils';
import uuid from 'node-uuid';
const FormItem=Form.Item;
const Option=Select.Option;
class ActionLogInfo extends Component{
  constructor(props){
    super(props);
    this.state={
      columns:[],
      data:[],
      loading:false,
      pagination:{pageSize:15},
      selectedRowKeys:[],
      optTime:'',userName:'',
      queryKey:'',query:'',
      permission:[],
    }
  }

  componentWillMount(){
    this.getDynColumnHead();
  }

  componentDidMount(){
    this.fetch();
  }

  getDynColumnHead =() =>{

    const firtColumns =[
      {title: '创建时间',dataIndex: 'createDate', key: 'createDate',width:160},
      {title: '文件名',dataIndex: 'fileName',key: 'fileName',width:300},
      {title:'业务代码',dataIndex:'code',key:'code',width:150,}
    ]
    this.setState({columns:firtColumns});
  }

  renderRate=(text) =>{
    if (text==="1") {
       return <span style={{color:'green'}}>成功</span>;
    }else
      return <span style={{color:'red'}} >失败</span>;
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
    const {queryKey,query}=this.state;
     const text="query="+query
                +"&queryKey="+queryKey
                +"&sort="+sort
                +"&dir="+dir
                +"&start="+page+"&limit=15";
     ajaxUtil("urlencoded","data-file-log!list.action",text,this,(data,that)  => {
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

     let query=values.query===undefined?"":values.query;
     let queryKey=values.queryKey===undefined?'':values.queryKey;
     this.setState({query,queryKey},()=>{this.fetch()});
  })
}

handleReset=() =>{
  this.form.resetFields();
  this.setState({query:'',queryKey:''},()=>{this.fetch()});
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
    this.setState({ selectedRowKeys });
  }

  render(){
    const {columns,data,loading,pagination,selectedRowKeys}=this.state;
    const rowSelection = {
     selectedRowKeys,
     onChange: this.onSelectChange,
      };
    return(
        <div>
        <SearchBut ref={(ref) => this.form = ref}  handleSearch={this.handleSearch}
        handleReset={this.handleReset} exportMes={e =>this.exportMes(e)} />
        <Table rowKey={()=>(uuid.v1())} loading={loading}  columns={columns} pagination={pagination} dataSource={data}
          onChange={this.handleTableChange} />
        </div>);
  }
}
class StatSearch extends Component {
  render() {
    const { getFieldDecorator } = this.props.form;

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
        <Col span={6}>
         <FormItem {...formItemLayout} label="查询选项" >
           {getFieldDecorator("queryKey")(
             <Select  placeholder="选择类型" style={{ width: 120 }} allowClear={true}>
             <Option key="fileName" value="fileName">文件名称</Option>
             </Select>
           )}
         </FormItem>
         </Col>
         <Col span={6}>
          <FormItem {...formItemLayout} label="查询值">
            {getFieldDecorator("query")(
                <Input  placeholder="查询值" style={{width:150}}/>
            )}
          </FormItem>
          </Col>
         <Col span={6} >
           <Button type="primary" onClick={this.props.handleSearch}>查询</Button>
           <Button style={{ marginLeft: 8 }} onClick={this.props.handleReset}> 重置</Button>
         </Col>
       </Row>
     </Form>
   );
  }
}
const SearchBut =Form.create()(StatSearch);
export default ActionLogInfo;
