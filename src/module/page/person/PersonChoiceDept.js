import React,{Component} from "react";
import {Col ,Row,Button, Icon,Popconfirm,message,Select,Input,Table,Modal} from 'antd';
import {ajaxUtil} from '../../../util/AjaxUtils';
const {Option} = Select;

class PersonChoiceDept extends Component {
  constructor(props){
    super(props);
    this.state={
      visible:false,
      loading:false,
      selectedRowKeys:[],
      data:[],
      columns:[],
    }
  }

  componentWillMount(){
    const columns =[
        { title:'角色名称', dataIndex:'text' , key:'text'},
    ];
    this.setState({columns});
  }

  show=() => {
    this.setState({loading:true});
    let text="userID="+this.props.userId+"&node="+1;
    ajaxUtil("urlencoded","roleAction!getRoleListByUserId.action",text,this,(data,that) => {
      this.setState({
        selectedRowKeys:data.selectedKeys,
          loading: false,
          data: data.data,
      });
    });
    this.setState({
      visible:true,
    });
  }

  fetch=(params ={})=>{
    this.setState({loading:true});
    let text="userID="+11+"&node="+1;
    ajaxUtil("urlencoded","roleAction!getRoleListByUserId.action",text,this,(data,that) => {
      this.setState({
        selectedRowKeys:data.selectedKeys,
          loading: false,
          data: data.data,
      });
    });
  }

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys});
  }

  onCancel=() =>{
    this.setState({visible:false})
  }

  onCreate=() =>{
    const keys=this.state.selectedRowKeys;
    let text="userID="+this.props.userId;
    for (var i = 0; i < keys.length; i++) {
      text+="&roleID="+keys[i]
    }
    ajaxUtil("urlencoded","roleAction!savePersonRole.action",text,this,(data,that) => {
      if (data.success===true) {
        message.success(data.info);
      }else{
         message.error(data.info);
      }
    });
  }


  render() {
    // const { getFieldDecorator } = this.props.form;
    const {selectedRowKeys}=this.state;
   const formItemLayout = {
     labelCol: { span: 10 },
     wrapperCol: { span: 14 },
   };
   const rowSelection={
     selectedRowKeys,
     onChange:this.onSelectChange
   }
   return(
     <Modal visible={this.state.visible} title="角色分配" okText="保存"  onCancel={this.onCancel} onOk={this.onCreate} >
     <Table rowKey="id" rowSelection={rowSelection} columns={this.state.columns}  loading={this.state.loading} dataSource={this.state.data}
     size="small" pagination={false} scroll={{ y: 500 }} />
     </Modal>
   );
}
}
export default PersonChoiceDept;
