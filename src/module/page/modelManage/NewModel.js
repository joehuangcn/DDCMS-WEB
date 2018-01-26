import React,{Component} from "react";
import { Form, Input, Button,Modal,Icon ,Select,Radio,TreeSelect} from 'antd';
import { ajaxUtil} from '../../../util/AjaxUtils';
import uuid from 'node-uuid';
const FormItem = Form.Item;
const {Option} = Select;
const RadioGroup = Radio.Group;
const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 16 },
};
class BizAuditFormModal extends Component {
    checkchange =() =>{
    }

handleSelectParentCode=(value, label, extra) =>{
    this.props.form.setFieldsValue({'module.parentname':label[0]});
    // this.setState({parentname:label[0]});
}

    render () {
        const { getFieldDecorator} = this.props.form;
        const {resoureList,record,action,menu}=this.props;
        return(
            <div>
                <Form>
                    <FormItem {...formItemLayout } label="模块名称">
                        {getFieldDecorator('module.name',{
                            rules:[{ required:true, message:'模块名称不能为空',}],
                            initialValue:record.name
                        })(
                            <Input placeholder="请输入模块名称" />
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout } label="所属模块">
                        {getFieldDecorator('module.parentCode',{
                            rules:[{ required:true, message:'所属模块不能为空',}],
                            initialValue:record.parentcode===undefined?"":record.parentcode
                        })
                        (
                            <TreeSelect  placeholder='请选择'
                                         style={{ width: 200 }} allowClear
                                         treeData={menu} onChange={this.handleSelectParentCode} />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout } label="">
                        {getFieldDecorator('module.parentname',{
                            rules:[{ required:true, message:'',}],
                            initialValue:record.parentname===undefined?"":record.parentname
                        })
                        (
                            <Input  style={{display:'none'}}/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout } label="模块路径">
                        {getFieldDecorator('module.url',{
                            rules:[],
                            initialValue:record.url===undefined?"":record.url
                        })(
                            <Input placeholder="请输入模块路径" />
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label="模块状态">
                        {getFieldDecorator('module.statu',{
                            rules:[{ required:true, message:'请选择模块状态',}],
                            initialValue:record.statu===undefined?"":record.statu
                        })(
                            <RadioGroup onChange={this.onChange} >
                                <Radio value="1">激活</Radio>
                                <Radio value="0">禁用</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout } label="资源类型">
                        {getFieldDecorator('module.treenodetype',{
                            rules:[{ required:true, message:'资源类型不能为空',}],
                            initialValue:record.treenodetype==undefined?'':record.treenodetype
                        })(
                            <Select placeholder="请选择" >
                                <Option value="D">目录</Option>
                                <Option value="F">文件</Option>
                            </Select>
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label="排序位置">
                        {getFieldDecorator('module.displayOrder',{
                            rules:[{}],
                            initialValue:record.displayOrder?record.displayOrder:''
                        })(
                            <Input placeholder="请输入排序号" />
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label="路由位置">
                        {getFieldDecorator('module.menuRouter',{
                            rules:[{}],
                            initialValue:record.menuRouter?record.menuRouter:''
                        })(
                            <Input placeholder="请输入路由位置" />
                        )}
                    </FormItem>
                </Form>
            </div>
        )
    };
}
const ComBizForm= Form.create()(BizAuditFormModal);

class NewAddModel extends Component {
    constructor(props){
        super(props);
        this.state = {
            visible:false,
            menu:[],
            resoureList:[],
        };
    }
    componentWillMount(){
        this.getBusTree();
    }
    getBusTree=() =>{
        ajaxUtil("urlencoded","module!getMenuSelect.action","parentCode=0&statu=1&selectable=yes",this,(data,that) => {
            // console.log(data);
            this.setState({menu:data});
        });
        ajaxUtil("urlencoded","dictionaryAction!getDictionaryListByType.action","name=DICT_ResourceType",this,(data,that) =>{
            this.setState({resoureList:data});
        });
    }
    show = () => {
        this.setState({
            visible:true,
            record:["subModule":"","moduleName":"","moduleList":"","srcType":""],
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

    handleOk = (e) => {
        const form= this.form;
        form.validateFields(( err, values) => {
            if (err) {
                return;
            }
            console.log("----values",values);

            this.setState({
                confirmLoading:true,
            });
            let inFilterBid="";
            let inFilterName="";
            let bid=this.state.record.id?this.state.record.id:'';

            const text="module.name="+values.module.name
                +"&module.treenodetype="+values.module.treenodetype
                +"&module.displayOrder="+values.module.displayOrder
                +"&module.menuRouter="+values.module.menuRouter
                +"&module.url="+(values.module.url.replace(/\&/g,"%26"))
                +"&act="+this.state.action
                +"&module.mid="+bid
                +"&module.parentCode="+values.module.parentCode
                +"&module.statu="+values.module.statu
                +"&parentName="+values.module.parentname;
                // let url="module.url="+values.module.url;
                // let some=[];some.push(text);some.push(url);
                // values.module.mid=bid;
                // values.act=this.state.action;
            ajaxUtil("urlencoded","moduleAction!saveObj.action",text,this,(data,that) => {
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
                this.props.refresh();
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
                                menu={this.state.menu} resoureList={this.state.resoureList}/>
                </Modal>
            </div>
        );
    }
}

export default NewAddModel;
