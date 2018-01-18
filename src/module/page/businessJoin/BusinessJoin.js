import React,{Component} from 'react'
import {ajaxUtil} from '../../../util/AjaxUtils';
import { Tree,Card,Col ,Row,Button, Icon,Popconfirm,message,Select,Input,Table} from 'antd';
import BusinessInfoList from './BusinessInfoList';

class BusinessJoin extends Component{
  constructor(props){
    super(props);
    this.state={
      permission:[],
      bizCode:'',
      bizName:'',
      tableData:{},
      tableInfo:{},
      selectedType:'',
    }
  }

  componentWillMount(){
    this.getInitProps(this.props);
    // this.getColum();
  }
  componentDidMount(){

  }
  // 初始化
  getInitProps=(props)=>{
   //  console.log(props);
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

  changebizNode=(selectedKeys,title) =>{
    console.log(selectedKeys+""+title);
    this.setState({bizCode:selectedKeys,bizName:title});
  }

  handleSelectNet=(data) =>{
    this.setState({selectedType:data})
  }

  render (){
    const {auditTypeList,auditScopeList,dataTypeList,bizCode,bizName,permission,tableData,tableInfo,selectedType} =this.state;
    let titleOne="业务类别("+(bizName.dicCode?bizName.dicName:'')+")";
    let titleTwo="业务列表情况("+(bizName.dicCode?bizName.dicName:'')+")";
    return (
      <div style={{ background: '#ECECEC'}}>
      <Row gutter={4}>
        <Col span={4}>
          <Card title="选择期数"  style={{minHeight:500}}>
              <JoinType changebizNode={(...title) =>this.changebizNode(...title)}/>
           </Card>
        </Col>
        <Col span={6}>
          <Card title={titleOne}  style={{minHeight:500}}>
                  <BusType bizCode={bizCode}  permission={permission} handleSelectNet={ (...data)=> this.handleSelectNet(...data)}/>
           </Card>
        </Col>
        <Col span={14}>
          <Card title={titleTwo}  style={{minHeight:500}}>
                <BusinessInfoList bizCode={bizCode}  permission={permission} selectedType={selectedType}/>
           </Card>
        </Col>
        </Row>
        </div>
    );
  }
}
  // <NetTableConfig  permission={permission}  tableData={tableData} tableInfo={tableInfo} bizCode={bizCode}/>
class JoinType extends Component{
  constructor(props){
    super(props);
    this.state={
      loading:false,
      data:[],
      columns:[{title: '接入期数',dataIndex: 'dicName', key: 'dicName',width:150}]
    };
  }

    componentWillMount() {
      this.getTreeList();
    }

    getTreeList = ()=> {
      this.setState({loading:true});
      ajaxUtil("urlencoded","dictionary!getDictionaryByType.action","dictionaryType=DICT_BusiJoin",this,(data,that)=> {
        this.setState({
          data:data.data,
          loading:false
        });
      })
    }

    // 选择列触发
    onSelect=(record) =>{
      const {bizCode}=this.state;
      const tableInfo=record;
      // const text="join="+record.dicCode+"&limit=10";
      this.props.changebizNode(record.dicCode,tableInfo);
      // ajaxUtil("urlencoded","busi-join!findType.action",text,this,(data,that) => {
      //       this.props.changebizNode(data,tableInfo);
      // });
    }
  render(){
    const rowSelection={
      type:'radio',
      onSelect:this.onSelect
    }
    return (
      <Table rowKey="dicCode" rowSelection={rowSelection} columns={this.state.columns}  loading={this.state.loading} dataSource={this.state.data}
      pagination={false}  size="small" />
    );
  }
  }

  class  BusType extends Component {
    constructor(props) {
      super(props);
      this.state={
        columns:[{ title:'业务类别', dataIndex:'name' , key:'name'},],
        pagination:{},
        loading:false,
        data:[],
        bizCode:props.bizCode
      }
    }
    componentWillReceiveProps(nextProps) {
      const {bizCode}=nextProps;
      console.log('setState之后的',bizCode);
      if (bizCode!==this.state.bizCode) {
        this.fetch({bizCode:bizCode});
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


    // 请求查询method
    fetch = ( params ={} ) => {
      console.log('params',params);
      this.setState({loading:true});
      let bizCode="";
      if (params.bizCode!==undefined) {
        bizCode=params.bizCode;
        this.setState({bizCode:params.bizCode });
      }else{
        bizCode=this.props.bizCode;
      }
      let page=0;
      if (params.page>1) {
        page=(params.page-1)*10;
      }
      let sort='bnid';
      if (typeof(params.sortField) !== "undefined" ) {
        sort=params.sortField;
      }
      let dir='ASC';
      if (typeof(params.sortOrder) !== "undefined" ) {
        dir=(params.sortOrder=="descend"?"desc":"asc");
      }
      // const {auditType,dataScope,dataType}=this.state;
      const text="join="+(bizCode==undefined?"":bizCode)
      +"&dir="+dir
      +"&sort="+sort
      +"&start="+page+"&limit=10";
      if (bizCode===undefined||bizCode==='') {
        this.setState({
            loading: false,
            data: [],
            pagination:{}
        });
      }else{
          ajaxUtil("urlencoded","busi-join!findType.action",text,this,(data,that) => {
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


    // 选择列触发
    onSelect=(record) => {
      // const {bizCode}=this.state;
      // const tableInfo=record;
      // const text="join="+record.dicCode+"&limit=10";
      // ajaxUtil("urlencoded","busi-join!getBusiJoinJsonList.action",text,this,(data,that) => {
      //       this.props.handleSelectNet(data,tableInfo);
      // });
      this.props.handleSelectNet(record.type);
    }
  render(){
    const rowSelection={
      type:'radio',
      onSelect:this.onSelect
    }
    return (
      <Table rowKey="type" rowSelection={rowSelection} columns={this.state.columns}  loading={this.state.loading} dataSource={this.state.data}
     size="small"   pagination={this.state.pagination} onChange={this.handleTableChange} />
    );
  }

  }



export default BusinessJoin;
