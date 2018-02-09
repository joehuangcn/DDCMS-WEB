import React,{Component} from 'react';
import {Select,DatePicker,Form,Button,Icon} from 'antd';
import { Row, Col } from 'antd';
import {ajaxUtil} from '../../../util/AjaxUtils';
import {ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
const FormItem=Form.Item;
const Option = Select.Option;
const showGenerMap=[
  {key:'YZL_RATE',value:'整体一致率'},
  {key:'BOSS_YZL_RATE',value:'以BOSS为准一致率'},
  {key:'FLAT_YZL_RATE',value:'以平台为准一致率'},
]
class  AuditChart extends Component {
  constructor(props) {
    super(props);
    this.state={
      data:[],
      citys:[],
      queryCity:'',
      startDate:'',
      endDate:'',
      typeChange:'',
      config:props.config,
    }
  }

  componentWillMount(){
    this.handleFocus();
  }

  handleFocus() {
   ajaxUtil("urlencoded","constant!getCityCodeEntryAllList.action","",this,(data,that)=>{

     this.setState({citys:data.data});
   });
  }
  componentDidMount(){
    this.fetch();
  }

  componentWillReceiveProps(props){
    if (props.config.bizCode!== this.state.config.bizCode) {
      this.setState({config:props.config});
      this.handleReset();
    }
  }

  fetch=()=>{
    const {queryCity,startDate,endDate,typeChange}=this.state;
    const {config} = this.props;
    const text="startDate="+startDate+"&endDate="+endDate+"&citycode="+queryCity+"&typeChange="+typeChange+"&bizCode="+config.bizCode;
    ajaxUtil("urlencoded","audit-stat!getLineChartByFlat.action",text,this,(data,that)=> {
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
   this.setState({queryCity:'',startDate:'',endDate:'',  typeChange:''},()=>{this.fetch()});
 }

 handleSearch=(e) => {
   const form= this.form;
   form.validateFields(( err, values) => {
     if (err) {
       return;
     }
     let queryCity=values.queryCity===undefined?'':values.queryCity;
     let startDate=values.startDate===undefined||values.startDate==null?'':values.startDate.format('YYYY-MM-DD');
     let endDate=values.endDate===undefined||values.endDate==null?'':values.endDate.format('YYYY-MM-DD');
     let typeChange=values.typeChange===undefined?'':values.typeChange;
     this.setState({queryCity,startDate,endDate,typeChange},()=>{this.fetch()});
  })
}
renderName=() =>{
  const {typeChange}=this.state;
  if (typeChange===''|| typeChange==='YZL_RATE') {
    return "整体一致率";
  }else if(typeChange ==="BOSS_YZL_RATE"){
    return "以BOSS为准一致率";
  }else if(typeChange ==="FLAT_YZL_RATE") {
    return "以平台为准一致率";
  }
  return "";
}

  render() {
    const {citys,data}=this.state;
    const title=this.renderName();
    return(
      <div>
      <SearchBut ref={(ref) => this.form = ref} handleSearch={this.handleSearch} handleReset={this.handleReset}  citys={this.state.citys}/>
      <span style={{textAlign: 'middle'}}>{title}</span>
      <ComposedChart width={1000} height={400} data={data}
          margin={{top: 20, right: 20, bottom: 20, left: 20}}>
        <XAxis dataKey="name"/>
        <YAxis unit="%"/>
        <Tooltip/>
        <Legend/>
        <CartesianGrid stroke='#f5f5f5'/>
        <Bar dataKey='条形图' barSize={20} fill='#00BFFF' unit="%"/>
        <Line type='monotone' dataKey='折线图' stroke='#ff7300' unit="%"/>
     </ComposedChart>
      </div>
    );
  }
}

class AuditChartSearch  extends Component{
  constructor(props) {
    super(props);
  }
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
           {getFieldDecorator("startDate")(
               <DatePicker  placeholder="开始时间"/>
           )}
         </FormItem>
         </Col>
         <Col span={4} >
          <FormItem {...formItemLayout} label="结束时间">
            {getFieldDecorator("endDate")(
                <DatePicker  placeholder="结束时间" />
            )}
          </FormItem>
          </Col>
          <Col span={4} >
           <FormItem {...formItemLayout} label="显示分类">
             {getFieldDecorator("typeChange")(
               <Select  placeholder="显示分类" style={{ width: 150 }}  allowClear={true}>
                 {showGenerMap.map(d=> <Option key={d.key} value={d.key}>{d.value}</Option>)}
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
export default AuditChart;
