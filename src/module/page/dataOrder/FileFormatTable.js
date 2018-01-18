import React,{Component} from 'react'
import {Button,Table,Popconfirm,Input,Icon,Select,message,Modal} from 'antd';
import {ajaxUtil} from '../../../util/AjaxUtils';
import uuid from 'node-uuid';
const Option = Select.Option;
const confirm=Modal.confirm;
const selectableDataTypeList=[
                {key:'nvarchar(128)',value:'nvarchar(128)'},
                {key:'nvarchar(64)',value:'nvarchar(64)'},
                {key:'nvarchar(32)',value:'nvarchar(32)'},
                {key:'date',value:'date'}
                  ]
class NetTableConfig extends Component {

  constructor(props){
    super(props);
    this.state={
      columns:[],
      dataSource:[],
      loading:false,
      pagination:{pageSize:30},
      tableInfo:{},
      count:0,
      visible:false,loadingOneBtn:false,loadingAllBtn:false,
      fileId:props.fileId
    }
  }
  componentWillMount(){
  this.getColums();
  }

  componentWillReceiveProps(nextProps){
    // const {root,totalProperty}=nextProps.tableData;
    // const {tableInfo,bizCode}=nextProps;
    // if (root===undefined||totalProperty===undefined) {
    //
    // }else if(bizCode!==tableInfo.bizCode){
    //   this.setState({pagination:{pageSize:30},dataSource:[]});
    // }else{
    //   this.setState({loading: true,})
    //   const pagination = this.state.pagination;
    //   pagination.total = parseInt(totalProperty,10);
    //   this.setState({
    //       loading: false,
    //       dataSource: root,
    //       count:root.length,
    //       pagination,tableInfo
    //   });
    // }
      const {fileId}=nextProps;
    if (fileId!==this.state.fileId) {
      this.setState({fileId},()=>{this.handleRefresh()})
    }

  }

  getColums=() =>{
    const columns =[
        { title:'列名', dataIndex:'name' , key:'name',render:(text,record) =><EditableCell value={text} onChange={this.onCellChange(record.id,'name')} type='input' selectList={[]}  renderType='value'/>},
        { title:'数据类型', dataIndex:'dtype' , key:'dtype',render:(text,record) =><EditableCell value={text} onChange={this.onCellChange(record.id,'dtype')} type='select' selectList={selectableDataTypeList} renderType='value'/>},
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
         <Popconfirm title="你确定要删除该配置项?" okText="是" cancelText="否" disabled onConfirm={() =>  this.onDelete(record.id,record)}>
         <a style={{color:'red',display:deletes}}>删除</a>
         </Popconfirm>
        </span>
      )
      },
    };
    columns.push(action);
    this.setState({columns});

  }
  handleAdd = () =>{
    const {dataSource,fileId}=this.state;
    // let id=uuid.v1();
    // id.replace(/[-]/g,"")
    const newData={name:'',dtype:'',id:'',fyid:fileId}
    this.setState({dataSource:[...dataSource,newData]});
  }
  handleSave= () =>{
    // this.setState({visible:true});
    const {dataSource}=this.state;
    if (dataSource.length<=0) {
       message.error("字段为空,请填写！！！");
    }else{
      this.handleOk();
    }
    // confirm({
    // title: '确定要保存这些字段吗?',
    //   onOk() {
    //     if (dataSource.length<=0) {
    //        message.error("字段为空,请填写！！！");
    //     }else{
    //       this.handleOk();
    //     }
    //   },
    // });
  }

  onCellChange = (key, dataIndex) => {
  return (value) => {
    const dataSource = [...this.state.dataSource];
    const target = dataSource.find(item => item.id === key);
    if (target) {
      target[dataIndex] = value;
      this.setState({ dataSource });
    }
  };
}
  onDelete=(id,record) =>{
    if (id===undefined) {
      const dataSource = [...this.state.dataSource];
        this.setState({ dataSource: dataSource.filter(item => item.id !== record.id) });
    }else{
      ajaxUtil("urlencoded","field-name-type!delField.action","id="+id,this,(data,that) => {
        let status=data.success;
          if (status==='true') {
            message.success(data.message);
            const dataSource = [...this.state.dataSource];
            this.setState({ dataSource: dataSource.filter(item => item.id !== record.id) });
          }else{
             message.error(data.message);
          }
          // this.handleRefresh();
      })
    }

  }

  handleRefresh=() =>{
    this.setState({loading: true,});
    const {fileId}=this.state;
    const text="fyid="+fileId
              +"&dir=ASC &sort=name&limit=30";
    ajaxUtil("urlencoded","field-name-type!getFieldJsonList.action",text,this,(data,that) => {
      const pagination = this.state.pagination;
      pagination.total = parseInt(data.totalProperty,10);
      this.setState({
          loading: false,
          dataSource: data.root,
          count:data.root.length,
          pagination
      });
    });
  }

handleOk=() =>{
    // this.setState({loadingAllBtn:true});
  ajaxUtil("urlencoded","field-name-type!saveField.action","fields="+JSON.stringify(this.state.dataSource),this,(data,that) => {
    let status=data.success;
    // this.setState({visible:false,loadingOneBtn:false,loadingAllBtn:false,});
    if (status==='true') {
    message.success(data.message);
    }else{
     message.error(data.message);
  }
  this.handleRefresh();
});
}
handleCancel=()=>{
  this.setState({visible:false});
}

  render() {
    const {dataSource,columns,loadingOneBtn,loadingAllBtn}=this.state;
    return (
      <div>
        <Button className="editable-add-btn" onClick={this.handleAdd}>添加</Button>
        <Button className="editable-save-btn" onClick={this.handleSave}>保存</Button>
        <Button className="editable-refresh-btn" onClick={this.handleRefresh}>刷新</Button>
        <Table rowKey='id' bordered dataSource={dataSource} columns={columns} loading={this.state.loading} pagination={this.state.pagination}/>
      </div>
    );
  }
}
export default NetTableConfig;

class EditableCell extends Component{
  constructor(props) {
    super(props);
    this.state={
      value:props.value,
      editable:false
    }
  }

  edit=() =>{
      this.setState({ editable: true });
  }
  check = () => {
    this.setState({ editable: false });
    if (this.props.onChange) {
      this.props.onChange(this.state.value);
    }
  }
  handleChange = (e) => {
  const value = e.target.value;
  this.setState({ value });
}
handleSeclectChange=(value) =>{
  this.setState({value});
}

  handleRenderEditType=(value,type,selectList)=>{
    console.log(value);
    switch (type) {
      case 'input':
      return (
          <Input value={value} onChange={this.handleChange} onPressEnter={this.check}/>
          )
        break;
        case 'select':
          return(<Select style={{width:'80%'}} placeholder="" onChange={this.handleSeclectChange} onPressEnter={this.check} >
              {selectList.map(d=> <Option key={d.key} value={d.key}>{d.value}</Option>)}
              </Select>
        )
          break;
      default:
        return '';
    }

  }

  handleUneditable(value,type){
    switch (type) {
      case 'value':
          return value;
        break;
        case 'key':
            return (value==='1'?<div style={{color:'blue'}}>是</div>:'否')
          break;
      default:return '';

    }
  }

  render() {
    const {value,editable}=this.state;
    return(
      <div style={{position:'relative'}}>
          {
            editable?
            <div style={{paddingRight:'24px'}}>
              {this.handleRenderEditType(value,this.props.type,this.props.selectList)}
              <Icon type="check" style={{right:0 ,position:'absolute' ,cursor:'pointer',width:'20px'}} onClick={this.check}/>
            </div>
            :
            <div className="value-edit" >
              {this.handleUneditable(value,this.props.renderType) || ''}
              <Icon type="edit" className="edit-icon" style={{right:0 ,position:'absolute' ,cursor:'pointer' ,width:'20%'}} onClick={this.edit}/>
            </div>
          }
      </div>
    )
  }
}
