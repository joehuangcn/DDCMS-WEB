import React,{Component} from 'react';
import {ajaxUtil} from '../../../util/AjaxUtils';
import BusinessSelect from '../../../component/businessSelect/BusinessSelect';
import { Tree,Card,Col ,Row,Button, Icon,Popconfirm,message,DatePicker,Select,Input,Table} from 'antd';
import FtpSetList from './FtpSetList';
class FtpSetMg extends Component {
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

     changebizNode=(selectedKeys,title) =>{
       console.log(selectedKeys+""+title);
       this.setState({bizCode:selectedKeys,bizName:title});
     }

    render() {
        const {auditTypeList,auditScopeList,dataTypeList,bizCode,bizName,permission,tableData,tableInfo} =this.state;
        let titleOne="网元FTP配置列表("+this.state.bizName+")";
      return (
        <div className="ftpConfig_main" style={{ background: '#ECECEC'}}>
        <Row gutter={8}>
          <Col span={8} >
            <Card title="选择业务"  style={{minHeight:500}}>
                <BusinessSelect changebizNode={(...title) =>this.changebizNode(...title)}/>
             </Card>
          </Col>
          <Col span={16}>
            <Card title={titleOne}  style={{minHeight:500}}>
                <FtpSetList permission={permission} bizCode={bizCode} />
             </Card>
          </Col>
          </Row>
          </div>
      );
    }
}

export default FtpSetMg;
