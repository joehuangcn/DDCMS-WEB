import React, {Component} from 'react'
import {Row, Col, Button, Breadcrumb,Menu, Icon, Layout, Badge, Popover,Spin,Tabs,Tooltip} from 'antd';
import {Link} from 'react-router-dom';
import {ajaxUtil} from '../../util/AjaxUtils.js';
import PwdChange from "../page/person/PwdChange"

import Moment from 'moment';
const ButtonGroup = Button.Group;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const TabPane=Tabs.TabPane;
class ToolBar extends Component {
  constructor(props){
    super(props);
    this.state={
      message:{}
    }
  }

  componentWillMount() {
    this.getMes();
  }

  getMes =() =>{
    ajaxUtil("urlencoded", "message!getPersonUnReadList.action", {}, this,(data,that)=>{
        that.setState({
          message:data
        });
    });
  }

  logout=() =>{
    ajaxUtil("urlencoded","person!logout.action","",this,(data,that)=>{
      console.log('data',data);
    });
  }
  help=() =>{
    let filename='';
    fetch("/DDCMS/file-handler!downSysGuidFile.action",{
      method:'POST',
      credentials: 'include',
      headers:{"Content-Type": "application/x-www-form-urlencoded"},
      body:""
    }).then(function(response) {
      filename=decodeURIComponent(response.headers.get('Content-Disposition'));
      filename=filename.split("attachment;filename=")[1];
     return response.blob();
    }
  ).then((responseJson) => {
    console.log("-----进入response",responseJson);
    var a = document.createElement('a');
      var url = window.URL.createObjectURL(responseJson);
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    }).catch((error) => {
    console.error(error);
});
// window.location.href="/DDCMS/file-handler!downSysGuidFile.action";
  }

  onClear= () =>{
  }

  readOne=(id) =>{
    console.log(id);
    let text="messageBean.status=2&messageBean.id="+id;
    ajaxUtil("urlencoded","message!updateStatus.action",text,this,(data,that)=>{
        this.getMes();
    });
  }

  readAll =() =>{
    ajaxUtil("urlencoded","message!updateStatusAll.action","",this,(data,that)=>{
        this.getMes();
    });
  }

  getContentBox=() => {
    // const children=[];
  //   const panes = children.map((child) => {
  //    const title = child.props.list && child.props.list.length > 0
  //      ? `${child.props.title} (${child.props.list.length})` : child.props.title;
  //    return (
  //      <TabPane tab={title} key={child.props.title}>
  //        <List
  //          {...child.props}
  //          data={child.props.list}
  //          onClick={item => this.onItemClick(item, child.props)}
  //          onClear={() => this.props.onClear(child.props.title)}
  //          title={child.props.title}
  //          locale={locale}
  //        />
  //      </TabPane>
  //    );
  //  });
  //  <Tabs className={styles.tabs} onChange={this.onTabChange}>
  //    {panes}
  //  </Tabs>
  const message=this.state.message;
   const title= (message.data!==undefined && message.data.length>0)?"消息("+message.data.length+")": "消息";
   const data=message.data==undefined?[]:message.data;
  const panes=<TabPane tab={title} key={title}>
                <ul>{ data.map((item,i) =>{
                return(
                      <Row key={item.id+"row"}>
                        <Col span={22}>
                          <div>
                            <li key={item.id}>
                               <div>
                               <h4>{item.title}</h4>
                              <span>{Moment.unix(item.createDate).format("YYYY-MM-DD HH:mm:ss")}</span>
                               </div>
                            </li>
                          </div>
                          </Col>
                          <Col span={2}>
                          <div className='clear'>
                            <Tooltip placement="topLeft" title="已阅" arrowPointAtCenter>
                                 <Button type="primary" shape="circle" size='small'  onClick={()=>{this.readOne(item.id)}} ><Icon type="check"/></Button>
                           </Tooltip>
                          </div>
                          </Col>
                          </Row>
                        )
                })}
                </ul>
                <ul>
                  <div className='allClear' onClick={this.onClear}>
                      <Button type="primary"style={{backgroundColor:'#1E90FF',width:'400px',height:'30px'}} onClick={()=>{this.readAll()}} >全部清空消息</Button>
                </div>
                </ul>
              </TabPane>
   return (
     <Spin spinning={false} delay={0}>
      <Tabs defaultActiveKey="1" >
          {panes}
         <TabPane tab="Tab 1" key="1">Content of Tab Pane 1</TabPane>
      </Tabs>
     </Spin>
   );
  }

  changePwd=()=>{
    this.pwdbiz.show();
  }

    render() {
        let style = {
            height: 16,
            paddingTop: 3,
            paddingRight: 3,
        }
        const {message}=this.state;
        const contentBox=this.getContentBox();
        return (
            <Row style={{background: '#fff', margin: '0 0 0 0'}}>
              <PwdChange ref={(ref) => this.pwdbiz=ref } />
              <Col span={8}>
              <Row type="flex" justify="start" style={{padding: '5px 0 0 15px'}}>
                     </Row>
                </Col>
                <Col span={16}>
                    <Row type="flex" justify="end">
                  <div>
                  <Menu
                  mode="horizontal"
                  style={{ lineHeight: '30px', float: 'right'}}
                  onClick={this.menuClick}
                    >
                  <Menu.Item key="1">
                    <Popover placement="bottomRight" content={contentBox}>
                      <Badge count={message.total}  style={{marginLeft: 10}}>
                          <Icon type="notification" />
                      </Badge>
                      </Popover >
                  </Menu.Item>
                  <SubMenu title={<span className="avatar">{this.props.userName}<i className="on bottom b-white" /></span>}>
                      <MenuItemGroup title="用户中心">
                          <Menu.Item key="setting:1">你好 - {this.props.userName}</Menu.Item>
                          <Menu.Item key="setting:2"><span onClick={this.help}>系统帮助</span>  <Icon type="tool" /></Menu.Item>
                          <Menu.Item key="logout"><span onClick={this.logout}>退出登录</span></Menu.Item>
                      </MenuItemGroup>
                      <MenuItemGroup title="设置中心">
                          <Menu.Item key="setting:3"><span onClick={this.changePwd}>修改密码</span></Menu.Item>
                      </MenuItemGroup>
                  </SubMenu>
              </Menu>
               </div>
                    </Row>
                </Col>
            </Row>
        )
    }
}
export default ToolBar;
