/**
 * Created by chenwei on 17/2/15.
 */

import './LoginForm.css';
import {config} from '../../../config';
import React, {Component} from 'react';
import {Form, Icon, Input, Button, Row, Col} from 'antd';
const FormItem = Form.Item;
//todo 分离成登陆页面和登陆form
class LoginForm extends Component {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log(values);
            if (!err) {
                fetch(config.baseUrl + 'person!ajaxLogin.action', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: "person.userAccount=" + values.userName +
                    "&person.passWord=" + values.password
                }).then((response) => response.json())
                    .then((responseJson) => {
                      console.log("-----response--login---");
                        console.log(responseJson);
                        if (responseJson.head.stateCode === 200) {
                            global.isAuthenticated = true;
                            setTimeout(this.props.history.push("/main"), 100);
                        } else {
                            console.log(responseJson.head)
                            setTimeout(this.props.history.push("/login"), 100);
                        }
                        return null;
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        });
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
          wrapperCol: { span: 24 },
        };
        return (
            <div>
                <Row>
                    <Col span={8} offset={8}>
                        <h1 className="login-form-title">辽宁数据一致性管理系统</h1>
                    </Col>
                </Row>
                <Row>
                    <Col span={8} offset={8}>
                        <Form onSubmit={this.handleSubmit} className="login-form">
                            <FormItem >
                                {getFieldDecorator('userName', {
                                    rules: [{required: true, message: '请输入用户名!'}],
                                })(
                                    <Input addonBefore={<Icon type="user"/>} placeholder="用户名" style={{width:'100%'}}/>
                                )}
                            </FormItem>
                            <FormItem >
                                {getFieldDecorator('password', {
                                    rules: [{required: true, message: '请输入密码!'}],
                                })(
                                    <Input addonBefore={<Icon type="lock"/>} type="password" placeholder="密码" style={{width:'100%'}}/>
                                )}
                            </FormItem>
                            <FormItem>
                                <Button type="primary" htmlType="submit" className="login-form-button">
                                    登陆
                                </Button>
                            </FormItem>
                        </Form>
                    </Col>
                </Row>
            </div>
        );
    }
}

const WrappedNormalLoginForm = Form.create()(LoginForm);

export default WrappedNormalLoginForm;
