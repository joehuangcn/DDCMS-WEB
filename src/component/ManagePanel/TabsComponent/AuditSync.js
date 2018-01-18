import React,{Component} from 'react';
import {Select,DatePicker,Form,Button,Icon,Table,Checkbox,Dropdown,Menu,message} from 'antd';
import { Row, Col } from 'antd';
import {ajaxUtil} from '../../../util/AjaxUtils';
const FormItem=Form.Item;
const Option = Select.Option;
var cityCodeMap = {
    "240": "沈阳",
    "410": "铁岭",
    "411": "大连",
    "412": "鞍山",
    "413": "抚顺",
    "414": "本溪",
    "415": "丹东",
    "416": "锦州",
    "417": "营口",
    "418": "阜新",
    "419": "辽阳",
    "421": "朝阳",
    "427": "盘锦",
    "429": "葫芦岛",
    "000": "辽宁省",
    "root": "汇总"
};

class  AuditSync extends Component {
  constructor(props) {
    super(props);
    this.state={
      columns:[],
      loading:false,
      data:[],
      citys:[],
      diffCodes:[],
      handleCompanys:[],
      pagination:{},
      queryCity:'',
      startDate:'',
      endDate:'',
      diffCodeChange:'',
      handleCpyChange:'',
      containZero:false,
      selectedRowKeys:[],
    }
  }

  componentWillMount(){
      this.getHead();
      this.handleFocus();
  }

  componentWillReceiveProps(props){
    // this.getHead();
    // this.handleFocus();
    this.handleReset();
  }

  componentDidMount(){
    this.fetch();
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

  fetch = (params = {}) => {
     this.setState({loading:true});
     let page=0;
     if (params.page>1) {
       page=(params.page-1)*10;
     }
     const {config} = this.props;
     const text="auditDate="+this.state.startDate
     +"&endDate="+this.state.endDate
     +"&cityCode="+this.state.queryCity
     +"&diffCode="+this.state.diffCodeChange
     +"&hd="+this.state.handleCpyChange
     +"&isZero="+this.state.containZero
     +"&auditType="+config.auditType
     +"&dataScope="+config.dataScope
     +"&dataType="+config.dataType
     +"&bizCodeParam="+config.bizCode
    //  +"&sort="+config.sort
    //  +"&dir="+config.dir
     +"&start="+page+"&limit=10";
     console.log("text=\""+text+"\"");

     ajaxUtil("urlencoded","audit-stat!getAuditDiffDetailList.action",text,this,(data,that)  => {
       const pagination = that.state.pagination;
       pagination.total = parseInt(data.totalProperty,10);
       this.setState({
           loading: false,
           data: data.root,
           pagination,
       });
     });
   }

  getHead=()=>{
    const columns=[
      { title:'稽核日期',dataIndex:'AUDITTIME',  key:'auditTime',width:200  },
      { title:'提数日期',dataIndex:'OBTAINDATATIME',key:'obtainDataTime',  width:170},
      { title:'城市',dataIndex:'CITYCODE', key:'cityCode',width:150,render:(text) =>cityCodeMap[text]},
      { title:'区域', dataIndex:'DEPTNAME', key:'deptName',  width:150},
      {  title:'业务名称',  dataIndex:'BIZNAME',key:'bizName',  width:150},
      {  title:'差异名称',  dataIndex:'DIFFNAME',key:'diffName',width:150},
      {  title:'差异代码',  dataIndex:'DIFFCODE',key:'diffCode',width:150},
      {  title:'差异量',  dataIndex:'DIFFNUM',key:'diffNum',width:150, },
      {  title:'差异比',  dataIndex:'DIFFPER',key:'diffPer',width:150,render:(text) =>(text+"%")},
      {  title:'同步前',  dataIndex:'BEFORESYN',key:'beforeSyn',width:150},
      {  title:'处理措施',  dataIndex:'DIFFDEAL',key:'diffDeal',width:300},
      {  title:'客服口径',  dataIndex:'CSEXPLAN',key:'csExplan', width:150},
      {  title:'牵头处理单位',dataIndex:'HANDLE_COMPANY',key:'handleCompany',  width:200},
      {  title:'差异处理方法',  dataIndex:'DIFF_HANDLE_METHOD',  key:'diffHandleMethod',  width:300},
      {title:'用户是否感知',dataIndex:'IS_USER_KNOWN',  key:'isUserKnown',width:150},
      {title:'下载申请',  dataIndex:'down',key:'diffDownApply', width:200,render:(text) =>(this.renderDownApply(text)) },
      {  title:'下载',  dataIndex:'diffDown',  key:'diffDown',  width:150, render:(text) =>(this.renderDownTxt(text)) },
      {  title:'上传审核',dataIndex:'diffReview',  key:'diffReview',width:150 ,render:(text) =>(this.renderCheckReview(text)) },
      {  title:'上传',  dataIndex:'DIFFSYN',  key:'diffSyn',width:150 ,render:(text) =>(this.renderDownApply(text)) },
      { title:'上传状态',dataIndex:'passOrNot',  key:'passOrNot',  width:150,render:(text) =>(this.renderPassNot(text))}
    ]

    this.setState({columns});
  }

  renderPassNot=(text) =>{
    switch (text) {
      case '0':
          return "差异上传通过审核"; break;
      case '1':
          return "差异上传审核未通过"; break;
      case '2':
           return "差异数据已经生成"; break;
      case '3':
          return "差异下载已审批"; break;
      case '4':
          return "差异数据已经下载"; break;
      case '5':
          return "差异数据已上传"; break;
      case '6':
          return "处理结果已反馈"; break;
      default:
        return "";
    }
  }

  renderDownApply =(text) =>{

  }

  renderDownTxt=(text) =>{

  }

  renderCheckReview=(text) =>{
    switch (text) {
      case 'NoDeedReView':
            return '不需要审核';
        break;
      case 'noPass':
            return '审核未过';
        break;
       case 'hasPass':
            return '审核通过';
          break;
        case 'noPermReview':
            return  '无权限';
          break;
      default:
        return <Button type="primary" onClick={this.handleReview}>审核</Button>; break;
    }
  }

// 设置 打开 审核界面
  handleReview =() =>{

  }

 handleFocus() {
   const {bizCode} =this.props.config;
  console.log('focus');
  ajaxUtil("urlencoded","constant!getCityCodeEntryAllList.action","",this,(data,that)=>{
    this.setState({citys:data.data});
  });
  ajaxUtil("urlencoded","business!getDiffCode.action","bizCode="+bizCode,this,(data,that)=>{
    this.setState({diffCodes:data.data});
  });
  ajaxUtil("urlencoded","dictionaryAction!getDictionaryListByType.action","name=DICT_HANDCOMPANY",this,(data,that)=>{
    this.setState({handleCompanys:data.data});
  });
}

handleReset = () => {
  const forms=this.form;
 this.form.resetFields();
 this.setState({queryCity:'',startDate:'',endDate:'',  diffCodeChange:'',handleCpyChange:'',containZero:false},()=>{this.fetch()});
}

handleSearch=(e) => {
 const form= this.form;
 form.validateFields(( err, values) => {
   if (err) {
     return;
   }
   console.log("----values",values);
   let queryCity=values.queryCity===undefined?'':values.queryCity;
   let startDate=values.startDate===undefined||values.startDate==null?'':values.startDate.format('YYYY-MM-DD');
   let endDate=values.endDate===undefined||values.endDate==null?'':values.endDate.format('YYYY-MM-DD');
   let diffCodeChange=values.diffCodeChange===undefined?'':values.diffCodeChange;
   let handleCpyChange=values.handleCpyChange===undefined?'':values.handleCpyChange;
   let containZero=values.containZero===undefined?'':values.containZero;
   this.setState({queryCity,startDate,endDate,diffCodeChange,handleCpyChange,containZero},()=>{this.fetch()});
})
}
exportMes=(e)=>{
  console.log(e);
   const {config} = this.props;
   let synId='';
   let downflag='';
  //  let text="auditDate="+this.state.startDate
  //  +"&endDate="+this.state.endDate
  //  +"&cityCode="+this.state.queryCity
  //  +"&diffCode="+this.state.diffCodeChange
  //  +"&hd="+this.state.handleCpyChange
  //  +"&isZero="+this.state.containZero
  //  +"&auditType="+config.auditType
  //  +"&dataScope="+config.dataScope
  //  +"&dataType="+config.dataType
  // +"&bizCodeParam="+config.bizCode
  //  +"&sort="+config.sort
  //  +"&dir="+config.dir
  let text="bizCode="+config.bizCode;
   if (e.key==='1') {
     if (this.state.selectedRowKeys.length<=0) {
        message.warning("请选择需要导出的列");
     }else{
       text+="&did="+this.state.selectedRowKeys;
      //  this.help(text);
       window.location.href="/DDCMS/audit-stat!downAuditComList.action?"+text;
     }
   }else if (e.key==='2') {
      text+="&downflag=all&synId=";
      // this.help(text);
      window.location.href="/DDCMS/audit-stat!downAuditComList.action?"+text;
   }
}
onSelectChange = (selectedRowKeys) => {
console.log('selectedRowKeys changed: ', selectedRowKeys);
this.setState({ selectedRowKeys });
}



  render(){
    const {citys,diffCodes,handleCompanys,selectedRowKeys}=this.state;
    const rowSelection = {
     selectedRowKeys,
     onChange: this.onSelectChange,
   };
    return(
      <div>
        <SearchBut ref={(ref) => this.form = ref} handleSearch={this.handleSearch} handleReset={this.handleReset}  citys={this.state.citys} exportMes={e =>this.exportMes(e)}
        diffCodes={this.state.diffCodes} handleCompanys={this.state.handleCompanys} containZero={this.state.containZero}/>
        <Table rowKey="DID"  rowSelection={rowSelection} columns={this.state.columns}
        loading={this.state.loading} dataSource={this.state.data}  scroll={{x:1000}} pagination={this.state.pagination}  scroll={{x:'120%',y:'250%'}} size="middle"/>
      </div>
    );
  }
}

class DiffMapSearch  extends Component {
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
   const diffcodeItemLayout = {
     labelCol: { span: 11 },
     wrapperCol: { span: 10 },
   };
   const {diffCodes,handleCompanys}=this.props;
   const menu = (
      <Menu onClick={this.props.exportMes}>
        <Menu.Item key="1">导出选中</Menu.Item>
      </Menu>
      );
   return(
    <Form layout="inline"  >
    <Row gutter={4}>
    <Col span={3} >
     <FormItem { ...cityItemLayout} label="城市">
       {getFieldDecorator("queryCity")(
         <Select  placeholder="选择地市" style={{ width: 120 }} onChange={this.city} allowClear={true}>
           {this.props.citys.map(d=> <Option key={d.key} value={d.key}>{d.value}</Option>)}
         </Select>
       )}
     </FormItem>
     </Col>
     <Col span={3}>
      <FormItem {...formItemLayout} label="开始时间" >
        {getFieldDecorator("startDate")(
            <DatePicker style={{ width: 100 }} placeholder="开始时间"/>
        )}
      </FormItem>
      </Col>
      <Col span={3} >
       <FormItem {...formItemLayout} label="结束时间">
         {getFieldDecorator("endDate")(
             <DatePicker style={{ width: 100 }} placeholder="结束时间" />
         )}
       </FormItem>
       </Col>
       <Col span={2}>
        <FormItem {...formItemLayout} label="" >
          {getFieldDecorator("diffCodeChange")(
            <Select  style={{ width: 100 }} placeholder="差异代码" onChange={this.diffCodeChange} allowClear={true}>
                {diffCodes.map(d =><Option key={d.diffCode} value={d.diffCode}>{d.diffCode}</Option>)}
            </Select>
          )}
        </FormItem>
        </Col>
        <Col span={2} >
         <FormItem {...formItemLayout} label="">
           {getFieldDecorator("handleCpyChange")(
             <Select style={{ width: 120 }} placeholder="牵头处理单位" allowClear={true}  onChange={this.handleChange}>
                 {handleCompanys.map(d =><Option key={d.dicCode} value={d.dicCode}>{d.dicName}</Option>)}
             </Select>
           )}
         </FormItem>
         </Col>
         <Col span={2} >
         <FormItem {...formItemLayout} label="">
           {getFieldDecorator("containZero",{initialValue:true})(
             <Checkbox style={{marginLeft:8, width: 120 }} onChange={this.changeCheckBox}>差异量不为0</Checkbox>
           )}
         </FormItem>
         </Col>
         <Col span={6} style={{ textAlign: 'center' }} >
           <Button type="primary" onClick={this.props.handleSearch}><Icon type="sync" />查询</Button>
           <Button style={{ marginLeft: 8 }} onClick={this.props.handleReset}> 重置</Button>
           <Dropdown overlay={menu} style={{ marginLeft: 16 }}>
              <Button>
                <Icon type="file-excel" />导出<Icon type="down" />
              </Button>
            </Dropdown>
         </Col>
       </Row>
     </Form>
   );

}
}
const SearchBut =Form.create()(DiffMapSearch);
export default AuditSync;
