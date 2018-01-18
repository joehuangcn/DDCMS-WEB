import React, {Component} from 'react';
import  { Upload, Button, Icon,message } from 'antd';
import {ajaxUtil} from '../../util/AjaxUtils';
class UploadFile extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }
handleChange = (info) => {
  let fileList = info.fileList;
  if (this.props.muliple===false) {
      fileList=fileList.slice(-1);
  }
  console.log(fileList);
  if(info.file.status==='removed') {
    console.log("deleted the file ", info.file);
    const onChange = this.props.onChange;
    const {deleteUrl}=this.props;
    if (onChange) {
      // onChange("");
      onChange(info.file);
      if (info.file.response) {
        let text="file="+info.file.response.bid;
        ajaxUtil("urlencoded",deleteUrl,text,this,{});
      }
    }
  }
  if (info.file.status==='done') {
      message.success(`${info.file.name} 上传成功!`);
      const onChange = this.props.onChange;
      if (onChange) {
        onChange(info.file);
        // onChange(info.file.response,"done");
      }
      // this.props.onUpChange(info.file.response);
  } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败！`);
  }

  this.setState({fileList });
}

  render () {
    const {requestUrl,muliple}=this.props;
    const actions= {
      action :'DDCMS/'+requestUrl,
      onChange:this.handleChange,
      muliple:muliple
    }
    return (
      <Upload {...actions} name={this.props.name} fileList={this.state.fileList}>
        <Button>
          <Icon type="upload" /> 文件上传
        </Button>
      </Upload>
    );
  }
}
export default UploadFile;
