import React,{Component} from 'react'
import {Table,Menu,Form,Row,Col,Select,Button,Icon,TreeSelect,DatePicker,Dropdown,message} from 'antd'
import {ajaxUtil} from '../../../util/AjaxUtils';
import uuid from 'node-uuid';
import WholeNetUpload from "./WholeNetUpload";
const FormItem=Form.Item;
const Option = Select.Option;

class OneStepDetailTable extends Component{
  constructor(props){
    super(props);
    this.state={
      columns:[],
      data:[],
      dynColumns:props.dynColumns,
      loading:false,
      pagination:{},
      selectedRowKeys:[],
    startDate:'',endDate:'',
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
      {title: '业务编码',dataIndex: 'businessCode', key: 'businessCode',width:100},
      { title: '业务名称',dataIndex: 'businessName',key: 'businessName',width:120,},
      {title: '一致总量',dataIndex: 'sameTotal',key: 'sameTotal',width:150},
      {title:'一致率',dataIndex:'samePercen',key:'samePercen',width:150},
      {title:'BOSS有平台无',
        children:[
          {title:'BOSS多差异量',dataIndex:'differenceTotalBoss',key:'differenceTotalBoss',width:150},
          {title:'差异金额',dataIndex:'differenceTotalAmountBoss',key:'differenceTotalAmountBoss',width:150},
          {title:'免费用户量',dataIndex:'freeUserBoss',key:'freeUserBoss',width:150},
          {title:'收费用户量',dataIndex:'chargeUserBoss',key:'chargeUserBoss',width:150},
          {title:'销户用户量',dataIndex:'cancleUserBoss',key:'cancleUserBoss',width:150},
          {title:'单独订购用户',
            children:[
              {title:'免费用户量',dataIndex:'sigleFreeUserBoss',key:'sigleFreeUserBoss',width:150},
              {title:'收费用户量',dataIndex:'sigleChargeUserBoss',key:'sigleChargeUserBoss',width:150},
              {title:'单独订购金额',dataIndex:'sigleAmountBoss',key:'sigleAmountBoss',width:150},
            ]
          },
          {title:'套餐捆绑用户',
              children:[
                {title:'免费用户量',dataIndex:'tcFreeUserBoss',key:'tcFreeUserBoss',width:150},
                {title:'收费用户量',dataIndex:'tcChargeUserBoss',key:'tcChargeUserBoss',width:150},
                {title:'套餐捆绑分摊金额',dataIndex:'tcftBoss',key:'tcftBoss',width:150},
              ]
          },
        ]
      },
      {title:'平台有BOSS无',
        children:[
          {title:'平台多差异量',dataIndex:'differenceTotalPlatform',key:'differenceTotalPlatform',width:150},
          {title:'差异金额',dataIndex:'differenceTotalAmountPlatform',key:'differenceTotalAmountPlatform',width:150},
          {title:'资费类型',
            children:[
              {title:'免费用户量',dataIndex:'freeUserPlatform',key:'freeUserPlatform',width:150},
              {title:'收费用户量',dataIndex:'chargeUserPlatform',key:'chargeUserPlatform',width:150},
            ]
          },
          {title:'订购时间',
              children:[
                {title:'入网时间早于订购时间用户量',dataIndex:'biggerUserPlatform',key:'biggerUserPlatform',width:150},
                {title:'入网时间晚于订购时间用户量',dataIndex:'smallerUserPlatform',key:'smallerUserPlatform',width:150},
                {title:'销户用户量',dataIndex:'cancleUserPlatform',key:'cancleUserPlatform',width:150},
              ]
          },
        ]
      },
      {title:'时间',dataIndex:'batchDate',key:'batchDate',width:150},
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
     let sort='';
     if (typeof(params.sortField) !== "undefined" ) {
       sort=params.sortField;
     }
     let dir='DESC';
     if (typeof(params.sortOrder) !== "undefined" ) {
       dir=(params.sortOrder=="descend"?"desc":"asc");
     }
    //  const {config} = this.props;
    const {startDate,endDate}=this.state;
     const text="startDate="+startDate
     +"&endDate="+endDate
     +"&sort="+sort
     +"&dir="+dir
     +"&start="+page+"&limit=10&type=0";
     ajaxUtil("urlencoded","whole-network!getJsonList.action",text,this,(data,that)  => {
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
     let cityCode=values.queryCity===undefined?'':values.queryCity;
     let startDate=values.startDate===undefined||values.startDate==null?'':values.startDate.format('YYYY-MM-DD');
     let endDate=values.endDate===undefined||values.endDate==null?'':values.endDate.format('YYYY-MM-DD');
     let bizCodeParams=values.bizCodeParam===undefined?'':values.bizCodeParam;
     this.setState({cityCode,startDate,endDate,bizCodeParams},()=>{this.fetch()});
  })
}

handleReset=() =>{
  this.form.resetFields();
  this.setState({startDate:'',endDate:''},()=>{this.fetch()});
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
   const {startDate,endDate}=this.state;
   let text="type=0&startDate="+startDate+"&endDate="+endDate;
   if (e.key==='1') {
     if (this.state.selectedRowKeys.length<=0) {
        message.warning("请选择需要导出的列");
     }else{
       text+="&flag=selected&ids="+this.state.selectedRowKeys;
      //  this.help(text);
       window.location.href="/DDCMS/whole-network!loadXLS.action?"+text;
     }
   }else if (e.key==='2') {
      text+="&flag=all&ids=";
      // this.help(text);
      window.location.href="/DDCMS/whole-network!loadXLS.action?"+text;
   }
 }

 uploadMes=(e) =>{
   const {permission} = this.props;
   if (permission.indexOf('upLoad')==-1) {
     message.error("暂无该上传权限！！！！！！");
   }else {
   if (e.key==='1') {
      message.info("正在下载请稍后......");
       window.location.href="/DDCMS/file-handler!downloadWholeNetworkDayTemplate.action";
   }else if (e.key==='2') {
      this.uploadXls.show(0);
    }
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
        handleReset={this.handleReset} exportMes={e =>this.exportMes(e)} permission={this.props.permission}  uploadMes={e=>this.uploadMes(e)} />
        <Table rowKey='id' loading={loading} rowSelection={rowSelection} columns={columns} pagination={pagination} dataSource={data}
          onChange={this.handleTableChange}  bordered  scroll={{ x: 2500, y: '100%' }}  size="middle"/>
            <WholeNetUpload ref={(ref) => this.uploadXls=ref}/>
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
  const uploadMenu = (
      <Menu onClick={this.props.uploadMes}>
        <Menu.Item key="1">模板下载</Menu.Item>
        <Menu.Item key="2">批量导入</Menu.Item>
      </Menu>
        );
   return(
    <Form layout="inline"  >
       <Row gutter={4}>
          <Col span={2}>
            <Dropdown overlay={uploadMenu} >
            <Button>
              <Icon type="file-excel" />批量导入<Icon type="down" />
            </Button>
          </Dropdown>
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
export default OneStepDetailTable;
