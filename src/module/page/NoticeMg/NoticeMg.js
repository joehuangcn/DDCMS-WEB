import React, {Component}  from 'react';
import {Table} from 'antd';
import { Button, Icon,Popconfirm,message,DatePicker,Select,Input,TreeSelect } from 'antd';
import {ajaxUtil} from '../../../util/AjaxUtils';
import NoticeItem from './NoticeItem';
const {RangePicker} = DatePicker;
const {Option} = Select;
const {Search} =Input;
const SHOW_CHILD=TreeSelect.SHOW_CHILD

class NoticeMg extends Component {
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
            permission:[],

        };

    }
    componentWillMount() {
        this.getInitProps(this.props);
        this.getDynAction();
        // this.loadTreeNode();
    }
    componentDidMount=() => {
        this.fetch();
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


    getDynAction =() => {
        const columns=[{
            title: '公告标题',
            dataIndex: 'title',
            key: 'title',
        },{
            title:'公告内容',
            dataIndex:'content',
            key:'content',
        },{
            title:'发布时间',
            dataIndex:'pubTime',
            key:'pubTime',
        },{
            title:'发布者',
            dataIndex:'publisher',
            key:'publisher',
        },];
        let action ={
            title:'操作',
            key:'action',
            render : (text, record) =>{
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
                  <a  style={{display:edit}} onClick = {() => {this.newbiz.showModal("edit",record);}}>修改</a>
                    <span className="ant-divider"/>
                        <Popconfirm title="你确定要删除该条记录?" okText="是" cancelText="否" onConfirm={() => {
                        ajaxUtil("urlencoded","notice!del.action","nid="+record.nid,this,(data,that) => {
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
        let sort='notice.pubTime';
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

        ajaxUtil("urlencoded","notice!getNoticeList.action",text,this,(data,that) => {
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

    // loadTreeNode =() =>{
    //     ajaxUtil("urlencoded","notice!getNoticeList.action","",this,(data,that) =>{
    //         this.setState({treeData:data});
    //     });
    // }
    // treeChange = (value) => {
    // }

    render(){
      const {addBtnPermiss}=this.state;
        return(
            <div>
                <Button type='primary' onClick={this.handleModal}  disabled={addBtnPermiss} ><Icon type="plus" />新增</Button>
                <Button  onClick={this.reflash}><Icon type="sync" />刷新</Button>
                <Select style={{ width: 120 }} onChange={this.onSelectChange}  allowClear placeholder="选择查询字段">
                  <Option value="Title">公告标题</Option>
                </Select>
                <Search  placeholder="输入查询值"   style={{ width: 120 }}  onSearch={this.handleSearch} />
                 <Table rowKey='nid' columns={this.state.columns}  loading={this.state.loading} dataSource= {this.state.data}   pagination={this.state.pagination} onChange={this.handleTableChange} />
                <NoticeItem  ref={(ref) => this.newbiz=ref } reflash={this.reflash}/>
            </div>
        );
    }

}

export default NoticeMg;
