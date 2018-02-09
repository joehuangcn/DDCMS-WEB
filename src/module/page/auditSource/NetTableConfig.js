import React,{Component} from 'react'
import {Button,Table,Popconfirm,Input,Icon,Select,message,Modal} from 'antd';
import {ajaxUtil} from '../../../util/AjaxUtils';
import uuid from 'node-uuid';
const Option = Select.Option;
const selectableDataTypeList=[
                {key:'nvarchar(128)',value:'nvarchar(128)'},
                {key:'nvarchar(64)',value:'nvarchar(64)'},
                {key:'nvarchar(32)',value:'nvarchar(32)'},
                {key:'date',value:'date'}
                  ]
const selectableKeyTypeList=[
                {key:'1',value:'是'},
                {key:'',value:'否'}
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
      bizCode:props.bizCode
    }
  }
  componentWillMount(){
  this.getColums();
  }

  componentWillReceiveProps(nextProps){
    const {root,totalProperty}=nextProps.tableData;
    const {tableInfo,bizCode}=nextProps;
    if (root===undefined||totalProperty===undefined) {

    }else if(bizCode!==tableInfo.bizCode){
      this.setState({pagination:{pageSize:30},dataSource:[]});
    }else{
      this.setState({loading: true,})
      const pagination = this.state.pagination;
      pagination.total = parseInt(totalProperty,10);
      this.setState({
          loading: false,
          dataSource: root,
          count:root.length,
          pagination,tableInfo
      });
    }

  }

  getColums=() =>{
    const columns =[
        { title:'列名', dataIndex:'fieldName' , key:'fieldName',render:(text,record) =><EditableCell value={text} onChange={this.onCellChange(record.id,'fieldName')} type='input' selectList={[]}  renderType='value'/>},
        { title:'数据类型', dataIndex:'fieldType' , key:'fieldType',render:(text,record) =><EditableCell value={text} onChange={this.onCellChange(record.id,'fieldType')} type='select' selectList={selectableDataTypeList} renderType='value'/>},
        { title:'字段类型', dataIndex:'fieldNameCh', key:'fieldNameCh',render:(text,record) =><EditableCell value={text} onChange={this.onCellChange(record.id,'fieldNameCh')} type='input' selectList={[]} renderType='value'/>},
        { title:'主键', dataIndex:'isKey' , key:'isKey',render:(text,record) =><EditableCell value={text} onChange={this.onCellChange(record.id,'isKey')} type='select' selectList={selectableKeyTypeList} renderType='key'/>},
        { title:'排序', dataIndex:'forder' , key:'forder',render:(text,record) =><EditableCell value={text} onChange={this.onCellChange(record.id,'forder')} type='input' selectList={[]} renderType='value'/>},
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
         <Popconfirm title="你确定要删除该配置项?" okText="是" cancelText="否" disabled onConfirm={() =>  this.onDelete(record.bfId,record)}>
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
    const {dataSource,tableInfo,count,bizCode}=this.state;
    if (tableInfo.bizCode===undefined||tableInfo.bizCode===''||tableInfo.netEleCode==='') {
      message.error("请先选择业务与网元");
    }else{
    let id=uuid.v1();
    const newData={fieldName:'',fieldType:'',fieldNameCh:'',isKey:'',forder:dataSource.length+1,id:id.replace(/[-]/g,''),...tableInfo}
    this.setState({dataSource:[...dataSource,newData]});
  }
  }
  handleSave= () =>{
    const {dataSource,tableInfo,count,bizCode}=this.state;
    if (tableInfo.bizCode===undefined||tableInfo.bizCode===''||tableInfo.netEleCode==='') {
      message.error("请先选择业务与网元");
    }else{
    this.setState({visible:true});
  }
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
  onDelete=(bfId,record) =>{
    if (bfId===undefined) {
      const dataSource = [...this.state.dataSource];
        this.setState({ dataSource: dataSource.filter(item => item.id !== record.id) });
    }else{
      ajaxUtil("urlencoded","bus-net-field!delField.action","bfId="+bfId,this,(data,that) => {
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
    const {bizCode,auditType,dataScope,dataType,netEleCode}=this.state.tableInfo;
    const text="bizCode="+bizCode+"&auditType="+auditType+"&dataScope="+dataScope+"&dataType="+dataType+"&netEleCode="+netEleCode
              +"&dir=ASC &sort=forder&limit=30";
    ajaxUtil("urlencoded","bus-net-field!getFieldJsonList.action",text,this,(data,that) => {
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

handleOk=(value) =>{
  if (value==='1') {
    this.setState({loadingOneBtn:true});
  }else{
    this.setState({loadingAllBtn:true});
  }

  ajaxUtil("urlencoded","bus-net-field!saveNetFields.action","fields="+JSON.stringify(this.state.dataSource)+"&flag="+value,this,(data,that) => {
    let status=data.success;
    this.setState({visible:false,loadingOneBtn:false,loadingAllBtn:false,});
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
        <Modal title="确定保存"
         visible={this.state.visible}
         onCancel={this.handleCancel}
         footer={[
           <Button key="submitOne" loading={loadingOneBtn} onClick={()=>this.handleOk("1")}>否</Button>,
           <Button key="submit" type="primary" loading={loadingAllBtn} onClick={()=>this.handleOk("all")}>是</Button>,
           <Button key="cancel"  onClick={this.handleCancel}>取消</Button>
         ]}
       >
         <p>是否以相同字段配置所有的关联网元素</p>
       </Modal>
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
