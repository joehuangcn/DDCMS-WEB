import React,{Component} from 'react';
import {ajaxUtil} from '../../../util/AjaxUtils';
import { Select,Input,Table,List,Popconfirm,Modal,Button} from 'antd';
import FileNameNew from './FileNameNew';

class FileNameSelectList extends Component {
  constructor(props) {
    super(props);
    this.state={
        loading:false,
        pagination:{ pageSize:15,current:1},
        selectedRowKeys:[],
        permission:{},
        columns:[],
    }
  }

  componentWillMount(){
    this.getColums();

  }
  componentDidMount(){
    this.fetch();
  }
  getColums=()=>{
    const columns =[{ title:'文件名', dataIndex:'fileName' , key:'fileName',sorter: true},];
    let action ={
      title:'操作',
      key:'action',
      render : (text, record) => {
        let permission=this.props.permission;
        let edit='true';let start='true';let deletes='true';
        let activeDis=false; let activeColor="green";
        if(permission.indexOf('edit')===-1){
            edit='none'
        }
        if (permission.indexOf('del')===-1) {
          deletes='none'
        }
        // if((record.taskType=='task_fix'&& record.taskStatu!=="3")|| record.taskStatu=="1"){
        //     activeDis=true;
        //     activeColor="grey";
        // }
        return(
        <span>
         <a  style={{display:edit}} onClick = {() => {
           this.newbiz.showModal("edit",record);
         }}>修改</a>
         <span className="ant-divider"/>
         <Popconfirm title="你确定要删除该配置项?" okText="是" cancelText="否" disabled onConfirm={() => {
           ajaxUtil("urlencoded","file-type!delfiletypebyID.action","id="+record.id,this,(data,that) => {
             let status=data.success;
             let message= data.message;
               if (status==='true') {
                 Modal.success({ title: '消息', content: message,});
               }else {
                 Modal.error({ title: '消息',content: message,
                });
               }
              this.fetch();
           })
         }}>
         <a style={{color:'red',display:deletes}}>删除</a>
         </Popconfirm>
        </span>
      )
      },
    };
    columns.push(action);
    this.setState({columns});

  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = {...this.state.pagination};
    pager.current=pagination.current;
    this.setState({
      pagination:pager,
    });
    this.fetch({
      results: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters,
    });
  }
  // handleTableChange = (page, pageSize) => {
  //     const pager = {...this.state.pagination};
  //     pager.current=page;
  //     this.setState({
  //       pagination:pager,
  //     });
  //     this.fetch({page:page,results:pageSize})
  // }


  // 请求查询method
  fetch = ( params ={} ) => {
    this.setState({loading:true}) ;
    let page=0;
    if (params.page>1) {
      page=(params.page-1)*10;
    }
    let sort='fileName';
    if (typeof(params.sortField) !== "undefined" ) {
      sort=params.sortField;
    }
    let dir='DESC';
    if (typeof(params.sortOrder) !== "undefined" ) {
      dir=(params.sortOrder=="descend"?"desc":"asc");
    }
    const {config} = this.props;
    const {query,queryKey}=this.state;
    const text="query="+(query==undefined?"":query)
    +"&queryKey="+(queryKey==undefined?"":queryKey)
    +"&dir="+dir
    +"&sort="+sort
    +"&start="+page+"&limit=15";

    ajaxUtil("urlencoded","file-type!getAllFileTypeList.action",text,this,(data,that) => {
      const pagination = that.state.pagination;
      pagination.total = parseInt(data.total,10);
      // pagination.onChange=this.handleTableChange;
      this.setState({
          loading: false,
          data: data.data,
          pagination,
      });
    });
  }
  onClick=(record, selected, selectedRows)=>{
    if (selected) {
      this.props.changebizNode(record);
    }else{
      this.props.changebizNode("");
    }
  }
  handleModal=() =>{
    this.newbiz.show();
  }

  // <List   header={<div>文件名</div>} bordered  pagination={this.state.pagination} loading={this.state.loading}
  //     dataSource={this.state.data}
  //      renderItem={item => (<List.Item className={item.id} style={{backgroundColor:'white'}} onClick={()=>this.onClick(item)}>{item.fileName}</List.Item>)} />

    render(){
      const rowSelection={
        hideDefaultSelections:'true',
        type:'radio',
        // selectedRowKeys:this.state.selectedRowKeys,
        onSelect:this.onClick
      }
    return(
      <div>
      <Button type='primary' onClick={this.handleModal} disabled={this.state.addBtnPermiss}>新增</Button>
      <Table rowKey='id' columns={this.state.columns} rowSelection={rowSelection} loading={this.state.loading} dataSource={this.state.data}
       onChange={this.handleTableChange} pagination={this.state.pagination} size="middle"/>
        <FileNameNew ref={(ref) => this.newbiz=ref } refresh={()=>this.fetch()}/>
       </div>
    );
    }

}
export default FileNameSelectList;
