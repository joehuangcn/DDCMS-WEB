import React,{Component} from 'react';
import { Button, Icon,Popconfirm,message,DatePicker,Select,Input,TreeSelect,Table,Modal,Row,Col,Form,Menu,Checkbox,Dropdown } from 'antd';
import {ajaxUtil} from '../../../util/AjaxUtils';
const {RangePicker} = DatePicker;
const {Option} = Select;
const {Search} =Input;
const FormItem=Form.Item;

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
class DiffDealInfo extends Component {
  constructor(props){
    super(props);
    this.state={
      columns:[],
      loading:false,
      data:[],
      pagination:{pageSize:10},
      id:'',
      permission:[],
      bizJoinTypeList:[],
      auditTypeList:[],
      query:'',
      queryKey:'',
      citys:[],
      bizList:[]
    };
  }

  componentWillMount(){
    this.getInitProps(this.props);

  }

  componentDidMount(){
    this.setHead();
    this.fetch();
    this.handleFocus();
    // this.timer=setInterval(()=>{this.reflash()},5000);
    // this.fetch();
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
    ajaxUtil("urlencoded","constant!getCityCodeEntryAllList.action","",this,(data,that)=>{
      this.setState({citys:data.data});
    });
    ajaxUtil("urlencoded","business!getBusAfterNew.action","",this,(data,that)=>{
        this.setState({bizList:data});
    });
  }

  // 渲染工作
  setHead=() =>{
    const columns =[
        { title:'业务名称', dataIndex:'bizname' , key:'bizname',sorter: true},
        { title:'提数日期', dataIndex:'obtaindatatime' , key:'obtaindatatime',},
        { title:'地市', dataIndex:'citycode' , key:'citycode',render:(text) =>(this.renderCity(text))},
        { title:'差异代码', dataIndex:'diffcode' , key:'diffcode'},
        { title:'差异名称', dataIndex:'diffname' , key:'diffname',},
        { title:'差异总量', dataIndex:'difftotal' , key:'difftotal',render:(text,record,index) =>(this.renderDifftotal(text,record,index))},
        { title:'新增差异', dataIndex:'ndcy' , key:'ndcy',render:(text,record,index) =>(this.renderNdcy(text,record,index))},
        { title:'历史差异', dataIndex:'his' , key:'his',render:(text,record,index) =>(this.renderHis(text,record,index))},
        { title:'历史差异细分', dataIndex:'hisdetail' , key:'hisdetail',render:(text,record) =>(this.renderHisdetail(text,record))},
        { title:'差异清理量', dataIndex:'dealnum' , key:'dealnum',},
        { title:'差异环比', dataIndex:'relative' , key:'relative',},
    ];


    // let action ={
    //   title:'操作',
    //   key:'action',
    //   render : (text, record) => {
    //     let permission=this.state.permission;
    //     let edit='true';let start='true';let deletes='true';
    //     let activeDis=false; let activeColor="green";
    //     if(permission.indexOf('edit')===-1){
    //         edit='none'
    //     }
    //     if (permission.indexOf('add')===-1) {
    //       start='none'
    //     }
    //     if (permission.indexOf('del')===-1) {
    //       deletes='none'
    //     }
    //     // if((record.taskType=='task_fix'&& record.taskStatu!=="3")|| record.taskStatu=="1"){
    //     //     activeDis=true;
    //     //     activeColor="grey";
    //     // }
    //     return(
    //     <span>
    //      <a  style={{display:edit}} onClick = {() => {
    //        this.newbiz.showModal("edit",record);
    //      }}>修改</a>
    //      <span className="ant-divider"/>
    //      <Popconfirm title="你确定要删除该记录?" okText="是" cancelText="否" disabled onConfirm={() => {
    //        ajaxUtil("urlencoded","netelement!del.action","id="+record.netEleCode,this,(data,that) => {
    //          let status=data.success;
    //          let message= data.message;
    //            if (status==='true') {
    //              Modal.success({ title: '消息', content: message,});
    //            }else {
    //              Modal.error({ title: '消息',content: message,
    //             });
    //            }
    //           this.refresh();
    //        })
    //
    //      }}>
    //      <a style={{color:'red',display:deletes}}>删除</a>
    //      </Popconfirm>
    //     </span>
    //   )
    //   },
    // };
    // columns.push(action);
    this.setState({columns});

  }

  renderCity =(text)=>{
    if (text==="root") {
      return "全省";
    }else
      return cityCodeMap[text];
    }


  renderDifftotal=(text,record,index) =>{
    if (parseInt(text,10)<=0) {
      return text;
    }else{
      return (<a onClick={()=> {this.downloadNum(record,'all',text)}}>{text}<Icon type="download" /></a>);
    }
  }
  renderNdcy=(text,record,index) =>{
    if (parseInt(text,10)<=0) {
      return text;
    }else{
      return (<a onClick={()=> {this.downloadNum(record,'ndcy',text)}}>{text}<Icon type="download" /></a>);
    }
  }
  renderHis=(text,record,index) =>{
    if (parseInt(text,10)<=0) {
      return text;
    }else{
      return (<a onClick={()=> {this.downloadNum(record,'his',text)}}>{text}<Icon type="download" /></a>);
    }
  }

  renderHisdetail=(text,record)=>{
    let done="";
    let undone="";
    let faildone="";
    if (text[0]!="0") {
      done= (<a onClick={()=> {this.downloadNum(record,'NDTD',text[0])}}>历史差异,上月未清理 {text[0]}<Icon type="download" /></a>);
    }
    if (text[1]!=="0") {
        undone= (<a onClick={()=> {this.downloadNum(record,'DSTD',text[1])}}>历史差异,上月已清理 {text[1]}<Icon type="download" /></a>);
    }
    if (text[2]!=="0") {
        faildone= (<a onClick={()=> {this.downloadNum(record,'DFTD',text[2])}}>历史差异，上月清理失败 {text[2]}<Icon type="download" /></a>);
    }
    return (<div>{done} {undone} {faildone}</div>);
  }

  downloadNum=(record,flag,diff) =>{
    message.info("正在下载请稍后...");
    let text="cityCode="+record.citycode+"&bizCode="+record.bizcode+"&obDate="+record.obtaindatatime+"&flag="+flag+"&diff="+diff;
    window.location.href="/DDCMS/data-analyze!getDataAnalyzeDetails.action?"+text;
  }

  // 请求查询method
  fetch = ( params ={} ) => {
    this.setState({loading:true}) ;
    let page=0;
    if (params.page>1) {
      page=(params.page-1)*10;
    }
    let sort='obtaindatatime';
    if (typeof(params.sortField) !== "undefined" ) {
      sort=params.sortField;
    }
    let dir='DESC';
    if (typeof(params.sortOrder) !== "undefined" ) {
      dir=(params.sortOrder=="descend"?"desc":"asc");
    }
    const {config} = this.props;
    const {bizCode,obDate,diffCode,cityCode,removeZero}=this.state;
    const text="bizCode="+(bizCode===undefined?"":bizCode)
    +"&obDate="+(obDate===undefined?"":obDate)
    +"&diffCode="+(diffCode===undefined?"":diffCode)
    +"&cityCode="+(cityCode===undefined?"":cityCode)
    +"&removeZero="+(removeZero===undefined?"":removeZero)
    +"&dir="+dir
    +"&sort="+sort
    +"&start="+page+"&limit=10";

    ajaxUtil("urlencoded","data-analyze!getDataAnalyzeReportForNew.action",text,this,(data,that) => {
      const pagination = that.state.pagination;
      pagination.total = parseInt(data.total,10);
      this.setState({
          loading: false,
          data: data.data,
          pagination,
      });
    });
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
  refresh=() =>{
    let pagination=this.state;
    pagination.current=1;
    this.setState({pagination},()=>{this.fetch();});
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
   this.setState({bizCode:'',obDate:'',diffCode:'',cityCode:'',removeZero:false},()=>{this.fetch()});
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
     let cityCode=values.cityCode===undefined?'':values.cityCode;
     let removeZero=values.removeZero===undefined?'':values.removeZero;
     this.setState({bizCode,obDate,diffCode,cityCode,removeZero},()=>{this.fetch()});
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
      <SearchBut ref={(ref) => this.form = ref} handleSearch={this.handleSearch} handleReset={this.handleReset}   citys={this.state.citys}
       bizList={this.state.bizList} exportMes={e =>this.exportMes(e)} />
    <Table rowKey='bizCode' columns={this.state.columns}  loading={this.state.loading} dataSource={this.state.data}
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
   const {bizList}=this.props;
   const {diffCodes,obList}=this.state;
  //  const menu = (
  //     <Menu onClick={this.props.exportMes}>
  //       <Menu.Item key="1">导出选中</Menu.Item>
  //     </Menu>
  //     );
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
          <Select  style={{ width: 150 }} placeholder="提数日期" allowClear={true}>
              {obList.map(d =><Option key={d.fieldCode} value={d.fieldCode}>{d.fieldName}</Option>)}
          </Select>
        )}
      </FormItem>
      </Col>
       <Col span={3}>
        <FormItem {...formItemLayout} label="" >
          {getFieldDecorator("diffCode")(
            <Select  style={{ width: 150 }} placeholder="差异代码" allowClear={true}>
                {diffCodes.map(d =><Option key={d.diffCode} value={d.diffCode}>{d.diffCode}</Option>)}
            </Select>
          )}
        </FormItem>
        </Col>
        <Col span={4} >
            <FormItem { ...cityItemLayout} label="城市">
              {getFieldDecorator("cityCode")(
                <Select  placeholder="选择地市" style={{ width: 120 }}  allowClear={true}>
                  {this.props.citys.map(d=> <Option key={d.key} value={d.key}>{d.value}</Option>)}
                </Select>
              )}
            </FormItem>
         </Col>
         <Col span={2} >
         <FormItem {...formItemLayout} label="">
           {getFieldDecorator("removeZero",{initialValue:true})(
             <Checkbox style={{marginLeft:8, width: 120 }} >差异量不为0</Checkbox>
           )}
         </FormItem>
         </Col>
         <Col span={6} style={{ textAlign: 'center' }} >
           <Button type="primary" onClick={this.props.handleSearch}><Icon type="sync" />查询</Button>
           <Button style={{ marginLeft: 8 }} onClick={this.props.handleReset}> 重置</Button>
              <Button onClick={this.props.exportMes}>
                <Icon type="file-excel" />导出<Icon type="down" />
              </Button>
         </Col>
       </Row>
     </Form>
   );

}
}
const SearchBut =Form.create()(DiffMapSearch);

export default DiffDealInfo;
