import React, {Component}  from 'react';
import {Table} from 'antd';
import { Button, Icon,Popconfirm,message,DatePicker,Select,Input,TreeSelect } from 'antd';
import {ajaxUtil} from '../../../util/AjaxUtils';
import NewBizAuditRule from './NewBizAuditRule';
const {RangePicker} = DatePicker;
const {Option} = Select;
const {Search} =Input;
const SHOW_CHILD=TreeSelect.SHOW_CHILD;

class BusinessAuditRule extends Component {
  constructor(props) {
    super(props);
    this.state = {
    data:[],
    pagination:[],
    loading:false,
    startDate:'',
    endDate:'',
    query:'',
    queryKey:'',

    };

  }
  componentWillMount() {
      this.getDynAction();
      this.loadTreeNode();
  }
  componentDidMount=() => {
    this.fetch();
  }

  download= (value) =>{
    fetch("/DDCMS/business-audit-standard!downloadByReact.action",{
      method:'POST',
      credentials: 'include',
      headers:{   "Content-Type": "application/x-www-form-urlencoded"},
      body:"filename="+value
    }).then(
      (response) =>
        response.json()
  )
    .then((responseJson) => {
      if (responseJson.head) {
           if (responseJson.head.stateCode === 400) {
             message.error(responseJson.head.stateMes);
          }
        }
    }).catch((error) => {
    console.error(error);
});
  }

  getDynAction =() => {
    const columns=[{
      title: '业务编码',
      dataIndex: 'businessCode',
      key: 'businessCode',
    },{
      title:'业务名称',
      dataIndex:'businessName',
      key:'businessName',
    },{
      title:'局方负责人',
      dataIndex:'jufang',
      key:'jufang',
    },{
      title:'稽核方案',
      dataIndex:'auditPlanName',
      key:'auditPlanName',
      render :(value, row, index) => {
        if (value !== '文件为空') {
          // return (<div>{value} <Button shape='circle' size='small'><Icon type="arrow-down" style={{fontSize:5}}/></Button>
          // <Button shape='circle' size='small'><Icon type="close" style={{fontSize:15}}/></Button></div>)
          return (
            <div>{value}
            <span className="ant-divider"/>
            <a onClick={()=> {this.download(value)}}>下载</a>
          <span className="ant-divider"/>
          <Popconfirm title="你确定要删除该条记录?" okText="是" cancelText="否" onConfirm={() => {
            ajaxUtil("urlencoded","business-audit-standard!del.action","fileId="+row.auditPlanName,this,(data,that) => {
               this.fetch();
            })
          }}>
          <a>删除</a>
          </Popconfirm></div>)
        }
      }
    },{
      title:'接口格式',
      dataIndex:'interfaceFormatName',
      key:'interfaceFormat',
      render :(value, row, index) => {
        console.log("--------------------record",row);
        if (value !== '文件为空') {
          return (
            <div>{value}
            <span className="ant-divider"/>
            <a onClick={()=> {this.download(value)}}>下载</a>
          <span className="ant-divider"/>
          <Popconfirm title="你确定要删除该条记录?" okText="是" cancelText="否" onConfirm={() => {
            ajaxUtil("urlencoded","business-audit-standard!del.action","fileId="+row.interfaceFormat,this,(data,that) => {
               this.fetch();
            })
          }}>
          <a>删除</a>
          </Popconfirm></div>)
        }
      }
    },{
      title:'更新日期',
      dataIndex:'uploadDate',
      key:'uploadDate',
    },{
      title:'备注',
      dataIndex:'remarks',
      key:'remarks',
    }];
    let action ={
      title:'操作',
      key:'action',
      render : (text, record) => (
        <span>
         <a onClick = {() => {
           this.newbiz.showModal("edit",record);
         }}>修改</a>
         <span className="ant-divider"/>
         <Popconfirm title="你确定要删除该条记录?" okText="是" cancelText="否" onConfirm={() => {
           ajaxUtil("urlencoded","business-audit-standard!dellist.action","id1="+record.bid,this,(data,that) => {
              this.fetch();
           })
         }}>
         <a>删除</a>
         </Popconfirm>
        </span>
      ),
    };
    columns.push(action);
    this.setState({columns});
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

  fetch = ( params ={} ) => {
    console.log('params',params);
    this.setState({loading:true}) ;
    let page=0;
    if (params.page>1) {
      page=(params.page-1)*10;
    }
    let sort='';
    if (typeof(params.sortField) !== "undefined" ) {
      sort=params.sortField;
    }
    let dir='';
    if (typeof(params.sortOrder) !== "undefined" ) {
      dir=params.sortOrder;
    }
    const {config} = this.props;
    const text="startDate="+this.state.startDate
    +"&endDate="+this.state.endDate
    +"&queryKey="+this.state.queryKey
    +"&query="+this.state.query
    +"&dir="+dir
    +"&sort="+sort
    +"&start="+page+"&limit=10";

    ajaxUtil("urlencoded","business-audit-standard!getJsonList.action",text,this,(data,that) => {
      const pagination = that.state.pagination;
      pagination.total = parseInt(data.total,10);
      this.setState({
          loading: false,
          data: data.data,
          pagination,
      });
    });
  }

  handleModal= () => {
    this.newbiz.show();
  }
  reflash=() => {
    this.fetch();
  }


 // cowConfirm = (e) =>{
 //   console.log("e",e);
 //  //  ajaxUtil("urlencoded","business-audit-standard!dellist.action","id",)
 // }
onStartChange =(date, dateString) => {
  this.setState({startDate:dateString});
};

onEndChange = (date, dateString) => {
this.setState({endDate:dateString });
};
onSelectChange =(value) => {
  this.setState({query:value});
};
handleSearch =(value) => {
  this.setState({queryKey:value},()=>{this.fetch});
}

loadTreeNode =() =>{
  ajaxUtil("urlencoded","business!getBusAfterNew.action","",this,(data,that) =>{
    this.setState({treeData:data});
  });
}
treeChange = (value) => {
}

  render(){
    return(
      <div>
        <Button type='primary' onClick={this.handleModal} >新增</Button>
    <Button  onClick={this.reflash}><Icon type="sync" />刷新</Button>
    <TreeSelect  placeholder='选择业务  单选框'
      style={{ width: 200 }} allowClear
      treeData={this.state.treeData}  onChange={this.treeChange}/>
    <DatePicker  placeholder="开始时间" onChange={this.onStartChange}/>
    <DatePicker  placeholder="结束时间" onChange={this.onEndChange}/>
    <Select style={{ width: 120 }} onChange={this.onSelectChange}  allowClear placeholder="选择查询字段">
      <Option value="businessCode">业务编码</Option>
      <Option value="businessName">业务名称</Option>
      <Option value="jufang">局方负责人</Option>
    </Select>
    <Search
      placeholder="输入查询值"
      style={{ width: 120 }}
      onSearch={this.handleSearch} />
    <Table columns={this.state.columns}  loading={this.state.loading} dataSource= {this.state.data}
           pagination={this.state.pagination} onChange={this.handleTableChange} />
    <NewBizAuditRule  ref={(ref) => this.newbiz=ref }/>
  </div>
     );
  }

}

export default BusinessAuditRule;
