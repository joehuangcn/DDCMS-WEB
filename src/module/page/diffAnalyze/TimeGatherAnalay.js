import React,{Component} from 'react';
import {Select,DatePicker,Form,Button,Icon,TreeSelect} from 'antd';
import { Row, Col } from 'antd';
import {ajaxUtil} from '../../../util/AjaxUtils';
import {BarChart, Bar, Brush, ReferenceLine, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
const FormItem=Form.Item;
const Option = Select.Option;
// --------------------时间聚集度分析------------------------------------------
const anaList = [
  {key:'total',value:'差异总量'},
  {key:'newhis',value:'历史/新增差异'},
];

class  TimeGatherAnalay extends Component {
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
      bizCode:'',obDate:'',diffCode:'',cityCode:'',
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
    this.fetch();
  }

  componentWillReceiveProps(props){
    this.handleReset();
  }

  fetch=()=>{
    const {bizCode,diffCode,cityCode,obDate}=this.state;
    const text="bizCode="+bizCode+"&obDate="+obDate+"&cityCode="+cityCode+"&diffCode="+diffCode;
    ajaxUtil("urlencoded","data-analyze!getDataAnalyzeTimeNew.action",text,this,(data,that)=> {
      this.setState({data:data.data});
    });
  }

  refresh=() =>{
    this.fetch();
  }

  handleReset = () => {
   this.form.resetFields();
   this.setState({bizCode:'',obDate:'',diffCode:'',cityCode:''},()=>{this.fetch()});
 }

 handleSearch=(e) => {
   const form= this.form;
   form.validateFields(( err, values) => {
     if (err) {
       return;
     }
     let bizCode=values.bizCode===undefined?'':values.bizCode;
     let diffCode=values.diffCode===undefined?'':values.diffCode;
     let cityCode=values.cityCode===undefined?'':values.cityCode;
     let obDate=values.obDate===undefined?'':values.obDate;
     this.setState({bizCode,diffCode,cityCode,obDate},()=>{this.fetch()});
  })
}

  render() {
    const {citys,data}=this.state;
    return(
      <div>
      <SearchBut ref={(ref) => this.form = ref} handleSearch={this.handleSearch} handleReset={this.handleReset}  citys={this.state.citys}
        bizList={this.state.bizList} />
        <span>请选择先业务,提数日期 进行查询</span>
        <BarChart width={1100} height={600} data={data}
                margin={{top: 5, right: 50, left: 20, bottom: 5}}>
           <XAxis dataKey="name"/>
           <YAxis/>
           <CartesianGrid strokeDasharray="3 3"/>
           <Tooltip/>
           <Legend verticalAlign="top" wrapperStyle={{lineHeight: '40px'}}/>
           <ReferenceLine y={0} stroke='#000'/>
           <Brush dataKey='name' height={30} stroke="#8884d8"/>
           <Bar dataKey="差异量" fill="#8884d8" />
          </BarChart>
      </div>
    );
  }
}

class AuditChartSearch  extends Component{
  constructor(props) {
    super(props);
    this.state={
      diffCodes:[],
      obList:[],
    }
  }

  handleBizTreeChange=(value) =>{
    ajaxUtil("urlencoded","data-analyze!getDiffCodeForAnalyzebyCitycode.action","bizCode="+value,this,(data,that)=>{
      this.setState({diffCodes:data.data});
    });
    ajaxUtil("urlencoded","data-analyze!getObtaindatatime.action","bizCode="+value,this,(data,that)=>{
      this.setState({obList:data.data});
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const {diffCodes,obList}=this.state;
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
        <Col span={4}>
         <FormItem {...formItemLayout} label="提数日期" >
           {getFieldDecorator("obDate")(
             <Select  style={{ width: 150 }} placeholder="提数日期" allowClear={true}>
                 {obList.map(d =><Option key={d.fieldCode} value={d.fieldCode}>{d.fieldName}</Option>)}
             </Select>
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
           <Col span={2} >
            <FormItem {...formItemLayout} label="城市">
              {getFieldDecorator("cityCode")(
                <Select  placeholder="选择地市" style ={{ width: 120 }} onChange={this.city} allowClear={true}>
                  {this.props.citys.map(d=> <Option key={d.key} value={d.key}>{d.value}</Option>)}
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
export default TimeGatherAnalay ;
