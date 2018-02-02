import React,{Component} from 'react';
import {Card,Collapse} from 'antd';
import Moment from 'moment';
import {ajaxUtil} from '../../../util/AjaxUtils';
const Panel=Collapse.Panel;
class NewNoticeInfo extends Component {
constructor(props){
  super(props);
  this.state={
    data:[]
  }
}
componentDidMount(){
  this.fetchData();
}

fetchData=()=> {
  ajaxUtil("urlencoded","notice!findNoticeListLimitTop.action","",this,(data,that) => {
    this.setState({data});
  });
}

  render() {
      const {data}=this.state;
      let columList=[];
      for (var i = 0; i < data.length; i++) {
          columList.push(<Panel  key={i} header={data[i].title+`  `+Moment(data[i].pubTime).format("YYYY-MM-DD HH:mm:ss")}><p>{data[i].content}</p></Panel>)
      }
      return(
        <Card title="最新公告" style={{padding:'5px'}}>
        <div>
        <Collapse bordered={false}>
          {columList}
        </Collapse>
        </div>
         </Card>
      );
  }

}
export default NewNoticeInfo;
