import PagePanel from 'components/PagePanel';
import Table from 'components/Table';
import i18n from 'utils/i18n';
import moment from 'moment';
import { Popover, Icon } from 'lean-ui';
import { dateFormatStyle } from 'utils/config';
import DateRangePicker from 'landings/Dashboard/components/DateRangePicker';
import PaginationBar from 'components/v2/PaginationBar';
import Chart from '../Chart';
import AddToWorkbench from 'landings/Dashboard/containers/AddToWorkbench';
import NoPermissionView from 'components/NoPermissionView';
import cs from 'landings/Dashboard/components/common.less';

const sumDataTypeRight = [
  { type: 'CUSTOMER_SUMMARY_NEW_CUSTOMER', right: 'checkCustomer' },
  { type: 'CUSTOMER_SUMMARY_NEW_ACCOUNT', right: 'checkAccount' },
  { type: 'CUSTOMER_SUMMARY_NEW_CUSTOMER_HAS_DEPOSIT', right: 'checkCustomer' },
  { type: 'CUSTOMER_SUMMARY_NEW_CUSTOMER_HAS_DEAL', right: 'checkCustomer' },
  { type: 'CUSTOMER_SUMMARY_TRANSFER_RATE', right: 'checkCustomer' },
  { type: 'CUSTOMER_SUMMARY_DEPOSIT', right: 'accountTrade' },
  { type: 'CUSTOMER_SUMMARY_WITHDRAWAL', right: 'accountTrade' },
  { type: 'CUSTOMER_SUMMARY_NET_DEPOSIT', right: 'accountTrade' },
  { type: 'CUSTOMER_SUMMARY_DEAL', right: 'accountTrade' },
  { type: 'CUSTOMER_SUMMARY_POSITION', right: 'accountTrade' },
  { type: 'CUSTOMER_SUMMARY_PROFIT', right: 'accountTrade' },
  { type: 'CUSTOMER_SUMMARY_COMMISSION', right: 'commission' },
  { type: 'CUSTOMER_SUMMARY_MAX_TRADE_SYMBOL', right: 'accountTrade' },
  // 客户概况新增指标
  { type: 'CUSTOMER_SUMMARY_REPEAT_DEPOSIT_CUSTOMER', right: 'checkCustomer' },
  { type: 'CUSTOMER_SUMMARY_DORMANT_CUSTOMER', right: 'checkCustomer' },
  { type: 'CUSTOMER_SUMMARY_EQUITY', right: 'accountTrade' },
  // 手续费、利息
  { type: 'CUSTOMER_SUMMARY_CHARGE', right: 'accountTrade' },
  { type: 'CUSTOMER_SUMMARY_SWAP', right: 'accountTrade' }
];

const notActiveCustomersOptions = [
  {
    value: 'ACTIVATE_CUSTOMER_REGISTER_NO_ACCOUNT_PAGE',
    label: i18n['dashboard.table_header.registed_no_account'],
    chart: 'customers'
  },
  {
    value: 'ACTIVATE_CUSTOMER_HAS_ACCOUNT_NO_DEPOSIT_PAGE',
    label: i18n['dashboard.table_header.have_account_no_deposit'],
    chart: 'customers'
  },
  {
    value: 'ACTIVATE_CUSTOMER_HAS_DEPOSIT_NO_DEAL_PAGE',
    label: i18n['dashboard.table_header.deposited_not_deal'],
    chart: 'customers'
  }
];

const addWorkbenceArr = [
  'ACTIVATE_CUSTOMER_REGISTER_NO_ACCOUNT_PAGE',
  'ACTIVATE_CUSTOMER_HAS_ACCOUNT_NO_DEPOSIT_PAGE',
  'ACTIVATE_CUSTOMER_HAS_DEPOSIT_NO_DEAL_PAGE'
];

export default class Root extends PureComponent {
  constructor(props) {
    super(props);
    this.sumDataType = [];
    this.subDataTypeRightObj = {};
    sumDataTypeRight.forEach(item => {
      this.sumDataType.push(item.type);
      this.subDataTypeRightObj[item.type] = item.right;
    });
  }
  state = {
    chartDataReady: false
  };
  componentDidMount() {
    const {
      searchParams,
      getTrendDatas,
      modifyParams,
      getSumData,
      setDashboardViewRight,
      userRights
    } = this.props;

    const type = 'ACTIVATE_CUSTOMER_PANEL';
    const params = {
      ...searchParams,
      type,
      fromTime: moment()
        .subtract(29, 'days')
        .startOf('day'),
      toTime: moment().endOf('day')
    };
    modifyParams(params);
    console.log('userRights', userRights);
    Promise.all([
      getSumData({
        fromTime: params.fromTime,
        toTime: params.toTime,
        type: this.sumDataType
      }),
      getTrendDatas({ ...params, type }),
      setDashboardViewRight(userRights)
    ]).then(() => {
      this.setState({
        chartDataReady: true
      });
    });
  }
  componentWillUnmount() {
    this.props.resetData();
  }
  onPageChange = v => {
    const { modifyTablePagination, paginationInfo } = this.props;
    modifyTablePagination({
      ...paginationInfo,
      ...v
    });
  };

  modifyParams = (field, value) => {
    const {
      modifyParams,
      searchParams,
      getTrendDatas,
      getSumData
    } = this.props;
    let obj;
    if (field === 'date') {
      obj = {
        fromTime: value.start,
        toTime: value.end
      };
    } else {
      obj = { [field]: value };
    }
    const params = {
      ...searchParams,
      ...obj
    };
    modifyParams(params);
    getTrendDatas(params);
    getSumData({
      fromTime: params.fromTime,
      toTime: params.toTime,
      type: this.sumDataType
    });
  };
  subDataFilter = sumData => {
    const { dashboardViewRight } = this.props;
    const data = [];
    this.sumDataType.forEach(item => {
      // 查看是否有该类型的数据返回
      if (!sumData.hasOwnProperty(item)) return;
      // 检测权限
      const right = this.subDataTypeRightObj[item];
      if (!dashboardViewRight[right]) return;
      // 通过以后将item放入列表
      data.push(item);
    });
    return data;
  };
  render() {
    const {
      trendData,
      match: { url },
      userRights,
      searchParams,
      sumData,
      paginationInfo,
      dashboardViewRight
    } = this.props;
    const { timeRange } = searchParams;
    const { chartDataReady } = this.state;
    const { data = [], labels = [] } = trendData;

    // 表格翻页
    const { pageNo, pageSize } = paginationInfo;
    const pageStart = (pageNo - 1) * pageSize;
    const pageEnd = pageStart + pageSize;
    const tableData = data.slice(pageStart, pageEnd);
    const tableLabels = labels.slice(pageStart, pageEnd);

    // panel 展示
    const sumDataKeys = this.subDataFilter(sumData);
    const totalKeysSize = sumDataKeys.length;
    const subDataKeysGroupSize = Math.ceil(sumDataKeys.length / 6);
    const panelElement = [];
    for (let i = 0; i < subDataKeysGroupSize; i++) {
      panelElement.push(
        <ul
          className={`${cs['customersPanel-row']} ${
            totalKeysSize < 6 ? cs['customersPanel-row-autoWidth'] : ''
          }`}
          key={i}
        >
          {sumDataKeys.slice(i * 6, i * 6 + 6).map((item, index) => {
            return (
              <li
                key={index}
                className={index === 5 ? cs['no-border'] : undefined}
              >
                {i18n[`dashboard.data_type.${item}`]}
                <div className={cs['number']}>{sumData[item]}</div>
              </li>
            );
          })}
        </ul>
      );
    }

    const tipsConfig = [
      {
        text: i18n['dashboard.tips.customer_data.customers.tips1'],
        show: dashboardViewRight['checkCustomer']
      },
      { text: i18n['dashboard.tips.customer_data.customers.tips2'], show: true }
    ];

    if (
      !dashboardViewRight['checkCustomer'] &&
      !dashboardViewRight['accountTrade'] &&
      !dashboardViewRight['checkAccount'] &&
      !dashboardViewRight['commission']
    )
      return <NoPermissionView />;

    return (
      <div className={cs['container']}>
        <div className={cs['navigation-bar']}>
          <div className={cs['navigation-left']}>
            <span className={cs['panel-title']}>
              {i18n['dashboard.navigator.customer_data.customers']}
            </span>
            {tipsConfig.length && (
              <Popover
                placement="bottomRight"
                trigger="click"
                content={
                  <ul className={cs['tips-box-content']}>
                    {tipsConfig.map((item, index) => {
                      if (!item.show) return null;
                      return <li key={index}>{item.text}</li>;
                    })}
                  </ul>
                }
              >
                <Icon icon="question" className={`${cs['icon']} main-color`} />
              </Popover>
            )}
          </div>
          <AddToWorkbench options={addWorkbenceArr} defaultVal={[]} />
          {chartDataReady && (
            <DateRangePicker
              align="right"
              onChange={this.modifyParams.bind(this, 'date')}
              defaultDate={{
                start: searchParams.fromTime,
                end: searchParams.toTime
              }}
              defaultLabel={i18n['general.date_range_picker.option.last30days']}
            />
          )}
        </div>
        <PagePanel>
          <PagePanel.Header>
            {i18n['dashboard.navigator.customer_data.customers']}
          </PagePanel.Header>
          <PagePanel.Body>
            <div className={cs['customersPanel']}>{panelElement}</div>
          </PagePanel.Body>
        </PagePanel>
        {dashboardViewRight['checkCustomer'] && (
          <PagePanel className={cs['table-panel']}>
            <PagePanel.Header>
              <div className={cs['chart-title']}>
                {i18n['dashboard.navigator.customer_data.not_active_customers']}
              </div>
              <span
                className={`${cs['chart-range-item']} ${
                  timeRange === 'DAY'
                    ? `${cs['active']} main-color main-color-border`
                    : ''
                }`}
                onClick={this.modifyParams.bind(this, 'timeRange', 'DAY')}
              >
                {i18n['dashboard.time_range.day']}
              </span>
              <span
                className={`${cs['chart-range-item']} ${
                  timeRange === 'WEEK'
                    ? `${cs['active']} main-color main-color-border`
                    : ''
                }`}
                onClick={this.modifyParams.bind(this, 'timeRange', 'WEEK')}
              >
                {i18n['dashboard.time_range.week']}
              </span>
              <span
                className={`${cs['chart-range-item']} ${
                  timeRange === 'MONTH'
                    ? `${cs['active']} main-color main-color-border`
                    : ''
                }`}
                onClick={this.modifyParams.bind(this, 'timeRange', 'MONTH')}
              >
                {i18n['dashboard.time_range.month']}
              </span>
            </PagePanel.Header>
            <PagePanel.Body>
              <div className={cs['chart']}>
                {chartDataReady && (
                  <Chart
                    data={trendData}
                    tabs={notActiveCustomersOptions}
                    activeTab={notActiveCustomersOptions[0].value}
                    isDashboardItem={false}
                  />
                )}
              </div>
            </PagePanel.Body>
          </PagePanel>
        )}

        {dashboardViewRight['checkCustomer'] && (
          <PagePanel className={cs['table-panel']}>
            <PagePanel.Header>
              {i18n['dashboard.title.table.not_active_source']}
            </PagePanel.Header>
            <PagePanel.Body className={cs['table-panel-body']}>
              <Table>
                <Table.Header>
                  <th>{i18n['dashboard.table_header.date']}</th>
                  <th>{`${i18n['dashboard.table_header.registed_no_account']}${
                    i18n['dashboard.table_header.proportion']
                  }`}</th>
                  <th>{`${
                    i18n['dashboard.table_header.have_account_no_deposit']
                  }${i18n['dashboard.table_header.proportion']}`}</th>
                  <th>{`${i18n['dashboard.table_header.deposited_not_deal']}${
                    i18n['dashboard.table_header.proportion']
                  }`}</th>
                </Table.Header>
                <Table.Body>
                  {tableData.map((item, index) => {
                    let dateString = tableLabels[index];
                    let d;
                    switch (searchParams.timeRange) {
                      case 'WEEK':
                        d = moment(dateString)
                          .add(1, 'weeks')
                          .format(dateFormatStyle);
                        break;

                      case 'MONTH':
                        d = moment(dateString)
                          .add(1, 'months')
                          .format(dateFormatStyle);
                        break;
                    }
                    dateString += d ? ` ~ ${d}` : '';
                    return (
                      <tr key={index}>
                        <td>{dateString}</td>
                        <td>{`${
                          item.ACTIVATE_CUSTOMER_REGISTER_NO_ACCOUNT_PAGE
                        } (${(
                          item.ACTIVATE_CUSTOMER_REGISTER_NO_ACCOUNT_PAGE_RATE *
                          100
                        ).toFixed(2)}%)`}</td>
                        <td>{`${
                          item.ACTIVATE_CUSTOMER_HAS_ACCOUNT_NO_DEPOSIT_PAGE
                        } (${(
                          item.ACTIVATE_CUSTOMER_HAS_ACCOUNT_NO_DEPOSIT_PAGE_RATE *
                          100
                        ).toFixed(2)}%)`}</td>
                        <td>{`${
                          item.ACTIVATE_CUSTOMER_HAS_DEPOSIT_NO_DEAL_PAGE
                        } (${(
                          item.ACTIVATE_CUSTOMER_HAS_DEPOSIT_NO_DEAL_PAGE_RATE *
                          100
                        ).toFixed(2)}%)`}</td>
                      </tr>
                    );
                  })}
                </Table.Body>
              </Table>
              <PaginationBar
                {...paginationInfo}
                onPageChange={this.onPageChange}
              />
            </PagePanel.Body>
          </PagePanel>
        )}
      </div>
    );
  }
}
