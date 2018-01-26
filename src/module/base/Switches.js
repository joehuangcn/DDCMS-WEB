import React, {Component}  from 'react';
import {
    Route,
    Switch
} from 'react-router-dom';
import TestComponent from '../page/TestComponent';
import BusinessAuditRule from '../page/BusinessAuditRule/BusinessAuditRule';
import AccessAudit from '../page/AccessAudit';
import Business from '../page/Business';
import DeptInfo from '../page/person/DeptInfo';
import Main from '../page/main/Main';
import AuditTask from "../page/AuditTask/AuditTask";
import NotFound from "../page/NotFound";
import NetSetMg from "../page/auditSource/NetSetMg";
import DiffConfig from "../page/diffConfig/DiffConfig";
import FtpSetMg from "../page/ftpSetMg/FtpSetMg";
import BusinessList from '../page/AuditTask/BusinessList';
import BusiOrder from "../page/dataOrder/BusiOrder";
import NetBeanMes from "../page/netBean/NetBeanMes";
import DataOrder from "../page/dataOrder/DataOrder";
import DataSourceMg from "../page/dataSource/DataSourceMg";
import DataGatherCondition from "../page/dataSource/DataGatherCondition";
import DataGatherRule from "../page/dataSource/DataGatherRule";
import SysConfig from "../page/sysConfig/SysConfig";
import ModelManage from "../page/modelManage/ModelManage";
import DepartmentManagement from "../page/DepartmentMmanagement/DepartmentManagement";
import RoleManage from "../page/RoleManage/RoleManage";
import DiffDealInfo from "../page/diffAnalyze/DiffDealInfo";
import DataAuditReportTotal from "../page/dataAuditReportTotal/DataAuditReportTotal";
import ActionLogInfo from "../page/logInfo/ActionLogInfo";
import DataFileLog from "../page/logInfo/DataFileLog";
import AuditRuleList from "../page/auditRuleSum/AuditRuleList";
import DiffTendAnalay from "../page/diffAnalyze/DiffTendAnalay";
import TimeGatherAnalay from "../page/diffAnalyze/TimeGatherAnalay";
import TargetNumAnalay from "../page/diffAnalyze/TargetNumAnalay";
import FtpAuditStoreManage from "../page/standardAuditTools/FtpAuditStoreManage";
import BusinessJoin from "../page/businessJoin/BusinessJoin";
import WholeNetBus from "../page/standardAuditTools/WholeNetBus"
import BookManage from "../page/BookManage/BookManage";
import BookType from "../page/BookType/BookType";
import NoticeMg from "../page/NoticeMg/NoticeMg";
import Sjdhbd from "../page/otherPlantFormBiz/Sjdhbd";
import Cyzs from "../page/otherPlantFormBiz/Cyzs";
import Xhssjb from "../page/otherPlantFormBiz/Xhssjb";
import SftpFile from "../page/standardAuditTools/SftpFile";
import WorkOrder from "../page/workOrder/WorkOrder";
import DataFlow from "../page/standardAuditTools/DataFlow";
import DealWith from "../page/sysAlarmDeal/DealWith";
import Level from "../page/sysAlarmDeal/Level";
import Monitor from "../page/sysAlarmDeal/Monitor";
import AuditProgressInfo from "../page/logInfo/AuditProgressInfo";
import AuditProgressMain from "../page/AuditProgressMain";
const Home = () => (
    <div>
        <h2>Home</h2>
    </div>
)

const NoMatch = () => (
    <div>
        <h2>NoMatch</h2>
    </div>
)

class Switches extends Component{
    render() {
        return (
            <Switch>
                <Route  path="/main" component={Main}/>
                <Route path="/text3" component={NoMatch}/>
                <Route path="/deptInfo" component={DeptInfo}/>
                <Route path="/business" component={Business}/>
                <Route path="/businessAuditRule" component={BusinessAuditRule}/>
                <Route path="/test" component={TestComponent}/>
                <Route path="/AccessAudit" component={AccessAudit} />
                <Route path="/AuditTask" component={AuditTask} />
                <Route path="/NotFound" component={NotFound} />
                <Route path="/NetSetMg"  component={NetSetMg} />
                <Route path="/DiffConfig" component={DiffConfig}/>
                <Route path="/FtpSetMg" component={FtpSetMg} />
                <Route path="/BusinessList" component={BusinessList} />
                <Route path="/BusiOrder" component={BusiOrder}/>
                <Route path="/NetBeanMes" component={NetBeanMes}/>
                <Route path="/DataOrder" component={DataOrder}/>
                <Route path="/DataSourceMg" component={DataSourceMg}/>
                <Route path="/DataGatherCondition" component={DataGatherCondition}/>
                <Route path="/SysConfig" component={SysConfig}/>
                <Route path="/ModelManage" component={ModelManage}/>
                <Route path="/DepartmentManagement" component={DepartmentManagement}/>
                <Route path="/RoleManage" component={RoleManage}/>
                <Route path="/DiffDealInfo" component={DiffDealInfo}/>
                <Route path="/DataAuditReportTotal" component={DataAuditReportTotal} />
                <Route path="/ActionLogInfo" component={ActionLogInfo} />
                <Route path="/DataFileLog" component={DataFileLog} />
                <Route path="/AuditRuleList" component={AuditRuleList} />
                <Route path="/DiffTendAnalay" component={DiffTendAnalay} />
                <Route path="/TimeGatherAnalay" component={TimeGatherAnalay} />
                <Route path="/TargetNumAnalay" component={TargetNumAnalay} />
                <Route path="/FtpAuditStoreManage" component={FtpAuditStoreManage} />
                <Route path="/BusinessJoin" component={BusinessJoin} />
                <Route path="/WholeNetBus" component={WholeNetBus} />
                <Route path="/BookManage" component={BookManage}/>
                <Route path="/BookType" component={BookType}/>
                <Route path="/NoticeMg" component={NoticeMg}/>
                <Route path="/Sjdhbd" component={Sjdhbd}/>
                <Route path="/Cyzs" component={Cyzs}/>
                <Route path="/Xhssjb" component={Xhssjb}/>
                <Route path="/SftpFile"  component={SftpFile} />
                <Route path="/WorkOrder" component={WorkOrder} />
                <Route path="/DataFlow" component={DataFlow} />
                <Route path="/DealWith" component={DealWith} />
                <Route path="/Level" component={Level} />
                <Route path="/DataGatherRule" component={DataGatherRule} />
                <Route path="/Monitor" component={Monitor} />
                <Route path="/AuditProgressInfo" component={AuditProgressInfo} />
                <Route path="/AuditProgressMain" component={AuditProgressMain} />
            </Switch>
        );
    }
}
export default Switches;
