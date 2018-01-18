import React,{Component} from 'react'
import {ajaxUtil} from '../../util/AjaxUtils';
import { Tree,Input} from 'antd';
const TreeNode= Tree.TreeNode;
const Search = Input.Search;
class BusinessSelect extends Component {
// expandedKeys 是展开的搜索的节点=======父亲的key  autoExpandParent true 及能展示父亲
  constructor(props){
    super(props);
    this.state={
      expandedKeys:[],
      autoExpandParent:false,
      treeData:[],
      bizData:[]
    };
  }

  componentWillMount() {
    this.getTreeList();
  }

  getTreeList = ()=> {
    ajaxUtil("urlencoded","business!getBusAfterNew.action","",this,(data,that)=> {
      const somebiz=this.getBizData(data,[]);
      this.setState({
        treeData:data,
        bizData:somebiz
      });
    })
  }

  getBizData =(data,bizData) =>{
    data.map((item) =>{
      if (item.children) {
        return this.getBizData(item.children,bizData);
      }
      return bizData.push(item);
    });
    return bizData;
  }

  renderTreeNodes = (data)=> {
     return data.map((item) => {
       if (item.children) {
         return(
           <TreeNode title={item.label} key={item.key} dataRef={item} selectable={item.selectable}>
              {this.renderTreeNodes(item.children)}
           </TreeNode>
         );
       }
       return <TreeNode title={item.label} key={item.key} dataRef={item} />;
     })
  }

  getParentKey = (key, tree) =>{
        let parentKey;
        for (let i = 0; i < tree.length; i++) {
          const node = tree[i];
          if (node.children) {
            if (node.children.some(item => item.key === key)) {
              parentKey = node.key;
            } else if (this.getParentKey(key, node.children)) {
              parentKey = this.getParentKey(key, node.children);
            }
          }
        }
      return parentKey;
  }

  onChange = (e) => {
    // const value=e.target.value;
    const value=e;
    const expandedKeys = this.state.bizData.map((item) => {
      if (item.key.indexOf(value) > -1 || item.label.indexOf(value)>-1) {
        return this.getParentKey(item.key, this.state.treeData);
      }
      return null;
    }).filter((item, i, self) => item && self.indexOf(item) === i);
    console.log('expandedKeys',expandedKeys);
    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
    });
  }

onSelect =(selectedKeys,info) =>{
  console.log("selected",selectedKeys,info);
  // this.props.changebizNode(selectedKeys[0]===undefined?'':selectedKeys[0],info.selectedNodes[0]===undefined?'':info.selectedNodes[0].props.title);
  this.props.changebizNode(selectedKeys[0]===undefined?'':selectedKeys[0],info.selectedNodes[0]===undefined?'':info.selectedNodes[0].props.title);
}

onExpand = (expandedKeys) => {
  this.setState({
    expandedKeys,
    autoExpandParent: false,
  });
}
  render () {
    return(
      <div style={{ maxHeight:400}}>
      <Search  placeholder="请输入业务名称或者代码" onSearch={this.onChange} />
      <Tree onSelect={this.onSelect} onExpand={this.onExpand} expandedKeys={this.state.expandedKeys} autoExpandParent={this.state.autoExpandParent} >
        {this.renderTreeNodes(this.state.treeData)}
      </Tree>
      </div>
    );
  }
}

export default BusinessSelect;
