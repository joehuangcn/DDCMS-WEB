import React from 'react'
import { Table,Tabs,Input, Button,Icon,Select,DatePicker } from 'antd';
import StatReportGridXJ from './TabsComponent/StatReportGridXJ'
import SynchLog from './TabsComponent/SynchLog'
import AuditChart from './TabsComponent/AuditChart'
import AuditSync from './TabsComponent/AuditSync'
import DiffType from './TabsComponent/DiffType'
import DiffInfoMap from './TabsComponent/DiffInfoMap'
import FlowChart from "./TabsComponent/FlowChart"
const TabPane = Tabs.TabPane;
class ManagePanel extends React.Component {

  constructor(props){
    super(props);
    this.state={
      activeKey:props.active,
    }
  }


  componentWillReceiveProps(props){
    const {active}=this.props;
    this.setState({activeKey:active});
    }

    callback=(key) =>{
      this.setState({activeKey:key});
    }

  render() {
    const {config,permission,id} = this.props;
    const {activeKey}=this.state;
    return(
    <div className="tabs_all" style={{height:'100%'}}>
      <Tabs type="card" style={{height:'100%'}} activeKey={activeKey}  onChange={this.callback}>
        <TabPane tab="稽核报表" key="1"><StatReportGridXJ config={config} permission={permission} activeKey={activeKey} id={id}/></TabPane>
        <TabPane tab="稽核图表" key="2"><AuditChart config={config} permission={permission} id={id}/></TabPane>
        <TabPane tab="地市统计" key="3"><DiffInfoMap config={config} permission={permission} id={id}/></TabPane>
        <TabPane tab="稽核同步" key="4"><AuditSync config={config} permission={permission} id={id}/></TabPane>
        <TabPane tab="差异展示分类" key="5"><DiffType config={config} permission={permission} id={id} /></TabPane>
        <TabPane tab="差异处理日志" key="6"><SynchLog config={config} permission={permission} id={id} /></TabPane>
        <TabPane tab="流程图" key="7"><FlowChart config={config} permission={permission} /></TabPane>
      </Tabs>
    </div>)
  }
}
export default ManagePanel;
