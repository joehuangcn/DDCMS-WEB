import React, {Component}  from 'react';
import { Table,Button, Icon,Popconfirm,message,Select,Input,TreeSelect,Modal,Tree,Row,Col,Card} from 'antd';
import {ajaxUtil} from '../../../util/AjaxUtils';
import NewAddRole from './NewAddRole';
import uuid from 'node-uuid';
import FunctionSetting from "./FunctionSetting";
import MenuAuthority from "./MenuAuthority";
const {Option} = Select;
const {Search} =Input;
const TreeNode = Tree.TreeNode;
const SHOW_CHILD=TreeSelect.SHOW_CHILD;


class RoleManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data:[],
            pagination:[],
            loading:false,
            startDate:'',
            endDate:'',
            query:'',
            queryKey:'',
            visible: false,
            selectedRowKeys:[],  //table 角色选择
            selectedTreeKeys:[],  //，默认模块树选择列表
            selectMenuKeys:[],   //勾选的模块树
            menu:[],
            roleTreeData:[],
            permission:[],
        };
    }
    componentWillMount() {
        this.getInitProps(this.props);
        this.getDynAction();
        this.loadTreeNode();
        this.getTreeList();
    }
    componentDidMount=() => {
        this.fetch();
    };

    // 初始化
    getInitProps=(props)=>{
       const {state}=props.location;
       let permission=[];
       ajaxUtil("urlencoded","permiss!getUserBtnPermissByResid.action","resid="+state.id, this,(data,that)=>{
         permission=data.data;
         let addBtnPermiss=false;
         let setPerm=false;
         if (permission.indexOf('add')==-1) {
           addBtnPermiss=true;
         }
         if (permission.indexOf('setPerm')==-1) {
           setPerm=true;
         }
         this.setState({
           id:state.id,
           permission:permission,
           addBtnPermiss:addBtnPermiss,
           setPerm:setPerm,
         });
       });
     }


    //获得层级树
    getTreeList = ()=> {
        ajaxUtil("urlencoded","dept!getComboTreeByDept.action","",this,(data,that)=> {
            this.setState({
                treeData:data
            });
        })
    };

    loadTreeNode =() =>{
        ajaxUtil("urlencoded","business!getBusAfterNew.action","",this,(data,that) =>{
            this.setState({treeData:data});
        });
    };

    renderTreeNodes = (data)=> {
        return data.map((item) => {
            if (item.child) {
                return(
                    <TreeNode title={item.title} key={item.key} dataRef={item}>
                        {this.renderTreeNodes(item.child)}
                    </TreeNode>
                );
            }
            return <TreeNode {...item} dataRef={item}/>;
        });
    };

    getDynAction =() => {
        const columns=[
          { title: '角色名称', dataIndex: 'roleName', key: 'roleName',},
          { title:'角色描述', dataIndex:'roleDescription', key:'roleDescription',},
          { title:'角色状态', dataIndex:'statu', key:'statu',render:(text)=>(this.handleRenderStatu(text))},
          { title:'角色备注', dataIndex:'remark', key:'remark',},
          { title:'操作时间', dataIndex:'operateTime', key:'operateTime',}
         ];
        let action ={
            title:'操作',
            key:'action',
            render : (text, record) => {
              let permission=this.state.permission;
              let edit='inline';let deletes='inline';
              let activeDis=false; let activeColor="green";
              if(permission.indexOf('edit')===-1){
                  edit='none'
              }
              if (permission.indexOf('del')===-1) {
                deletes='none'
              }

              return (
                <span>
                   <a style={{display:edit}}  onClick = {() => {
                       this.newbiz.showModal("edit",record);
                   }}>修改</a>
                   <span className="ant-divider"/>
                   <Popconfirm title="你确定要删除该条记录?" okText="是" cancelText="否" onConfirm={() => {
                       ajaxUtil("urlencoded","roleAction!deleRole.action","role_id="+record.role_id,this,(data,that) => {
                           this.fetch();
                       })
                   }}>
                   <a style={{color:'red',display:deletes}}> 删除</a>
                   </Popconfirm>
              </span>
            )
          }
        };
        columns.push(action);
        this.setState({columns});
    };

    handleRenderStatu=(text) =>{
      if (text==='1') {
        return <a style={{color:'green'}}>激活</a>
      }else
        return <a style={{color:'red'}}>禁用</a>
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
    };

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
        let dir='';
        if (typeof(params.sortOrder) !== "undefined" ) {
            dir=params.sortOrder;
        }
        const {config} = this.props;
        const text="startDate="+this.state.startDate
            +"&endDate="+this.state.endDate
            +"&queryKey="+this.state.queryKey
            +"&query="+this.state.query
            +"&dir="+dir
            +"&sort="+sort
            +"&start="+page+"&limit=10";

        ajaxUtil("urlencoded","roleAction!getRoleList.action",text,this,(data,that) => {
            const pagination = that.state.pagination;
            pagination.total = parseInt(data.total,10);
            this.setState({
                loading: false,
                data: data.data,
                pagination,
            });
        });
    };

    handleModal= () => {
        this.newbiz.show();
    };
    reflash=() => {
        this.fetch();
    };
    onSelectChange =(value) => {
        this.setState({query:value});
    };
    handleSearch =(value) => {
        this.setState({queryKey:value},()=>{this.fetch});
    };

    onSelectChange = (selectedRowKeys) => {

       this.setState({ selectedRowKeys });
     }

    render(){
      const {selectedRowKeys,selectedTreeKeys,setPerm,addBtnPermiss}=this.state;
      const rowSelection ={
       selectedRowKeys,
       onChange: this.onSelectChange,
       type:"radio",
        };

        return(
            <div>
                <Row>
                  <Col span={6}>
                <Button type='primary' onClick={this.handleModal}  disabled={addBtnPermiss} >新增</Button>
                <Button type="primary" onClick={this.showSetUpModal}  disabled={setPerm}>权限设置</Button>
                <Button onClick={this.reflash}><Icon type="sync" />刷新</Button>
                  </Col>
                <Col span={18} style={{ textAlign: 'right',}}>
                    <span style={{fontSize:"14px",marginRight:"8px"}}>查询:</span>
                    <Select style={{ width: 120,marginLeft: 8 }} onChange={this.onSelectChange}  allowClear placeholder="请选择查询类型">
                        <Option value="moduleName">模块名称</Option>
                        <Option value="moduleState">模块状态</Option>
                    </Select>
                    <Search  placeholder="输入查询值"  style={{ width: 200, marginLeft: 16}}  onSearch={this.handleSearch} />
                  </Col>
                </Row>
                <Table rowKey="role_id"  rowSelection={rowSelection} columns={this.state.columns}  loading={this.state.loading} dataSource= {this.state.data}
                       pagination={this.state.pagination} onChange={this.handleTableChange} />
                <NewAddRole  ref={(ref) => this.newbiz=ref } reflash={this.reflash}/>
                <Modal key={uuid.v1()}
                    title="权限设置"
                    visible={this.state.visible}
                    onCancel={this.handleSetUpCancel} width={700} footer={null}
                >
                <Row gutter={16}>
                  <Col span={12}>
                      <MenuAuthority ref={(ref) => this.menuTree=ref } selectedRowKeys={selectedRowKeys} getBtnPermissList={(...roleId) => this.getBtnPermissList(...roleId)} />
                  </Col>
                  <Col span={12}>
                      <FunctionSetting  ref={(ref) => this.funSet=ref } roleKey={selectedRowKeys} />

                  </Col>
                  </Row>
                </Modal>
            </div>
        );
    }

    getBtnPermissList=(resid,roleId) =>{
       this.funSet.getBtnPermissList(resid,roleId);
    }
    // onSelect = (selectedKeys, info) =>{
    //     let tableContent = this.refs.tableContent;
    //     tableContent.style.display="inline-block";
    //       const {selectedRowKeys}=this.state;
    //      console.log('selected', selectedKeys, info);
    //
    //      if (info.node.props.dataRef.child===undefined) {
    //       //  this.setState({selectedLeftKey:selectedKeys[0]});
    //        this.funSet.getBtnPermissList(selectedKeys[0],selectedRowKeys[0]);
    //      }
    // };
    //   getLeftSelect(select,rowKey){
    //     this.funSet.getBtnPermissList(select,rowKey);
    //   }
    //
    //   onCheck = (checkedKeys, info) => {
    //    console.log('onCheck', checkedKeys, info);
    //     this.setState({selectMenuKeys:checkedKeys});
    //  }

    showSetUpModal = () => {
      const {selectedRowKeys}=this.state;
      if (selectedRowKeys.length>0) {
        this.setState({visible:true});

        // ajaxUtil("urlencoded","role!getRoleModuleTreeList.action","roleID="+selectedRowKeys[0],this,(data,that)=> {
        //     this.setState({
        //         roleTreeData:data.data,
        //         selectedTreeKeys:data.selectedKeys,
        //         visible:true
        //     });
        // })
      }else{
        message.warn("请先选择角色!");
      }
    };
    // handleSetUpOk = (e) => {
    //     console.log(e);
    //     this.setState({
    //         visible: false,
    //     });
    //     let tableContent = this.refs.tableContent;
    //     tableContent.style.display="none";
    //     this.onChange();
    //
    // };
    handleSetUpCancel = (e) => {
        // console.log(e);
        this.setState({
            visible: false,
        });
    }
    //
    // saveMenu=()=>{
    //   const {selectMenuKeys,selectedRowKeys}=this.state;
    //   ajaxUtil("urlencoded","role!authorityNew.action","roleID="+selectedRowKeys[0]+"&resID="+selectMenuKeys,this,(data,that)=> {
    //     if (data.success===true) {
    //       message.success(data.info);
    //     }else{
    //       message.error(data.info);
    //     }
    //   })
    // }
    //
    //
    // saveFunset=() =>{
    //   this.funSet.getSeletedKeys();
    // }
    //
    // getCheckFunset=(funSetKeys,resid)=>{
    //   console.log(funSetKeys,resid);
    //   const {selectedRowKeys}=this.state;
    //   let text="resid="+resid+"&roleid="+selectedRowKeys[0]+"&btnArr="+funSetKeys;
    //   ajaxUtil("urlencoded","permiss!saveUserBtnPermissNew.action",text,this,(data,that)=> {
    //     if (data.success===true) {
    //       message.success(data.message);
    //     }else{
    //       message.error(data.message);
    //     }
    //   })
    // }
}

export default RoleManage;
