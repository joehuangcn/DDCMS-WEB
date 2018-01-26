import React, {Component}  from 'react';
import {Table} from 'antd';
import { Button, Icon,Popconfirm,message,DatePicker,Select,Input,TreeSelect,ColorPicker } from 'antd';
import {ajaxUtil} from '../../../util/AjaxUtils';
import LevItem from "./LevItem";
const {RangePicker} = DatePicker;
const {Option} = Select;
const {Search} =Input;
const SHOW_CHILD=TreeSelect.SHOW_CHILD

// var Colr = require('colr');
// var ColorPicker = require('react-colorpicker');

class Level extends Component {
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
            addBtnPermiss:false,
            permission:[],
            // displayColorPicker: false,
        };
        // this.handleClick = this.handleClick.bind(this);
    }

      handleClick=()=> {
          this.newbiz.show();
      }
    componentWillMount() {
        this.getInitProps(this.props);
        this.getDynAction();
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
        const columns=[
          { title: '告警级别名称',  dataIndex: 'levName',  key: 'levName',},
          {title:'告警颜色',dataIndex:'colorValue',  key:'colorValue',render:(text) =>(this.renderColer(text))},
          {title:'图片路径',  dataIndex:'imgPath',key:'imgPath',},
          {  title:'告警级别',dataIndex:'thLev',  key:'thLev',
        },];

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
            return(
            <span>
             <a  style={{display:edit}} onClick = {() => {
               this.newbiz.showModal("edit",record);
             }}>修改</a>
             <span className="ant-divider"/>
             <Popconfirm title="你确定要删除该记录?" okText="是" cancelText="否" disabled onConfirm={() => {
               ajaxUtil("urlencoded","threshlev!delObj.action","levId="+record.levId,this,(data,that) => {
                 let status=data.success;
                 let message= data.message;
                   if (status==='true') {
                     message.success(message);
                   }else {
                     message.error(message);
                    }
                    this.fetch()
                   }
               )
             }}>
             <a style={{color:'red',display:deletes}}>删除</a>
             </Popconfirm>
            </span>
          )
        }
        };
        columns.push(action);
        this.setState({columns});
    }

    renderColer =(text)=>{
      if (text!=="") {
        return <div style={{backgroundColor:"#"+text}}>{text}</div>;
      }else{
        return text;
      }
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
        console.log('params',params);
        this.setState({loading:true}) ;
        let page=0;
        if (params.page>1) {
            page=(params.page-1)*10;
        }
        let sort='threshLev.levName';
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

        ajaxUtil("urlencoded","threshlev!getLevList.action",text,this,(data,that) => {
            const pagination = that.state.pagination;
            pagination.total = parseInt(data.total,10);
            this.setState({
                loading: false,
                data: data.data,
                pagination,
            });
        });
    }

    // handleModal= () => {
    //     this.newbiz.show();
    // }
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

    render(){
        return(
            <div>
              <Button  type='primary' onClick={ this.handleClick} disabled={this.state.addBtnPermiss}>新增</Button>
                <Button  onClick={this.reflash}><Icon type="sync" />刷新</Button>
                <Select style={{ width: 120 }} onChange={this.onSelectChange}  allowClear placeholder="选择查询字段">
                  <Option value="levName">告警级别名称</Option>
                  <Option value="colorValue">告警颜色</Option>
                </Select>
                <Search  placeholder="输入查询值"   style={{ width: 120 }}  onSearch={this.handleSearch} />
                 <Table rowKey="levId" columns={this.state.columns}  loading={this.state.loading} dataSource= {this.state.data}   pagination={this.state.pagination} onChange={this.handleTableChange} />
                 <LevItem  ref={(ref) => this.newbiz=ref } refresh={this.fetch}/>
            </div>
        );
    }

}

export default Level;
