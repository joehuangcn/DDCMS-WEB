import React,{Component} from 'react';
import {Card,Icon,Table,Tooltip,Button,Popconfirm,Modal,Input,Form,message} from 'antd';
import {ajaxUtil} from '../../../util/AjaxUtils';
import {Link} from 'react-router-dom';
import uuid from 'uuid';
const {TextArea}=Input;
const FormItem=Form.Item;
class OrderMes extends Component {
  constructor(props){
    super(props);
    this.state={
      loading:false,
      pagination:{pageSize:5},
      data:[],
      columns:[],
      visible:false,
      modalTitle:''
    };
  }
  componentWillMount(){
    this.getDynAction();
    this.getWorkOrderDetail();
  }

  componentDidMount(){
    this.fetchData();
  }

  getDynAction =() => {
    const columns=[{
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render:(value,row,index) =>(this.renderStatu(value,row,index))
    },{
      title:'操作',
      key:'action',
      render : (text, record) => {
         let so=this.switchAction(text,record);
        return(
          <div>
          {so}
        </div>
      )
    }
    },{
      title:'工单名称',
      dataIndex:'workOrderName',
      key:'workOrderName',
    },{
      title:'创建人',
      dataIndex:'fromPerson.name',
      key:'fromPerson',
    },{
      title:'审核人1',
      dataIndex:'reviewPerson.name',
      key:'reviewPerson',
    },{
      title:'审核人2',
      dataIndex:'reviewPersonRe.name',
      key:'reviewPersonRe',
    },{
      title:'指派人员',
      dataIndex:'toPerson',
      key:'toPerson',
      render:(value,row ,index) =>{
        return this.renderSomeName(value,row,index);
      }
    },{
      title:'实际执行人员',
      dataIndex:'checkHandler.name',
      key:'checkHandler',
    },{
      title:'结束人员',
      dataIndex:'checkEndPerson.name',
      key:'checkEndPerson',
    },{
      title:'优先级',
      dataIndex:'priority',
      key:'priority',
      render:(value) =>(this.renderPriority(value))
    },{
      title:'期望完成时间',
      dataIndex:'wishEndTime',
      key:'wishEndTime',
    }];
    this.setState({columns});
  }

  switchAction=(value,record)=>{
    let so;
    switch(record.status){
      case 0:
        so=(<div>
          <Tooltip placement="topLeft" title="审查通过" arrowPointAtCenter>
            <Button type="primary" shape="circle" size='small'  onClick={()=>{this.showCheckInfo("审查通过",1,record)}} ><Icon type="check"/></Button>
         </Tooltip>
         <Tooltip placement="topLeft" title="驳回" arrowPointAtCenter>
            <Button type="danger" shape="circle" size='small' onClick={()=>{this.showCheckInfo("驳回操作",-1,record)}} ><Icon type="rollback" /></Button>
        </Tooltip>
        </div>
      );
        break;
      case 1:
          so=(<div><Tooltip placement="topLeft" title="审查通过" arrowPointAtCenter>
            <Button type="primary" shape="circle" size='small'  onClick={()=>{this.showCheckInfo("执行操作",2,record)}} ><Icon type="check"/></Button>
         </Tooltip>
         <Tooltip placement="topLeft" title="驳回" arrowPointAtCenter>
            <Button type="danger" shape="circle" size='small' onClick={()=>{this.showCheckInfo("驳回操作",-1,record)}} ><Icon type="rollback" /></Button>
        </Tooltip></div>);
        break;
      case 2:
          so=<Tooltip placement="topLeft" title="执行" arrowPointAtCenter>
          <Button type="primary" shape="circle" icon="clock-circle-o" size='small' onClick={()=>{this.showCheckInfo("执行操作",4,record)}}/>
          </Tooltip>
        break;
      case 3:
        so=<Tooltip placement="topLeft" title="确定" arrowPointAtCenter>
        <Button type="primary" style={{backgroundColor:'green'}} shape="circle" icon="check" size='small' onClick={()=>{this.showCheckInfo("完成操作",4,record)}} />
        </Tooltip>
        break;
      case 4:
        so=<Tooltip placement="topLeft" title="结束" arrowPointAtCenter>
        <Button type="primary"  shape="circle" icon="close" size='small' onClick={()=>{this.showCheckInfo("结束操作",5,record)}}/></Tooltip>
        break;
      case 5:
        so=(<div>
          <Tooltip placement="topLeft" title="关闭" arrowPointAtCenter>
            <Button style={{backgroundColor:'#FF00FF'}} shape="circle" icon="poweroff" size='small' onClick={()=>{this.showCheckInfo("关闭操作",6,record)}}/>
         </Tooltip>
         <Tooltip placement="topLeft" title="不通过" arrowPointAtCenter>
              <Button type="danger" shape="circle" icon="rollback" size='small' onClick={()=>{this.showCheckInfo("结果审核不通过",3,record)}}/>
        </Tooltip>
        </div>)
        break;
      case -1:
        so=<Tooltip placement="topLeft" title="关闭" arrowPointAtCenter>
             <Button  style={{backgroundColor:'#FF00FF'}} shape="circle" icon="poweroff" size='small' onClick={()=>{this.showCheckInfo("关闭操作",6,record)}} />
         </Tooltip>
        break;
        default: break;
    };
    return so;
  }
  renderStatu=(value,row,index)=> {
    switch (value) {
      case -1:
        return "派单审核未通过";
        break;
      case 0:
        return "待审查";
        break;
      case 1:
        return "待审查";
        break;
      case 2:
        return "待执行";
        break;
       case 3:
         return "结果审核未通过";
          break;
        case 4:
          return "执行中";
          break;
        case 5:
          return "完成";
          break;
        case 6:
          return "关闭";
          break;
      default:return "";

    }
  }
  renderPriority=(value)=>{
    switch (value) {
      case '1':
        return "高";
      case '2':
        return "中";
      case '3':
       return "低";
      default:return "";
    }
  }
  renderSomeName= (value,row ,index)=>{
      if(value!=='undefined' || value!==''){
        let renderName='';
        for (var i = 0; i < value.length; i++) {
          if (i<value.length-1) {
              renderName+= value[i].name+",";
          }else {
              renderName+=value[i].name
          }
        }
        return renderName;
      }
      return value;
    }

  getWorkOrderDetail=()=>{
    ajaxUtil("urlencoded","module!getModleByRouter.action","router=/WorkOrder",this,(data,that) => {
      console.log(data);
      this.setState({menu:data});
    });
  }

 showCheckInfo=(text,updataStat,record) =>{
   this.newbiz.showCheckInfo(text,updataStat,record);
 }
  handleTableChange=(pagination,filters,sorter)=> {
    const pager={...this.state.pagination};
    console.log('pager',pager);
    pager.current=pagination.current;
    this.setState({
      pagination:pager,
    });
    this.fetchData({
      results: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters,
    });
  }

  fetchData=(params ={} )=>{
    this.setState({loading:true});
    console.log('params',params);
    let page=0;
    if (params.page>1) {
      page=(params.page-1)*5;
    }
    let sort='';
    if (typeof(params.sortField) !== "undefined" ) {
      sort=params.sortField;
    }
    let dir='';
    if (typeof(params.sortOrder) !== "undefined" ) {
      dir=params.sortOrder;
    }
    const text="&dir="+dir+"&sort="+sort
    +"&start="+page+"&limit=5";

    ajaxUtil("urlencoded","work-order!getPersonalList.action",text,this,(data,that)=>{
      console.log("fetch data ",data);
      const pagination = that.state.pagination;
      pagination.total = parseInt(data.total,10);
      that.setState({
          loading: false,
          data: data.data,
          pagination,
      });
    });
  }

  render(){
    const {menu}=this.state;
     let routerpoint={pathname:"/WorkOrder",state:menu};
    return (
      <Card title='待办工单' extra={<Link to={routerpoint}>More</Link>}>
        <div>
        <Table rowKey='woid' columns={this.state.columns} dataSource={this.state.data} loading={this.state.loading}
                pagination={this.state.pagination}
                onChange={this.handleTableChange}
                scroll={{x:1300}}
        />
        <CheckModalForm ref={(ref) => this.newbiz=ref}  modalTitle={this.state.modalTitle} />
        </div>
      </Card>
    );
  }
}


class ReturnInfoForm extends Component {
  render(){
    const {form}=this.props;
    const {getFieldDecorator}=form;
    return(
      <Form >
      <FormItem label="处理结果备注">
        {getFieldDecorator('comments')(<TextArea rows={4}/>)}
      </FormItem>
      </Form>
    );
  }
}
const ModalForm = Form.create()(ReturnInfoForm)
class CheckModalForm extends Component {
  constructor(props){
    super(props);
    this.state={
      modalTitle:'',
      visible:false
    }
  }

  showCheckInfo=(text,updateStat,record) =>{
    console.log('showCheckInfo',text);
    this.setState({
      visible:true,
      modalTitle:text,
      record:record,
      updateStat:updateStat
    });
  }
  hideModal=(e)=> {
    const form=this.form;
    this.setState({visible:false});
      form.resetFields();
  }

  afterClose=() =>{

  }
  handleOk=(e)=> {
    const form=this.form;
    const {record,updateStat}=this.state;
    this.setState({
      confirmLoading:true,
    });
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const text="workOrder.status="+updateStat+"&workOrder.woid="+record.woid+"&workOrder.dealResult="+values.comments;
      ajaxUtil("urlencoded","work-order!updateStatus.action",text,this,(data,that)=>{
          let status=data.success;
          let backMessage= data.message;
          this.setState({
            visible: false,
            confirmLoading: false,
          });

          if (status===true) {
            // Modal.success({
            //  title: '消息',
            //  content: backMessage,
            // });
            message.success(backMessage, 3);
          }else {
            message.error(backMessage, 3);
          }
      })
      form.resetFields();
    })

  }
  render(){
    const {modalTitle,visible,confirmLoading}=this.state;
  return (
    <Modal title={modalTitle} visible={visible} onCancel={this.hideModal} afterClose={this.afterClose}
     confirmLoading={confirmLoading} onOk={this.handleOk}>
      <ModalForm ref={(ref) => this.form = ref}  />
    </Modal>
  )
}
}
export default OrderMes;
