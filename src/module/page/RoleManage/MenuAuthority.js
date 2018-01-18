import React, {Component}  from 'react';
import { Table,Button, Icon,Popconfirm,message,Select,Input,TreeSelect,Modal,Tree,Row,Col,Card} from 'antd';
import {ajaxUtil} from '../../../util/AjaxUtils';
import uuid from 'node-uuid';
const TreeNode = Tree.TreeNode;


class MenuAuthority extends Component {
  constructor(props){
      super(props);
      this.state={
          data:[],
          loading:false,
          selectedRowKeys:props.selectedRowKeys,
          selectedTreeKeys:[],
          selectMenuKeys:[],
          roleTreeData:[],
          resid:'',
          tempAll:[],  //为选择的节点加上其半个选择的父节点
      }
    }

    componentWillMount() {
      this.showList(this.state.selectedRowKeys);
    }

    componentWillReceiveProps(props) {
    }

    showList = (rowKey) =>{
      ajaxUtil("urlencoded","role!getRoleModuleTreeList.action","roleID="+rowKey,this,(data,that)=> {
          this.setState({
              roleTreeData:data.data,
              selectedTreeKeys:data.selectedKeys,
              selectMenuKeys:data.selectedKeys,
          });
      })
    }

    saveMenu=()=>{
      const {tempAll,selectedRowKeys}=this.state;
      ajaxUtil("urlencoded","role!authorityNew.action","roleID="+selectedRowKeys[0]+"&resID="+tempAll,this,(data,that)=> {
        if (data.success===true) {
          message.success(data.info);
        }else{
          message.error(data.info);
        }
      })
    }

    renderTreeNodes = (data)=> {
        return data.map((item) => {
            if (item.child) {
                return(
                    <TreeNode title={item.title} key={item.key} dataRef={item}>
                        {this.renderTreeNodes(item.child)}
                    </TreeNode>
                );
            }
            return <TreeNode {...item} dataRef={item}/>;
        });
    };

    onSelect = (selectedKeys, info) =>{
          const {selectedRowKeys}=this.state;
         if (info.node.props.dataRef.child===undefined) {
          //  this.setState({selectedLeftKey:selectedKeys[0]});
           this.props.getBtnPermissList(selectedKeys[0],selectedRowKeys[0]);
         }

    };
      onCheck = (checkedKeys, info) => {
       let tempAll= checkedKeys.concat(info.halfCheckedKeys);
        this.setState({
          selectMenuKeys:checkedKeys,
          tempAll:tempAll,
        });
     }


    render() {
        const {selectedTreeKeys,selectMenuKeys}=this.state;
      return (
          <Card title="菜单浏览权限设置" extra={<Button type="primary" onClick={this.saveMenu}>保存</Button>} >
              <Tree checkable checkedKeys={selectMenuKeys}
                        defaultSelectedKeys={selectedTreeKeys}
                        defaultCheckedKeys={selectedTreeKeys}
                            onCheck={this.onCheck}  onSelect={this.onSelect} style={{height:300}}>
                  {this.renderTreeNodes(this.state.roleTreeData)}
              </Tree>
         </Card>
      );
    }

}
export default MenuAuthority;
