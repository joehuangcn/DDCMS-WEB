import React,{Component} from 'react';
import {Select,DatePicker,Form,Button,Table,Row, Col } from 'antd';
import ReactEcharts from 'echarts-for-react';
import {ajaxUtil} from '../../../util/AjaxUtils';
const FormItem=Form.Item;
const Option = Select.Option;
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
class  DiffType extends Component {
  constructor(props) {
    super(props);
    this.state={
      columns:[],
      data:[],
      citys:[],
      loading:false,
      auditDate:'',
      obDateDate:'',
      queryCity:'',
      pieData:[],
      pagination:{},
      config:props.config,
      pieData:{
          title : {
            text: '业务差异饼图统计',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        series : [
            {
                name: '差异占比',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:[],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
        }
      }

  }

  componentWillMount(){
    this.getHead();
    this.handleFocus();
  }

  componentDidMount(){
    this.fetch();
    this.getPieFetch();
  }
  componentWillReceiveProps(props){
    if (props.config.bizCode!== this.state.config.bizCode) {
      this.setState({config:props.config},);
      this.handleReset();
    }
  }

  getHead=()=>{
    const columns =[
      { title: '提数日期',dataIndex: 'obtaindatatime',  key: 'obtaindatatime'},
      { title: '差异代码', dataIndex: 'diffcode', key: 'diffcode'},
      { title: '城市', dataIndex: 'citycode', key: 'citycode'},
      { title: '差异名称', dataIndex: 'diffname', key: 'diffname'},
      { title: '差异影响', dataIndex: 'beforeSyn',key: 'beforeSyn'},
      { title: '业务代码', dataIndex:'bizcode', key: 'bizcode'},
      { title: '差异量', dataIndex: 'diffnum', key: 'diffnum'}
    ]
    this.setState({columns});
  }

  handleFocus() {
   ajaxUtil("urlencoded","constant!getCityCodeEntryAllList.action","",this,(data,that)=>{

     this.setState({citys:data.data});
   });
 }

 refresh=()=>{
   this.fetch();
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

 fetch = (params = {}) => {
    this.setState({loading:true});
    let page=0;
    if (params.page>1) {
      page=(params.page-1)*10;
    }
    const {queryCity,auditDate,obDateDate}=this.state;
    const {config} = this.props;
    const text="auditDate="+auditDate
    +"&obtainDate="+obDateDate
    +"&cityCode="+queryCity
    +"&auditType="+config.auditType
    +"&dataScope="+config.dataScope
    +"&dataType="+config.dataType
    +"&bizCodeParam="+config.bizCode
   //  +"&sort="+config.sort
   //  +"&dir="+config.dir
    +"&start="+page+"&limit=10";
    ajaxUtil("urlencoded","cy-detail!getPicChart.action",text,this,(data,that) => {
      const pagination = that.state.pagination;
      pagination.total = parseInt(data.total,10);
      this.setState({
          loading: false,
          data: data.root,
          pagination,
      });
    });
  }

  getPieFetch=() => {
     let page=0;
     const {queryCity,auditDate,obDateDate}=this.state;
     const {config} = this.props;
     const text="auditDate="+auditDate
     +"&obtainDate="+obDateDate
     +"&cityCode="+queryCity
     +"&auditType="+config.auditType
     +"&dataScope="+config.dataScope
     +"&dataType="+config.dataType
     +"&bizCodeParam="+config.bizCode
    //  +"&sort="+config.sort
    //  +"&dir="+config.dir
     +"&start="+page+"&limit=10";
     ajaxUtil("urlencoded","cy-detail!getDiffPieChart.action",text,this,(data,that)  => {
       let pieData=this.state.pieData;
       pieData.series[0].data=data.data;
        this.setState({
            pieData
        });
     });
  }

  handleReset = () => {
   this.form.resetFields();
   this.setState({queryCity:'',startDate:'',endDate:''},()=>{this.fetch();this.getPieFetch();});
 }

 handleSearch=(e) => {
   const form= this.form;
   form.validateFields(( err, values) => {
     if (err) {
       return;
     }
     let queryCity=values.queryCity===undefined?'':values.queryCity;
     let auditDate=values.auditDate===undefined||values.auditDate==null?'':values.auditDate.format('YYYY-MM-DD');
     let obDateDate=values.obDateDate===undefined||values.obDateDate==null?'':values.obDateDate.format('YYYY-MM-DD');
     this.setState({queryCity,auditDate,obDateDate},()=>{this.fetch();this.getPieFetch();});
  })
}

  render(){
    const {citys,pieData}=this.state;
    return(
      <div>
        <SearchBut ref={(ref) => this.form = ref} handleSearch={this.handleSearch} handleReset={this.handleReset}  citys={this.state.citys}/>
        <Table rowKey="DID"  rowSelection={this.state.rowSelection} columns={this.state.columns}
        loading={this.state.loading} dataSource={this.state.data}  scroll={{x:1000}} pagination={this.state.pagination} />

        <ReactEcharts option={pieData} style={{height: '300px', width: '100%'}} className={'react_for_echarts'} />
      </div>
    );
  }

}

class StatSearch extends Component {
  render() {
    const { getFieldDecorator } = this.props.form;
   const formItemLayout = {
     labelCol: { span: 10 },
     wrapperCol: { span: 14 },
   };
   return(
    <Form layout="inline"  >
       <Row gutter={24}>
       <Col span={4} >
        <FormItem {...formItemLayout} label="城市">
          {getFieldDecorator("queryCity")(
            <Select  placeholder="选择地市" style={{ width: 120 }} onChange={this.city} allowClear={true}>
              {this.props.citys.map(d=> <Option key={d.key} value={d.key}>{d.value}</Option>)}
            </Select>
          )}
        </FormItem>
        </Col>
        <Col span={4}>
         <FormItem {...formItemLayout} label="开始时间" >
           {getFieldDecorator("auditDate")(
               <DatePicker  placeholder="开始时间"/>
           )}
         </FormItem>
         </Col>
         <Col span={4} >
          <FormItem {...formItemLayout} label="结束时间">
            {getFieldDecorator("obDateDate")(
                <DatePicker  placeholder="结束时间" />
            )}
          </FormItem>
          </Col>
         <Col span={4} style={{ textAlign: 'right' }} >
           <Button type="primary" onClick={this.props.handleSearch}>查询</Button>
           <Button style={{ marginLeft: 8 }} onClick={this.props.handleReset}> 重置</Button>
         </Col>
       </Row>
     </Form>
   );
  }
}
const SearchBut =Form.create()(StatSearch);

export default DiffType;
