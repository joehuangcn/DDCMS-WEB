import React,{Component} from 'react'
import { Table,Tabs,Input, Button,Icon,Select,DatePicker,Popconfirm,Row,Col} from 'antd';
import {ajaxUtil} from '../../../util/AjaxUtils';
import DataSum from './DataSum'
import DataDetail from './DataDetail'
const TabPane = Tabs.TabPane;
// ----------------------------总体稽核报表页面-----------------------------------------------
class  DataAuditReportTotal extends Component {
  constructor(props) {
    super(props);
    this.state={
      citys:[],
      dynColumns:'',
      bizList:[],
      permission:[],
    }
    }

  componentWillMount(){
      this.getInitProps(this.props);
      this.getInitList();
  }

  // 初始化
  getInitProps=(props)=>{
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

  getInitList =() =>{
    ajaxUtil("urlencoded","constant!getCityCodeEntryAllList.action","",this,(data,that)=>{
      this.setState({citys:data.data});
    });
    ajaxUtil("urlencoded","audit-statall!getDynColumnHeadJson.action","",this,(data,that)=>{
      this.setState({dynColumns:data.data});
    });
    ajaxUtil("urlencoded","business!getBusAfterNew.action","",this,(data,that)=>{
        this.setState({bizList:data});
    });

  }
    render(){
      const {citys,dynColumns,bizList,permission}=this.state;
      return(
        <div className="tabs_all" style={{height:'100%'}}>
          <Tabs type="card" style={{height:'100%'}}>
            <TabPane tab="稽核报表" key="1"><DataSum bizList={bizList} dynColumns={dynColumns} citys={citys} permission={permission}/></TabPane>
            <TabPane tab="稽核报表-明细" key="2"><DataDetail bizList={bizList} dynColumns={dynColumns} citys={citys}  permission={permission}/></TabPane>
          </Tabs>
        </div>
      );
    }
}
export default DataAuditReportTotal;
