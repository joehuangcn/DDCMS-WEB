import React,{Component} from 'react'
import {Table,Form,Row,Col,Button,Icon,DatePicker,message,Input} from 'antd'
import {ajaxUtil} from '../../../util/AjaxUtils';
const FormItem=Form.Item;
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
      {title: '操作人',dataIndex: 'optname', key: 'optname',width:150},
      {title: '操作时间',dataIndex: 'operateTime', key: 'operateTime',width:160},
      { title: 'IP',dataIndex: 'optip',key: 'optip',width:100},
      {title: '日志信息',dataIndex: 'opperlog',key: 'opperlog',width:150},
      {title:'请求参数',dataIndex:'params',key:'params',width:300,},
      {title:'操作结果',dataIndex:'optresult',key:'optresult',width:150,render:(text)=>(this.renderRate(text))},
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
     let sort='optLog.operateTime';
     if (typeof(params.sortField) !== "undefined" ) {
       sort=params.sortField;
     }
     let dir='DESC';
     if (typeof(params.sortOrder) !== "undefined" ) {
       dir=(params.sortOrder=="descend"?"desc":"asc");
     }
    //  const {config} = this.props;
    const {optTime,userName}=this.state;
     const text="optTime="+optTime
                +"&userName="+userName
                +"&sort="+sort
                +"&dir="+dir
                +"&start="+page+"&limit=15";
     ajaxUtil("urlencoded","optlog!getoptLogList.action",text,this,(data,that)  => {
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
     let optTime=values.optTime===undefined||values.optTime==null?'':values.optTime.format('YYYY-MM-DD');
     let userName=values.userName===undefined?'':values.userName;
     this.setState({optTime,userName},()=>{this.fetch()});
  })
}

handleReset=() =>{
  this.form.resetFields();
  this.setState({optTime:'',userName:''},()=>{this.fetch()});
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
    const {citys,bizList}=this.props;
    const rowSelection = {
     selectedRowKeys,
     onChange: this.onSelectChange,
      };
    return(
        <div>
        <SearchBut ref={(ref) => this.form = ref}  handleSearch={this.handleSearch}
        handleReset={this.handleReset} exportMes={e =>this.exportMes(e)} />
        <Table rowKey='l_id' loading={loading} rowSelection={rowSelection} columns={columns} pagination={pagination} dataSource={data}
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
         <FormItem {...formItemLayout} label="操作时间" >
           {getFieldDecorator("optTime")(
               <DatePicker className='1111' placeholder="操作时间" style={{width:150}}/>
           )}
         </FormItem>
         </Col>
         <Col span={6}>
          <FormItem {...formItemLayout} label="操作人">
            {getFieldDecorator("userName")(
                <Input  placeholder="操作人名称" style={{width:150}}/>
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
