import React,{Component} from 'react'
import { Table, Button,Select,DatePicker,message,Form,Dropdown,Menu,Icon} from 'antd';
import { Row, Col } from 'antd';
import {ajaxUtil} from '../../../util/AjaxUtils';
const {RangePicker} = DatePicker;
const Option = Select.Option;
const FormItem = Form.Item;
class StatReportGridXJ extends Component {
  constructor(props) {
    super(props);
    this.state={
      data:[],
      total:'',
      loading: false,
      queryCity:'',
      startDate:'',
      endDate:'',
      columns:[],
      pagination:{},
      citys:[],
      selectedRowKeys:[],
      config:props.config,
    }
  }

  componentWillMount(){
    // this.getDynColumnHead();
  }
  // componentDidMount() {
  //   this.fetch();
  // }
  componentWillReceiveProps(props){
    if (props.config.bizCode!== this.state.config.bizCode) {

      const {config}=props;
      this.setState({
        data:[],
        total:'',
        loading: false,
        queryCity:'',
        startDate:'',
        endDate:'',
        columns:[],
        pagination:{},
        citys:[],
        config:config,
      },() =>this.fetch());
      this.form.resetFields();
      this.getDynColumnHead(config);
    }
  }
  reflash= () => {
    this.fetch();
  }

  handleExport=()=>{
     const {config} = this.props;
     message.success('正在导出', 2);
     fetch('/DDCMS/audit-stat!loadXLS.action', {
        method: 'POST',
        credentials: 'include',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body:'',
     })
  }
  getDynColumnHead=(config)=>{
    const constColumns =[{
      title: '稽核日期',dataIndex: 'AUDITTIME',  key: 'AUDITTIME',width:150},
    { title: '提数日期',  dataIndex: 'OBTAINDATATIME',  key: 'OBTAINDATATIME',width:150},
    { title: '城市',  dataIndex: 'CITYCODE',    key: 'CITYCODE', width:100 },
    {  title: '区域',dataIndex: 'DEPT',  key: 'DEPT', width:130 },
    {  title: '业务名称',dataIndex: 'BIZNAME',  key: 'BIZNAME', width:150},
     {title: '业务代码',dataIndex: 'BIZCODE',  key: 'BIZCODE',width:150},
     {  title: '一致总量',  dataIndex: 'SAMETOTAL',key: 'SAMETOTAL',width:160},
     {  title: '差异总量',   dataIndex: 'DIFFTOTAL',  key: 'DIFFTOTAL',width:160},
     {  title: '稽核总量',dataIndex: 'AUDITTOTAL',  key: 'AUDITTOTAL', width:160 }
   ];
       const text="bizCode="+config.bizCode;
       fetch('/DDCMS/audit-stat!getDynColumnHead.action', {
          method: 'POST',
          credentials: 'include',
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body:text,
       }).then((response) => {

            return response.text();
          }).then((text)  => {
             let resArray = text.split(',');
            //  let addcolumns="";
            let cols=constColumns;

             for (let i = 0; i < resArray.length; i++) {
                let f = resArray[i];
                let head="";
                if (config.bizCode.substring(0,1)==1){
                  head = f.replace("BOSS","ESOP").replace("FLAT","业务平台").replace("MAS","行业网关");
                }else{
                  head = f;
                }

                let addcolumns={title:head+"总量", dataIndex:f,key: f ,width:160};
                // +",{title:'"+head+"一致率(一致总量/BOSS总量)',dataIndex:'CURR_MOTH_"+f+"',key: 'CURR_MOTH_"+f+"',}"
                // +",{title:'上月同期"+head+"一致率(一致总量/BOSS总量)',dataIndex:'PREV_MOTH_"+f+"',key: 'PREV_MOTH_"+f+"',}"
                // +",{title:'上年同期"+head+"一致率(一致总量/BOSS总量)',dataIndex:'PREV_YEAR_"+f+"',key: 'PREV_YEAR_"+f+"',}"
                cols.push(addcolumns);
                // addcolumns=this.state.columns.substring(0,this.state.columns.length-1);
                // +"]";

                // this.state.columns=cols;
             }
             if (config.bizCode.substring(0,1)==1) {

             }
             let name=config.bizCode.substring(0,1)===1?'ESOP':'BOSS';
             let CURR_MOTH_BOSS_HEADER=name+"一致率(一致总量/"+name+"总量)";
             let PREV_MOTH_BOSS_HEADER="上月同期"+name+"一致率(上月同期一致总量/上月同期"+name+"总量)"
             cols.push({title:'数据一致率(一致总量/稽核总量)',dataIndex:"YLPER" ,key:"YLPER",width:300,render:(text) =>(text+"%")});
             cols.push({title:CURR_MOTH_BOSS_HEADER , dataIndex:'CURR_MOTH_BOSS', key:'CURR_MOTH_BOSS',width:300,render:text =>(text+"%")});
             cols.push({title:PREV_MOTH_BOSS_HEADER,dataIndex:'PREV_MOTH_BOSS',key:"PREV_MOTH_BOSS",width:300,render:text =>(text+"%")});
             this.setState({columns:cols});
            //  dyClum=cols;
         }).catch((error) => {
            console.error(error);
    });
    ajaxUtil("urlencoded","constant!getCityCodeEntryAllList.action","",this,(data,that)=>{
      this.setState({citys:data.data});
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
  fetch = (params = {}) => {
     this.setState({loading:true});
     let page=0;
     if (params.page>1) {
       page=(params.page-1)*10;
     }
    //  const {config} = this.props;
    let sort='OBTAINDATATIME';
    if (typeof(params.sortField) !== "undefined" ) {
      sort=params.sortField;
    }
    let dir='DESC';
    if (typeof(params.sortOrder) !== "undefined" ) {
      dir=(params.sortOrder=="descend"?"desc":"asc");
    }
    const {config}=this.state;
     const text="startDate="+this.state.startDate
     +"&endDate="+this.state.endDate
     +"&cityCode="+this.state.queryCity
     +"&bizCodeParam="+config.bizCode
     +"&auditType="+config.auditType
     +"&dataScope="+config.dataScope
     +"&dataType="+config.dataType
    //  +"&sort="+config.sort
    //  +"&dir="+config.dir
     +"&start="+page+"&limit=10&sort="+sort+"&dir="+dir;


     ajaxUtil("urlencoded","audit-stat!getAuditStatListOfJson.action",text,this,(data,that)  => {
       const pagination = that.state.pagination;
       pagination.total = parseInt(data.totalProperty,10);
       this.setState({
           loading: false,
           data: data.root,
           pagination,
       });
     });
   }

   handleReset = () => {
    this.form.resetFields();
    this.setState({queryCity:'',startDate:'',endDate:''},()=>{this.fetch()});
  }

  handleSearch=(e) => {
    const form= this.form;
    form.validateFields(( err, values) => {
      if (err) {
        return;
      }

      let queryCity=values.citys===undefined?'':values.citys;
      let startDate=values.startDate===undefined||values.startDate==null?'':values.startDate.format('YYYY-MM-DD');
      let endDate=values.endDate===undefined||values.endDate==null?'':values.endDate.format('YYYY-MM-DD');
      this.setState({queryCity,startDate,endDate},()=>{this.fetch()});
   })
}

exportMes=(e)=>{
   const {config,pagination} = this.state;
   let synId='';
   let downflag='';
   let text="startDate="+this.state.startDate
   +"&endDate="+this.state.endDate
   +"&cityCode="+this.state.queryCity
   +"&bizCodeParam="+config.bizCode
   +"&auditType="+config.auditType
   +"&dataScope="+config.dataScope
   +"&dataType="+config.dataType
  //  +"&sort="+config.sort
  //  +"&dir="+config.dir
   if (e.key==='1') {
     if (this.state.selectedRowKeys.length<=0) {
        message.warning("请选择需要导出的列");
     }else{
       text+="&flag=selected&ids="+this.state.selectedRowKeys;
       console.log(text);
      //  this.help(text);
       window.location.href="/DDCMS/audit-stat!loadXLS.action?"+text;
     }
   }else if (e.key==='2') {
      text+="&flag=all&ids=";
       console.log(text);
      // this.help(text);
      window.location.href="/DDCMS/audit-stat!loadXLS.action?"+text;
   }
}

onSelectChange = (selectedRowKeys) => {

this.setState({ selectedRowKeys });
}
  render() {
    const {selectedRowKeys}=this.state;
    const rowSelection = {
     selectedRowKeys,
     onChange: this.onSelectChange,
   };
    return(
    <div>
      <SearchBut ref={(ref) => this.form = ref} handleSearch={this.handleSearch} handleReset={this.handleReset}  citys={this.state.citys} exportMes={e =>this.exportMes(e)}/>
      <Table columns={this.state.columns}  loading={this.state.loading} dataSource={this.state.data} rowSelection={rowSelection}
      pagination={this.state.pagination} onChange={this.handleTableChange}  scroll={{x:'120%',y:'120%'}} />
    </div>)
  }
}


class StatSearch extends Component {
  render() {
    const { getFieldDecorator } = this.props.form;
   const formItemLayout = {
     labelCol: { span: 10 },
     wrapperCol: { span: 14 },
   };
   const menu = (
      <Menu onClick={this.props.exportMes}>
        <Menu.Item key="1">导出选中</Menu.Item>
        <Menu.Item key="2">导出全部</Menu.Item>
      </Menu>
      );
   return(
    <Form layout="inline"  >
       <Row gutter={24}>
       <Col span={4} >
        <FormItem {...formItemLayout} label="城市">
          {getFieldDecorator("citys")(
            <Select  placeholder="选择地市" style={{ width: 120 }} onChange={this.city} allowClear={true}>
              {this.props.citys.map(d=> <Option key={d.key} value={d.key}>{d.value}</Option>)}
            </Select>
          )}
        </FormItem>
        </Col>
        <Col span={4}>
         <FormItem {...formItemLayout} label="开始时间" >
           {getFieldDecorator("startDate")(
               <DatePicker  placeholder="开始时间"/>
           )}
         </FormItem>
         </Col>
         <Col span={4} >
          <FormItem {...formItemLayout} label="结束时间">
            {getFieldDecorator("endDate")(
                <DatePicker  placeholder="结束时间" />
            )}
          </FormItem>
          </Col>
         <Col span={8} style={{ textAlign: 'right' }} >
           <Button type="primary" onClick={this.props.handleSearch}>查询</Button>
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
const SearchBut =Form.create()(StatSearch);

export default StatReportGridXJ;
