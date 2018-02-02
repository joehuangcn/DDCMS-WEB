import React,{Component} from "react";
import { Tree,Form, Input, Button,Modal,Icon ,Select,Radio,TreeSelect} from 'antd';
import { ajaxUtil} from '../../../util/AjaxUtils';
import uuid from 'node-uuid';
const FormItem = Form.Item;
const {Option} = Select;
const RadioGroup = Radio.Group;
const TreeNode = Tree.TreeNode;
const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 16 },
};
class BizAuditFormModal extends Component {
    constructor (props){
        super(props);
        this.state={
            node:'',
        };
    }
    changeNode=(node) => {
        this.setState({node});
    }
    render () {
        const { getFieldDecorator} = this.props.form;
        const record = this.props.record;
        const action = this.props.action;
        const {menu} = this.props;
        return(
            <div>
                <Form>
                    <FormItem {...formItemLayout } label="部门名称">
                        {getFieldDecorator('dept.deptName',{
                            rules:[{ required:true, message:'部门名称不能为空',}],
                            initialValue:record.deptName
                        })(
                            <Input placeholder="请输入部门名称" />
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label="所属部门">
                        {getFieldDecorator('dept.upDeptid',{
                            rules:[{}],
                            initialValue:record.upDeptid
                        })(
                            <TreeSelect  placeholder='请选择'
                                         style={{ width: 200 }} allowClear
                                         treeData={menu}  onChange={this.handleSelectParentCode}/>
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout } label="城市编码">
                        {getFieldDecorator('dept.cityCode',{
                            rules:[{}],
                            initialValue:record.cityCode
                        })
                        (
                            <Input placeholder="请输入城市编码" />
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout } label="部门地址">
                        {getFieldDecorator('dept.address',{
                            rules:[{}],
                            initialValue:record.address
                        })(
                            <Input placeholder="请输入部门地址" />
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout } label="部门电话">
                        {getFieldDecorator('dept.tel',{
                            rules:[{}],
                            initialValue:record.tel
                        })(
                            <Input placeholder="请输入部门电话" />
                        )}
                    </FormItem>



                </Form>
            </div>
        )
    };
}
const ComBizForm= Form.create()(BizAuditFormModal);

export default class NewDepartment extends Component {
    constructor(props){
        super(props);
        this.state = {
            visible:false,
            menu:[],
        };
    }
    componentWillMount(){
        this.getBusTree();
    }
    getBusTree=() =>{
      ajaxUtil("urlencoded","dept!getDeptTreeSelect.action","",this,(data,that)=>{
          this.setState({menu:data});
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

            this.setState({
                confirmLoading:true,
            });
            let inFilterBid="";
            let inFilterName="";
            let bid=this.state.record.deptId?this.state.record.deptId:'';

            const text="dept.deptName="+values.dept.deptName
                +"&dept.address="+(values.dept.address===undefined?"":values.dept.address)
                +"&dept.tel="+(values.dept.tel===undefined?"":values.dept.tel )
                +"&dept.cityCode="+(values.dept.cityCode===undefined?"":values.dept.cityCode)
                +"&act="+this.state.action
                +"&dept.deptId="+bid
                +"&dept.upDeptid="+(values.dept.upDeptid===undefined?"":values.dept.upDeptid)
            ajaxUtil("urlencoded","deptAction!saveObj.action",text,this,(data,that) => {
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
                                menu={this.state.menu}/>
                </Modal>
            </div>
        );
    }
}
