import React,{Component} from 'react'
import { Table,Tabs,Input, Button,Icon,Select,DatePicker } from 'antd';
import {ajaxUtil} from '../../../util/AjaxUtils';
import OneStepDetailTable from './OneStepDetailTable'
import MonthStepTable from './MonthStepTable'
const TabPane = Tabs.TabPane;
// ----------------------------全网增值业务页面-----------------------------------------------
class  WholeNetBus extends Component {
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
            <TabPane tab="一级表" key="1"><OneStepDetailTable  dynColumns={dynColumns}  permission={permission}/></TabPane>
            <TabPane tab="月报表" key="2"><MonthStepTable  dynColumns={dynColumns}   permission={permission}/></TabPane>
          </Tabs>
        </div>
      );
    }
}
export default WholeNetBus;
