import React,{Component} from 'react';
import {ajaxUtil} from '../../../util/AjaxUtils';
import { Tree,Card,Col ,Row,Button, Icon,Popconfirm,message,DatePicker,Select,Input,Table,Modal} from 'antd';
import PersonInfoNew from './PersonInfoNew';
import PersonChoiceDept from './PersonChoiceDept';
const TreeNode = Tree.TreeNode;
const {Option} = Select;
const {Search} =Input;

class DeptInfo extends Component {
  constructor (props){
    super(props);
    this.state={
      node:'',
      id:'',
      permission:[],
      addBtnPermiss:true,
    };
  }
  componentWillMount(){
    this.getInitProps(this.props);
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

  changeNode=(node) => {
    this.setState({node});
  }
  render(){
    const {permission,id,addBtnPermiss}=this.state;
    return(
      <div style={{ background: '#ECECEC'}}>
      <Row gutter={16}>
        <Col span={6}>
          <Card title="部门栏">
             <DeptList changeNode={node => this.changeNode(node)} />
           </Card>
        </Col>
        <Col span={18}>
          <Card title="用户列表">
             <PersonInfo node={this.state.node} permission={permission} resid={id} addBtnPermiss={addBtnPermiss}/>
           </Card>
        </Col>
        </Row>
        </div>
    );
  }
}
export default DeptInfo;

class DeptList extends Component {
  constructor(props){
    super(props);
    this.state={
      treeData:[],
    };
  }

  componentWillMount =()=> {
    this.getTreeList();
  }

  getTreeList = ()=> {
    console.log("获取的业务树为");
    ajaxUtil("urlencoded","dept!getComboTreeByDept.action","",this,(data,that)=> {
      this.setState({
        treeData:data
      });
    })
  }

//异步加载实现的方法. 运用promise 函数进行异步处理.
  onLoadData = (treeNode) => {
    return new Promise((resolve) => {
    ajaxUtil("urlencoded","dept!getComboTreeByDept.action","node="+treeNode.props.eventKey,this,(data,that)=> {
      treeNode.props.dataRef.children=data;
      this.setState({
        treeData:[...this.state.treeData],
      });
    })
    resolve();
    }
    )
  }

  renderTreeNodes = (data)=> {
     return data.map((item) => {
       if (item.children) {
         return(
           <TreeNode title={item.title} key={item.key} dataRef={item}>
              {this.renderTreeNodes(item.children)}
           </TreeNode>
         );
       }
       return <TreeNode {...item} dataRef={item} />;
     })
  }
  // <Tree loadData={this.onLoadData} >
  //   {this.renderTreeNodes(this.state.treeData)}
  // </Tree>

onSelect =(selectedKeys,info) =>{
  console.log("selected",selectedKeys,info);
  this.props.changeNode(selectedKeys[0]);
}
  render () {
    return(
      <div>
      <Tree onSelect={this.onSelect}>
        {this.renderTreeNodes(this.state.treeData)}
      </Tree>
      </div>
    );
  }
}


class PersonInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      node:props.node,
      loading:false,
      data:[],
      pagination:[],
      query:'',
      queryKey:'',
      selectedRowKeys:[],
    };
  }

  componentWillMount (){
    this.getColumns();
  }
  componentDidMount (){
    // this.getlist();
  }

  componentWillReceiveProps(nextProps) {
      const {node}=nextProps;

      console.log('setState之后的',this.state.node);
      this.getlist({node:node});
  }

  getColumns = ()=> {
    const columns=[{title:"用户账号", dataIndex:"useraccount", key:"useraccount"},
          {title:"用户名称", dataIndex:"username", key:"username"},
          {title:"用户职务", dataIndex:"duty", key:"duty"},
          {title:"用户部门", dataIndex:"deptname", key:"deptname"},
          {title:"创建日期", dataIndex:"createTime", key:"createTime"},
          {title:"用户状态", dataIndex:"statu", key:"statu",
           render:(value) =>{
             if (value==='1') {
               return <span style={{color:'green'}}>激活</span>;
             }else{
               return <span style={{color:'red'}} >失效</span>;
             }
           }}
  ];
  let action ={
    title:'操作',
    key:'action',
    render : (text, record) => {
      let permission=this.props.permission;
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
       <a style={{display:edit}} onClick = {() => {
         this.newbiz.showModal("edit",record);
       }}>修改</a>
       <span className="ant-divider"/>
       <Popconfirm title="你确定要删除该条记录?" okText="是" cancelText="否" disabled onConfirm={() => {
         ajaxUtil("urlencoded","personAction!delPerson.action","userId="+record.userid,this,(data,that) => {
           let status=data.success;
           let message= data.message;
             if (status==='true') {
               message.success(message);
             }else {
               message.error(message);
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
  this.setState({columns:columns});
  }

  getlist= (params={} )=> {
    console.log('params',params);
    this.setState({loading:true});
    let node="";
    if (params.node!==undefined) {
      node=params.node;
      this.setState({node:params.node});
    }else{
      node=this.props.node;
    }
    if (node==="") {
      this.setState({loading:false});
      return;
    }
    let page=0;
    if (params.page>1) {
      page=(params.page-1)*10;
    }
    let sort='person.createTime';
    if (typeof(params.sortField) !== "undefined" ) {
      sort=params.sortField;
    }
    let dir='DESC';
    if (typeof(params.sortOrder) !== "undefined" ) {
      dir=params.sortOrder;
    }
    const {query,queryKey}=this.state;
    const text="node="+node
                +"&query="+query
                +"&queryKey="+queryKey
                +"&start="+page+"&limit=10";
    ajaxUtil("urlencoded","person!getPersonListBydept.action",text,this,(data,that) => {
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
    this.getlist({
      results: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters,
    });
  }

  handleModal= () =>{
    this.newbiz.show();
  }
  refresh=()=>{
    this.getlist();
    let pagination=this.state;
    pagination.current=1;
    this.setState({pagination});
  }
  handleConditionChange=(value) =>{
    if (value==undefined) {
      value='';
    }
      this.setState({queryKey:value});
  }
  handleSearch=(value)=>{
    this.setState({query:value},()=>{
      this.getlist()
    });
  }
  onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
      this.setState({ selectedRowKeys });
 }
 defaultPwd=()=>{
   const {selectedRowKeys}=this.state;
   if (selectedRowKeys.length===0) {
     message.warning('请选择记录');
   }else if(selectedRowKeys.length!==1){
     message.warning('请选择单条记录');
   }else{
     Modal.info({
       title: '重置密码',
       content:"确定要重置该用户密码吗？？？",
       onOk() {
         ajaxUtil("urlencoded","personAction!reSetPwd.action","userId="+selectedRowKeys,this,(data,that) => {
           let status=data.success;
           let message= data.message;
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
       })
     }
     });
   }
 }
setDept=()=>{
  const {selectedRowKeys}=this.state;
  if (selectedRowKeys.length===0) {
    message.warning('请选择记录');
  }else if(selectedRowKeys.length!==1){
    message.warning('请选择单条记录');
  }else{
    this.depbiz.show();
  }
}
  render() {
    const {node,selectedRowKeys}=this.state;
    const rowSelection = {
     selectedRowKeys,
     hideDefaultSelections:true,
     onChange: this.onSelectChange,
   };
    return(
      <div>
      <PersonChoiceDept ref={(ref) => this.depbiz=ref } refresh={()=>this.refresh()} userId={selectedRowKeys}/>
      <Button type='primary' disabled={this.props.addBtnPermiss} onClick={this.handleModal} ><Icon type="user-add" />新增</Button>
      <Button  onClick={this.refresh}><Icon type="sync" />刷新</Button>
      <Button  onClick={this.defaultPwd}><Icon type="safety" />重置密码</Button>
      <Button  onClick={this.setDept}><Icon type="team" />设置角色</Button>
      <Button  onClick={this.reflash}><Icon type="sync" />导出</Button>
      <Select style={{ width: 120 }} onChange={this.handleConditionChange}  allowClear placeholder="选择查询字段">
        <Option value="p.userName">用户名称</Option>
        <Option value="p.duty">用户职务</Option>
     </Select>
     <Search
      placeholder="输入查询值"
      style={{ width: 120 }}
      onSearch={this.handleSearch} />
      <Table rowKey="userid" columns={this.state.columns} loading={this.state.loading} dataSource={this.state.data} rowSelection={rowSelection}
      pagination={this.state.pagination} onChange={this.handleTableChange} />
      <PersonInfoNew ref={(ref) => this.newbiz=ref }
         refresh={()=>this.refresh()} resid={this.state.id} node={node}/>
      </div>
    );
  }
}
