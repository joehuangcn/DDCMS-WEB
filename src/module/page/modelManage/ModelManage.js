import React, {Component}  from 'react';
import { Table,Button, Icon,Popconfirm,message,DatePicker,Select,Input,TreeSelect } from 'antd';
import {ajaxUtil} from '../../../util/AjaxUtils';
import NewAddModel from './NewModel';
const {RangePicker} = DatePicker;
const {Option} = Select;
const {Search} =Input;
class ModelManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data:[],
            pagination:[],
            loading:false,
            query:'',
            queryKey:'',
            id:'',
            permission:[],
        };

    }
    componentWillMount() {
        this.getInitProps(this.props);
        this.getDynAction();
        this.loadTreeNode();
    }
    componentDidMount=() => {
        this.fetch();
    };

    // 初始化
    getInitProps=(props)=>{
     //  console.log(props);
       const {state}=props.location;
       let permission=[];
       ajaxUtil("urlencoded","permiss!getUserBtnPermissByResid.action","resid="+state.id, this,(data,that)=>{
         permission=data.data;
         let addBtnPermiss=false;
         if (permission.indexOf('add')===-1) {
           addBtnPermiss=true;
         }
         this.setState({
           id:state.id,
           permission:permission,
           addBtnPermiss:addBtnPermiss
         });
       });
     }

    getDynAction =() => {
        const columns=[
          { title: '模块名称', dataIndex: 'name', key: 'name',},
          { title:'所属模块', dataIndex:'parentname', key:'parentname',},
          { title:'模块路径', dataIndex:'url', key:'url',},
          { title:'模块状态', dataIndex:'statu',key:'statu',width:100,render:(text)=>(this.handleRenderStatu(text))},
          { title:'路由位置', dataIndex:'menuRouter',key:'menuRouter',width:120}
        ];
        let action ={
            title:'操作',
            key:'action',
            render : (text, record) =>{
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
                   <a style={{display:edit}} onClick = {() => {
                       this.newbiz.showModal("edit",record);
                   }}>修改</a>
                  <span className="ant-divider"/>
                  <Popconfirm title="你确定要删除该条记录?" okText="是" cancelText="否" onConfirm={() => {
                  if (record.initflag==="1") {
                    message.error("不能删除系统初始化数据!");
                  }else{
                   ajaxUtil("urlencoded","moduleAction!delObj.action","id1="+record.bid,this,(data,that) => {
                     let status=data.success;
                     let mes= data.message;
                       if (status==='true') {
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
        console.log('params',params);
        this.setState({loading:true}) ;
        let page=0;
        if (params.page>1) {
            page=(params.page-1)*10;
        }
        let sort='name';
        if (typeof(params.sortField) !== "undefined" ) {
            sort=params.sortField;
        }
        let dir='ASC';
        if (typeof(params.sortOrder) !== "undefined" ) {
            dir=params.sortOrder;
        }
        const {config} = this.props;
        const text="queryKey="+(this.state.queryKey==undefined?"":this.state.queryKey)
            +"&query="+(this.state.query==undefined?"":this.state.query)
            +"&dir="+dir
            +"&sort="+sort
            +"&start="+page+"&limit=10";

        ajaxUtil("urlencoded","moduleAction!getModuleList.action",text,this,(data,that) => {
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
                    <span style={{fontSize:"14px",marginRight:"8px"}}>查询:</span>
                    <Select style={{ width: 120 }} onChange={this.onSelectChange}  allowClear placeholder="请选择查询类型">
                        <Option value="name">模块名称</Option>
                        <Option value="statu">模块状态</Option>
                    </Select>
                    <Search
                        placeholder="输入查询值"
                        style={{ width: 200 }}
                        onSearch={this.handleSearch} />

                <Table rowKey='id' columns={this.state.columns}  loading={this.state.loading} dataSource= {this.state.data}
                       pagination={this.state.pagination} onChange={this.handleTableChange} />
                <NewAddModel  ref={(ref) => this.newbiz=ref }  refresh={()=>this.refresh()}/>
            </div>
        );
    }

}

export default ModelManage;
