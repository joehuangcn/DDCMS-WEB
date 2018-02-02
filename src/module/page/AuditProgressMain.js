import React,{Component} from 'react'
import { Form, Input,Modal ,Select,Row,Col,Radio,Divider,Checkbox,message,Steps, Button} from 'antd';
import { ajaxUtil} from '../../util/AjaxUtils';
import uuid from 'node-uuid';
import ModelManage from "./modelManage/ModelManage";
import BusinessList from './AuditTask/BusinessList';
import RoleManage from "./RoleManage/RoleManage";
import NetSetMg from "./auditSource/NetSetMg";
import DiffConfig from "./diffConfig/DiffConfig";
import FtpSetMg from "./ftpSetMg/FtpSetMg";
import BusiOrder from "./dataOrder/BusiOrder";
const FormItem = Form.Item;
const {Option} = Select;
const Step = Steps.Step;
// ------------------稽核自动化整合配置----------------------------

const steps = [{
  title: '业务管理',
  content: '/BusinessList',
},{
  title: '模块管理',
  content: '/ModelManage',
},{
  title: '角色管理',
  content: '/RoleManage',
},{
  title: '提数规则',
  content: '1',
}, {
  title: '稽核源表配置',
  content: '/NetSetMg',
},{
  title: '差异配置',
  content: '/DiffConfig',
},{
  title: '提数及同步配置',
  content: '/FtpSetMg',
},{
  title: '预处理规则配置',
  content: '/BusiOrder',
}
];



class AuditProgressMain extends Component {

    constructor(props){
      super(props);
      this.state={
         current: 0,
         buiLocation:{state:{}},
         modeLocation:{state:{}},
         roleLocation:{state:{}},
         netLocation:{state:{}},
         diffLocation:{state:{}},
         ftpLocation:{state:{}},
         buOrderLocation:{state:{}},
      }
    }
    componentWillMount() {
      this.getWorkOrderDetail();
    }

    next=()=>{
      const current = this.state.current + 1;
      this.setState({ current });
      }

    prev=()=>{
      const current = this.state.current - 1;
      this.setState({ current });
    }

    getWorkOrderDetail=()=>{
      let text="routers=/BusinessList,/ModelManage,/RoleManage,/NetSetMg,/DiffConfig,/FtpSetMg,/BusiOrder";
      ajaxUtil("urlencoded","module!getModleByRouterList.action",text,this,(data,that) => {
      const {buiLocation,modeLocation,roleLocation,netLocation,diffLocation,ftpLocation,buOrderLocation}=this.state;
      for (var i = 0; i < data.length; i++) {
        switch (data[i].router) {
          case '/BusinessList':
              buiLocation.state=data[i];
            break;
            case "/ModelManage":
                modeLocation.state=data[i];
              break;
            case "/RoleManage":
              roleLocation.state=data[i];
              break;
            case "/NetSetMg":
              netLocation.state=data[i];
              break;
            case "/DiffConfig":
              diffLocation.state=data[i];
              break;
            case "/FtpSetMg":
              ftpLocation.state=data[i];
              break;
            case "/BusiOrder":
              buOrderLocation.state=data[i];
              break;
          default:

        }
      }
        // location.state=data;
        //   console.log(data,location);
        this.setState({buiLocation,modeLocation,roleLocation,netLocation,diffLocation,ftpLocation,buOrderLocation});
      });
    }

     renderContent=(current) =>{
      //  console.log(current);
       const {buiLocation,modeLocation,roleLocation,netLocation,diffLocation,ftpLocation,buOrderLocation}=this.state;
       switch (current) {
        case 0:return <BusinessList  location={buiLocation}/>;break;
        case 1:return <ModelManage  location={modeLocation}/>;break;
        case 2: return <RoleManage  location={roleLocation} />;break;
        case 3: return "";break;
        case 4:return <NetSetMg location={netLocation} />; break;
        case 5:  return <DiffConfig location={diffLocation} />;break;
        case 6: return <FtpSetMg location={ftpLocation} />; break;
        case 7:return <BusiOrder location={buOrderLocation} />;break;
         default:
            return "";
       }
     }

    render(){
       const {current} = this.state;
      return(
        <div>
          <Steps current={this.state.current} size="small" >
            {steps.map(item => <Step key={item.title} title={item.title} />)}
          </Steps>
          <div className="steps-action" style={{margin:'5px'}}>
         {
           this.state.current < steps.length - 1 && <Button type="primary" onClick={() => this.next()}>下一步</Button>
         }
         {
           this.state.current === steps.length - 1
           &&
           <Button type="primary" onClick={() => message.success('配置完成')}>完成</Button>
         }
         {
           this.state.current > 0
           &&
           <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
             上一步
           </Button>
         }
       </div>
          <div className="step-content">
            {this.renderContent(current)}
          </div>
        </div>
      )
    }


}
export default AuditProgressMain;
