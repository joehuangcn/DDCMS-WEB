import React,{Component} from "react";
import { Form, Input, Button,Modal,Upload ,Icon,Radio ,Select} from 'antd';
import {TwitterPicker} from 'react-color';
import { ajaxUtil} from '../../../util/AjaxUtils';
import UploadFile from '../../../component/uploadFile/UploadFile';
import uuid from 'node-uuid';


const FormItem = Form.Item;
const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 16 },
};
class BizAuditFormModal extends Component {
  constructor(props){
    super(props);
    this.state={
      colorValue:props.color,
      displayColorPicker: false,
    }
  }
    handleChange =(color) =>{
       this.props.form.setFieldsValue({'threshlev.colorValue':color.hex});
       this.setState({colorValue:color.hex});
    }

    handleClick = () =>{
      this.setState({ displayColorPicker:!this.state.displayColorPicker})
    };
    cancelText=() =>{
      this.setState({ displayColorPicker:false})
    }

    render () {
        const { getFieldDecorator} = this.props.form;
        const record = this.props.record;
        const action = this.props.action;
        const {color} =this.props;
        const {displayColorPicker,colorValue}=this.state;
        console.log('---');
        return(
            <div>
                <Form>
                    <FormItem {...formItemLayout } label="告警级别名称">
                        {getFieldDecorator('threshLev.levName',{
                        rules:[{ required:true, message:'告警级别名称不能为空',}],
                            initialValue:record.levName
                        })(<Input placeholder="请输入告警级别名称" />)}
                    </FormItem>
                    <FormItem {...formItemLayout } label="告警颜色">
                        {getFieldDecorator('threshLev.colorValue',{
                        rules:[{ required:true, message:'公告内容不能为空',}],
                        initialValue:record.colorValue
                      })(<Input style={{backgroundColor:colorValue}}/>)}
                     </FormItem>
                    <TwitterPicker onChange={ this.handleChange}/>

                     <FormItem {...formItemLayout } label="图片路径">
                        {getFieldDecorator('threshLev.imgPath',{
                        rules:[],
                            initialValue:record.imgPath
                        })(<Input placeholder="" />)}
                    </FormItem>
                    <FormItem {...formItemLayout } label="告警级别">
                        {getFieldDecorator('threshLev.thLev',{
                        rules:[{ required:true, message:'告警级别',}],
                            initialValue:record.thLev
                        })(<Input placeholder="请输入告警级别" />)}
                    </FormItem>
            </Form>
        </div>
    )
    };
}
const ComBizForm= Form.create()(BizAuditFormModal);

export default  class LevItem extends Component {
    constructor(props){
        super(props);
        this.state = {
            visible:false,
        };
    }
    show = () => {
        this.setState({
            visible:true,
            record:[],
            color:'',
        action:'add'
    });
    }
    showModal =(action,record) => {
        this.setState({
            visible:true,
            record:record,
            action:action,
            color:'#'+record.colorValue
        });
    }

    handleOk = () => {
        const form= this.form;
        form.validateFields(( err, values) => {
            if (err) {
                return;
            }
            console.log("----values",values);

            this.setState({
                confirmLoading:true,
            });
            let bid=this.state.record.levId?this.state.record.levId:'';

            const text="threshLev.levName="+values.threshLev.levName
                +"&threshLev.colorValue="+(values.threshLev.colorValue.replace(/\#/g,""))
                +"&act="+this.state.action
                +"&threshLev.levId="+bid
                +"&threshLev.imgPath="+values.threshLev.imgPath
                +"&threshLev.thLev="+values.threshLev.thLev;
            ajaxUtil("urlencoded","threshlev!saveObj.action",text,this,(data,that) => {
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
        const { visible, confirmLoading ,color}= this.state;
        return(
            <div>
            <Modal key={uuid.v1()} visible={visible} onOk={this.handleOk} onCancel={this.handleCancel}
        title="修改告警级别" confirmLoading={confirmLoading}  afterClose={this.afterClose}>
    <ComBizForm ref={(ref) => this.form = ref} record={this.state.record} action={this.state.action} color={color}/>
        </Modal>
        </div>
    );
    }
}
