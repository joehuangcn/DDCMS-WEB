import React ,{Component} from 'react'
import {ajaxUtil} from '../../util/AjaxUtils';
import Tabs from '../../component/ManagePanel/Tabs';

 class  Business extends Component {
   constructor(props) {
     super(props);
     this.state={
       config: {
           bizCode:'',
           bizCodeParam:'',//业务代码
           auditType:'',//JTJH
           dataScope:'',//A
           dataType:'',//ECPro
           dir:'',	//DESC
           sort1:'',
           export:''
         },
           id:'',
           permission:[],
           active:"1",
     };
   }

   getInitProps=(props)=>{
    //  console.log(props);
      const {state}=props.location;
      let url=state.url;
      let config={};
      let array=url.split("&");
      // pagejs/DataAudit/auditMain.js?DICT_AuditType=JTJH&DICT_DataScope=A&bizCode=1005&DICT_DataType=ECPro
      for (var i = 0; i < array.length; i++) {
          switch (i) {
            case 0:
              config.auditType=array[i].split("=")[1];
              break;
              case 1:
              config.dataScope=array[i].split("=")[1];
              break;
              case 2:
              config.bizCode=array[i].split("=")[1];
              break;
              case 3:
              config.dataType=array[i].split("=")[1];
            default:
              break;
          }
      };
      let permission=[];
      ajaxUtil("urlencoded","permiss!getUserBtnPermissByResid.action","resid="+state.id, this,(data,that)=>{
        permission=data;
        this.setState({
          id:state.id,
          config:config,
          permission:permission,
          active:"1",
        });
      });

      // this.getPermission(state.id);
   }
  //  getPermission=(id)=>{
  //    ajaxUtil("urlencoded","permiss!getUserBtnPermissByResid.action","resid="+id, this,(data,that)=>{
  //      console.log('construcrter----',data);
  //      this.setState({permission:data});
  //    });
  //  }
   componentWillMount(){
       this.getInitProps(this.props);
   }

   componentWillReceiveProps(props){
      this.getInitProps(props);
   }
   render() {
       const {config,permission,active,id} = this.state;
       return (
           <div className="body-content" style={{height:'100%'}}>
               <Tabs config={config} permission={permission} active={active} id={id}/>
           </div>
       );

 }
 }
export default Business;
