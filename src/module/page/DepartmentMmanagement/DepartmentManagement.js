import React, {Component}  from 'react';
import { Table,Button, Icon,Popconfirm,message,DatePicker,Select,Input,TreeSelect} from 'antd';
import {ajaxUtil} from '../../../util/AjaxUtils';
import NewDepartment from './NewDepartment';
const {RangePicker} = DatePicker;
const {Option} = Select;
const {Search} =Input;

class DepartmentManagement extends Component {
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
            id:'',
            permission:[],
        };

    }
    // 初始化
    getInitProps=(props)=>{
       const {state}=props.location;
       let permission=[];
       if (state===null|| state===undefined) {
        return ;
      }else{
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
     }

    componentWillMount() {
        this.getInitProps(this.props);
        this.getDynAction();
        this.loadTreeNode();
    }
    componentDidMount=() => {
        this.fetch();
    };

    getDynAction =() => {
        const columns=[{
            title: '部门名称',
            dataIndex: 'deptName',
            key: 'deptName',
        },{
            title:'所属部门',
            dataIndex:'updeptName',
            key:'updeptName',
        },{
            title:'城市编码',
            dataIndex:'cityCode',
            key:'cityCode',
        },{
            title:'部门地址',
            dataIndex:'address',
            key:'address',
        },{
            title:'部门电话',
            dataIndex:'tel',
            key:'tel',
        }];
        let action ={
            title:'操作',
            key:'action',
            render : (text, record) => {
              let permission=this.state.permission;
              let edit='inline';let start='inline';let deletes='inline';
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

              return (
                <span>
                     <a style={{display:edit}} onClick = {() => {
                         this.newbiz.showModal("edit",record);
                     }}>修改</a>
                     <span className="ant-divider"/>
                     <Popconfirm title="你确定要删除该条记录?" okText="是" cancelText="否" onConfirm={() => {
                        if (this.state.permission.indexOf('del')===-1) {
                          message.error("暂无权限删除");
                        }else{
                         ajaxUtil("urlencoded","deptAction!delObj.action","deptId="+record.deptId,this,(data,that) => {
                           let status=data.success;
                           let mes= data.message;
                             if (status===true) {
                               message.success(mes);
                             }else {
                               message.error(mes);
                             }
                            this.fetch();
                         })
                       }
                     }}>
                     <a style={{color:'red',display:deletes}}>删除</a>
                     </Popconfirm>
                    </span>
                        )
          }
        };
        columns.push(action);
        this.setState({columns});
    };
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
        let sort='dept.departName';
        if (typeof(params.sortField) !== "undefined" ) {
            sort=params.sortField;
        }
        let dir='ASC';
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

        ajaxUtil("urlencoded","deptAction!getDeptList.action",text,this,(data,that) => {
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
    refresh=() => {
        this.fetch();
    };
    onSelectChange =(value) => {
        this.setState({queryKey:value});
    };
    handleSearch =(value) => {
        this.setState({query:value},()=>{this.fetch()});
    };

    loadTreeNode =() =>{
        ajaxUtil("urlencoded","business!getBusAfterNew.action","",this,(data,that) =>{
            this.setState({treeData:data});
        });
    };

    render(){
        return(
            <div>
                <Button type='primary' onClick={this.handleModal} disabled={this.state.addBtnPermiss} >新增</Button>
                <Button  onClick={this.refresh}><Icon type="sync" />刷新</Button>
                <div style={{float:"right"}}>
                    <span style={{fontSize:"14px",marginRight:"8px"}}>查询:</span>
                    <Select style={{ width: 120 }} onChange={this.onSelectChange}  allowClear placeholder="请选择查询类型">
                        <Option value="deptName">部门名称</Option>
                        <Option value="upDeptid">所属部门</Option>
                    </Select>
                    <Search
                        placeholder="输入查询值"
                        style={{ width: 120 }}
                        onSearch={this.handleSearch} />
                </div>
                <Table rowKey="deptId" columns={this.state.columns}  loading={this.state.loading} dataSource= {this.state.data}
                       pagination={this.state.pagination} onChange={this.handleTableChange} />
                <NewDepartment  ref={(ref) => this.newbiz=ref }  refresh={()=>this.refresh()}/>
            </div>
        );
    }

}

export default DepartmentManagement;
