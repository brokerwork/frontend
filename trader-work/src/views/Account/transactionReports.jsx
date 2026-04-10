import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Select, Table, Pagination, DatePicker } from 'antd'

import './transactionReports.less'
import i18n from '@/utils/i18n'
import { ACCOUNT_DATA, USER_INFO } from '@/utils/storage'
import moment from 'moment'
import * as actions from '@/actions/Account/transactionReports'
import { setHeaderTitle } from '@/actions/App/app'

const RangePicker = DatePicker.RangePicker;
const Option = Select.Option
const columns1 = [
    {
      title: i18n['tradereport.order.number'],
      dataIndex: 'orderNum',
      key: 'orderNum',
    },
    {
      title: i18n['tradereport.account'],
      dataIndex: 'account',
      key: 'account',
    },
    {
      title: i18n['tradereport.type'],
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: i18n['tradereport.variety'],
      dataIndex: 'kind',
      key: 'kind',
    },
    {
      title: i18n['tradereport.volum'],
      dataIndex: 'tradeNum',
      key: 'tradeNum',
    },
    {
      title: i18n['tradereport.open.price'],
      dataIndex: 'openPrice',
      key: 'openPrice',
    },
    {
      title: i18n['tradereport.open.time'],
      dataIndex: 'openTime',
      key: 'openTime',
    },
    {
      title: i18n['tradereport.exit.price'],
      dataIndex: 'closePrice',
      key: 'closePrice',
    },
    {
      title: i18n['tradereport.exit.time'],
      dataIndex: 'closeTime',
      key: 'closeTime',
    },
    {
      title: i18n['tradereport.stop.loss'],
      dataIndex: 'stopLoss',
      key: 'stopLoss',
    },
    {
      title: i18n['tradereport.take.profit'],
      dataIndex: 'targetProfit',
      key: 'targetProfit',
    },
    {
      title: i18n['tradereport.commission'],
      dataIndex: 'commission',
      key: 'commission',
    },
    {
      title: i18n['tradereport.interest'],
      dataIndex: 'interest',
      key: 'interest',
    },
    {
      title: i18n['tradereport.gain'],
      dataIndex: 'profitLoss',
      key: 'profitLoss',
    },
    {
      title: i18n['general.comment.tw'],
      dataIndex: 'comment',
      key: 'comment',
    },
];
const columns2 = [
    {
      title: i18n['tradereport.order.number'],
      dataIndex: 'orderNum',
      key: 'orderNum',
    },
    {
      title: i18n['tradereport.account'],
      dataIndex: 'account',
      key: 'account',
    },
    {
      title: i18n['tradereport.type'],
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: i18n['tradereport.variety'],
      dataIndex: 'kind',
      key: 'kind',
    },
    {
      title: i18n['tradereport.volum'],
      dataIndex: 'tradeNum',
      key: 'tradeNum',
    },
    {
      title: i18n['tradereport.resting.price'],
      dataIndex: 'orderPrice',
      key: 'orderPrice',
    },
    {
      title: i18n['tradereport.resting.time'],
      dataIndex: 'orderTime',
      key: 'orderTime',
    },
    {
      title: i18n['tradereport.stop.loss'],
      dataIndex: 'stopLoss',
      key: 'stopLoss',
    },
    {
      title: i18n['tradereport.take.profit'],
      dataIndex: 'targetProfit',
      key: 'targetProfit',
    },
    {
      title: i18n['tradereport.execution.time'],
      dataIndex: 'time',
      key: 'time',
    },
];
const columns3 = [
    {
      title: i18n['tradereport.order.number'],
      dataIndex: 'orderNum',
      key: 'orderNum',
    },
    {
      title: i18n['tradereport.account'],
      dataIndex: 'account',
      key: 'account',
    },
    {
      title: i18n['tradereport.type'],
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: i18n['tradereport.variety'],
      dataIndex: 'kind',
      key: 'kind',
    },
    {
      title: i18n['tradereport.volum'],
      dataIndex: 'tradeNum',
      key: 'tradeNum',
    },
    {
      title: i18n['tradereport.open.price'],
      dataIndex: 'openPrice',
      key: 'openTime',
    },
    {
      title: i18n['tradereport.open.time'],
      dataIndex: 'openTime',
      key: 'openTime',
    },
    {
      title: i18n['tradereport.stop.loss'],
      dataIndex: 'stopLoss',
      key: 'stopLoss',
    },
    {
      title: i18n['tradereport.take.profit'],
      dataIndex: 'targetProfit',
      key: 'targetProfit',
    },
    {
        title: i18n['tradereport.commission'],
        dataIndex: 'commission',
        key: 'commission',
    },
    {
        title: i18n['tradereport.interest'],
        dataIndex: 'interest',
        key: 'interest',
    },
    {
        title: i18n['tradereport.gain'],
        dataIndex: 'profitLoss',
        key: 'profitLoss',
    }
];

class TransactionReports extends Component {
  lock = false
  params = {
        type: 'history',
        from: moment().subtract(30,'days').format('YYYYMMDD'),
        to: moment().format('YYYYMMDD'),
        total: 0,
        size: 10,
        page: 1
  }
    state = {
      type: 'history',
      allowViewHistoryOrder: false,
      allowViewOrder: false,
      allowViewPosition: false
    }
  componentWillReceiveProps = (nextProps) => {
    this.props.setHeaderTitle(i18n['menu.trade.report'])
    let currentPlatform = this.props.account.currAccount.vendor
    if (!nextProps.structConfig || !nextProps.accountList.liveAccountList.length || this.lock) return
    let basicSetting = nextProps.structConfig[currentPlatform].basicSetting
    let { allowViewHistoryOrder, allowViewOrder, allowViewPosition } = basicSetting
    this.setState({
      allowViewHistoryOrder,
      allowViewOrder,
      allowViewPosition,
      type: allowViewHistoryOrder?'history':allowViewOrder?'order':allowViewPosition?'position':null
    })
    this.lock = true
  }
  componentDidMount() {
      this.props.setHeaderTitle(i18n['menu.trade.report'])
      this.props.fetchReports(this.params)
  }
  onChange = value => {
    this.params.page = value
    this.props.fetchReports(this.params)
  }
  onOk = values => {
    this.params.from = values[0].format('YYYYMMDD')
    this.params.to = values[1].format('YYYYMMDD')
    this.props.fetchReports(this.params)
  }
  handleChange = value => {
      this.params.type = value
      this.setState({
          type: value
      })
      this.props.fetchReports(this.params)
  }
  renderFooter = () => {
    return <table className="table">
      <tbody>
        <tr>
          <td>{i18n['tradereport.total']}</td>
          <td></td>
          <td></td>
          <td></td>
          <td>{this.totalObj.volume}</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>{this.totalObj.commission}</td>
          <td>{this.totalObj.swap}</td>
          <td>{this.totalObj.profit}</td>
          <td></td>
        </tr>

      </tbody>
    </table>
  }
  render() {
      
    if (!this.props.data.list) return null
    const { allowViewHistoryOrder, allowViewOrder, allowViewPosition, type } = this.state
    this.params.total = this.props.data.total
    this.totalObj = this.props.data.sta||{}
      let data = this.props.data.list.map(el => {
            return {
                orderNum: el.id,
                account: el.account,
                type: el.type,
                kind: el.symbol,
                tradeNum: el.volume,
                openPrice: el.openPrice,
                openTime: el.openTime,
                closePrice: el.closePrice,
                closeTime: el.closeTime,
                orderPrice: el.orderPrice,
                orderTime: el.orderTime,
                time: '',
                stopLoss: el.stopLoss,
                targetProfit: el.takeProfit,
                commission: el.commission,
                interest: el.swaps||el.swap,
                profitLoss: el.profit,
                comment: el.comment 
            }
      })
      return <div className="page transaction-reports">
            <Select value={type} style={{ width: 110,marginRight: 10 }} onChange={this.handleChange}>
              {allowViewHistoryOrder && <Option value='history'>{i18n['tradereport.trade.history']}</Option>}
              {allowViewOrder && <Option value='order'>{i18n['tradereport.restingorder.query']}</Option>}
              {allowViewPosition && <Option value='position'>{i18n['tradereport.position.query']}</Option>}
            </Select>
            <RangePicker
              allowClear={false}
              ranges={{ [i18n['datepicker.range.today']]: [moment(), moment()], [i18n['datepicker.range.thismonth']]: [moment().startOf('month'), moment().endOf('month')] }}
              // showTime
              format="YYYY/MM/DD"
              onChange={this.onOk}
              defaultValue={[moment(this.params.from),moment(this.params.to)]}
            />
        {this.state.type === 'history' && <Table className="table" dataSource={data} columns={columns1} pagination={false} footer={this.renderFooter}/>}
          {this.state.type==='order' && <Table className="table" dataSource={data} columns={columns2} pagination={false}/>}
          {this.state.type==='position' && <Table className="table" dataSource={data} columns={columns3} pagination={false}/>}
            <Pagination className="pagination" showQuickJumper defaultCurrent={1} total={this.params.total} onChange={this.onChange} />
      </div>
      
  }
}
export default connect(
  ({ app, common, account }) => {
      return {
        account: app.account,
        structConfig: app.structConfig,
        struct: app.struct,
        brand: common.brandInfo,
        accountList: app.accountList,
        data : account.transactionReports
      }   
  }, 
  { ...actions, setHeaderTitle })(TransactionReports)