import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { Select, Table, Row, Col, Input, DatePicker } from 'antd'

import i18n from '@/utils/i18n'
import './commissionReport.less'
import * as appActions from '@/actions/App/app'
import * as actions from '@/actions/Spread/commissionReport'

const Option = Select.Option
const { RangePicker } = DatePicker

class CommissionReport extends Component {
    constructor(props) { 
        super(props)
        this.state = {
            serverId: '',                        //  服务器
            reportType: 'trade',                                    // 报表类型
            searchStart: moment().format('YYYY-MM-DD'),             //  开始时间
            searchEnd: moment().format('YYYY-MM-DD'),               //  结束时间
            accountQueryValue: '',                                  //  模糊查找内容
            nowPage: 1,                    
            pageSize: 10,
            flag: false
        }
        props.getServer().then(res => { 
            if (res && res.result) { 
                this.setState({
                    serverId: res.data && res.data.data[0].serverId,
                })
            }
        })
    }
    total = 0;
    componentDidMount() { 
        this.props.setHeaderTitle(i18n['spread.commission.report'])
        if (this.state.serverId && this.props.customerId) { 
            this.getRebate()
        }
    }
    componentWillReceiveProps(nextProps) {
        this.props.setHeaderTitle(i18n['spread.commission.report'])
        if (nextProps.customerId && nextProps.serverList) { 
            if (this.state.flag) return false
            this.setState({
                flag: true,
                serverId: nextProps.serverList.data[0].serverId,
            }, () => { 
                this.getRebate()
            })
        }
    }

    //  搜索
    pressEnter = () => { 
        this.setState({
            nowPage: 1,
        }, () => { 
            this.getRebate()
        })
    }
    //  搜索框值
    queryChange = (e) => { 
        this.setState({
            accountQueryValue: e.target.value,
        })
    }

    //  翻页
    tableChange = (pagination, filters, sorter) => { 
        this.setState({
            nowPage: pagination,
        }, () => { 
            this.getRebate()
        })
    }

    //  时间选择
    rangeDate = (dates, dateStrings) => { 
        this.setState({
            searchStart: dateStrings[0],
            searchEnd: dateStrings[1],
            nowPage: 1,
        }, () => { 
            if (dateStrings && dateStrings[0] && dateStrings[1]) { 
                this.getRebate()
            }
        })
    }

    //  选择服务器
    serverChange = (val) => { 
        this.setState({
            serverId: val,
            nowPage: 1,
        }, () => { 
            this.getRebate()
        })
    }

    //  选择报表类型
    reportType = (val) => { 
        this.setState({
            reportType: val,
            nowPage: 1,
        }, () => { 
            this.getRebate()
        })
    }

    //  拉取数据
    getRebate = () => { 
        const {
            nowPage, 
            serverId, 
            pageSize, 
            searchEnd, 
            reportType,
            searchStart, 
            accountQueryValue, 
        } = this.state
        const { 
            customerId, 
            getTradeRebate, 
            getChargeRebate, 
            getOtherRebate, 
            tradeRebate,
            chargeRebate,
            otherRebate,
        } = this.props
        let params = {
            nowPage,
            pageSize,
            searchEnd,
            searchStart,
            accountQueryValue,
        }
        if (reportType == 'trade') {
            getTradeRebate(serverId, customerId, {
                ...params,
                // sta: tradeRebate && tradeRebate.sta,
            })
        } else if (reportType == 'charge') {
            getChargeRebate(serverId, customerId, {
                ...params,
                // sta: chargeRebate && chargeRebate.sta,
            })
        } else if (reportType == 'other') { 
            getOtherRebate(serverId, customerId, {
                ...params,
                // sta: otherRebate && otherRebate.sta,
            })
        }
    }
    render() {
        const { reportType, serverId, accountQueryValue } = this.state
        const { serverList, tradeRebate, chargeRebate, otherRebate } = this.props
        let columns = []
        let rebateData = []
        let sta = {}
        
        if (reportType == 'trade' || reportType == 'charge') {
            let tempRebate = reportType == 'trade' ? tradeRebate : chargeRebate
            columns = [
                { title: i18n['spread.rebate.account'], dataIndex: 'rebateAccount', key: 'rebateAccount', align: 'center' },
                { title: i18n['spread.rebate.money'], dataIndex: 'rebateMoney', key: 'rebateMoney', align: 'center' },
                { title: i18n['spread.trade.account'], dataIndex: 'tradeAccount', key: 'tradeAccount', align: 'center' },
                { title: i18n['spread.trade.name'], dataIndex: 'name', key: 'name', align: 'center' },
                { title: i18n['tradereport.order.number'], dataIndex: 'ticket', key: 'ticket', align: 'center' },
                { title: i18n['spread.trade.type'], dataIndex: 'type', key: 'type', align: 'center' },
                { title: i18n['spread.trade.count'], dataIndex: 'count', key: 'count', align: 'center' },
                { title: i18n['tradereport.exit.time'], dataIndex: 'time', key: 'time', align: 'center' },
            ]
            if (tempRebate && tempRebate.list) { 
                sta = tempRebate.sta
                this.total = tempRebate.total
                tempRebate.list.forEach((item, index) => { 
                    rebateData.push({
                        key: index,
                        rebateAccount: item.commission_user_login,
                        rebateMoney: item.rebate_money,
                        tradeAccount: item.login,
                        name: item.name,
                        ticket: item.ticket,
                        type: item.symbol,
                        count: item.volume,
                        time: item.close_time,
                    })
                })
            }
        } else if (reportType == 'other') { 
            columns = [
                { title: i18n['spread.rebate.type'], dataIndex: 'type', key: 'type', align: 'center' },
                { title: i18n['spread.rebate.account'], dataIndex: 'account', key: 'account', align: 'center' },
                { title: i18n['spread.rebate.money'], dataIndex: 'money', key: 'money', align: 'center' },
                { title: i18n['spread.trade.account'], dataIndex: 'number', key: 'number', align: 'center' },
                { title: i18n['spread.trade.name'], dataIndex: 'name', key: 'name', align: 'center' },
                { title: i18n['spread.des'], dataIndex: 'detail', key: 'detail', align: 'center' },
            ]
            if (otherRebate && otherRebate.list) { 
                sta = otherRebate.sta
                this.total = otherRebate.total
                otherRebate.list.forEach((item, index) => { 
                    rebateData.push({
                        key: index,
                        type: item.commission_type,
                        account: item.commission_user_login,
                        money: item.rebate_money,
                        number: item.login,
                        name: item.name,
                        detail: item.desc,
                    })
                })
            }
        }
        return (
            <div className='page commission-report'>
                <div className="report-head">
                    <Row>
                        <Col span={18}>
                            <Row>
                                <Col span={7}>
                                    <Select
                                        value={serverId}
                                        onChange={this.serverChange}
                                        className='report-select'>
                                        {
                                            serverList && serverList.data && serverList.data.map(item => { 
                                                return <Option value={item.serverId}>{item.desc}</Option>
                                            })
                                        }
                                    </Select>
                                </Col>
                                <Col span={7}>
                                    <Select
                                        onChange={this.reportType}
                                        defaultValue={reportType}
                                        className='report-select'>
                                        <Option value='trade'>{i18n['spread.trade.report']}</Option>  
                                        <Option value='charge'>{i18n['spread.charge.report']}</Option>  
                                        <Option value='other'>{i18n['spread.other.report']}</Option>  
                                    </Select>
                                </Col>
                                <Col span={7}>
                                    <RangePicker
                                        allowClear={false}
                                        onChange={this.rangeDate}
                                        defaultValue={[moment(), moment()]}
                                        ranges={{ Today: [moment(), moment()], 'This Month': [moment().startOf('month'), moment().endOf('month')] }} />
                                </Col>
                            </Row>
                        </Col>
                        <Col span={6}>
                            <Input
                                onChange={this.queryChange}
                                value={accountQueryValue}
                                onPressEnter={this.pressEnter}
                                placeholder={i18n['spread.account.name']}></Input>
                        </Col>
                    </Row>
                </div>
                <div className='report-hint'>{i18n['spread.hint']}</div>
                <div className="report-table">
                    <Table bordered dataSource={rebateData} columns={columns} pagination={{
                        total: this.total,
                        pageSize: this.state.pageSize,
                        current: this.state.nowPage,
                        onChange: this.tableChange
                    }}/>
                </div>
                <div className="report-des">
                    {
                        reportType == 'trade' && <div className='report-total'>{i18n['spread.rebate.total']}: {sta.sum_rebate_money}</div>
                    }
                    {
                        reportType == 'charge' && <div className='report-total'>{i18n['spread.rebate.total']}: {sta.sum_rebate_money}</div>
                    }
                    {
                        reportType == 'other' && <div className='report-total'>
                            <span>{i18n['spread.deposit.rebate.total']}: {sta.sum11_rebate_money}</span>
                            <span>{i18n['spread.net.rebate.total']}: {sta.sum10_rebate_money}</span>
                            <span>{i18n['spread.profit.rebate.total']}: {sta.sum30_rebate_money}</span>
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default connect(
    ({ app, spread }) => { 
        return {
            serverList: spread.serverList,
            tradeRebate: spread.tradeRebate,
            chargeRebate: spread.chargeRebate,
            otherRebate: spread.otherRebate,
            customerId: app.proxySetting.customerId,
        }
    }, {
        ...actions,
        ...appActions,
    }
)(CommissionReport)