import React,{Component} from 'react'
import { Table,Tabs,Input, Button,Icon,Select,DatePicker,Col,Row,Form } from 'antd';
import {ajaxUtil} from '../../../util/AjaxUtils';
const TabPane = Tabs.TabPane;
const FormItem=Form.Item;
// ----------------------------流量话单页面-----------------------------------------------
class  DataFlow extends Component {
  constructor(props) {
    super(props);
    this.state={
      permission:[],
      oneStep:0,
      monthStep:1,
    }
    }

  componentWillMount(){
      this.getInitProps(this.props);
      // this.getInitList();
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
    render(){
      const {permission,oneStep,monthStep}=this.state;
      return(
        <div className="tabs_all" style={{height:'100%'}}>
          <Tabs type="card" style={{height:'100%'}}>
            <TabPane tab="日增量" key="1"><TableList  type={oneStep}  permission={permission}/></TabPane>
            <TabPane tab="月全量" key="2"><TableMonthList  type={monthStep} permission={permission}/></TabPane>
          </Tabs>
        </div>
      );
    }
}


class TableList extends Component {
    constructor(props) {
      super(props);
      this.state={
        columns:[],
        data:[],
        startDate:'',endDate:'',
          pagination:{},
      }
      }

      componentWillMount(){
        this.getDynColumnHead();
      }

      componentDidMount(){
        this.fetch();
      }

      getDynColumnHead =() =>{
        // console.log(dynColumns);
        const firtColumns =[
          {title: '稽核开始时间',dataIndex: 'startDate', key: 'startDate',width:100},
          { title: '稽核结束时间',dataIndex: 'endDate',key: 'endDate',width:120,},
          {title: 'PGW名称',dataIndex: 'name',key: 'name',width:150},
          {title:'上行流量',dataIndex:'upflow',key:'upflow',width:150},
          {title:'下行流量',dataIndex:'downflow',key:'downflow',width:150},
          {title:'提数时间',dataIndex:'insertDate',key:'insertDate',width:150},
        ]
        this.setState({columns:firtColumns});
      }

      fetch = (params = {}) => {
         this.setState({loading:true});
         let page=0;
         if (params.page>1) {
           page=(params.page-1)*10;
         }
         let sort='insertDate';
         if (typeof(params.sortField) !== "undefined" ) {
           sort=params.sortField;
         }
         let dir='DESC';
         if (typeof(params.sortOrder) !== "undefined" ) {
           dir=(params.sortOrder=="descend"?"desc":"asc");
         }
        //  const {config} = this.props;
        const {startDate,endDate}=this.state;
        const {type}=this.props;
         const text="startDate="+startDate
         +"&endDate="+endDate
         +"&sort="+sort
         +"&dir="+dir
         +"&start="+page+"&limit=10&type="+type;
         ajaxUtil("urlencoded","dataflow!getDataflowList.action",text,this,(data,that)  => {
           const pagination = that.state.pagination;
           pagination.total = parseInt(data.total,10);
           if (data.data===undefined) {
             data.data=[];
           }
           this.setState({
               loading: false,
               data: data.data,
               pagination,
           });
         });
       }



      handleSearch=(e) => {
       const form= this.form;
       form.validateFields(( err, values) => {
         if (err) {
           return;
         }
         console.log(values);
         let startDate=values.startDate===undefined||values.startDate==null?'':values.startDate.format('YYYY-MM-DD');
         let endDate=values.endDate===undefined||values.endDate==null?'':values.endDate.format('YYYY-MM-DD');
         this.setState({startDate,endDate},()=>{this.fetch()});
      })
    }

    handleReset=() =>{
      this.form.resetFields();
      this.setState({startDate:'',endDate:''},()=>{this.fetch()});
    }

    render(){
        const {columns,data,loading,pagination,selectedRowKeys}=this.state;
      return(
        <div>
        <SearchBut ref={(ref) => this.form = ref} handleSearch={this.handleSearch}
        handleReset={this.handleReset}/>
        <Table rowKey='id' loading={loading} columns={columns} pagination={pagination} dataSource={data}
          onChange={this.handleTableChange}  bordered size="middle"/>
       </div>
      );
    }
}

class TableMonthList extends Component {
    constructor(props) {
      super(props);
      this.state={
        columns:[],
        data:[],
        startDate:'',endDate:'',
          pagination:{},
      }
      }

      componentWillMount(){
        this.getDynColumnHead();
      }

      componentDidMount(){
        this.fetch();
      }

      getDynColumnHead =() =>{
        // console.log(dynColumns);
        const firtColumns =[
          {title: '稽核开始时间',dataIndex: 'startDate', key: 'startDate',width:100},
          { title: '稽核结束时间',dataIndex: 'endDate',key: 'endDate',width:120,},
          {title: 'PGW名称',dataIndex: 'name',key: 'name',width:150},
          {title:'上行流量',dataIndex:'upflow',key:'upflow',width:150},
          {title:'下行流量',dataIndex:'downflow',key:'downflow',width:150},
          {title:'提数时间',dataIndex:'insertDate',key:'insertDate',width:150},
        ]
        this.setState({columns:firtColumns});
      }

      fetch = (params = {}) => {
         this.setState({loading:true});
         let page=0;
         if (params.page>1) {
           page=(params.page-1)*10;
         }
         let sort='insertDate';
         if (typeof(params.sortField) !== "undefined") {
           sort=params.sortField;
         }
         let dir='DESC';
         if (typeof(params.sortOrder) !== "undefined" ) {
           dir=(params.sortOrder=="descend"?"desc":"asc");
         }
        //  const {config} = this.props;
        const {startDate,endDate}=this.state;
        const {type}=this.props;
         const text="startDate="+startDate
         +"&endDate="+endDate
         +"&sort="+sort
         +"&dir="+dir
         +"&start="+page+"&limit=10&type="+type;
         ajaxUtil("urlencoded","dataflow!getDataflowList.action",text,this,(data,that)  => {
           const pagination = that.state.pagination;
           pagination.total = parseInt(data.total,10);
           if (data.data===undefined) {
             data.data=[];
           }
           this.setState({
               loading: false,
               data: data.data,
               pagination,
           });
         });
       }



      handleSearch=(e) => {
       const form= this.form;
       form.validateFields(( err, values) => {
         if (err) {
           return;
         }
         console.log(values);
         let startDate=values.startDate===undefined||values.startDate==null?'':values.startDate.format('YYYY-MM-DD');
         let endDate=values.endDate===undefined||values.endDate==null?'':values.endDate.format('YYYY-MM-DD');
         this.setState({startDate,endDate},()=>{this.fetch()});
      })
    }

    handleReset=() =>{
      this.form.resetFields();
      this.setState({startDate:'',endDate:''},()=>{this.fetch()});
    }

    render(){
        const {columns,data,loading,pagination,selectedRowKeys}=this.state;
      return(
        <div>
        <SearchBut ref={(ref) => this.form = ref} handleSearch={this.handleSearch}
        handleReset={this.handleReset}/>
        <Table rowKey='id' loading={loading} columns={columns} pagination={pagination} dataSource={data}
          onChange={this.handleTableChange}  bordered  size="middle"/>
       </div>
      );
    }
}
class StatSearch extends Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    const {permission}=this.props;
    let expBtnPermiss='inline';
   const formItemLayout = {
     labelCol: { span: 10 },
     wrapperCol: { span: 14 },
   };
   const cityItemLayout = {
     labelCol: { span: 7 },
     wrapperCol: { span: 7 },
   };
   return(
    <Form layout="inline"  >
       <Row gutter={4}>
        <Col span={5}>
         <FormItem {...formItemLayout} label="查询：开始时间" >
           {getFieldDecorator("startDate")(
               <DatePicker className='1111' placeholder="开始时间" style={{width:150}}/>
           )}
         </FormItem>
         </Col>
         <Col span={5} >
          <FormItem {...formItemLayout} label="结束时间">
            {getFieldDecorator("endDate")(
                <DatePicker  placeholder="结束时间" style={{width:150}}/>
            )}
          </FormItem>
          </Col>
         <Col span={6}  >
           <Button type="primary" onClick={this.props.handleSearch}>查询</Button>
           <Button style={{ marginLeft: 8 }} onClick={this.props.handleReset}> 重置</Button>
         </Col>
       </Row>
     </Form>
   );
  }
}
const SearchBut =Form.create()(StatSearch);

export default DataFlow;
