import React,{Component} from 'react';
import {ajaxUtil} from '../../../util/AjaxUtils';
import BusinessSelect from '../../../component/businessSelect/BusinessSelect';
import { Tree,Card,Col ,Row,Button, Icon,Popconfirm,message,DatePicker,Select,Input,Table} from 'antd';
import DiffList from './DiffList';
class DiffConfig extends Component {
    constructor(props){
      super(props);
      this.state={
          permission:[],
          bizCode:'',
          bizName:'',
      }
    }
    componentWillMount(){
      this.getInitProps(this.props);
      // this.getColum();
    }

    // 初始化
    getInitProps=(props)=>{
       const {state}=props.location;
       let permission=[];
       ajaxUtil("urlencoded","permiss!getUserBtnPermissByResid.action","resid="+state.id, this,(data,that)=>{
         permission=data.data;
         let addBtnPermiss=false;
         if (permission.indexOf('add')===-1) {
           addBtnPermiss=true;
         }
         this.setState({
           id:state.id,
           permission:permission,
           addBtnPermiss:addBtnPermiss
         });
       });
     }

     changebizNode=(selectedKeys,title) =>{
       this.setState({bizCode:selectedKeys,bizName:title});
     }

    render() {
        const {auditTypeList,auditScopeList,dataTypeList,bizCode,bizName,permission,tableData,tableInfo,addBtnPermiss} =this.state;
        let titleOne="业务差异列表("+this.state.bizName+")";
      return (
        <div className="diffconfig_main" style={{ background: '#ECECEC'}}>
        <Row gutter={8}>
          <Col span={8}>
            <Card title="选择业务" style={{minHeight:500}}>
                <BusinessSelect changebizNode={(...title) =>this.changebizNode(...title)}/>
             </Card>
          </Col>
          <Col span={16}>
            <Card title={titleOne}  style={{minHeight:500}}>
                <DiffList permission={permission} bizCode={bizCode}  addBtnPermiss={addBtnPermiss}/>
             </Card>
          </Col>
          </Row>
          </div>
      );
    }
}

export default  DiffConfig;
