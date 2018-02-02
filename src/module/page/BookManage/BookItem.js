import React, { Component } from "react";
import { Form, Input, Button, Modal, Upload, Icon, Radio, Select } from "antd";
import { ajaxUtil } from "../../../util/AjaxUtils";
import UploadFile from "../../../component/uploadFile/UploadFile";
import uuid from "node-uuid";
const { Option } = Select;

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 }
};
class BizAuditFormModal extends Component {
  checkchange = () => {};
  render() {
    const { getFieldDecorator } = this.props.form;
    const record = this.props.record;
    const action = this.props.action;
    const {dicTypeNameList} =this.props;
    return (
      <div>
        <Form>
          <FormItem {...formItemLayout} label="字典代码">
            {getFieldDecorator("dictionary.dicCode", {
              rules: [{ required: true, message: "业务名称不能为空" }],
              initialValue: record.dicCode
            })(<Input placeholder="请输入字典代码" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="字典名称">
            {getFieldDecorator("dictionary.dicName", {
              rules: [{ required: true, message: "负责人不能为空" }],
              initialValue: record.dicName
            })(<Input placeholder="请输入字典名称" />)}
          </FormItem>
          <FormItem {...formItemLayout } label="字典类型">
           {getFieldDecorator('dictionary.dicTypeName',{
             rules:[{ required:true, message:'字典类型不能为空',}],
             initialValue:record.dicTypeCode===undefined?"":record.dicTypeCode
           })(
             <Select  placeholder="请选择字典类型"  onChange={this.city} allowClear={true}>
               {dicTypeNameList.map(d=> <Option key={d.dicTypeCode} value={d.dicTypeCode}>{d.dicTypeName}</Option>)}
             </Select>
          )}
          </FormItem>
          <FormItem {...formItemLayout} label="备注">
            {getFieldDecorator("dictionary.remarks", {
              initialValue: record.remark
            })(<Input type="textarea" rows={6} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="字典状态">
            {getFieldDecorator("dictionary.dicStatu", {
              initialValue: record.dicStatu
            })(
              <Radio.Group>
                <Radio value="1">有效</Radio>
                <Radio value="0">无效</Radio>
              </Radio.Group>
            )}
          </FormItem>
        </Form>
      </div>
    );
  }
}
const ComBizForm = Form.create()(BizAuditFormModal);

export default class BookItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }
  show = () => {
    this.setState({
      visible: true,
      record: [
        ("dicCode": ""),
        ("dicName": ""),
        ("dicTypeName": ""),
        ("remarks": "")
      ],
      action: "add"
    });
  };
  showModal = (action, record) => {
    this.setState({
      visible: true,
      record: record,
      action: action
    });
  };

  handleOk = () => {
    const form = this.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      this.setState({
        confirmLoading: true
      });
      let inFilterBid = "";
      let inFilterName = "";
      let bid = this.state.record.bid ? this.state.record.bid : "";
      const text = "dictionary.dicCode="+values.dictionary.dicCode
      +"&dictionary.dicName="+values.dictionary.dicName
      +"&dictionary.dicStatu="+values.dictionary.dicStatu
      +"&dictionary.remark="+values.dictionary.remark
      +"&dictionary.dictionaryType.dicTypeCode=" +values.dictionary.dicTypeName
        +"&act=" +this.state.action
        +"&dictionary.bid="+bid;
      ajaxUtil(
        "urlencoded","dictionaryAction!savaDictionary.action", text,this, (data, that) => {
          let status = data.success;
          let message = data.message;
          this.setState({
            visible: false,
            confirmLoading: false
          });
          if (status === "true") {
            Modal.success({
              title: "消息",
              content: message
            });
          } else {
            Modal.error({
              title: "消息",
              content: message
            });
          }
        }
      );
    });
  };

  handleCancel = e => {
    this.setState({ visible: false });
    const form1 = this.form;
  };
  afterClose = () => {
    this.form.resetFields();
  };

  render() {
    const { visible, confirmLoading } = this.state;
    const { dicTypeNameList } = this.props;
    return (
      <div>
        <Modal
          key={uuid.v1()} visible={visible} onOk={this.handleOk} onCancel={this.handleCancel} title="新增字典信息"
          confirmLoading={confirmLoading}   afterClose={this.afterClose}
        >
          <ComBizForm
            ref={ref => (this.form = ref)}record={this.state.record} action={this.state.action} dicTypeNameList={dicTypeNameList}/>
        </Modal>
      </div>
    );
  }
}
