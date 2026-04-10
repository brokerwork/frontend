import PagePanel from 'components/PagePanel';
import Table from 'components/Table';
import i18n from 'utils/i18n';
import PaginationBar from 'components/v2/PaginationBar';
import { Popover, Icon } from 'lean-ui';
import DateRangePicker from 'landings/Dashboard/components/DateRangePicker';
import cs from 'landings/Dashboard/components/common.less';
import Chart from '../Chart';
import moment from 'moment';
import AddToWorkbench from 'landings/Dashboard/containers/AddToWorkbench';
import constants from 'landings/Dashboard/components/constants';
import NoPermissionView from 'components/NoPermissionView';

const addWorkbenceArr = [
  'NEW_CUSTOMER_TENANT_ACTIVE_LOGIN_PAGE',
  'NEW_CUSTOMER_TENANT_ACTIVE_DEAL_PAGE'
];

const tabs = addWorkbenceArr.map(tab => ({
  value: tab,
  label: i18n[constants[tab].label]
}));

export default class Root extends PureComponent {
  state = {
    chartDataReady: false
  };
  componentDidMount() {
    const {
      initialParams,
      searchParams,
      modifyParams,
      getTrendDatas,
      setDashboardViewRight,
      userRights
    } = this.props;
    const type = 'NEW_CUSTOMER_ACTIVE_PANEL';
    const params = {
      ...searchParams,
      type,
      fromTime: moment()
        .subtract(6, 'days')
        .startOf('day'),
      toTime: moment().endOf('day')
    };
    modifyParams(params);
    Promise.all([
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
    const { modifyParams, searchParams, getTrendDatas } = this.props;
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
  };
  render() {
    const {
      match: { url },
      paginationInfo,
      searchParams,
      userRights,
      dashboardViewRight,
      trendData: { labels = [], data = [] }
    } = this.props;
    const { timeRange } = searchParams;
    const { chartDataReady } = this.state;
    // 增加日期数据
    let tableData = labels.map((label, index) => ({
      ...data[index],
      date: moment(label).format('YYYY-MM-DD')
    }));
    let tableLabels = labels;
    const { pageNo, pageSize } = paginationInfo;
    const pageStart = (pageNo - 1) * pageSize;
    const pageEnd = pageStart + pageSize;
    tableData = tableData.slice(pageStart, pageEnd);
    tableLabels = tableLabels.slice(pageStart, pageEnd);
    const tipsConfig = [
      {
        text: i18n['dashboard.tips.active_customer.tips1'],
        show: dashboardViewRight['checkCustomer']
      },
      {
        text: i18n['dashboard.tips.active_customer.tips2'],
        show: dashboardViewRight['checkCustomer']
      }
    ];

    if (!dashboardViewRight['checkCustomer']) return <NoPermissionView />;

    return (
      <div className={cs['container']} data-test="container">
        <div className={cs['navigation-bar']}>
          <div className={cs['navigation-left']}>
            <span className={cs['panel-title']}>
              {i18n['dashboard.navigator.customer_data.active_customer']}
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
          <DateRangePicker
            align="right"
            onChange={this.modifyParams.bind(this, 'date')}
            defaultDate={{
              start: searchParams.fromTime,
              end: searchParams.toTime
            }}
            defaultLabel={i18n['general.date_range_picker.option.last7days']}
          />
        </div>
        <PagePanel>
          <PagePanel.Header>
            <div className={cs['chart-title']}>
              {i18n['dashboard.navigator.customer_data.active_customer']}
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
                <Chart tabs={tabs} data={data} labels={labels} />
              )}
            </div>
          </PagePanel.Body>
        </PagePanel>
        <PagePanel className={cs['table-panel']}>
          <PagePanel.Header>
            {i18n['dashboard.navigator.customer_data.active_customer_detail']}
          </PagePanel.Header>
          <PagePanel.Body className={cs['table-panel-body']}>
            <Table>
              <Table.Header>
                <th>{i18n['dashboard.data_type.date']}</th>
                <th>
                  {
                    i18n[
                      'dashboard.data_type.NEW_CUSTOMER_TENANT_ACTIVE_LOGIN_PAGE'
                    ]
                  }
                </th>
                <th>
                  {
                    i18n[
                      'dashboard.data_type.NEW_CUSTOMER_TENANT_ACTIVE_TW_LOGIN_PAGE'
                    ]
                  }
                </th>
                <th>
                  {
                    i18n[
                      'dashboard.data_type.NEW_CUSTOMER_TENANT_ACTIVE_MT4_LOGIN_PAGE'
                    ]
                  }
                </th>
                <th>
                  {
                    i18n[
                      'dashboard.data_type.NEW_CUSTOMER_TENANT_ACTIVE_MT5_LOGIN_PAGE'
                    ]
                  }
                </th>
                <th>
                  {
                    i18n[
                      'dashboard.data_type.NEW_CUSTOMER_TENANT_ACTIVE_CTRADER_LOGIN_PAGE'
                    ]
                  }
                </th>
                <th>
                  {
                    i18n[
                      'dashboard.data_type.NEW_CUSTOMER_TENANT_ACTIVE_DEAL_PAGE'
                    ]
                  }
                </th>
              </Table.Header>
              <Table.Body>
                {tableData.map(item => {
                  return (
                    <tr key={item.date}>
                      <td>{item.date}</td>
                      <td>{item.NEW_CUSTOMER_TENANT_ACTIVE_LOGIN_PAGE}</td>
                      <td>{item.NEW_CUSTOMER_TENANT_ACTIVE_TW_LOGIN_PAGE}</td>
                      <td>{item.NEW_CUSTOMER_TENANT_ACTIVE_MT4_LOGIN_PAGE}</td>
                      <td>{item.NEW_CUSTOMER_TENANT_ACTIVE_MT5_LOGIN_PAGE}</td>
                      <td>
                        {item.NEW_CUSTOMER_TENANT_ACTIVE_CTRADER_LOGIN_PAGE}
                      </td>
                      <td>{item.NEW_CUSTOMER_TENANT_ACTIVE_DEAL_PAGE}</td>
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
      </div>
    );
  }
}
