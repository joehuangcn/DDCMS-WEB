import React,{Component} from 'react';
import {Select,DatePicker,Form,Button,Icon,TreeSelect} from 'antd';
import { Row, Col } from 'antd';
import {ajaxUtil} from '../../../util/AjaxUtils';
import {ComposedChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,PieChart, Pie,Cell} from 'recharts';
const FormItem=Form.Item;
const Option = Select.Option;
// --------------------差异趋势分析------------------------------------------
const anaList = [
  {key:'total',value:'差异总量'},
  {key:'newhis',value:'历史/新增差异'},
];

class  DiffTendAnalay extends Component {
  constructor(props) {
    super(props);
    this.state={
      data:[],
      citys:[],
      queryCity:'',
      startDate:'',
      endDate:'',
      typeChange:'',
      id:'',
      permission:[],
      showGener:'',
      netCode:'',
      bizCode:'',
    }
  }

  componentWillMount(){
    this.handleFocus();
  }

  handleFocus() {
   ajaxUtil("urlencoded","constant!getCityCodeEntryAllList.action","",this,(data,that)=>{
     this.setState({citys:data.data});
   });
   ajaxUtil("urlencoded","business!getBusAfterNew.action","",this,(data,that)=>{
       this.setState({bizList:data});
   });
  }
  componentDidMount(){
    // console.log('OK');
    this.fetch();
  }

  componentWillReceiveProps(props){
    this.handleReset();
  }

  fetch=()=>{
    const {bizCode,startDate,endDate,diffCode,cityCode,showGener,netCode}=this.state;
    const text="bizCode="+bizCode+"&startDate="+startDate+"&endDate="+endDate+"&cityCode="+cityCode+"&showGener="+showGener+"&netCode="+netCode;
    ajaxUtil("urlencoded","data-analyze!getDataAnalyzeChartNew.action",text,this,(data,that)=> {
      this.setState({data:data.data});
    });
  }

  queryCity=(value) => {
    this.setState({queryCity:value});
  }
  onStartChange= (date, dateString) => {
    this.setState({ startDate: dateString });
  }
  onEndChange= (date, dateString) => {
     this.setState({ endDate: dateString });
  }
  typeChange =(value) =>{
    this.setState({typeChange:value});
  }

  refresh=() =>{
    this.fetch();
  }

  handleReset = () => {
   this.form.resetFields();
   this.setState({bizCode:'',startDate:'',endDate:'',diffCode:'',cityCode:'',showGener:'',netCode:''},()=>{this.fetch()});
 }

 handleSearch=(e) => {
   const form= this.form;
   form.validateFields(( err, values) => {
     if (err) {
       return;
     }
     console.log("----values",values);
     let bizCode=values.bizCode===undefined?'':values.bizCode;
     let startDate=values.startDate===undefined||values.startDate==null?'':values.startDate.format('YYYY-MM-DD');
     let endDate=values.endDate===undefined||values.endDate==null?'':values.endDate.format('YYYY-MM-DD');
     let diffCode=values.diffCode===undefined?'':values.diffCode;
     let cityCode=values.cityCode===undefined?'':values.cityCode;
     let showGener=values.showGener===undefined?'':values.showGener;
     let netCode=values.netCode===undefined?'':values.netCode;
     this.setState({bizCode,startDate,endDate,diffCode,cityCode,showGener,netCode},()=>{this.fetch()});
  })
}

handleRenderPie=(showGener) =>{
  if (showGener===""||showGener==="total") {
    return <Bar dataKey='差异量' yAxisId="1" barSize={20} fill='#00BFFF'/>;
  }else{
    return <Bar dataKey='新增差异' yAxisId="1" barSize={20} fill='#8884d8'/>;
  }
}

handleRenderHis=(showGener) =>{
  if (showGener===""||showGener==="total") {
    return ;
  }else{
      return <Bar dataKey='历史差异' yAxisId="1" barSize={20} fill='#82ca9d'/>;
  }
}

handleRenderRate=(netCode) =>{
  if (netCode===""||netCode==="total"){
    return   <Line type='monotone'  yAxisId="2"  dataKey="整体一致率"  type='monotone' stroke='#ff7300' unit="%"/>;
  }else{
      return <Line type='monotone'  yAxisId="2"  dataKey={netCode}  type='monotone' stroke='#ff7300' unit="%"/>;
  }
}

  render() {
    const {citys,data,showGener,netCode}=this.state;
    return(
      <div>
      <SearchBut ref={(ref) => this.form = ref} handleSearch={this.handleSearch} handleReset={this.handleReset}  citys={this.state.citys}
        bizList={this.state.bizList} />
      <ComposedChart width={1000} height={500} data={data}
          margin={{top: 20, right: 20, bottom: 20, left: 20}}>
        <XAxis dataKey="name"/>
        <YAxis  yAxisId="1"/>
        <YAxis  orientation="right" allowDataOverflow={true} type="number" yAxisId="2" unit="%" />
        <Tooltip/>
        <Legend/>
        <CartesianGrid stroke='#f5f5f5'/>
          {this.handleRenderPie(showGener)} {this.handleRenderHis(showGener)} {this.handleRenderRate(netCode)}
     </ComposedChart>
      </div>
    );
  }
}

class AuditChartSearch  extends Component{
  constructor(props) {
    super(props);
    this.state={
      diffCodes:[],
      netCodes:[],
    }
  }

  handleBizTreeChange=(value) =>{
    ajaxUtil("urlencoded","data-analyze!getDiffCodeForAnalyzebyCitycode.action","bizCode="+value,this,(data,that)=>{
      this.setState({diffCodes:data.data});
    });
    ajaxUtil("urlencoded","data-analyze!getSameRateNetCode.action","bizCode="+value,this,(data,that)=>{
      this.setState({netCodes:data.data});
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const {diffCodes,netCodes}=this.state;
   const formItemLayout = {
     labelCol: { span: 10 },
     wrapperCol: { span: 14 },
   };
   return(
    <Form layout="inline"  >
       <Row gutter={4}>
       <Col span={6} >
               <FormItem {...formItemLayout} label="选择业务">
                 {getFieldDecorator("bizCode")(
                   <TreeSelect  placeholder='选择业务'
                      style={{ width: 200 }} allowClear
                   treeData={this.props.bizList}  onChange={this.handleBizTreeChange} />
                 )}
               </FormItem>
        </Col>
        <Col span={6}>
         <FormItem {...formItemLayout} label="开始时间" >
           {getFieldDecorator("startDate")(
               <DatePicker style={{ width: 200 }} placeholder="开始时间"/>
           )}
         </FormItem>
         </Col>
         <Col span={6} >
          <FormItem {...formItemLayout} label="结束时间">
            {getFieldDecorator("endDate")(
                <DatePicker style={{ width: 200 }} placeholder="结束时间" />
            )}
          </FormItem>
          </Col>
          <Col span={6}>
           <FormItem {...formItemLayout} label="差异代码" >
             {getFieldDecorator("diffCode")(
               <Select  style={{ width: 150 }} placeholder="差异代码" allowClear={true}>
                   {diffCodes.map(d =><Option key={d.diffCode} value={d.diffCode}>{d.diffCode}</Option>)}
               </Select>
             )}
           </FormItem>
           </Col>
       </Row>
       <Row gutter={4}>
       <Col span={4} >
        <FormItem {...formItemLayout} label="城市">
          {getFieldDecorator("cityCode")(
            <Select  placeholder="选择地市" style ={{ width: 120 }} onChange={this.city} allowClear={true}>
              {this.props.citys.map(d=> <Option key={d.key} value={d.key}>{d.value}</Option>)}
            </Select>
          )}
        </FormItem>
        </Col>
        <Col span={4} >
         <FormItem {...formItemLayout} label="分析纬度">
           {getFieldDecorator("showGener")(
             <Select  placeholder="选择分析纬度" style ={{ width: 120 }} allowClear={true}>
               {anaList.map(d=> <Option key={d.key} value={d.key}>{d.value}</Option>)}
             </Select>
           )}
         </FormItem>
         </Col>
         <Col span={4} >
          <FormItem {...formItemLayout} label="一致率分类">
            {getFieldDecorator("netCode")(
              <Select  placeholder="请选择" style ={{ width: 120 }}  allowClear={true}>
                {netCodes.map(d=> <Option key={d.netCode} value={d.netCode}>{d.samerateName}</Option>)}
              </Select>
            )}
          </FormItem>
          </Col>
      <Col span={4} style={{ textAlign: 'right' }} >
        <Button type="primary" onClick={this.props.handleSearch}><Icon type="sync" />查询</Button>
        <Button style={{ marginLeft: 8 }} onClick={this.props.handleReset}> 重置</Button>
      </Col>
       </Row>
     </Form>
   );

}
}
const SearchBut =Form.create()(AuditChartSearch);
export default DiffTendAnalay ;
