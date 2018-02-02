import React,{Component} from 'react';
import ReactEcharts from 'echarts-for-react';
import {Select,DatePicker,Form,Button,Icon,Table,Checkbox} from 'antd';
import { Row, Col } from 'antd';
import {ajaxUtil} from '../../../util/AjaxUtils';
import "echarts/map/js/province/liaoning.js";
const FormItem=Form.Item;
const Option = Select.Option;

class DiffInfoMap extends Component {
 constructor(props){
   super(props);
   this.state={
     obtainDateList:[],
     diffCodeList:[],
     netCodeList:[],
     obtainDate:'',
     diffCode:'',
     netCode:'',
     config:props.config,
     option:{
       title : {
         text: '',
         x:'center'
     },
     tooltip : {
         trigger: 'item',
         formatter:function(params){
           if (params.data.sameRate!==undefined) {
             return params.name+"<br/>差异量 :"+params.value+" 整体占比："+params.data.sameRate+"%";
           }

         }
     },
     visualMap: {
                min: 0,
                max: 0,
                left: 'left',
                top: 'bottom',
                text: ['高','低'],           // 文本，默认为数值文本
                calculable: true,
                color: ['orangered','yellow','lightskyblue']
      },
     series : [
         {
             name: '',
             type: 'map',
             mapType : '辽宁',
             roam:false,
             label:{
               normal:{show:true},
               emphasis:{show:true}
             },
             data:[
                        {name: '沈阳市',value: 20 ,sameRate:15},
                        {name: '大连市',value:30 ,sameRate:20},
                        {name: '鞍山市',value:40 ,sameRate:30},
                        {name: '抚顺市',value: 50 ,sameRate:45},
                        {name:'本溪市',value:60 ,sameRate:23},
                        {name:'丹东市',value:80 ,sameRate:56},
                        {name:'锦州市',value:20 ,sameRate:30},
                        {name:'营口市',value:30 ,sameRate:40},
                        {name:'阜新市',value:100,sameRate:50},
                        {name:'辽阳市',value:23, sameRate:78},
                        {name:'盘锦市',value:45 ,sameRate:32},
                        {name:'铁岭市',value:67,sameRate:20},
                        {name:'朝阳市',value:29,sameRate:20},
                        {name:'葫芦岛市',value:13,sameRate:67}
             ],
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
}
 componentDidMount(){
   this.fetch();
 }
 componentWillReceiveProps(props){
   if (props.config.bizCode!== this.state.config.bizCode) {
     this.setState({config:props.config},this.getHead) ;
   this.handleReset();
 }
 }

  fetch=()=>{
    const {obtainDate,diffCode,netCode}=this.state;
    const {bizCode}= this.state.config;
    const text="obtainDate="+obtainDate+"&diffCode="+diffCode+"&netCode="+netCode+"&bizCode="+bizCode;
    ajaxUtil("urlencoded","data-analyze!getCityMapList.action",text,this,(data,that)  => {
     let option=this.state.option;
     option.series[0].data=data.data;
     option.title.text=(data.obData==undefined?'':data.obData)+data.bizName+'地市差异情况';
     option.visualMap.max=data.maxNum;
      this.setState({
          option
      });
    });
 }
 getHead=()=> {
   const {bizCode} =this.state.config;
   ajaxUtil("urlencoded","data-analyze!getObtaindatatime.action","bizCode="+bizCode,this,(data,that)=>{

     this.setState({obtainDateList:data.data});
   });
   ajaxUtil("urlencoded","data-analyze!getDiffCodeForAnalyze.action","bizCode="+bizCode,this,(data,that)=>{
     this.setState({diffCodeList:data.data});
   });
   ajaxUtil("urlencoded","data-analyze!getSameRateNetCode.action","bizCode="+bizCode,this,(data,that)=>{
     this.setState({netCodeList:data.data});
   });
 }

 refresh=() =>{
   this.fetch();
 }
 queryObtainDate =(value) =>{
   this.setState({obtainDate:value});
 }
 queryDiffCode =(value) =>{
   this.setState({diffCode:value});
 }
 queryNetCode=(value) =>{
   this.setState({netCode:value});
 }

 handleReset = () => {
  this.form.resetFields();
  this.setState({obtainDate:'',diffCode:'',netCode:''},()=>{this.fetch()});
}

handleSearch=(e) => {
  const form= this.form;
  form.validateFields(( err, values) => {
    if (err) {
      return;
    }

    let obtainDate=values.obtainDate===undefined?'':values.obtainDate;
    // let diffCode=values.diffCode===undefined||values.diffCode==null?'':values.diffCode.format('YYYY-MM-DD');
    // let netCode=values.netCode===undefined||values.netCode==null?'':values.netCode.format('YYYY-MM-DD');
    let diffCode=values.diffCode===undefined?'':values.diffCode;
    let netCode=values.netCode===undefined?'':values.netCode;
    this.setState({obtainDate,diffCode,netCode},()=>{this.fetch()});
 })
}

  render(){
    const {obtainDateList,diffCodeList,netCodeList} =this.state;
  
    return(
      <div>
        <SearchBut ref={(ref) => this.form = ref} handleSearch={this.handleSearch} handleReset={this.handleReset}  obtainDateList={this.state.obtainDateList}
          diffCodeList={this.state.diffCodeList}  netCodeList={this.state.netCodeList}/>
      <ReactEcharts option={this.state.option} style={{height: '700px', width: '100%'}} className={'react_for_echarts'} />
      </div>
    );
  }
}

class DiffMapSearch  extends Component {
  render() {
    const { getFieldDecorator } = this.props.form;
   const formItemLayout = {
     labelCol: { span: 10 },
     wrapperCol: { span: 14 },
   };
   const {obtainDateList,diffCodeList,netCodeList}=this.props;
   return(
    <Form layout="inline"  >
       <Row gutter={24}>
       <Col span={4} >
        <FormItem {...formItemLayout} label="提数日期">
          {getFieldDecorator("obtainDate")(
            <Select  style={{ width: 120 }} onChange={this.queryObtainDate} allowClear={true}>
                {obtainDateList.map(d=> <Option key={d.fieldName} value={d.fieldCode}>{d.fieldName}</Option>)}
            </Select>
          )}
        </FormItem>
        </Col>
        <Col span={4}>
         <FormItem {...formItemLayout} label="差异代码" >
           {getFieldDecorator("diffCode")(
             <Select  style={{ width: 120 }} onChange={this.queryDiffCode} allowClear={true}>
                 {diffCodeList.map(d=> <Option key={d.diffCode} value={d.diffCode}>{d.diffCode}</Option>)}
             </Select>
           )}
         </FormItem>
         </Col>
         <Col span={4} >
          <FormItem {...formItemLayout} label="一致率分类">
            {getFieldDecorator("netCode")(
              <Select  style={{ width: 120 }} onChange={this.queryNetCode} allowClear={true}>
                  {netCodeList.map(d=> <Option key={d.netCode} value={d.netCode}>{d.samerateName}</Option>)}
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
const SearchBut =Form.create()(DiffMapSearch);

export default DiffInfoMap;
