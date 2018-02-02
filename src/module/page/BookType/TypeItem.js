import React,{Component} from "react";
import { Form, Input, Button,Modal,Upload ,Icon,Radio } from 'antd';
import { ajaxUtil} from '../../../util/AjaxUtils';
import UploadFile from '../../../component/uploadFile/UploadFile';
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
        const action = this.props.action;
        return(
            <div>
                <Form>
                    <FormItem {...formItemLayout } label="字典类型代码">
                        {getFieldDecorator('dictionaryType.dicTypeCode',{
                        rules:[{ required:true, message:'字典类型代码不能为空',}],
                            initialValue:record.dicTypeCode
                    })(<Input placeholder="请输入字典类型代码" />)}
                    </FormItem>
                    <FormItem {...formItemLayout } label="字典类型名称">
                        {getFieldDecorator('dictionaryType.dicTypeName',{
                        rules:[{ required:true, message:'字典类型名称不能为空',}],
                            initialValue:record.dicTypeName
                    })(
                       <Input placeholder="请输入字典类型名称" />
                )}
                    </FormItem>
                    <FormItem {...formItemLayout } label="备注">
                        {getFieldDecorator('dictionaryType.remark',{
                        initialValue:record.remark
                    })(
                    <Input  type="textarea"  rows={6}/>
                )}
                    </FormItem>
                    <FormItem{...formItemLayout } label="字典类型" >
                        {getFieldDecorator('dictionaryType.dicType', {
                        initialValue: record.dicType
                    })(
                    <Radio.Group>
                    <Radio value="1">自定义</Radio>
                        <Radio value="0">系统</Radio>
                        </Radio.Group>
                )}
                    </FormItem>
                    <FormItem{...formItemLayout } label="字典类型状态" >
                        {getFieldDecorator('dictionaryType.dicTypeStatu', {
                        initialValue: record.dicTypeStatu
                    })(
                    <Radio.Group>
                    <Radio value="1">有效</Radio>
                        <Radio value="0">无效</Radio>
                        </Radio.Group>
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
            record:["dicTypeCode":"","dicTypeName":"","remarks":""],
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
            let bid=this.state.record.bid?this.state.record.bid:'';

            const text="dictionaryType.dicTypeCode="+values.dictionaryType.dicTypeCode
                +"&dictionaryType.dicTypeName="+values.dictionaryType.dicTypeName
                +"&dictionaryType.remark="+values.dictionaryType.remark
                +"&dictionaryType.dicTypeStatu="+values.dictionaryType.dicTypeStatu
                +"&dictionaryType.dicType="+values.dictionaryType.dicType
                +"&act="+this.state.action
                +"&dictionaryType.bid="+bid
                // +"&inFilterBid="+inFilterBid
                // +"&inFilterName="+inFilterName
                ;
            ajaxUtil("urlencoded","dictionary-type!savaDictionaryType.action",text,this,(data,that) => {
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
        title="新增字典类型信息" confirmLoading={confirmLoading}  afterClose={this.afterClose}>
    <ComBizForm ref={(ref) => this.form = ref} record={this.state.record} action={this.state.action} />
        </Modal>
        </div>
    );
    }
}
