import React, {Component}  from 'react'
import {Row,Icon} from 'antd';
import './App.css';

class Header extends Component {
    render() {
        let title_style = {
            fontSize: '25px',
            height: '35px',
            lineHeight: '50px',
            color: '#fff',
            fontFamily: 'sans-serif',
        }
        return (
            <Row style={{background: '#3F3F3F',height:'7%'}}>
                <Row type="flex" justify="left">
                <Icon
                   className="trigger"
                   type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
                   onClick={this.props.onCollapse}
                 />
                  <h2 style={title_style}>*****管理系统</h2>
                </Row>
            </Row>
        )
    }
}

export default Header;
