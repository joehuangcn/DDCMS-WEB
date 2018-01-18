import React,{Component} from 'react';
import { Button, Icon,Popconfirm,message,DatePicker,Select,Input,TreeSelect,Table,Modal,Form,Row,Col } from 'antd';
import {ajaxUtil} from '../../../util/AjaxUtils';
const {Option} = Select;
const FormItem = Form.Item;

class SysConfig extends Component {
  constructor(props){
    super(props);
    this.state={
      columns:[],
      loading:false,
      data:[],
      pagination:{pageSize:10},
      id:'',
      permission:[],
    };
  }

  componentWillMount(){
    this.getInitProps(this.props);

  }

  componentDidMount(){
    this.setHead();
    this.fetch();
    // this.timer=setInterval(()=>{this.reflash()},5000);
    // this.fetch();
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

  // 渲染工作
  setHead=() =>{
    const columns =[
        { title:'选择', dataIndex:'key' , key:'key',render:(text) =>(this.renderKey(text))},
        { title:'值', dataIndex:'value' , key:'value',render:(text) =>(this.renderStatu(text))},
    ];
    let action ={
      title:'操作',
      key:'action',
      render : (text, record) => {
        let permission=this.state.permission;
        let edit='true';let start='true';let deletes='true';
        let activeDis=false; let activeColor="green";
        if(permission.indexOf('edit')===-1){
            edit='none'
        }
        if (permission.indexOf('add')===-1) {
          start='none'
        }
        if (permission.indexOf('del')===-1) {
          deletes='none'
        }
        return(
        <span>
         <a  style={{display:edit}} onClick = {() => {
           this.newbiz.showModal("edit",record);
         }}>修改</a>
        </span>
      )
      },
    };
    columns.push(action);
    this.setState({columns});

  }
  renderKey=(text)=>{
    switch (text) {
      case "authType":
        return "登录授权类型";
        break;
      default:
        return "";
    }
  }
  renderStatu=(text) =>{
    switch (text) {
      case "all":
        return "同时支持4A和本地";
        break;
      case "4a":
        return "只支持4A";
        break;
      case "local":
        return "只支持本地";
        break;
      default:
        return "";
    }
  }

  // 请求查询method
  fetch = ( params ={} ) => {
    this.setState({loading:true}) ;
    let page=0;
    if (params.page>1) {
      page=(params.page-1)*10;
    }
    let sort='';
    if (typeof(params.sortField) !== "undefined" ) {
      sort=params.sortField;
    }
    let dir='ASC';
    if (typeof(params.sortOrder) !== "undefined" ) {
      dir=(params.sortOrder=="descend"?"desc":"asc");
    }
    const {config} = this.props;
    const text="dir="+dir+"&sort="+sort
    +"&start="+page+"&limit=10";

    ajaxUtil("urlencoded","sys-config!getConfig.action",text,this,(data,that) => {
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
  handleSearch=(value) =>{
    this.setState({query:value},()=>{
      this.fetch()
    });
    // this.fetch();
    }

  render() {
    const{bizJoinTypeList,auditTypeList}=this.state;
    return(
      <div>
      <Button  onClick={this.refresh}><Icon type="sync" />刷新</Button>
    <Table rowKey='key' columns={this.state.columns}  loading={this.state.loading} dataSource={this.state.data}
     onChange={this.handleTableChange} pagination={this.state.pagination} size="middle"/>
    <SynBeanNewInfo ref={(ref) => this.newbiz=ref } refresh={()=>this.refresh()} />
    </div>
    );
  }

}

const selectList = [
  {dicCode:'all',dicName:'同时支持4A和本地'},
  {dicCode:'4a',dicName:'只支持4A'},
  {dicCode:'local',dicName:'只支持本地'}
];
class  SynInfoModal extends Component {
  constructor(props) {
    super(props);
  }

  handleRenderTab=(type,formItemLayout,label,name,required,initValue,SourceList,rows,info) =>{
    const {getFieldDecorator} = this.props.form;
    let renderSome;
    switch (type) {
      // case 'input':
      //         renderSome=<Input placeholder="请输入"/>
      //   break;
        case 'select':
              renderSome= <Select  placeholder="请选择" >
                              {SourceList.map(d=> <Option key={d.dicCode} value={d.dicCode}>{d.dicName}</Option>)}
                          </Select>
          break;
          // case 'textarea':
          //     renderSome= <TextArea placeholder={info} rows={rows}/>; break;
          // case 'radio':
          //       renderSome=<RadioGroup>
          //                 {SourceList.map(d=> <Radio key={d.key} value={d.key}>{d.value}</Radio>)}
          //           </RadioGroup>;break;
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
    const {record,action} =this.props;
    const inputFormItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span:16},
    };
    const textFormItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 10 },
    };
    return (
      <div>
            <Form>
            <Row>
              <Col>
              {this.handleRenderTab("select",inputFormItemLayout,"登录类型","value",true,record.value,selectList,0,'')}
             </Col>
             </Row>
            </Form>
      </div>
    );
  }
}
const BusForm= Form.create()(SynInfoModal);

class SynBeanNewInfo extends Component{
  constructor(props){
    super(props);
    this.state={
        visible:false,
    }
  }
  handleCancel = (e) => {
    this.form.resetFields();
    this.setState({visible:false});
  }
  showModal =(action,record) => {
   this.setState({
     visible:true,
     record:record,
     action:action
   });
  }

  handleOk=(e) =>{
    const form= this.form;
    form.validateFields(( err, values) => {
      if (err) {
        return;
      }
      this.setState({
        confirmLoading:true,
      });
      const text="sysConfig.key="+this.state.record.key
      +"&sysConfig.value="+values.value
      ajaxUtil("urlencoded","sys-config!setConfigEntry.action",text,this,(data,that) => {
        let status=data.success;
        let message= data.message;
        this.setState({
          visible: false,
          confirmLoading: false,
        });
        this.form.resetFields();
          if (status===true) {
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
          this.props.refresh();
      });

    });
  }

  render(){
    const { visible, confirmLoading }= this.state;
    return(
      <div>
       <Modal visible={visible} onOk={this.handleOk} onCancel={this.handleCancel} width={500}
              title="编辑" confirmLoading={confirmLoading} okText="保存">
       <BusForm ref={(ref) => this.form = ref}  record={this.state.record} action={this.state.action} />
       </Modal>
      </div>
    );
  }
}

export default SysConfig;
