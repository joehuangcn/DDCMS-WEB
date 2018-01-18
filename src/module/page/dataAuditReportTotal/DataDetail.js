import React,{Component} from 'react'
import {Table,Menu,Form,Row,Col,Select,Button,Icon,TreeSelect,DatePicker,Dropdown,message} from 'antd'
import {ajaxUtil} from '../../../util/AjaxUtils';
import uuid from 'node-uuid';
const FormItem=Form.Item;
const Option = Select.Option;
class DataDetail extends Component{
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
    // console.log(dynColumns);
    const firtColumns =[
      {title: '业务名称',dataIndex: 'BIZNAME', key: 'BIZNAME',width:150},
      {title: '业务代码',dataIndex: 'BIZCODE', key: 'BIZCODE',width:150},
      { title: '稽核总量',dataIndex: 'AUDITTOTAL',key: 'AUDITTOTAL',width:100},
      {title: '一致总量',dataIndex: 'SAMETOTAL',key: 'SAMETOTAL',width:150},
      {title:'BOSS一致率',dataIndex:'RATE_BOSS',key:'RATE_BOSS',width:150,render:(text)=>(this.renderRate(text)),},
      {title:'ESOP一致率',dataIndex:'RATE_ESOP',key:'RATE_ESOP',width:150,render:(text)=>(this.renderRate(text))},
      { title: '差异总量',dataIndex: 'DIFFTOTAL', key: 'DIFFTOTAL',width:150},
      { title: '新增差异总量', dataIndex: 'DIFFADDITION',key: 'DIFFADDITION',width:150},
      { title: '差异处理总量', dataIndex:'DIFFPROCESS',key: 'DIFFPROCESS',width:100},
      { title: '整体一致率', dataIndex: 'YLPER',  key: 'YLPER',width:100,render:(text)=>(this.renderRate(text))},
    ]
    // let flatArray=[];
    // if (dynColumns!==undefined) {
    //     let dynColumnsList=dynColumns.split(",");
    //     for (var i = 0; i < dynColumnsList.length; i++) {
    //       let some=dynColumnsList[i];
    //       if (some==='CBSS') {
    //           some="CBOSS";
    //       }
    //       if (some!=='') {
    //         let head = some.replace("FLAT","业务平台").replace("MAS","行业网关");
    //         flatArray.push({title: head + '总量',dataIndex: some,key:some, width: 100});
    //       }
    //     }
    // }
    //
    // console.log(flatArray);


    this.setState({columns:firtColumns});
  }

  renderRate=(text) =>{
    if (text==""||text===undefined) {
       return "";
    }else
      return text+"%";
  }

  fetch = (params = {}) => {
     this.setState({loading:true});
     let page=0;
     if (params.page>1) {
       page=(params.page-1)*10;
     }
     let sort='BIZSCOPENAME';
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
     ajaxUtil("urlencoded","audit-statall!getAuditAllBizListOfJson.action",text,this,(data,that)  => {
       const pagination = that.state.pagination;
       pagination.total = parseInt(data.totalProperty,10);
       this.setState({
           loading: false,
           data: data.root,
           pagination,
       });
     });
   }


  expandedRowRender=(record)=>{
    const {dynColumns}=this.state;
      let flatArray=[];
    if (dynColumns!==undefined) {
        let dynColumnsList=dynColumns.split(",");
        for (var i = 0; i < dynColumnsList.length; i++) {
          let some=dynColumnsList[i];
          if (some==='CBSS') {
              some="CBOSS";
          }
          if (some!=='') {
            let head = some.replace("FLAT","业务平台").replace("MAS","行业网关");
            flatArray.push({title: head + '总量',dataIndex: some,key:some, width: 100});
          }
        }
    }
    return (
      <Table rowKey={()=>(uuid.v1())}
      columns={flatArray}
       dataSource={this.state.data}
       pagination={false}
   />
    )
  }

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
       text+="&flag=selected&bizeScopes="+this.state.selectedRowKeys;
      //  this.help(text);
       window.location.href="/DDCMS/audit-statall!loadDetailXLS.action?"+text;
     }
   }else if (e.key==='2') {
      text+="&flag=all&bizeScopes=";
      // this.help(text);
      window.location.href="/DDCMS/audit-statall!loadDetailXLS.action?"+text;
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
        <Table rowKey='BIZCODE' loading={loading} rowSelection={rowSelection} columns={columns} pagination={pagination} dataSource={data}  expandedRowRender={this.expandedRowRender}
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
       <Col span={4} >
        <FormItem { ...cityItemLayout} label="城市">
          {getFieldDecorator("queryCity")(
            <Select  placeholder="选择地市" style={{ width: 120 }} onChange={this.city} allowClear={true}>
              {this.props.citys.map(d=> <Option key={d.key} value={d.key}>{d.value}</Option>)}
            </Select>
          )}
        </FormItem>
        </Col>
        <Col span={6} >
         <FormItem { ...cityItemLayout} label="业务名称">
           {getFieldDecorator("bizCodeParam")(
                 <TreeSelect  placeholder='选择业务'
                    style={{ width: 250 }} allowClear treeCheckable={true} showCheckedStrategy='SHOW_CHILD'
                 treeData={this.props.bizList}  onChange={this.handleBizTreeChange} />
           )}
         </FormItem>
         </Col>
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
           <Button style={{ marginLeft: 8 }} onClick={this.props.handleReset}> 重置</Button>
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
export default DataDetail;
