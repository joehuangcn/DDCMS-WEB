import React,{Component} from "react";
import { Form, Input, Button,Modal,Icon ,Select,Radio,TreeSelect} from 'antd';
import { ajaxUtil} from '../../../util/AjaxUtils';
import uuid from 'node-uuid';
const FormItem = Form.Item;
const {Option} = Select;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 16 },
};
class BizAuditFormModal extends Component {

    render () {
        const { getFieldDecorator} = this.props.form;
        const record = this.props.record;
        const action = this.props.action;
        const {menu} = this.props;
        return(
            <div>
                <Form>
                    <FormItem {...formItemLayout } label="角色名称">
                        {getFieldDecorator('roleMange.roleName',{
                            rules:[{ required:true, message:'角色名称不能为空',}],
                            initialValue:record.roleName
                        })(
                            <Input placeholder="请输入角色名称" />
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout } label="角色描述">
                        {getFieldDecorator('roleMange.roleDescription',{
                            rules:[{}],
                            initialValue:record.roleDescription===undefined?"":record.roleDescription
                        })
                        (
                            <Input placeholder="请输入角色描述" />
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label="角色状态">
                        {getFieldDecorator('roleMange.statu',{
                            rules:[{ required:true, message:'请角色状态',}],
                            initialValue:record.statu
                        })(
                            <RadioGroup onChange={this.onChange} >
                                <Radio value="1">激活</Radio>
                                <Radio value="2">禁用</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout } label="角色备注">
                        {getFieldDecorator('roleMange.remark',{
                            initialValue:record.remark
                        })(
                            <TextArea rows={6}/>
                        )}
                    </FormItem>

                </Form>
            </div>
        )
    };
}
const ComBizForm= Form.create()(BizAuditFormModal);

class NewAddRole extends Component {
    constructor(props){
        super(props);
        this.state = {
            visible:false,
        };
    }
    show = () => {
        this.setState({
            visible:true,
            record:["roleName":"","roleDescription":"","statu":"","remark":""],
            action:'add',
    });
    }
    showModal =(action,record) => {
        this.setState({
            visible:true,
            record:record,
            action:action
        });
    }

    handleOk = () => {
        const form= this.form;
        form.validateFields(( err, values) => {
            if (err) {
                return;
            }
            this.setState({
                confirmLoading:true,
            });
            let bid=this.state.record.role_id ? this.state.record.role_id:'';
            const text="role.roleName="+values.roleMange.roleName
                +"&role.roleDescription="+values.roleMange.roleDescription
                +"&role.statu="+values.roleMange.statu
                +"&role.remark="+values.roleMange.remark
                +"&act="+this.state.action
                +"&role.role_id="+bid;
            ajaxUtil("urlencoded","roleAction!saveRole.action",text,this,(data,that) => {
                //权限保存请求路径:roleAction!authority.action
                let status=data.success;
                let message= data.message;
                this.setState({
                    visible: false,
                    confirmLoading: false,
                });
                if (status===true) {
                    Modal.success({
                        title: '消息',
                        content: message,
                    });
                }else {
                    Modal.error({
                        title: '消息',
                        content: message,
                    });
                }
                this.props.reflash();
            });

        });
    }

    handleCancel = (e) => {
        this.setState({visible:false});
        const form1= this.form;
    }
    afterClose = () => {
        this.form.resetFields();
    }

    render() {
        const { visible, confirmLoading }= this.state;
        return(
            <div>
                <Modal key={uuid.v1()} visible={visible} onOk={this.handleOk} onCancel={this.handleCancel}
                       title="编辑" confirmLoading={confirmLoading}  afterClose={this.afterClose}
                >
                    <ComBizForm ref={(ref) => this.form = ref} record={this.state.record} action={this.state.action}
                                />
                </Modal>
            </div>
        );
    }
}

export default NewAddRole;
