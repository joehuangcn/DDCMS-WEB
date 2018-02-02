/**
 * Created by chenwei on 17/7/27.
 */
import React, {Component}  from 'react';
import {Table,Button} from 'antd';
import {ajaxUtil} from '../../util/AjaxUtils';
import uuid from 'node-uuid';

const columns = [{
    title: 'bizCode',
    dataIndex: 'BIZCODE',
    sorter: true,
    width: '20%',
}, {
    title: 'bizName',
    dataIndex: 'BIZNAME',
    width: '20%',
}, {
    title: 'dataScope',
    dataIndex: 'DATASCOPE',
}];

class TestComponent extends Component {
    state = {
        data: [],
        pagination: {},
        loading: false,
    };
    handleTableChange = (pagination, filters, sorter) => {
        const pager = {...this.state.pagination};
        pager.current = pagination.current;
        this.setState({
            pagination: pager,
        });
        this.fetch({
            results: pagination.pageSize,
            page: pagination.current,
            sortField: sorter.field,
            sortOrder: sorter.order,
            ...filters,
        });
    }
    fetch = (params = {}) => {
        this.setState({loading: true});

        ajaxUtil("urlencoded", "audit-stat!getAuditStatListOfJson.action",
         "limit=22&auditType=JTJH&dataScope=A&dataType=ECPro&nodeKey=23DC63099BBD523DE0538062A8C0082A&bizCodeParam=1005&startDate=&endDate=&cityCode=412&sort=AUDITTIME&dir=DESC", this, (data, that) => {
            const pagination = that.state.pagination;
            pagination.total = parseInt(data.totalProperty,10);
            that.setState({
                loading: false,
                data: data.root,
                pagination,
            });
        });
        // reqwest({
        //     url: 'https://randomuser.me/api',
        //     method: 'get',
        //     data: {
        //         results: 10,
        //         ...params,
        //     },
        //     type: 'json',
        // }).then((data) => {
        //     const pagination = { ...this.state.pagination };
        //     // Read total count from server
        //     // pagination.total = data.totalCount;
        //     pagination.total = 200;
        //     this.setState({
        //         loading: false,
        //         data: data.results,
        //         pagination,
        //     });
        // });
    }

    componentDidMount() {
        this.fetch();
    }


    render() {
        return (
          <div>
            <Table columns={columns}
                   rowKey={uuid.v1()}
                   dataSource={this.state.data}
                   pagination={this.state.pagination}
                   loading={this.state.loading}
                   onChange={this.handleTableChange}
            />
            </div>
        );
    }
}
export default TestComponent;
