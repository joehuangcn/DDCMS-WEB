import React, {Component}  from 'react';
import {Table} from 'antd';
import { Button, Icon,Popconfirm,message,DatePicker,Select,Input,TreeSelect } from 'antd';
import uuid from 'node-uuid';
import {ajaxUtil} from '../../../util/AjaxUtils';
const {RangePicker} = DatePicker;
const {Option} = Select;
const {Search} =Input;

const SHOW_CHILD=TreeSelect.SHOW_CHILD

class Cyzs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data:[],
            pagination:[],
            loading:false,
            startDate:'',
            endDate:'',
        };

    }
    componentWillMount() {
        this.getDynAction();
        // this.loadTreeNode();
    }
    componentDidMount=() => {
        this.fetch();
    }

    getDynAction =() => {
        const columns=[{
            title: '业务名称',
            dataIndex: 'bizname',
            key: 'bizname',
        },{
            title:'稽核日期',
            dataIndex:'datatime',
            key:'datatime',
        },{
            title:'BOOSS数量',
            dataIndex:'bossqty',
            key:'bossqty',
        },{
            title:'平台反馈量',
            dataIndex:'reqty',
            key:'reqty',
        },{
            title: '一致量',
            dataIndex: 'sameqty',
            key: 'sameqty',
        },{
            title:'平台添加量',
            dataIndex:'addqty',
            key:'addqty',
            render :(value, row, index) => {
                if (value !=='0') {
                  return (
                    <div>{value}
                        <span className="ant-divider"/>
                        <a onClick={()=> {this.download(2,value,row)}}><Icon type="download" /></a>
                    </div>)
                }else
                return value;
              }
        },{
            title:'平台删除量',
            dataIndex:'delqty',
            key:'delqty',
            render :(value, row, index) => {
                if (value !== '0') {
                  return (
                    <div>{value}
                        <span className="ant-divider"/>
                        <a onClick={()=> {this.download(3,value,row)}}><Icon type="download" /></a>
                    </div>)
                }else{
                  return value;
                }
              }
        },{
            title:'平台更新量',
            dataIndex:'modqty',
            key:'modqty',
            render :(value, row, index) => {
                if (value !== '0') {
                  return (
                    <div>{value}
                        <span className="ant-divider"/>
                        <a onClick={()=> {this.download(4,value,row)}}><Icon type="download" /></a>
                    </div>)
                }else{
                 return value;
              }
            }
        },{
            title:'处理失败量',
            dataIndex:'failqty',
            key:'failqty',
            render :(value, row, index) => {
                if (value !== '0') {
                  return (
                    <div>{value}
                        <span className="ant-divider"/>
                        <a onClick={()=> {this.download(0,value,row)}}><Icon type="download" /></a>
                    </div>)
                }else {
                return value;}
              }
        },{
            title:'一致率',
            dataIndex:'samerate',
            key:'samerate',
        },{
            title:'平台',
            dataIndex:'pingtai',
            key:'pingtai',
        },];
        // columns.push();
        this.setState({columns});
    }

    // download= (value) =>{
    //     // let value="";
    //     window.location.href="";
    //     fetch("/DDCMS/cyzs!downDetails.action",{
    //       method:'POST',
    //       credentials: 'include',
    //       headers:{   "Content-Type": "application/x-www-form-urlencoded"},
    //       body:"filename="+value
    //     }).then(
    //       (response) =>
    //         response.json()
    //   )
    //     .then((responseJson) => {
    //       if (responseJson.head) {
    //            if (responseJson.head.stateCode === 400) {
    //              message.error(responseJson.head.stateMes);
    //           }
    //         }
    //     }).catch((error) => {
    //     console.error(error);
    //     });
    //   }

    download=(result,value,record) =>{
      let text="result="+result+" &datatime="+record.datatime+"&citycode="+record.citycode;
      window.location.href="/DDCMS/audit-rule!loadXLS.action?"+text;
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
        let sort='datatime';
        if (typeof(params.sortField) !== "undefined" ) {
            sort=params.sortField;
        }
        let dir='DESC';
        if (typeof(params.sortOrder) !== "undefined" ) {
            dir=params.sortOrder;
        }
        const {config} = this.props;
        const text="startDate="+this.state.startDate
            +"&endDate="+this.state.endDate
            +"&dir="+dir
            +"&sort="+sort
            +"&start="+page+"&limit=10";

        ajaxUtil("urlencoded","cyzs!getJsonList.action",text,this,(data,that) => {
            const pagination = that.state.pagination;
            pagination.total = parseInt(data.total,10);
            this.setState({
                loading: false,
                data: data.data,
                pagination,
            });
        });
    }

    exportMes=(e)=>{

        const {config,permission} = this.props;
        const {startDate,endDate}=this.state;
        let text="startDate="+startDate
        +"&endDate="+endDate;
        // if (e.key==='1') {
        //     if (this.state.selectedRowKeys.length<=0) {
        //         message.warning("请选择需要导出的列");
        //     }else{
        //     text+="&flag=select&bizeScopes="+this.state.selectedRowKeys;
        //     //  this.help(text);
        //     window.location.href="/DDCMS/cyzs!loadXLS.action?"+text;
        //     }
        // }else if (e.key==='2') {
        //     text+="&flag=all&bizeScopes=";
            // this.help(text);
            window.location.href="/DDCMS/cyzs!loadXLS.action?"+text;
        // }
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
    //     ajaxUtil("urlencoded","cyzs!getJsonList.action","",this,(data,that) =>{
    //         this.setState({treeData:data});
    //     });
    // }
    treeChange = (value) => {
    }

    render(){
        return(
            <div>
                <Button type='primary' onClick={this.exportMes} ><Icon type="download" />导出</Button>
                    <DatePicker  placeholder="开始时间" onChange={this.onStartChange}/>
                    <DatePicker  placeholder="结束时间" onChange={this.onEndChange}/>
                    <Button type='primary'  onClick={this.reflash}><Icon type="sync" />查询</Button>
                    <Table rowKey={() =>uuid.v1()} columns={this.state.columns}  loading={this.state.loading} dataSource= {this.state.data}   pagination={this.state.pagination} onChange={this.handleTableChange} />
            </div>
        );
    }

}
export default Cyzs;
