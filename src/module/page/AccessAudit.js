import React,{Component} from 'react'
import { Table,Tabs,Input, Button,Icon,Select,DatePicker,Form } from 'antd';
import {ajaxUtil} from '../../util/AjaxUtils';
import uuid from "node-uuid";
const Search = Input.Search;
const InputGroup = Input.Group;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const FormItem=Form.Item;

const columns =[{
    title: '业务代码',
    dataIndex: 'bizCode',
    key: 'bizCode',
  },{
    title: '业务名称',
    dataIndex: 'bizName',
    key: 'bizName',
  }, {
    title: '稽核类型',
    dataIndex: 'dataScope',
    key: 'dataScope',
  }, {
    title: '稽核网元',
    dataIndex: 'netElement',
    key: 'netElement',
  }, {
    title: '稽核频率',
    dataIndex: 'auditFrequency',
    key: 'auditFrequency',
  },{
    title: '稽核时间',
    dataIndex: 'auditTime',
    key: 'auditTime',
  }, {
    title: '本月是否稽核',
    dataIndex: 'ifAudit',
    key: 'ifAudit',
  }, {
    title: '本月是否同步差异',
    dataIndex: 'ifSynchronization',
    key: 'ifSynchronization',
  }
  ];
class AccessAudit extends Component {
  constructor(props) {
    super(props);
    this.state={
      data:[],
      // total:'',
      pagination:{pageSize:15},
      loading: false,
      ifAudit:'',
      ifSync:'',
      query:'',
      queryKey:''};

  }
  componentWillMount(){
    this.fetch();
  }
  reflash=()=>{
    this.fetch();
  }
  ifAudit=(values)=>{
    this.setState({ ifAudit: values });

  }
  ifSync=(values)=>{
    this.setState({ ifSync: values });
  }
  query=(values)=>{
    this.setState({ query: values });
  }
  search=(values)=>{
    this.setState({queryKey:values},()=>(this.fetch()));
  }

  handleTableChange=(pagination,filters,sorter)=>{
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.fetch({
      results: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters,
    });

  }
  fetch = ( params = {}) => {
    let page=0;
    if (params.page>1) {
      page=(params.page-1)*15;
    }
     const text="ifaudit="+this.state.ifAudit+"&iftongbu="+this.state.ifSync+"&query="+this.state.query+"&queryKey="+this.state.queryKey
     +"&start="+page+"&limit=15"+"&sortField="+params.sortField+"&sortOrder"+params.sortOrder;
     this.setState({loading: true});
     ajaxUtil("urlencoded","auditSituation!getList.action",text,this,(data,that)=>  {
       const pagination = that.state.pagination;
       pagination.total = parseInt(data.total,10);
      //  this.setState({ total: data.total});
       this.setState({
           loading: false,
           data: data.data,
           pagination,
       });
     });
   }

  //  setOk=() =>{
  //      <Button type="primary" onClick={this.setOk}>完成</Button>
  //    ajaxUtil("urlencoded", "data-gather!test.action","",this,(data,that)=>{
  //    })
  //  }


  render() {
    return(
    <div>
      <div className="table-operations">
            <Select placeholder="是否稽核" style={{ width: 120 }} onChange={() => this.ifAudit} allowClear={true} >
                <Option value="是">是</Option>
                <Option value="否">否</Option>
            </Select>
            <Select placeholder="是否同步" style={{ width: 120 }} onChange={() => this.ifSync} allowClear={true}>
                <Option value="是">是</Option>
                <Option value="否">否</Option>
            </Select>

            <Select placeholder="业务查询" style={{ width: 120 }} onChange={this.query} allowClear={true}>
                <Option value="业务名称">业务名称</Option>
                <Option value="业务编码">业务编码</Option>
            </Select>
            <Search
                 placeholder="请输入"
                 style={{ width: 120 }}
                 onSearch={this.search}
            />
            <Button onClick={this.reflash}><Icon type="sync" />刷新</Button>
      </div>
      <Table rowKey={()=>uuid.v1()} columns={columns}  loading={this.state.loading} dataSource={this.state.data}  onChange={this.handleTableChange} pagination={this.state.pagination}/>
    </div>)
  }
}
export default AccessAudit;
