import React,{Component} from 'react';
import {ajaxUtil} from '../../../util/AjaxUtils';
import FileNameSelectList from './FileNameSelectList';
import { Tree,Card,Col ,Row,Button, Icon,Popconfirm,message,DatePicker,Select,Input,Table} from 'antd';
import BusiOrderList from './BusiOrderList';
import FileFormatTable from './FileFormatTable';
class DataOrder extends Component {
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

     changebizNode=(record) =>{
       console.log(record);
       this.setState({bizCode:record.id,bizName:record.fileName});
     }

    render() {
        const {auditTypeList,auditScopeList,dataTypeList,bizCode,bizName,permission,tableData,tableInfo} =this.state;
        let titleOne="文件格式配置=>"+this.state.bizName;
      return (
        <div className="diffconfig_main" style={{ background: '#ECECEC'}}>
        <Row gutter={8}>
          <Col span={8}>
            <Card title="选择文件名" style={{minHeight:500}}>
                <FileNameSelectList permission={permission} changebizNode={(record) =>this.changebizNode(record)}/>
             </Card>
          </Col>
          <Col span={16}>
            <Card title={titleOne}  style={{minHeight:500}}>
                <FileFormatTable permission={permission} fileId={bizCode}/>
             </Card>
          </Col>
          </Row>
          </div>
      );
    }
}

export default  DataOrder;
