import React,{Component} from 'react'
import {Table,Menu,Form,Row,Col,Select,Button,Icon,TreeSelect,DatePicker,Dropdown,message} from 'antd'
import {ajaxUtil} from '../../../util/AjaxUtils';
import uuid from 'node-uuid';
import Sjdhbd from './Sjdhbd';
const FormItem=Form.Item;
const Option = Select.Option;
class Sjdhdd extends Component{
  constructor(props){
    super(props);
    this.state={
      columns:[],
      data:[],
      dynColumns:props.dynColumns,
      loading:false,
      pagination:{},
      selectedRowKeys:[],
      cityCode:'',startDate:'',endDate:'',bizCodeParams:[],
    }
  }

  componentWillMount(){
    this.getDynColumnHead();
  }

  componentDidMount(){
    this.fetch();
  }
  componentWillReceiveProps(nextProps){
    const {dynColumns}=this.props;
    if (dynColumns!==this.state.dynColumns) {
      this.setState({dynColumns});
      this.getDynColumnHead(dynColumns);
    }
  }

  getDynColumnHead =() =>{
    const firtColumns =[
        {title: '业务名称',dataIndex: 'bizname',key: 'bizname',},
        {title:'稽核日期',dataIndex:'datatime',key:'datatime',},
        {title:'BOOSS数量',dataIndex:'bossqty', key:'bossqty',},
        {title:'平台反馈量',dataIndex:'reqty',key:'reqty',},
        {title: '一致量', dataIndex: 'sameqty',key: 'sameqty',},
        {title:'平台添加量',dataIndex:'addqty',key:'addqty',},
        {title:'平台删除量',dataIndex:'delqty',key:'delqty',},
        {title:'平台更新量',dataIndex:'modqty',key:'modqty',},
        {title:'处理失败量',dataIndex:'failqty',key:'failqty',},
        {title:'一致率',dataIndex:'samerate', key:'samerate',},
    ];
    this.setState({columns:firtColumns});
  }


  fetch = (params = {}) => {
     this.setState({loading:true});
     let page=0;
     if (params.page>1) {
       page=(params.page-1)*10;
     }
     let sort='datatime';
     if (typeof(params.sortField) !== "undefined" ) {
       sort=params.sortField;
     }
     let dir='DESC';
     if (typeof(params.sortOrder) !== "undefined" ) {
       dir=(params.sortOrder=="descend"?"desc":"asc");
     }
    //  const {config} = this.props;
    const {cityCode,startDate,endDate,bizCodeParams}=this.state;
     const text="startDate="+startDate
     +"&endDate="+endDate
     +"&cityCode="+cityCode
     +"&bizCodeParams="+bizCodeParams
     +"&sort="+sort
     +"&dir="+dir
     +"&start="+page+"&limit=10";
     ajaxUtil("urlencoded","sjdhbd!getJsonList.action",text,this,(data,that)  => {
       const pagination = that.state.pagination;
       pagination.total = parseInt(data.totalProperty,10);
       this.setState({
           loading: false,
           data: data.root,
           pagination,
       });
     });
   }
   reflash=() => {
    this.fetch();
}

//   expandedRowRender=(record)=>{
//     const {dynColumns}=this.state;
//       let flatArray=[];
//     if (dynColumns!==undefined) {
//         let dynColumnsList=dynColumns.split(",");
//         for (var i = 0; i < dynColumnsList.length; i++) {
//           let some=dynColumnsList[i];
//           if (some==='CBSS') {
//               some="CBOSS";
//           }
//           if (some!=='') {
//             let head = some.replace("FLAT","业务平台").replace("MAS","行业网关");
//             flatArray.push({title: head + '总量',dataIndex: some,key:some, width: 100});
//           }
//         }
//     }
//     return (
//       <Table
//       columns={flatArray}
//        dataSource={this.state.data}
//        pagination={false}
//    />
//     )
//   }

  handleSearch=(e) => {
   const form= this.form;
   form.validateFields(( err, values) => {
     if (err) {
       return;
     }
     console.log(values);
     let cityCode=values.queryCity===undefined?'':values.queryCity;
     let startDate=values.startDate===undefined||values.startDate==null?'':values.startDate.format('YYYY-MM-DD');
     let endDate=values.endDate===undefined||values.endDate==null?'':values.endDate.format('YYYY-MM-DD');
     let bizCodeParams=values.bizCodeParam===undefined?'':values.bizCodeParam;
     this.setState({cityCode,startDate,endDate,bizCodeParams},()=>{this.fetch()});
  })
}

handleReset=() =>{
  this.form.resetFields();
  this.setState({cityCode:'',startDate:'',endDate:'',bizCodeParams:[]},()=>{this.fetch()});
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

exportMes=(e)=>{
  console.log(e);
   const {config,permission} = this.props;
   let synId='';
   let downflag='';
   const {cityCode,startDate,endDate,bizCodeParams}=this.state;
   let text="startDate="+startDate
   +"&endDate="+endDate
   +"&cityCode="+cityCode
   +"&bizCodeParam="+bizCodeParams
   if (e.key==='1') {
     if (this.state.selectedRowKeys.length<=0) {
        message.warning("请选择需要导出的列");
     }else{
       text+="result=4&datatime=31-JUL-16&citycode=root"+this.state.selectedRowKeys;
      //  this.help(text);
       window.location.href="/DDCMS/sjdhbd!downDetails.action?"+text;
     }
   }else if (e.key==='2') {
      text+="result=4&datatime=31-JUL-16&citycode=root";
      // this.help(text);
      window.location.href="/DDCMS/sjdhbd!downDetails.action?"+text;
   }
 }

 onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
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
        <SearchBut ref={(ref) => this.form = ref}  citys={citys} bizList={bizList} handleSearch={this.handleSearch}
        handleReset={this.handleReset} exportMes={e =>this.exportMes(e)} permission={this.props.permission}/>
        <Table rowKey='BIZSCOPENAME' loading={loading} rowSelection={rowSelection} columns={columns} pagination={pagination} dataSource={data}  expandedRowRender={this.expandedRowRender}
          onChange={this.handleTableChange} />
        </div>);
  }
}
class StatSearch extends Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    const {permission}=this.props;
    let expBtnPermiss='inline';
    if (permission.indexOf('exp')===-1) {
      expBtnPermiss='none';
    }
   const formItemLayout = {
     labelCol: { span: 10 },
     wrapperCol: { span: 14 },
   };
   const cityItemLayout = {
     labelCol: { span: 7 },
     wrapperCol: { span: 7 },
   };
   const menu = (
      <Menu onClick={this.props.exportMes}>
        <Menu.Item key="1">导出选中</Menu.Item>
        <Menu.Item key="2">导出全部</Menu.Item>
      </Menu>
      );
   return(
    <Form layout="inline"  >
       <Row gutter={4}>
            <Col span={4}>
         <FormItem {...formItemLayout} label="开始时间" >
           {getFieldDecorator("startDate")(
               <DatePicker className='1111' placeholder="开始时间" style={{width:150}}/>
           )}
         </FormItem>
         </Col>
         <Col span={4} >
          <FormItem {...formItemLayout} label="结束时间">
            {getFieldDecorator("endDate")(
                <DatePicker  placeholder="结束时间" style={{width:150}}/>
            )}
          </FormItem>
          </Col>
         <Col span={6} style={{ textAlign: 'right',}} >
           <Button type="primary" onClick={this.props.handleSearch}>查询</Button>
           <Button onClick={this.reflash}><Icon type="sync" />刷新</Button>
           <div style={{display:expBtnPermiss}}>
           <Dropdown overlay={menu} style={{ marginLeft: 16}}>
              <Button>
                <Icon type="file-excel" />导出<Icon type="down" />
              </Button>
            </Dropdown>
            </div>
         </Col>
       </Row>
     </Form>
   );
  }
}
const SearchBut =Form.create()(StatSearch);
export default Sjdhdd;
