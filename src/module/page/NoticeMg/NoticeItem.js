import React,{Component} from "react";
import { Form, Input,Modal } from 'antd';
import { ajaxUtil} from '../../../util/AjaxUtils';
import uuid from 'node-uuid';


const FormItem = Form.Item;
const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 16 },
};
class BizAuditFormModal extends Component {
    checkchange =() =>{
    }
    render () {
        const { getFieldDecorator} = this.props.form;
        const record = this.props.record;
        // const action = this.props.action;
        return(
            <div>
                <Form>
                    <FormItem {...formItemLayout } label="公告标题">
                        {getFieldDecorator('notice.title',{
                        rules:[{ required:true, message:'公告标题不能为空',}],
                            initialValue:record.title
                    })(<Input placeholder="请输入字典公告标题" />)}
                    </FormItem>
                    <FormItem {...formItemLayout } label="公告内容">
                        {getFieldDecorator('notice.content',{
                        rules:[{ required:true, message:'公告内容不能为空',}],
                        initialValue:record.content
                    })(
                    <Input  type="textarea"  rows={6}/>
                )}
                </FormItem>
            </Form>
        </div>
    )
    };
}
const ComBizForm= Form.create()(BizAuditFormModal);

export default  class TypeItem extends Component {
    constructor(props){
        super(props);
        this.state = {
            visible:false,
        };
    }
    show = () => {
        this.setState({
            visible:true,
            record:["title":"","content":""],
        action:'add'
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
            let inFilterBid="";
            let inFilterName="";
            let nid=this.state.record.nid?this.state.record.nid:'';

            const text="notice.title="+values.notice.title
                +"&notice.content="+values.notice.content
                +"&act="+this.state.action
                +"&notice.nid="+nid;
            ajaxUtil("urlencoded","notice!save.action",text,this,(data,that) => {
                let status=data.success;
                let message= data.message;
                this.setState({
                    visible: false,
                    confirmLoading: false,
                });
                if (status==='true') {
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
        // const form1= this.form;
    }
    afterClose = () => {
        this.form.resetFields();
    }

    render() {
        const { visible, confirmLoading }= this.state;
        return(
            <div>
            <Modal key={uuid.v1()} visible={visible} onOk={this.handleOk} onCancel={this.handleCancel}
        title="新增字典类型信息" confirmLoading={confirmLoading}  afterClose={this.afterClose}>
    <ComBizForm ref={(ref) => this.form = ref} record={this.state.record} action={this.state.action} />
        </Modal>
        </div>
    );
    }
}
