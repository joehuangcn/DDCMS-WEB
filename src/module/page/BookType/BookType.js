import React, {Component}  from 'react';
import {Table} from 'antd';
import { Button, Icon,Popconfirm,message,DatePicker,Select,Input,TreeSelect } from 'antd';
import {ajaxUtil} from '../../../util/AjaxUtils';
import TypeItem from './TypeItem';
const {RangePicker} = DatePicker;
const {Option} = Select;
const {Search} =Input;
const SHOW_CHILD=TreeSelect.SHOW_CHILD

class BookType extends Component {
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

        };

    }
    componentWillMount() {
        this.getInitProps(this.props);
        this.getDynAction();
        this.loadTreeNode();
    }
    componentDidMount=() => {
        this.fetch();
    }

    // 初始化
    getInitProps=(props)=>{
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


    getDynAction =() => {
        const columns=[{
            title: '字典类型代码',
            dataIndex: 'dicTypeCode',
            key: 'dicTypeCode',
        },{
            title:'字典类型名称',
            dataIndex:'dicTypeName',
            key:'dicTypeName',
        },{
            title:'字典类型',
            dataIndex:'dicType',
            key:'dicType',
            render:(text)=>(this.handleRenderStatu(text))
        },{
            title:'字典类型状态',
            dataIndex:'dicTypeStatu',
            key:'dicTypeStatu',
            render:(text)=>(this.handleRenderStatuI(text))
        },{
            title:'备注',
            dataIndex:'remark',
            key:'remark',
        },{
            title:'创建时间',
            dataIndex:'operateTime',
            key:'operateTime',
        }];
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
              if (permission.indexOf('del')===-1){
                deletes='none'
              }
              return (
                <span>
                <a style={{display:edit}}  onClick = {() => {
            this.newbiz.showModal("edit",record);
        }}>修改</a>
            <span className="ant-divider"/>
                <Popconfirm title="你确定要删除该条记录?" okText="是" cancelText="否" onConfirm={() => {
                ajaxUtil("urlencoded","dictionary-type!deleDictionaryType.action","typeId="+record.dicTypeCode,this,(data,that) => {
                    this.fetch();
                })
            }}>
                <a style={{color:'red',display:deletes}} >删除</a>
                </Popconfirm>
            </span>
         )
       }
        };
        columns.push(action);
        this.setState({columns});
    }
    handleRenderStatuI=(text) =>{
        if (text==='1') {
          return <a style={{color:'green'}}>有效</a>
        }else
          return <a style={{color:'red'}}>无效</a>
      }
      handleRenderStatu=(text) =>{
        if (text==='1') {
          return <a style={{color:'green'}}>自定义</a>
        }else
          return <a style={{color:'red'}}>系统</a>
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

    fetch = ( params ={} ) => {
        this.setState({loading:true}) ;
        let page=0;
        if (params.page>1) {
            page=(params.page-1)*10;
        }
        let sort='dictionaryType.operateTime';
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

        ajaxUtil("urlencoded","dictionary-type!getDictionaryTypeList.action",text,this,(data,that) => {
            const pagination = that.state.pagination;
            pagination.total = parseInt(data.total,10);
            this.setState({
                loading: false,
                data: data.data,
                pagination,
            });
        });
    }

    handleModal= () => {
        this.newbiz.show();
    }
    reflash=() => {
        this.fetch();
    }


    cowConfirm = (e) =>{
          ajaxUtil("urlencoded","dictionary-type!getDictionaryTypeList.action","id",)
    }
    onStartChange =(date, dateString) => {
        this.setState({startDate:dateString});
    }

    onEndChange = (date, dateString) => {
        this.setState({endDate:dateString });
    }
    onSelectChange =(value) => {
        this.setState({query:value});
    }
    handleSearch =(value) => {
        this.setState({queryKey:value},()=>{this.fetch});
    }

    loadTreeNode =() =>{
        ajaxUtil("urlencoded","dictionary-type!getDictionaryTypeList.action","",this,(data,that) =>{
            this.setState({treeData:data});
        });
    }
    treeChange = (value) => {
    }

    render(){
        return(
            <div>
                <Button type='primary' onClick={this.handleModal} disabled={this.state.addBtnPermiss} ><Icon type="plus" />新增</Button>
                <Button  onClick={this.reflash}><Icon type="sync" />刷新</Button>
                <Select style={{ width: 120 }} onChange={this.onSelectChange}  allowClear placeholder="选择查询字段">
                  <Option value="dicTypeName">类型名称</Option>
                </Select>
                <Search  placeholder="输入查询值"   style={{ width: 120 }}  onSearch={this.handleSearch} />
                 <Table columns={this.state.columns}  loading={this.state.loading} dataSource= {this.state.data}   pagination={this.state.pagination} onChange={this.handleTableChange} />
                <TypeItem  ref={(ref) => this.newbiz=ref }/>
            </div>
        );
    }

}

export default BookType;
