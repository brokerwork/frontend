import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Input, Select, InputNumber, Modal, Checkbox, Table, Pagination, DatePicker } from 'antd'

import './tradingFlow.less'
import i18n from '@/utils/i18n'
import { ACCOUNT_DATA, USER_INFO } from '@/utils/storage'
import moment from 'moment'
import * as actions from '@/actions/Fund/tradingFlow'
import { setHeaderTitle } from '@/actions/App/app'

const RangePicker = DatePicker.RangePicker;
const Option = Select.Option


class TradingFlow extends Component {
  params = {
    accountId: '',
    from: moment().subtract(30,'days').valueOf(),
    to: moment().valueOf(),
    sort: 'openTime',
    order: 'desc',
    total: 0,
    size: 10,
    page: 1
  }
  
    componentDidMount() {
      this.account = this.props.account.currAccount.account
      this.accountName = this.props.account.currAccount.accountName
      this.props.setHeaderTitle(i18n['menu.fundmgmt.fundflow'])
      this.params.accountId = this.account
      this.props.fetchList(this.params)
  }
  componentWillReceiveProps(){
    this.props.setHeaderTitle(i18n['menu.fundmgmt.fundflow'])
  }
  onChange = value => {
    this.params.page = value
    this.props.fetchList(this.params)
  }
  onOk = values => {
    this.params.from = values[0].startOf('day').valueOf()
    this.params.to = values[1].endOf('day').valueOf()
    this.props.fetchList(this.params)
  }
  handleChange = value => {
    this.params.accountId = value
    this.props.fetchList(this.params)
  }
  render() {
      const columns = [
          {
            title: i18n['fundflow.column.common.accountId'],
            dataIndex: 'account',
            key: 'account',
          },
          {
            title: i18n['mobile.name'],
            dataIndex: 'name',
            key: 'name'
          },
          {
              title: i18n['mobile.deposit'],
              dataIndex: 'depositAmount',
              key: 'depositAmount'
            },
          {
            title: i18n['mobile.withdraw'],
            dataIndex: 'withdrawAmount',
            key: 'withdrawAmount'
          },
          {
            title: i18n['mobile.creditChange'],
            dataIndex: 'credit',
            key: 'credit'
          },
          {
            title: i18n['mobile.operateTime'],
            dataIndex: 'time',
            key: 'time'
          },
          {
            title: i18n['fundflow.column.common.comment'],
            dataIndex: 'comment',
            key: 'comment'
          }
      ];
      if (!this.props.list.list) return null
    let accountList = this.props.accountList.liveAccountList
    this.params.total = this.props.list.total
    const data = this.props.list.list.map(el => {
      let depositAmount = 0,withdrawAmount = 0,credit = 0
      if (el.type == 'deposit') {
        depositAmount = el.profit
      }else if (el.type == 'withdraw') {
        withdrawAmount = el.profit
      } else if (el.type == 'out'||el.type == 'in') {
        credit = el.profit
      }
      return {
        account: el.accountId,
        name: this.accountName,
        depositAmount,
        withdrawAmount,
        credit,
        time: el.openTime,
        comment: el.comment
        }
      })
      return <div className="page trading-flow">
            <Select defaultValue={this.props.account.currAccount.account} style={{ width: 110,marginRight: 10 }} onChange={this.handleChange}>
              {accountList.map(el => {
                return <Option value={el.account}>{el.account}</Option>
              })}
            </Select>
            <RangePicker
              allowClear={false}
              ranges={{ [i18n['datepicker.range.today']]: [moment(), moment()], [i18n['datepicker.range.thismonth']]: [moment().startOf('month'), moment().endOf('month')] }}
              // showTime
              format="YYYY/MM/DD"
              onChange={this.onOk}
              defaultValue={[moment(this.params.from),moment(this.params.to)]}
            />
            <Table className="table" dataSource={data} columns={columns} pagination={false}/>
            <Pagination className="pagination" showQuickJumper defaultCurrent={1} total={this.params.total} onChange={this.onChange} />
      </div>
      
  }
}
export default connect(
  ({ app, common, fund }) => {
      return {
        account: app.account,
        structConfig: app.structConfig,
        struct: app.struct,
        brand: common.brandInfo,
        accountList: app.accountList,
        list : fund.tradingFlowList
      }   
  }, 
  { ...actions, setHeaderTitle })(TradingFlow)