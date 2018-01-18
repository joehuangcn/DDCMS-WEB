import React,{Component} from 'react'
import { Button, Icon,Popconfirm,message,DatePicker,Select,Input,TreeSelect,Table,Modal,Col,Row,Form} from 'antd';
import {ajaxUtil} from '../../../util/AjaxUtils';
const Option = Select.Option;
const FormItem = Form.Item;
const confirm=Modal.confirm;
class NetConnectConfig extends Component {

  constructor(props){
    super(props);
    this.state={
      auditTypeList:[],
      auditScopeList:[],
      dataTypeList:[],
      columns:[],
      pagination:{},
      loading:false,
      data:[],
      bizCode:props.bizCode
    }
    }

    componentWillMount(){
      this.getColums();
      this.getConditionList();
    }

    componentWillReceiveProps(nextProps) {
      const {bizCode}=nextProps;
      console.log('setState之后的',bizCode);
      if (bizCode!==this.state.bizCode) {
        this.fetch({bizCode:bizCode});
      }
    }

    getColums=()=>{
      const columns =[
          { title:'网元名称', dataIndex:'netEleName' , key:'netEleName'},
          { title:'网元代码', dataIndex:'netEleCode' , key:'netEleCode'},
          { title:'是否建表', dataIndex:'isCreateTab', key:'isCreateTab',render:(text) =>(this.renderCreateT(text))},
          { title:'表名', dataIndex:'tabName' , key:'tabName'},
      ];
      let action ={
        title:'操作',
        key:'action',
        render : (text, record) => {
          let permission=this.props.permission;
          let deletes='true';
          let activeDis=false; let activeColor="green";
          if (permission.indexOf('del')==-1) {
            deletes='none'
          }

          return(
          <span>
          <a  style={{color:'green'}} onClick = {() => {
            if (record.isCreateTab==='1') {
              confirm({
                title:'表已存在,确定继续执行？', content:'重建将删除表以及已有的数据',onOk:()=>{this.handleCreatTable(record)}
            })
            }else{
            this.handleCreatTable(record);
          }
          }}>建表</a>
          <span className="ant-divider"/>
           <Popconfirm title="你确定要删除该配置项?" okText="是" cancelText="否" disabled onConfirm={() => {
               const {bizCode,auditType,dataScope,dataType}=this.state;
               const text="bizcode="+bizCode+"&auditType="+auditType+"&dataScope="+dataScope+"&dataType="+dataType+"&bnid="+record.bnid+"&isCreateTab"
                          +record.isCreateTab+"&netEleCode="+record.netEleCode+"&tabName="+record.tabName;
             ajaxUtil("urlencoded","business!delBusiNete.action",text,this,(data,that) => {
               let status=data.mess;
                 if (status==='ok') {
                   message.success("删除成功");
                 }else{
                    message.error("删除失败");
                 }
                this.handleAddPlat();
             })

           }}>
           <a style={{color:'red',display:deletes}}>删除</a>
           </Popconfirm>
          </span>
        )
        },
      };
      columns.push(action);
      this.setState({columns});

    }
    renderCreateT=(text) =>{
      if (text==='1') {
        return <a style={{color:'green'}}>已建</a>
      }else
        return <a style={{color:'red'}}>未建</a>
    }

    getConditionList =() =>{
      ajaxUtil("urlencoded","dictionaryAction!getDictionaryListByType.action","name=DICT_AuditType",this,(data,that)=>{
        this.setState({auditTypeList:data.data});
      });
      ajaxUtil("urlencoded","dictionaryAction!getDictionaryListByType.action","name=DICT_DataScope",this,(data,that)=>{
        this.setState({auditScopeList:data.data});
      });
      ajaxUtil("urlencoded","dictionaryAction!getDictionaryListByType.action","name=DICT_DataType",this,(data,that)=>{
        this.setState({dataTypeList:data.data});
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
      const {auditType,dataScope,dataType}=this.state;
      const text="bizCode="+(bizCode==undefined?"":bizCode)
      +"&auditType="+(auditType==undefined?"":auditType)
      +"&dataScope="+(dataScope==undefined?"":dataScope)
      +"&dataType="+(dataType==undefined?"":dataType)
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
          ajaxUtil("urlencoded","business!findRelatNet.action",text,this,(data,that) => {
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

    handleAuditTypeChange=(value) =>{
      this.setState({auditType:value},()=>{this.fetch()});
    }
    handleAuditScopeChange=(value) =>{
      this.setState({dataScope:value},()=>{this.fetch()});
    }
    handleDataTypeChange=(value)=>{
      this.setState({dataType:value},()=>{this.fetch()})
    }

    // 打开新建窗口
    handleModal= () => {
      const {auditType,dataScope,dataType}=this.state;
      if (auditType===''||auditType===undefined||dataScope===''||dataScope===undefined||dataType===''||dataType===undefined) {
        message.error('稽核类型,稽核范围,数据类型不能为空,请先选择！！！');
      }else{
        this.newbiz.show();
      }
    }

    handleAddPlat=() =>{
      this.fetch();
    }
    // 选择列触发
    onSelect=(record) =>{
      const {bizCode}=this.state;
      const tableInfo={"bizCode":bizCode,"auditType":record.auditType,"dataScope":record.dataScope,"dataType":record.dataType,"netEleCode":record.netEleCode};
      const text="bizCode="+bizCode+"&auditType="+record.auditType+"&dataScope="+record.dataScope+"&dataType="+record.dataType+"&netEleCode="+record.netEleCode
                +"&dir=ASC &sort=forder&limit=30";
      ajaxUtil("urlencoded","bus-net-field!getFieldJsonList.action",text,this,(data,that) => {
            this.props.handleSelectNet(data,tableInfo);
      });
    }

    //创建表
    handleCreatTable=(record) =>{
      const text="bizCode="+this.state.bizCode+"&auditType="+record.auditType+"&dataScope="+record.dataScope+"&dataType="+record.dataType+"&netCode="+record.netEleCode ;
      ajaxUtil("urlencoded","business!createDynTab.action",text,this,(data,that) => {
        let status=data.success;
        let message= data.message;
          if (status==='true') {
            Modal.success({ title: '消息', content: message,});
          }else {
            Modal.error({ title: '消息',content: message,});
          }
            this.fetch();
      });
    }
// <Button  onClick={this.handleCreatTable}><Icon type="sync" />建表</Button>
    render(){
      const {auditTypeList,auditScopeList,dataTypeList,auditType,dataScope,dataType,bizCode} =this.state;
      const rowSelection={
        type:'radio',
        onSelect:this.onSelect
      }
      return(
        <div>
        <NetConfigConditon ref={(ref) => this.newbiz=ref } bizCode={bizCode} auditType={auditType} dataScope={dataScope} dataType={dataType}  handleAddPlat={this.handleAddPlat}/>
        <Button type='primary' onClick={this.handleModal} disabled={this.state.addBtnPermiss}>配置关联</Button>

        <Select  placeholder="稽核类型" style={{ width: 120, textAlign: 'right'  }} onChange={this.handleAuditTypeChange} allowClear={true}>
          {auditTypeList.map(d=> <Option key={d.dicCode} value={d.dicCode}>{d.dicName}</Option>)}
        </Select>
        <Select  placeholder="稽核范围" style={{ width: 120 , textAlign: 'right' }} onChange={this.handleAuditScopeChange} allowClear={true}>
          {auditScopeList.map(d=> <Option key={d.dicCode} value={d.dicCode}>{d.dicName}</Option>)}
        </Select>
        <Select  placeholder="数据类型" style={{ width: 150 , textAlign: 'right' }} onChange={this.handleDataTypeChange} allowClear={true}>
          {dataTypeList.map(d=> <Option key={d.dicCode} value={d.dicCode}>{d.dicName}</Option>)}
        </Select>
        <Table rowKey="bnid" columns={this.state.columns}  loading={this.state.loading} dataSource={this.state.data}
        pagination={this.state.pagination} onChange={this.handleTableChange}   rowSelection={rowSelection} size="middle"/>
        </div>
      );
    }

}

class NetConfigConditon extends Component {
  constructor(props){
    super(props);
    this.state={
      visible:false,
      loading:false,
      pagination:{pageSize:15},
      selectedRowKeys:[],
      data:[],
      columns:[]
    }
  }
  componentWillMount(){
    const columns =[
        { title:'名称', dataIndex:'NETELENAME' , key:'NETELENAME'},
        { title:'代码', dataIndex:'NETELECODE' , key:'NETELECODE'},
    ];
    this.setState({columns});
  }

  showModal =(action,record) => {
    this.setState({
      visible:true,
    });
  }
  show=() => {
    this.setState({loading:true});
    const {auditType,dataScope,dataType,bizCode}=this.props;
    let text="bizCode="+bizCode+"&auditType="+auditType+"&dataScope="+dataScope+"&dataType="+dataType+"&sort=checked&dir=DESC&limit=15";
    ajaxUtil("urlencoded","business!getNetCheckList.action",text,this,(data,that) => {
      const pagination = that.state.pagination;
      pagination.total = parseInt(data.total,10);
      this.setState({
        selectedRowKeys:data.selectedKeys,
          loading: false,
          data: data.data,
          pagination,
      });
    });
    this.setState({
      visible:true,
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

  fetch=(params ={})=>{
    this.setState({loading:true});
    let page=0;
    if (params.page>1) {
      page=(params.page-1)*15;
    }
    // let sort='bnid';
    // if (typeof(params.sortField) !== "undefined" ) {
    //   sort=params.sortField;
    // }
    // let dir='ASC';
    // if (typeof(params.sortOrder) !== "undefined" ) {
    //   dir=(params.sortOrder=="descend"?"desc":"asc");
    // }
    const {auditType,dataScope,dataType,bizCode}=this.props;
    let text="bizCode="+bizCode+"&auditType="+auditType+"&dataScope="+dataScope+"&dataType="+dataType+"&sort=checked&dir=DESC&limit=15"+"&start="+page;
    ajaxUtil("urlencoded","business!getNetCheckList.action",text,this,(data,that) => {
      const pagination = that.state.pagination;
      pagination.total = parseInt(data.total,10);
      this.setState({
        selectedRowKeys:data.selectedKeys,
          loading: false,
          data: data.data,
          pagination,
      });
    });
  }

  onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  }

  onCancel=() =>{
    this.setState({visible:false})
  }
  onCreate=() =>{
    const {auditType,dataScope,dataType,bizCode}=this.props;
    const keys=this.state.selectedRowKeys;

    let text="bizCode="+bizCode+"&auditType="+auditType+"&dataScope="+dataScope+"&dataType="+dataType;
    for (var i = 0; i < keys.length; i++) {
      text+="&netArr="+keys[i]
    }
    ajaxUtil("urlencoded","business!saveNet.action",text,this,(data,that) => {
      if (data.success==='true') {
        message.success(data.message);
      }else{
         message.error(data.message);
      }
      this.props.handleAddPlat();
    });
  }


  render() {
    // const { getFieldDecorator } = this.props.form;
    const {auditTypeList,auditScopeList,dataTypeList} =this.props;
    const {selectedRowKeys}=this.state;
   const formItemLayout = {
     labelCol: { span: 10 },
     wrapperCol: { span: 14 },
   };
   const rowSelection={
     selectedRowKeys,
     onChange:this.onSelectChange
   }
   return(
     <Modal visible={this.state.visible} title="配置关联网元" okText="保存"  onCancel={this.onCancel} onOk={this.onCreate} >
     <Table rowKey="NETELECODE" rowSelection={rowSelection} columns={this.state.columns}  loading={this.state.loading} dataSource={this.state.data}
     pagination={this.state.pagination} onChange={this.handleTableChange} size="small" />
     </Modal>
   );
}
}

const SearchForm=Form.create()(NetConfigConditon);

export default NetConnectConfig;
