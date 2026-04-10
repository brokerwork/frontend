/* 销售报表页面 */
import * as React from 'react';
import {Row, Col, Button,
    DropdownButton, MenuItem, CustomDateRangePicker,
    FormControl, ButtonGroup,NewSelect
} from 'fooui';
import {SearchBox,Panel} from 'fooui';
import {Pagination} from 'fooui/src/ui/pagination';

import {AppHeader} from '../../header/index';
import {AppFooter} from '../../footer/index';
import {connect} from 'react-redux';
import {Select} from 'fooui';
import {fetchAllCustomers} from '../actions/customerActions';
import {Table}  from 'react-bootstrap';
import { Router, Route, hashHistory, Link, IndexRoute } from 'react-router';

interface P { }
interface S { }

class SalesReport extends React.Component<{}, S>{
    constructor(props) {
        super(props);
    }
    _onPageSizeChange = (size: number, current: number) => {
        
    }
    onPageChange = (current: number) => {
        
        var {dispatch} = this.props;
        var queryParam = {
            nowPage: current,
            pageSize: 5
        }
        dispatch(fetchAllCustomers(queryParam))
    }
    componentDidMount() {
        var {dispatch} = this.props;
        var queryParam = {
            nowPage: 1,
            pageSize: 10
        }

    }

    //右边的search box
    doFuzySearch = (value) => {
        var {dispatch} = this.props;
        var queryParam = {
            fuzzyItem: 'CustomerName',
            fuzzyVal: value
        }
        dispatch(fetchAllCustomers(queryParam))
    }

    //中间的search条件
    doCommonSearch = () => {
        var {dispatch} = this.props;
        var senseItem = this.refs.senseItem.getCurrentItemValue();
        var searchDate = this.refs.searchDate.getSelectedValue();
        var range = this.refs.daterangepicker.getSelectedRange();
        var queryParam = {
            senseItem: senseItem,
            searchDate: searchDate
        }
        if (range != null) {
            queryParam.searchStart = range[0];
            queryParam.searchEnd = range[1] + 3600 * 24 * 1000;
        }
        
        dispatch(fetchAllCustomers(queryParam))
    }

    editCustomer = (data) => {
        
    }


    render() {
        return (
            <div>
                <div className="customer page-wrapper">
                    <Row>
                        <Col md={12}>
                            <Panel title="销售目标/查看报表">
                                <div className="panel-body">
                                    <div className="toolbar">

                                        <div className="customer-filters">
                                            <Button bsStyle="primary"><Link to="salesTarget">返回</Link></Button>
                                            <NewSelect options={[
                                                                    { label: '2016财年', value: 'All' },
                                                                ]}
                                                       iconRight={"fa fa-angle-down"}
                                                       isChangeText={true}
                                                       btnText="2016财年"
                                                       className="ghost-btn menu-btn newselect-menu"
                                                       onChange={this.doCommonSearch}
                                                       ref="senseItem"
                                            />
                                            <NewSelect options={[
                                                     { label: '季度报表', value: 'All' },
                                                    { label: '月度报表', value: 'month' },
                                                                ]}
                                                       iconRight={"fa fa-angle-down"}
                                                       isChangeText={true}
                                                       btnText="季度报表"
                                                       className="ghost-btn menu-btn newselect-menu"
                                                       onChange={this.doCommonSearch}
                                                       ref="senseItem"
                                            />
                                            <Button bsStyle="primary" >下载报表</Button>

                                            <div className="pull-right">
                                                <NewSelect options={[
                                                     { label: '客户名称', value: 'CustomerName' },
                                                    { label: '客户ID', value: 'CustomerId' },
                                                    { label: '姓名', value: 'ContactName' },
                                                    { label: '电话', value: 'ContactPhone' },
                                                    { label: '邮箱', value: 'ContactMail' }
                                                                ]}
                                                           iconRight={"fa fa-angle-down"}
                                                           isChangeText={true}
                                                           btnText="客户名称"
                                                           className="ghost-btn menu-btn newselect-menu"
                                                           onChange={this.doCommonSearch}
                                                           ref="senseItem"
                                                />
                                            </div>

                                        </div>


                                    </div>
                                    <div className="row report-table">
                                        <div className="col-md-12">

                                            <Table  bordered>
                                                <tbody>
                                                    <tr>
                                                        <td className="th1" rowSpan="2">用户编号</td>
                                                        <td className="th1" rowSpan="2">姓名</td>
                                                        <td className="th1" rowSpan="2">角色</td>
                                                        <td className="th1" rowSpan="2">指标类型</td>
                                                        <td colSpan="3" className="th2">年度目标</td>
                                                        <td colSpan="3" className="th2">第一季度</td>
                                                        <td colSpan="3" className="th2">第二季度</td>
                                                        <td colSpan="3" className="th2">第三季度</td>
                                                        <td colSpan="3" className="th2">第四季度</td>
                                                    </tr>
                                                    <tr>

                                                        <td>目标</td>
                                                        <td>完成</td>
                                                        <td>完成率</td>
                                                        <td>目标</td>
                                                        <td>完成</td>
                                                        <td>完成率</td>
                                                        <td>目标</td>
                                                        <td>完成</td>
                                                        <td>完成率</td>
                                                        <td>目标</td>
                                                        <td>完成</td>
                                                        <td>完成率</td>
                                                        <td>目标</td>
                                                        <td>完成</td>
                                                        <td>完成率</td>
                                                    </tr>
                                                    <tr>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                    </tr>
                                                    <tr>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                    </tr>
                                                    <tr>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                    </tr>
                                                    <tr>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                    </tr>
                                                </tbody>
                                            </Table>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col col-md-2">
                                            <p className="pages-color">共&nbsp;<span className="number-color">{this.props.totalRecords}</span>&nbsp;条, 当前第&nbsp;<span className="number-color">{this.props.currPageNumber}</span>&nbsp;页</p>
                                        </div>
                                        <div className="col col-md-10 pull-right">
                                            <Pagination
                                                total={this.props.totalPages}
                                                current={this.props.currPageNumber}
                                                onChange={this.onPageChange}
                                                pageSize={this.props.pageSize}
                                                pageSizeOptions={[10, 20, 30]}
                                                onPageSizeChange={ this._onPageSizeChange }
                                                />
                                        </div>
                                    </div>
                                </div>
                            </Panel>
                        </Col>
                    </Row>

                </div>
                <AppFooter/>
            </div>


        )
    }
}

function mapStateToProps(state) {
    return {
        customers: state.customerPage.customers,
        totalRecords: state.customerPage.totalRecords,
        totalPages: state.customerPage.otalPages,
        currPageNumber: state.customerPage.currPageNumber,
        pageSize: state.customerPage.pageSize,
        showBatchTools: state.customerPage.showBatchTools
    }
}


export default connect(mapStateToProps)(SalesReport);