import React,{Component} from 'react'
import { Button, Icon,Popconfirm,message,Select,Input,TreeSelect,Table,Modal,Col,Row,Form} from 'antd';
import {ajaxUtil} from '../../../util/AjaxUtils';
import uuid from 'node-uuid';
const Option = Select.Option;
const FormItem = Form.Item;
const confirm=Modal.confirm;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};
class  BusInfoModal extends Component {
  constructor(props) {
    super(props);
  }

  handleRenderTab=(type,formItemLayout,label,name,required,initValue,SourceList,rows,info) =>{
    const {getFieldDecorator} = this.props.form;
    let renderSome;
    switch (type) {
      case 'input':
              renderSome=<Input placeholder="请输入"/>
        break;
        case 'select':
              renderSome= <Select  placeholder="请选择" >
                              {SourceList.map(d=> <Option key={d.dicCode} value={d.dicCode}>{d.dicName}</Option>)}
                          </Select>
        break;
        case 'dicName':
              renderSome= <Select  placeholder="请选择" >
                              {SourceList.map(d=> <Option key={d.dicName} value={d.dicName}>{d.dicName}</Option>)}
                          </Select>
          break;
          case 'textarea':
              renderSome= <TextArea placeholder={info}   rows={rows}/>; break;
      default:break;
    }
    return (
      <FormItem {...formItemLayout } label={label}>
       {getFieldDecorator(name,{
         rules:[{ required:required, message:label+'不能为空',}],
         initialValue:initValue?initValue:""
       })
       (
         renderSome
      )}
     </FormItem>

   );
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const {record,action,auditTypeList,dataScopeList} =this.props;
    const inputFormItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 8 },
    };
    const textFormItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 16 },
    };
    return (
      <div>
            <Form>
            <Row gutter={12}>
            <Col span={12}>
              {this.handleRenderTab("input",formItemLayout,"业务编码","busiJoin.bizcode",true,record.bizcode,[],0,'')}
             </Col>
             <Col span={12}>
               {this.handleRenderTab("input",formItemLayout,"业务名称","busiJoin.bizName",true,record.bizName,[],0,'')}
            </Col>
            </Row>
            <Row>
            <Col span={12}>
            {this.handleRenderTab("input",formItemLayout,"稽核网元","busiJoin.netCode",true,record.netCode,[],0,'')}
             </Col>
             <Col span ={12}>
               {this.handleRenderTab("input",formItemLayout,"稽核频率","busiJoin.rate",true,record.rate,[],0,'')}
             </Col>
             </Row>
             <Row gutter={4}>
             <Col span={12}>
             {this.handleRenderTab("input",formItemLayout,"稽核时间","busiJoin.auditTime",true,record.auditTime,[],0,'')}
              </Col>
              <Col span ={12}>
                {this.handleRenderTab("input",formItemLayout,"稽核进度","busiJoin.progress",true,record.progress,[],0,'')}
              </Col>
             </Row>
            <Row gutter={24}>
            <Col span ={12}>
            {this.handleRenderTab("select",formItemLayout,"业务类型","busiJoin.type",true,record.type,auditTypeList,0,'')}
            </Col>
            <Col span={12}>
            {this.handleRenderTab("dicName",textFormItemLayout,"稽核范围","busiJoin.auditType",true,record.auditType,dataScopeList,0,'')}
             </Col>
            </Row>
            <Row>
              {this.handleRenderTab("textarea",formItemLayout,"备注","busiJoin.mark",false,record.mark,[],2,'')}
            </Row>
            </Form>
      </div>
    );
  }
}
const BusForm= Form.create()(BusInfoModal);

class  BusinessInfoList extends Component {
  constructor(props) {
    super(props);
    this.state={
      columns:[],
      pagination:{},
      loading:false,
      data:[],
      bizCode:props.bizCode,
      selectedType:props.selectedType,
      dataScopeList:[],
      auditTypeList:[],
      visible:false,
      confirmLoading: false,

    }
  }

  componentWillMount(){
    this.getColums();
    this.getConditionList();
  }

  getConditionList =() =>{
    ajaxUtil("urlencoded","dictionaryAction!getDictionaryListByType.action","name=DICT_DataScope",this,(data,that)=>{
      this.setState({dataScopeList:data.data});
    });
    ajaxUtil("urlencoded","dictionaryAction!getDictionaryListByType.action","name=DICT_AuditType",this,(data,that)=>{
      this.setState({auditTypeList:data.data});
    });
  }

  componentWillReceiveProps(nextProps) {
    const {bizCode,selectedType}=nextProps;
    if (bizCode!==this.state.bizCode||selectedType!==this.state.selectedType) {
      this.fetch({bizCode:bizCode,selectedType:selectedType});
    }
  }

  getColums=()=>{
    const columns =[
        { title:'业务编码', dataIndex:'bizcode' , key:'bizcode',width:100},
        { title:'业务名称', dataIndex:'bizName' , key:'bizName',width:120},
        { title:'稽核类型', dataIndex:'auditType', key:'auditType',width:100},
        { title:'稽核网元', dataIndex:'netCode' , key:'netCode',width:120},
        { title:'稽核频率', dataIndex:'rate' , key:'rate',width:100},
        { title:'稽核时间', dataIndex:'auditTime' , key:'auditTime',width:100},
        { title:'稽核进度', dataIndex:'progress' , key:'progress',width:100},
        { title:'备注', dataIndex:'mark' , key:'mark',width:200},
    ];
    let action ={
      title:'操作',
      key:'action',
      width:120,
      fixed: 'right',
      render : (text, record) => {
        let permission=this.props.permission;
        let deletes='true';  let edit='true';
        let activeDis=false; let activeColor="green";
        if (permission.indexOf('del')==-1) {
          deletes='none'
        }
        if(permission.indexOf('edit')===-1){
            edit='none'
        }

        return(
        <span>
        <a  style={{color:'green',display:edit}} onClick = {() => {
          this.showModal("edit",record);
        }}>修改</a>
        <span className="ant-divider"/>
         <Popconfirm title="你确定要删除该配置项?" okText="是" cancelText="否" disabled onConfirm={() => {
             const text="bizcode="+record.bizcode;
           ajaxUtil("urlencoded","busi-join!del.action",text,this,(data,that) => {
             let status=data.success;
               if (status==='true') {
                 message.success("删除成功");
               }else{
                  message.error("删除失败");
               }
              this.refresh();
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
    this.setState({loading:true});
    let bizCode=""; let selectedType="";
    if (params.bizCode!==undefined) {
      bizCode=params.bizCode;
      this.setState({bizCode:params.bizCode });
    }else{
      bizCode=this.props.bizCode;
    }
    if (params.selectedType!==undefined) {
      selectedType=params.selectedType;
      this.setState({selectedType:params.selectedType });
    }else{
      selectedType=this.props.selectedType;
    }


    let page=0;
    if (params.page>1) {
      page=(params.page-1)*10;
    }
    let sort='busiJoin.bizcode';
    if (typeof(params.sortField) !== "undefined" ) {
      sort=params.sortField;
    }
    let dir='ASC';
    if (typeof(params.sortOrder) !== "undefined" ) {
      dir=(params.sortOrder=="descend"?"desc":"asc");
    }
    // const {auditType,dataScope,dataType}=this.state;
    const text="join="+(bizCode==undefined?"":bizCode)
    +"&type="+(selectedType==undefined?'':selectedType)
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
        ajaxUtil("urlencoded","busi-join!getBusiJoinJsonList.action",text,this,(data,that) => {
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


  handleCancel = (e) => {
    // this.form.resetFields();
    this.setState({visible:false});
  }

  handleOk=(e) =>{
    const form= this.form;
    form.validateFields(( err, values) => {
      if (err) {
        return;
      }
      if(this.state.bizCode===""||this.state.bizCode==undefined){
        message.warning("请先选择业务期数");
      }else{
      this.setState({
        confirmLoading:true,
      });
      const text="busiJoin.bizcode="+values.busiJoin.bizcode
      +"&busiJoin.bizName="+values.busiJoin.bizName
      +"&busiJoin.netCode="+values.busiJoin.netCode
      +"&busiJoin.rate="+values.busiJoin.rate
      +"&busiJoin.auditTime="+values.busiJoin.auditTime
      +"&busiJoin.progress="+values.busiJoin.progress
      +"&busiJoin.auditType="+values.busiJoin.auditType
      +"&busiJoin.type="+values.busiJoin.type
      +"&busiJoin.mark="+(values.busiJoin.mark===undefined?"":values.busiJoin.mark)
      +"&busiJoin.join="+this.state.bizCode
      +"&act="+this.state.action;
      ajaxUtil("urlencoded","busi-join!save.action",text,this,(data,that) => {
        let status=data.success;
        let message= data.message;
        this.setState({
          visible: false,
          confirmLoading: false,
        });
        // this.form.resetFields();
          if (status==='true') {
            Modal.success({
             title: '消息',
             content: message,
            });
          }else {
            Modal.error({
              title: '消息',
              content: message,
           });
          }
          this.refresh();
        });
    }
    });
  }

  showModal =(action,record) => {
   this.setState({
     visible:true,
     record:record,
     action:action
   });
  }

  handleModal = () => {
    this.setState({
      visible:true,
      record:[],
      action:'add'
    });
  }

  refresh =() =>{
    // this.setState({})
    this.fetch();
    let pagination=this.state;
    pagination.current=1;
    this.setState({pagination});
  }

  render(){
    const  {auditTypeList,dataScopeList,visible,confirmLoading,bizCode}=this.state;
    return(
      <div>
      <Button type='primary' onClick={this.handleModal} disabled={this.state.addBtnPermiss}>新增</Button>
      <Table rowKey="bizcode" columns={this.state.columns}  loading={this.state.loading} dataSource={this.state.data}
     size="small"  pagination={this.state.pagination} onChange={this.handleTableChange} scroll={{x:'120%'}} />
      <Modal key={uuid.v1()} visible={visible} onOk={this.handleOk} onCancel={this.handleCancel} width={750}
               title="编辑" confirmLoading={confirmLoading} okText="保存">
        <BusForm ref={(ref) => this.form = ref} bizCode={bizCode} record={this.state.record} action={this.state.action}
            dataScopeList={dataScopeList} auditTypeList={auditTypeList}
             />
      </Modal>
     </div>
    );
  }
}

export default BusinessInfoList;
