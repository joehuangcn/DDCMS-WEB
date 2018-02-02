import React, {Component}  from 'react';
import {Table} from 'antd';
import { Button, Icon,Popconfirm,message,DatePicker,Select,Input,TreeSelect,ColorPicker } from 'antd';
import {ajaxUtil} from '../../../util/AjaxUtils';

const {RangePicker} = DatePicker;
const {Option} = Select;
const {Search} =Input;
const SHOW_CHILD=TreeSelect.SHOW_CHILD


class DealWith extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data:[],
            pagination:[],
            loading:false,
            alertType:'',
            isDeal:'',
            searchText:'',
        };
    }

    componentWillMount() {
        this.getDynAction();
    }
    componentDidMount=() => {
        this.fetch();
    }

    getDynAction =() => {
        const columns=[{
            title: '告警类型',
            dataIndex: 'alertType',
            key: 'alertType', render:(text) =>(this.rendType(text))

        },{
            title:'告警子类型',
            dataIndex:'alertSubType',
            key:'alertSubType',
            render:(text)=>(this.handleRenderStatu(text))
        },{
            title:'告警日期',
            dataIndex:'creatTime',
            key:'creatTime',
        },{
            title:'告警信息',
            dataIndex:'alertInfo',
            key:'alertInfo',
        },{
            title:'处理时间',
            dataIndex:'dealTime',
            key:'dealTime',
        },{
            title:'告警模块',
            dataIndex:'servName',
            key:'servName',
        },];
        let action ={
            title:'操作',
            key:'action',
            render : (text, record) => {
              if (record.dealTime==='未处理') {
                        return (
                            <span>
                            <Popconfirm title="确定该条告警记录已处理?" okText="是" cancelText="否" onConfirm={() => {
                            ajaxUtil("urlencoded","sys-alert!dealSysAlert.action","id="+record.alertid,this,(data,that) => {
                                this.fetch();
                            })
                        }}>
                            <span style={{color:'#0693E3'}}>处理</span>
                            </Popconfirm>
                        </span>
                     )
              }else{
                return "";
                }
        },
      }
        columns.push(action);
        this.setState({columns});
    }

    rendType =(v) =>{
      if (v == "thresh") {
           return "业务稽核";
      } else if (v == "system") {
           return "系统运行";
        }else if (v == "file") {
           return "文件取数";
       }
    }

    handleRenderStatu=(v) =>{
      if (v === "SameRate") {
            return "稽核一致率";
        } else if (v === "AddDiffRate") {
              return "新增差异率";
        } else if (v === "SynSuccessRate") {
              return "同步成功率";
        } else if (v === "menHigh") {
              return "内存占用过高";
        } else if (v === "cpuHigh") {
              return "cpu占用过高";
        } else if (v === "auditOutDate") {
              return "稽核任务超时";
        } else if (v === "outAuth") {
              return "未授权操作";
        }else if (v === "file") {
              return "文件取数";
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
        const text="alertType="+this.state.alertType
            +"&isDeal="+this.state.isDeal
            +"&searchText="+this.state.searchText
            +"&dir="+dir
            +"&sort="+sort
            +"&start="+page+"&limit=10";

        ajaxUtil("urlencoded","sys-alert!getSysAlertList.action",text,this,(data,that) => {
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

    onSelectChange =(value) => {
        value=(value===undefined?"":value);
        this.setState({alertType:value});
    }
    onDealChange =(value) => {
        value=(value===undefined?"":value);
        this.setState({isDeal:value});
    }

    handleSearch =(value) => {
        value=(value===undefined?"":value);
        this.setState({searchText:value},()=>{this.fetch});
    }

    render(){
        return(
            <div>
                <Button  onClick={this.reflash}><Icon type="sync" />刷新</Button>
                <Select style={{ width: 120 }} onChange={this.onSelectChange} allowClear placeholder="选择告警类型">
                  <Option value="levName">文件取数</Option>
                  <Option value="olorValue">业务稽核</Option>
                  <Option value="olor">系统运行</Option>
                </Select>
                <Select style={{ width: 120 }} onChange={this.onDealChange}  allowClear placeholder="选择告警处理">
                  <Option value="1">已处理</Option>
                  <Option value="0">未处理</Option>
                </Select>
                <Search  placeholder="输入告警信息"   style={{ width: 140 }}  onSearch={this.handleSearch} />
                 <Table  rowKey="alertid"  columns={this.state.columns}  loading={this.state.loading} dataSource= {this.state.data}   pagination={this.state.pagination} onChange={this.handleTableChange} />
            </div>
        );
    }

}

export default DealWith;
