import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Form,
  Input,
  Select,
  InputNumber,
  Modal,
  Checkbox,
  Table,
  Pagination,
  DatePicker,
  Tooltip,
  Button
} from "antd";

import "./task.less";
import i18n from "@/utils/i18n";
import { ACCOUNT_DATA, USER_INFO } from "@/utils/storage";
import moment from "moment";
import * as actions from "@/actions/Fund/task";
import { setHeaderTitle } from "@/actions/App/app";
import _ from "lodash";

const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;
const depositColumns = [
  {
    title: i18n["fundflow.column.common.id"],
    dataIndex: "id",
    key: "id"
  },
  {
    title: i18n["fundflow.column.common.accountId"],
    dataIndex: "account",
    key: "account"
  },
  {
    title: i18n["fundflow.column.deposit.depositAmount"],
    dataIndex: "amount",
    key: "amount"
  },
  {
    title: i18n["fundflow.column.common.createTime"],
    dataIndex: "createTime",
    key: "createTime"
  },
  {
    title: i18n["fundflow.column.deposit.depositCurrency"],
    dataIndex: "payCurrency",
    key: "payCurrency"
  },
  {
    title: i18n["fundflow.column.deposit.payAmount"],
    dataIndex: "payAmount",
    key: "payAmount"
  },
  {
    title: i18n["fundflow.column.deposit.payStatus"],
    dataIndex: "status",
    key: "status"
  },
  {
    title: i18n["fundflow.column.deposit.payTime"],
    dataIndex: "payTime",
    key: "payTime"
  },
  {
    title: i18n["fundflow.column.common.state"],
    dataIndex: "state",
    key: "state",
    render: (value, row, index) => {
      const val = row["originalState"];

      if ((value == "Rejected" || val === "Closed") && row["rejectReason"]) {
        return (
          <div>
            {value}
            <Tooltip placement="bottomRight" title={row["rejectReason"]}>
              <div style={{ display: "inline-block" }}>
                <i class="iconfont icon-live-comments reject-content"></i>
              </div>
            </Tooltip>
          </div>
        );
      } else {
        return value;
      }
    }
  },
  {
    title: i18n["fundflow.column.common.comment"],
    dataIndex: "comment",
    key: "comment"
  }
];
const withdrawColumns = [
  {
    title: i18n["fundflow.column.common.id"],
    dataIndex: "id",
    key: "id"
  },
  {
    title: i18n["fundflow.column.common.accountId"],
    dataIndex: "account",
    key: "account"
  },
  {
    title: i18n["fundflow.column.withdraw.withdrawAmount"],
    dataIndex: "amount",
    key: "amount"
  },
  {
    title: i18n["fundflow.column.common.createTime"],
    dataIndex: "createTime",
    key: "createTime"
  },
  {
    title: i18n["withdraw.withdrawCurrency"],
    dataIndex: "currency",
    key: "currency"
  },
  {
    title: i18n["fundflow.column.common.state"],
    dataIndex: "state",
    key: "state",
    render: (value, row, index) => {
      const val = row["originalState"];

      if ((value == "Rejected" || val === "Closed") && row["rejectReason"]) {
        return (
          <div>
            {value}
            <Tooltip placement="bottomRight" title={row["rejectReason"]}>
              <div style={{ display: "inline-block" }}>
                <i class="iconfont icon-live-comments reject-content"></i>
              </div>
            </Tooltip>
          </div>
        );
      } else {
        return value;
      }
    }
  },
  {
    title: i18n["fundflow.column.common.comment"],
    dataIndex: "comment",
    key: "comment"
  }
];
const transferColumns = [
  {
    title: i18n["fundflow.column.common.id"],
    dataIndex: "id",
    key: "id"
  },
  {
    title: i18n["fundflow.column.transfer.accountId"],
    dataIndex: "account",
    key: "account"
  },
  {
    title: i18n["fundflow.column.transfer.transferAmount"],
    dataIndex: "amount",
    key: "amount"
  },
  {
    title: i18n["fundflow.column.transfer.receiptAccount"],
    dataIndex: "receiptAccount",
    key: "receiptAccount"
  },
  {
    title: i18n["fundflow.column.transfer.receiptAccountName"],
    dataIndex: "name",
    key: "name"
  },
  {
    title: i18n["fundflow.column.common.createTime"],
    dataIndex: "createTime",
    key: "createTime"
  },
  {
    title: i18n["fundflow.column.common.state"],
    dataIndex: "state",
    key: "state",
    render: (value, row, index) => {
      const val = row["originalState"];
      if ((val == "Rejected" || val === "Closed") && row["rejectReason"]) {
        return (
          <div>
            {value}
            <Tooltip placement="bottomRight" title={row["rejectReason"]}>
              <div style={{ display: "inline-block" }}>
                <i class="iconfont icon-live-comments reject-content"></i>
              </div>
            </Tooltip>
          </div>
        );
      } else {
        return value;
      }
    }
  },
  {
    title: i18n["fundflow.column.common.comment"],
    dataIndex: "comment",
    key: "comment"
  }
];

class Task extends Component {
  columns = depositColumns;
  params = {
    accountId: "",
    from: moment()
      .subtract(30, "days")
      .format("YYYY-MM-DD"),
    to: moment().format("YYYY-MM-DD"),
    size: 10,
    page: 1,
    type: "Deposit",
    total: 0
  };
  translation = {
    Pending: i18n["dealer.report.status.unpaid"],
    Finished: i18n["fundflow.tradeState.finished"],
    Dealed: i18n["fundflow.tradeState.dealed"],
    Submited: i18n["fundflow.tradeState.submited"],
    Closed: i18n["fundflow.tradeState.rejected"]
  };
  componentDidMount() {
    this.account = this.props.account.currAccount.account;
    this.props.setHeaderTitle(i18n["task.list"]);
    this.params.accountId = this.account;
    this.props.fetchList(this.params);
  }
  componentWillReceiveProps() {
    this.props.setHeaderTitle(i18n["task.list"]);
  }
  onChange = value => {
    this.params.page = value;
    this.props.fetchList(this.params);
  };
  onOk = values => {
    this.params.from = values[0].format("YYYY-MM-DD");
    this.params.to = values[1].format("YYYY-MM-DD");
    this.props.fetchList(this.params);
  };
  handleAccountChange = value => {
    this.params.accountId = value;
    this.props.fetchList(this.params);
  };
  handleChange = value => {
    this.params.type = value;
    let columns = "";
    switch (value) {
      case "Deposit":
        columns = depositColumns;
        this.params.type = value;
        break;
      case "Withdraw":
        columns = withdrawColumns;
        this.params.type = value;
        break;
      case "Transfer":
        columns = transferColumns;
        this.params.type = value;
        break;
      case "BwWithdraw":
        const copyColumns = _.cloneDeep(withdrawColumns);
        copyColumns.splice(1, 0, {
          title: i18n["fundflow.column.common.apply"],
          dataIndex: "apply",
          key: "apply"
        });
        columns = copyColumns;
        break;
      case "BwTransfer":
        const copyTransferColumns = _.cloneDeep(transferColumns);
        copyTransferColumns.splice(1, 0, {
          title: i18n["fundflow.column.common.apply"],
          dataIndex: "apply",
          key: "apply"
        });
        columns = copyTransferColumns;
        break;
      default:
    }
    this.columns = columns;
    this.props.fetchList(this.params);
  };
  render() {
    let type = "";
    switch (this.params.type) {
      case "Deposit":
        type = "depositTransaction";
        break;
      case "Withdraw":
      case "BwWithdraw":
        type = "withdrawTransaction";
        break;
      case "Transfer":
      case "BwTransfer":
        type = "transferTransaction";
        break;
      default:
    }
    if (!this.props.list.list) return null;
    let accountList = this.props.accountList.liveAccountList;
    this.params.total = this.props.list.total;

    const data = this.props.list.list.map((el, index) => {
      let obj = el[type] || {};
      return {
        id: obj.id,
        account: obj.accountId,
        amount: obj.depositAmount || obj.withdrawAmount || obj.transferAmount,
        createTime: moment(obj.createTime).format("YYYY-MM-DD HH:mm:ss"),
        payCurrency: obj.payCurrency,
        payAmount: obj.payAmount,
        status: this.translation[obj.payStatus],
        name: obj.receiptAccountName,
        payTime:
          obj.payStatus === "Finished" && obj.payTime
            ? (`${obj.payTime}`.length < `${Date.now()}`.length
                ? moment.unix(obj.payTime)
                : moment(obj.payTime)
              ).format("YYYY-MM-DD HH:mm:ss")
            : "-",
        currency: obj.currency,
        state: this.translation[obj.state],
        originalState: obj.state,
        comment: obj.comment,
        apply: obj.apply,
        rejectReason: obj.rejectReason,
        receiptAccount: obj.receiptAccount
      };
    });
    return (
      <div className="page task">
        <Select
          defaultValue={this.account}
          style={{ width: 110, marginRight: 10 }}
          onChange={this.handleAccountChange}
        >
          {accountList.map(el => {
            return <Option value={el.account}>{el.account}</Option>;
          })}
        </Select>
        <Select
          defaultValue={this.params.type}
          style={{ width: 110, marginRight: 10 }}
          onChange={this.handleChange}
        >
          <Option value="Deposit">{i18n["fundflow.tradeType.deposit"]}</Option>
          <Option value="Withdraw">
            {i18n["fundflow.tradeType.withdraw"]}
          </Option>
          <Option value="Transfer">
            {i18n["fundflow.tradeType.transfer"]}
          </Option>
          <Option value="BwTransfer">
            {i18n["fundflow.tradeType.BwTransfer"]}
          </Option>
          <Option value="BwWithdraw">
            {i18n["fundflow.tradeType.BwWithdraw"]}
          </Option>
        </Select>
        <RangePicker
          allowClear={false}
          ranges={{
            [i18n["datepicker.range.today"]]: [moment(), moment()],
            [i18n["datepicker.range.thismonth"]]: [
              moment().startOf("month"),
              moment().endOf("month")
            ]
          }}
          format="YYYY/MM/DD"
          onChange={this.onOk}
          defaultValue={[moment(this.params.from), moment(this.params.to)]}
        />
        <Table
          className="table"
          dataSource={data}
          columns={this.columns}
          pagination={false}
        />
        <Pagination
          className="pagination"
          showQuickJumper
          defaultCurrent={1}
          total={this.params.total}
          onChange={this.onChange}
        />
      </div>
    );
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
      list: fund.tradingList
    };
  },
  { ...actions, setHeaderTitle }
)(Task);
