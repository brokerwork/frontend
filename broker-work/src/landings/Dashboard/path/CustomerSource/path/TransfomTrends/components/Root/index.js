import PagePanel from 'components/PagePanel';
import Table from 'components/Table';
import i18n from 'utils/i18n';
import DropdownForCode from 'components/v2/DropdownForCode';
import PaginationBar from 'components/v2/PaginationBar';
import { Popover, Icon } from 'lean-ui';
import DateRangePicker from 'landings/Dashboard/components/DateRangePicker';
import cs from 'landings/Dashboard/components/common.less';
import Chart from '../Chart';
import AddToWorkbench from 'landings/Dashboard/containers/AddToWorkbench';
import NoPermissionView from 'components/NoPermissionView';

const trendArr = [
  'NEW_CUSTOMER_PAGE_TREND',
  'NEW_CUSTOMER_HAS_DEPOSIT_PAGE_TREND',
  'NEW_CUSTOMER_HAS_DEAL_PAGE_TREND',
  'NEW_ACCOUNT_PAGE_TREND',
  'NEW_ACCOUNT_HAS_DEPOSIT_PAGE_TREND',
  'NEW_ACCOUNT_HAS_DEAL_PAGE_TREND',
  'NEW_DEPOSIT_PAGE_TREND',
  'NEW_DEAL_PAGE_TREND'
];
const distributeArr = [
  'NEW_CUSTOMER_PAGE_DISTRIBUTE',
  'NEW_CUSTOMER_HAS_DEPOSIT_PAGE_DISTRIBUTE',
  'NEW_CUSTOMER_HAS_DEAL_PAGE_DISTRIBUTE',
  'NEW_ACCOUNT_PAGE_DISTRIBUTE',
  'NEW_ACCOUNT_HAS_DEPOSIT_PAGE_DISTRIBUTE',
  'NEW_ACCOUNT_HAS_DEAL_PAGE_DISTRIBUTE',
  'NEW_DEPOSIT_PAGE_DISTRIBUTE',
  'NEW_DEAL_PAGE_DISTRIBUTE'
];

const defaultSource = {
  value: 'all',
  label: i18n['dashboard.customer_source.all']
};

export default class Root extends PureComponent {
  state = {
    chartDataReady: false,
    showCustomerSourceFilter: true,
    activeFilter: '',
    activeFilterOpts: [],
    activeChartType: 'line'
  };
  componentDidMount() {
    const {
      initialParams,
      getHistoryData,
      getRankingsData,
      searchParams,
      getCustomerSources,
      setDashboardViewRight,
      userRights
    } = this.props;
    const type = 'SOURCE_DISTRIBUTE_PANEL';
    initialParams(type);
    Promise.all([
      getHistoryData({
        ...searchParams,
        type: 'SOURCE_TREND_PANEL'
      }),
      getRankingsData({
        ...searchParams,
        type
      }),
      getCustomerSources(),
      setDashboardViewRight(userRights)
    ]).then(
      ([
        historyDataRes,
        raningsDataRes,
        customerSourceRes,
        dashboardViewRight
      ]) => {
        const state = {
          chartDataReady: true
        };
        if (historyDataRes.result) {
          const activeFilter = Object.keys(historyDataRes.data)[0];
          state['activeFilter'] = activeFilter;
        }
        state['activeFilterOpts'] = [defaultSource];
        if (customerSourceRes.result) {
          state['activeFilterOpts'] = [
            defaultSource,
            ...customerSourceRes.data
          ];
        }
        this.setState(state);
      }
    );
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
      getRankingsData,
      getHistoryData
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
    getRankingsData(params);
    getHistoryData({
      ...params,
      type: 'SOURCE_TREND_PANEL'
    }).then(res => {
      if (!res.result) return;
      if (res.result) {
        const activeFilter = Object.keys(res.data)[0];
        this.setState({ activeFilter });
      }
    });
  };
  onChartViewChange = view => {
    setTimeout(() => {
      this.setState({
        activeChartType: view,
        showCustomerSourceFilter: view === 'line'
      });
    }, 1);
  };
  modifyActiveFilter = v => {
    this.setState({
      activeFilter: v
    });
  };
  render() {
    const {
      historyData,
      rankingsData,
      match: { url },
      paginationInfo,
      searchParams,
      customerSourceOptions,
      userRights,
      dashboardViewRight
    } = this.props;
    const { timeRange } = searchParams;
    const {
      chartDataReady,
      activeFilter,
      showCustomerSourceFilter,
      activeChartType,
      activeFilterOpts
    } = this.state;
    const customerSourceObj = {};
    activeFilterOpts.forEach(item => {
      customerSourceObj[item.value] = item.label;
    });
    let tableData = rankingsData.data || [];
    let tableLabels = rankingsData.labels || [];
    const { pageNo, pageSize } = paginationInfo;
    const pageStart = (pageNo - 1) * pageSize;
    const pageEnd = pageStart + pageSize;
    tableData = tableData.slice(pageStart, pageEnd);
    tableLabels = tableLabels.slice(pageStart, pageEnd);
    const tipsConfig = [
      {
        text:
          i18n['dashboard.tips.tranfom_trends.SOURCE_TREND_NEW_CUSTOMER_PAGE'],
        show: dashboardViewRight['checkCustomer']
      },
      {
        text:
          i18n[
            'dashboard.tips.tranfom_trends.SOURCE_TREND_NEW_CUSTOMER_HAS_DEPOSIT_PAGE'
          ],
        show: dashboardViewRight['checkCustomer']
      },
      {
        text:
          i18n[
            'dashboard.tips.tranfom_trends.SOURCE_TREND_NEW_CUSTOMER_HAS_DEAL_PAGE'
          ],
        show: dashboardViewRight['checkCustomer']
      },
      {
        text:
          i18n['dashboard.tips.tranfom_trends.SOURCE_TREND_NEW_ACCOUNT_PAGE'],
        show: dashboardViewRight['accountTrade']
      },
      {
        text:
          i18n[
            'dashboard.tips.tranfom_trends.SOURCE_TREND_NEW_ACCOUNT_HAS_DEPOSIT_PAGE'
          ],
        show: dashboardViewRight['accountTrade']
      },
      {
        text:
          i18n[
            'dashboard.tips.tranfom_trends.SOURCE_TREND_NEW_ACCOUNT_HAS_DEAL_PAGE'
          ],
        show: dashboardViewRight['accountTrade']
      },
      {
        text:
          i18n['dashboard.tips.tranfom_trends.SOURCE_TREND_NEW_DEPOSIT_PAGE'],
        show: dashboardViewRight['accountTrade']
      },
      {
        text: i18n['dashboard.tips.tranfom_trends.SOURCE_TREND_NEW_DEAL_PAGE'],
        show: dashboardViewRight['accountTrade']
      }
    ];

    if (
      !dashboardViewRight['checkCustomer'] &&
      !dashboardViewRight['accountTrade']
    )
      return <NoPermissionView />;

    return (
      <div className={cs['container']}>
        <div className={cs['navigation-bar']}>
          <div className={cs['navigation-left']}>
            <span className={cs['panel-title']}>
              {i18n['dashboard.navigator.customer_source.transfom_trends']}
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
          <AddToWorkbench
            options={activeChartType === 'line' ? trendArr : distributeArr}
            defaultVal={[]}
          />
          {showCustomerSourceFilter && (
            <DropdownForCode
              data={activeFilterOpts}
              value={activeFilter}
              onChange={this.modifyActiveFilter}
            />
          )}
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
              {i18n['dashboard.navigator.customer_source.transfom_trends']}
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
                  activeChartType={activeChartType}
                  onChartViewChange={this.onChartViewChange}
                  historyData={historyData}
                  rankingsData={rankingsData}
                  activeFilter={activeFilter}
                  rights={dashboardViewRight}
                  customerSourceOptions={activeFilterOpts}
                />
              )}
            </div>
          </PagePanel.Body>
        </PagePanel>
        <PagePanel className={cs['table-panel']}>
          <PagePanel.Header>
            {i18n['dashboard.title.table.source']}
          </PagePanel.Header>
          <PagePanel.Body className={cs['table-panel-body']}>
            <Table>
              <Table.Header>
                <th>{i18n['dashboard.navigator.customer_source']}</th>
                {dashboardViewRight['checkCustomer'] && (
                  <th>
                    {i18n['dashboard.data_type.SOURCE_TREND_NEW_CUSTOMER_PAGE']}
                  </th>
                )}
                {dashboardViewRight['checkCustomer'] && (
                  <th>
                    {
                      i18n[
                        'dashboard.data_type.SOURCE_TREND_NEW_CUSTOMER_HAS_DEPOSIT_PAGE'
                      ]
                    }
                  </th>
                )}
                {dashboardViewRight['checkCustomer'] && (
                  <th>
                    {
                      i18n[
                        'dashboard.data_type.SOURCE_TREND_NEW_CUSTOMER_HAS_DEAL_PAGE'
                      ]
                    }
                  </th>
                )}
                {dashboardViewRight['accountTrade'] && (
                  <th>
                    {i18n['dashboard.data_type.SOURCE_TREND_NEW_ACCOUNT_PAGE']}
                  </th>
                )}
                {dashboardViewRight['accountTrade'] && (
                  <th>
                    {
                      i18n[
                        'dashboard.data_type.SOURCE_TREND_NEW_ACCOUNT_HAS_DEPOSIT_PAGE'
                      ]
                    }
                  </th>
                )}
                {dashboardViewRight['accountTrade'] && (
                  <th>
                    {
                      i18n[
                        'dashboard.data_type.SOURCE_TREND_NEW_ACCOUNT_HAS_DEAL_PAGE'
                      ]
                    }
                  </th>
                )}
                {dashboardViewRight['accountTrade'] && (
                  <th>
                    {i18n['dashboard.data_type.SOURCE_TREND_NEW_DEPOSIT_PAGE']}
                  </th>
                )}
                {dashboardViewRight['accountTrade'] && (
                  <th>
                    {i18n['dashboard.data_type.SOURCE_TREND_NEW_DEAL_PAGE']}
                  </th>
                )}
              </Table.Header>
              <Table.Body>
                {tableLabels.map((item, index) => {
                  const d = tableData[index];
                  return (
                    <tr key={index}>
                      <td>{customerSourceObj[item]}</td>
                      {dashboardViewRight['checkCustomer'] && (
                        <td>{d.SOURCE_DISTRIBUTE_NEW_CUSTOMER_PAGE}</td>
                      )}
                      {dashboardViewRight['checkCustomer'] && (
                        <td>
                          {d.SOURCE_DISTRIBUTE_NEW_CUSTOMER_HAS_DEPOSIT_PAGE}
                        </td>
                      )}
                      {dashboardViewRight['checkCustomer'] && (
                        <td>
                          {d.SOURCE_DISTRIBUTE_NEW_CUSTOMER_HAS_DEAL_PAGE}
                        </td>
                      )}
                      {dashboardViewRight['accountTrade'] && (
                        <td>{d.SOURCE_DISTRIBUTE_NEW_ACCOUNT_PAGE}</td>
                      )}
                      {dashboardViewRight['accountTrade'] && (
                        <td>
                          {d.SOURCE_DISTRIBUTE_NEW_ACCOUNT_HAS_DEPOSIT_PAGE}
                        </td>
                      )}
                      {dashboardViewRight['accountTrade'] && (
                        <td>{d.SOURCE_DISTRIBUTE_NEW_ACCOUNT_HAS_DEAL_PAGE}</td>
                      )}
                      {dashboardViewRight['accountTrade'] && (
                        <td>{d.SOURCE_DISTRIBUTE_NEW_DEPOSIT_PAGE}</td>
                      )}
                      {dashboardViewRight['accountTrade'] && (
                        <td>{d.SOURCE_DISTRIBUTE_NEW_DEAL_PAGE}</td>
                      )}
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
