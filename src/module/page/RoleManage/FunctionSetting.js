import React ,{Component} from "react";
import { Table,Button, Icon,Popconfirm,message,Select,Input,TreeSelect,Modal,Tree,Row,Col,Card} from 'antd';
import {ajaxUtil} from '../../../util/AjaxUtils';



export default class FunctionSetting extends Component{
    constructor(props){
        super(props);
        this.state={
            data:[],
            loading:false,
            selectedRowKeys:[],
            resid:'',
        }
    }
    componentWillMount(){
        // this.getTableData();

    }
    //获取数据
    getTableData =()=>{
        ajaxUtil("urlencoded","permiss!getBtnPermissList.action","",this,(data,that) => {
            this.setState({data:data.data});
        });
    };

    getBtnPermissList=(resid,roleids)=> {
      this.setState({loading:true});
      let text="resid="+resid+"&roleids="+roleids;
        ajaxUtil("urlencoded","permiss!getUserPermissNew.action",text,this,(data,that) => {
          let selected=data.selected;
          if (data.selected.length>0 && data.selected[0]==='') {
            selected=[];
          }
            this.setState({
              selectedRowKeys:selected,
                loading: false,
                data: data.data.data,
                resid:resid
            });
        });
    }

    onSelectChange = (selectedRowKeys) => {
      // console.log('selectedRowKeys changed: ', selectedRowKeys);
      this.setState({ selectedRowKeys});
    }

    getSeletedKeys=() =>{
      const {selectedRowKeys,resid}=this.state;
      const {roleKey}=this.props;
      let text="resid="+resid+"&roleid="+roleKey[0]+"&btnArr="+selectedRowKeys;
      ajaxUtil("urlencoded","permiss!saveUserBtnPermissNew.action",text,this,(data,that)=>{
        if (data.success===true) {
          message.success(data.message);
        }else{
          message.error(data.message);
        }
      });
      // this.props.getCheckFunset(selectedRowKeys,resid);
    }

    render(){
        const columns = [{
            title: '操作名称',
            dataIndex: 'dicName',
        }, {
            title: '操作代码',
            dataIndex: 'dicCode',
        }];
        const {selectedRowKeys,loading}=this.state;
        const rowSelection={
          selectedRowKeys,
          onChange:this.onSelectChange
        }
        return(
          <Card title="功能操作权限设置" extra={<Button type="primary" onClick={this.getSeletedKeys}>保存</Button>} >
              <Table rowKey="dicCode" className="functionTable" rowSelection={rowSelection} columns={columns} dataSource={this.state.data}  pagination={false}
                loading={loading} scroll={{ y: 500 }} />
           </Card>
        )
    }


}
