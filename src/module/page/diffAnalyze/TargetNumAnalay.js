import React,{Component} from 'react';
import { Button, Icon,Popconfirm,message,DatePicker,Select,Input,TreeSelect,Table,Modal,Row,Col,Form,Menu,Checkbox,Dropdown } from 'antd';
import {ajaxUtil} from '../../../util/AjaxUtils';
const {RangePicker} = DatePicker;
const {Option} = Select;
const {Search} =Input;
const FormItem=Form.Item;
// --------------------号码轨迹分析-----------------------------------
const fixColumns =[
    { title:'差异出现次数', dataIndex:'CNT' , key:'CNT',sorter: true},
    { title:'差异代码', dataIndex:'DIFF_CODE' , key:'DIFF_CODE'},
    { title:'差异名称', dataIndex:'diffName' , key:'diffname',},
    { title:'同步情况', dataIndex:'ISSYNC' , key:'ISSYNC',},
    { title:'差异出现情况', dataIndex:'diffDate' , key:'diffDate'},
];
const cityCodeMap = {
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
class TargetNumAnalay extends Component {
  constructor(props){
    super(props);
    this.state={
      columns:[],
      loading:false,
      data:[],
      pagination:{pageSize:10},
      id:'',
      permission:[],
      citys:[],
      bizList:[],
      bizCode:'',obDate:'',diffCnt:'',key:'',diffCode:'',
    };
  }

  componentWillMount(){
    this.getInitProps(this.props);

  }

  componentDidMount(){
    // this.fetch();
    this.handleFocus();
  }
  // 初始化
  getInitProps=(props)=>{
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

   handleFocus() {
    ajaxUtil("urlencoded","business!getBusAfterNew.action","",this,(data,that)=>{
        this.setState({bizList:data});
    });
  }
  // 请求查询method
  fetch = ( params ={} ) => {

    let page=0;
    if (params.page>1) {
      page=(params.page-1)*10;
    }
    let sort='DIFF_CODE';
    if (typeof(params.sortField) !== "undefined" ) {
      sort=params.sortField;
    }
    let dir='DESC';
    if (typeof(params.sortOrder) !== "undefined" ) {
      dir=(params.sortOrder=="descend"?"desc":"asc");
    }
    const {config} = this.props;
    const {bizCode,obDate,diffCode,diffCnt,key}=this.state;
    if (bizCode===undefined||bizCode===""||obDate===""||diffCode==="") {
      message.warning("业务，日期，差异代码为必选项！！！！");
    }else{
    this.setState({loading:true}) ;
    const text="bizCode="+(bizCode===undefined?"":bizCode)
    +"&obDate="+(obDate===undefined?"":obDate)
    +"&diffCode="+(diffCode===undefined?"":diffCode)
    +"&diffCnt="+(diffCnt===undefined?"":diffCnt)
    +"&key="+(key===undefined?"":key)
    +"&dir="+dir
    +"&sort="+sort
    +"&start="+page+"&limit=10";
    ajaxUtil("urlencoded","data-analyze!getDataAnalyzeDetailJson.action",text,this,(data,that) => {
      const pagination = that.state.pagination;
      pagination.total = parseInt(data.total,10);
      this.setState({
          loading: false,
          data: data.data,
          pagination,
      });
    });
  }
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
  refresh=() => {
    let pagination=this.state;
    pagination.current=1;
    this.setState({pagination},()=>{this.fetch();});
  }
  handleGetColumns=() =>{
    const {bizCode,obDate,diffCode,diffCnt,key}=this.state;
    const coluumText="bizCode="+bizCode+"&diffCode="+diffCode+"&key="+key;
        ajaxUtil("urlencoded","data-analyze!getDetailColumnsNew.action",coluumText,this,(data,that) => {
          fixColumns.push(data.extraHeads);
          this.setState({
              columns: fixColumns,
          });
        });
  }
  handleModal= () =>{
    this.newbiz.show();
  }
  handelSeChange=(value) =>{
    this.setState({queryKey:value});
  }
  handleReset = () => {
    const forms=this.form;
   this.form.resetFields();
   this.setState({bizCode:'',obDate:'',diffCode:'',diffCnt:'',key:''},()=>{this.handleGetColumns(); this.fetch();});
  }

  handleSearch=(e) => {
   const form= this.form;
   form.validateFields(( err, values) => {
     if (err) {
       return;
     }
     let bizCode=values.bizCode===undefined?'':values.bizCode;
     let obDate=values.obDate===undefined?'':values.obDate;
     let diffCode=values.diffCode===undefined?'':values.diffCode;
     let diffCnt=values.diffCnt===undefined?'':values.diffCnt;
     let key=values.key===undefined?'':values.key;
     this.setState({bizCode,obDate,diffCode,diffCnt,key},()=>{this.handleGetColumns();this.fetch();});
  })
  }

  exportMes=(e)=>{
     const {bizCode,obDate,diffCode,cityCode,removeZero,pagination}=this.state;
     let page=0;
     if (pagination.current>1) {
       page=(pagination.current-1)*10;
     }
     const text="bizCode="+(bizCode===undefined?"":bizCode)
     +"&obDate="+(obDate===undefined?"":obDate)
     +"&diffCode="+(diffCode===undefined?"":diffCode)
     +"&cityCode="+(cityCode===undefined?"":cityCode)
     +"&removeZero="+(removeZero===undefined?"":removeZero)
     +"&dir=ASC"
     +"&sort=obtaindatatime"
     +"&start="+page+"&limit=10";

    //  +"&sort="+config.sort
    //  +"&dir="+config.dir
    if (this.state.permission.indexOf('exp')===-1) {
        message.error("当前用户暂无权限下载！！！");
    }
    else {
         window.location.href="/DDCMS/data-analyze!getDataAnalyzeReportToExcel.action?"+text;
   }
 }

  render() {
    const{bizJoinTypeList,auditTypeList}=this.state;
    return(
      <div>
      <SearchBut ref={(ref) => this.form = ref} handleSearch={this.handleSearch} handleReset={this.handleReset}
       bizList={this.state.bizList} />
    <span>请依次选择 业务，提数日期，差异代码 为必选项</span>
    <Table columns={this.state.columns}  loading={this.state.loading} dataSource={this.state.data}
     onChange={this.handleTableChange} pagination={this.state.pagination} size="middle"/>
    </div>
    );
  }

}

class DiffMapSearch  extends Component {
  constructor(props){
    super(props);
    this.state={
      diffCodes:[],
      obList:[],
      cnts:[],
    }
  }
  handleBizTreeChange=(value) =>{
    ajaxUtil("urlencoded","data-analyze!getDiffCodeForAnalyzebyCitycode.action","bizCode="+value,this,(data,that)=>{
      this.setState({diffCodes:data.data});
    });
    ajaxUtil("urlencoded","data-analyze!getObtaindatatime.action","bizCode="+value,this,(data,that)=>{
      this.setState({obList:data.data});
    });
  }

  handleObChange=(value)=>{
    const text="bizCode="+this.props.bizCode+"&diffCode="+this.props.form.getFieldValue('diffCode')+"&obDate="+value;
    ajaxUtil("urlencoded","data-analyze!getDiffCnt.action",text,this,(data,that)=>{
      this.setState({cnts:data.data});
    });
  }
  handleDiffChange=(value) =>{
    const text="bizCode="+this.props.bizCode+"&diffCode="+value+"&obDate="+this.props.form.getFieldValue('obDate');
    ajaxUtil("urlencoded","data-analyze!getDiffCnt.action",text,this,(data,that)=>{
      this.setState({cnts:data.data});
    });
}


  render() {
    const { getFieldDecorator } = this.props.form;
   const formItemLayout = {
     labelCol: { span: 10 },
     wrapperCol: { span: 14 },
   };
   const {bizList}=this.props;
   const {diffCodes,obList,cnts}=this.state;
   return(
    <Form layout="inline"  >
    <Row gutter={2}>
    <Col span={4} >
            <FormItem {...formItemLayout} label="">
              {getFieldDecorator("bizCode")(
                <TreeSelect  placeholder='选择业务'
                   style={{ width: 200 }} allowClear
                treeData={bizList}  onChange={this.handleBizTreeChange} />
              )}
            </FormItem>

     </Col>
     <Col span={4}>
      <FormItem {...formItemLayout} label="提数日期" >
        {getFieldDecorator("obDate")(
          <Select  style={{ width: 150 }} placeholder="提数日期" allowClear={true}  onChange={this.handleObChange} >
              {obList.map(d =><Option key={d.fieldCode} value={d.fieldCode}>{d.fieldName}</Option>)}
          </Select>
        )}
      </FormItem>
      </Col>
       <Col span={4}>
        <FormItem {...formItemLayout} label="差异代码" >
          {getFieldDecorator("diffCode")(
            <Select  style={{ width: 120 }} placeholder="差异代码" allowClear={true} onChange={this.handleDiffChange}>
                {diffCodes.map(d =><Option key={d.diffCode} value={d.diffCode}>{d.diffCode}</Option>)}
            </Select>
          )}
        </FormItem>
        </Col>
        <Col span={4} >
            <FormItem { ...formItemLayout} label="差异出现次数">
              {getFieldDecorator("diffCnt")(
                <Select  placeholder="请选择" style={{ width: 120 }}  allowClear={true}>
                  {cnts.map(d=> <Option key={d.count} value={d.count}>{d.count}</Option>)}
                </Select>
              )}
            </FormItem>
         </Col>
         <Col span={4} >
             <FormItem { ...formItemLayout} label="">
               {getFieldDecorator("key")(
                <Input placeholder="号码搜索" style={{ width: 200 }} />
               )}
             </FormItem>
          </Col>
         <Col span={4} style={{ textAlign: 'center' }} >
           <Button type="primary" onClick={this.props.handleSearch}><Icon type="sync" />查询</Button>
           <Button style={{ marginLeft: 8 }} onClick={this.props.handleReset}> 重置</Button>
         </Col>
       </Row>
     </Form>
   );

}
}
const SearchBut =Form.create()(DiffMapSearch);

export default TargetNumAnalay;
