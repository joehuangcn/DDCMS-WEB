import React,{Component} from 'react'
import {ajaxUtil} from '../../../util/AjaxUtils';
import { Tree,Card,Col ,Row,Button, Icon,Popconfirm,message,Select,Input,Table} from 'antd';
import UploadFile from '../../../component/uploadFile/UploadFile';
import BusinessSelect from '../../../component/businessSelect/BusinessSelect';
import NetConnectConfig from './NetConnectConfig';
import NetTableConfig from './NetTableConfig';
class NetSetMg extends Component{

  constructor(props){
    super(props);
    this.state={
      permission:[],
      bizCode:'',
      bizName:'',
      tableData:{},
      tableInfo:{}
    }
  }

  componentWillMount(){
    this.getInitProps(this.props);
    // this.getColum();
  }
  componentDidMount(){

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

  // getColum= ()=>{
  //   ajaxUtil("urlencoded","dictionaryAction!getDictionaryListByType.action","name=DICT_AuditType",this,(data,that)=>{
  //     this.setState({auditTypeList:data.data});
  //   });
  //   ajaxUtil("urlencoded","dictionaryAction!getDictionaryListByType.action","name=DICT_DataScope",this,(data,that)=>{
  //     this.setState({auditScopeList:data.data});
  //   });
  //   ajaxUtil("urlencoded","dictionaryAction!getDictionaryListByType.action","name=DICT_DataType",this,(data,that)=>{
  //     this.setState({dataTypeList:data.data});
  //   });
  // }

  changebizNode=(selectedKeys,title) =>{
    console.log(selectedKeys+""+title);
    this.setState({bizCode:selectedKeys,bizName:title});
  }

  handleSelectNet=(data,tableInfo) =>{
    this.setState({tableData:data,tableInfo:tableInfo})
  }

  render (){
    const {auditTypeList,auditScopeList,dataTypeList,bizCode,bizName,permission,tableData,tableInfo} =this.state;
    let titleOne="网元关连配置("+this.state.bizName+")";
    let titleTwo="网元字段表配置("+this.state.bizName+")";
    return (
      <div style={{ background: '#ECECEC'}}>
      <Row gutter={8}>
        <Col span={8}>
          <Card title="选择业务">
              <BusinessSelect changebizNode={(...title) =>this.changebizNode(...title)}/>
           </Card>
        </Col>
        <Col span={16}>
          <Card title={titleOne}>
                  <NetConnectConfig bizCode={bizCode}  permission={permission} handleSelectNet={ (...data)=> this.handleSelectNet(...data)}/>
           </Card>
        </Col>
        </Row>
        <Row gutter={8}>
          <Col span={24}>
            <Card title={titleTwo}>
                <NetTableConfig  permission={permission}  tableData={tableData} tableInfo={tableInfo} bizCode={bizCode}/>
             </Card>
          </Col>
          </Row>
        </div>
    );
  }
}

export default NetSetMg;
