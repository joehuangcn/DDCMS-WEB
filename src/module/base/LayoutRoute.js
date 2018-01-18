/**
 * Created by chenwei on 17/2/15.
 */
import React, {Component} from 'react'
import {Layout} from 'antd';
import Header from './Header'
import Switches from './Switches'
import SiderMenu from './SiderMenu'
import ToolBar from './ToolBar'
import './LayoutRoute.css'
import {ajaxUtil} from '../../util/AjaxUtils.js'
import {config} from '../../config'

const {Content, Footer, Sider} = Layout;

class LayoutRoute extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName:'',
            collapsed: false,
            mode:"inline",
            message:{}
        };
    }
    componentDidMount(){
      ajaxUtil("urlencoded", "person!getAjaxName.action", {}, this,(data,that)=>{
          that.setState({
            userName:data.userName
          });
      });
    }

    onCollapse=()=> {
        // console.log(collapsed);
          // mode: collapsed ? 'vertical' : 'inline',
        this.setState({
            collapsed:!this.state.collapsed,
            mode:!this.state.collapsed? 'vertical' : 'inline',
        });
    }
    // onCollapse=(collapsed)=> {
    //     this.setState({
    //         collapsed,
    //         mode:collapsed? 'vertical' : 'inline',
    //     });
    // }

    render() {
        return (
            <Layout  className="layout_main">

                <Layout className="layout_cont">
                    <Sider
                        collapsible  trigger={null}
                        collapsed={this.state.collapsed} onCollapse={this.onCollapse}
                        style={{ overflow: 'auto'}}
                    >
                        <div className="logo"/>
                        <SiderMenu location={this.props.location} mode={this.state.mode}/>
                    </Sider>
                    <Layout>
                        <Header  onCollapse={this.onCollapse} collapsed={this.state.collapsed} />
                        <Content  className="content_main" style={{margin: '0 16px'}}>
                            <div
                                style={{borderBottomStyle: 'solid', borderBottomWidth: 1, borderBottomColor: 'grey'}}>
                                <ToolBar userName={this.state.userName} />
                            </div>
                            <div  className="content_switch">
                                <Switches />
                            </div>
                        </Content>
                        <Footer style={{textAlign: 'center'}}>
                            电信科学技术第五研究所 Version:2.0
                        </Footer>
                   </Layout>
                </Layout>
            </Layout>
        );
    }
}

export default LayoutRoute;
