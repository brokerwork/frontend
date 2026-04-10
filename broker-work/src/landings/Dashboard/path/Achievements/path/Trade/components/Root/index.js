import PagePanel from 'components/PagePanel';
import moment from 'moment';
import { dateFormatStyle } from 'utils/config';
import Table from 'components/Table';
import i18n from 'utils/i18n';
import PaginationBar from 'components/v2/PaginationBar';
import DateRangePicker from 'landings/Dashboard/components/DateRangePicker';
import Chart from '../Chart';
import DepositDistribute from '../DepositDistribute';
import DepositTrend from '../DepositTrend';
import WithdrawalTrend from '../WithdrawalTrend';
import cs from 'landings/Dashboard/components/common.less';
import { Popover, Icon } from 'lean-ui';
import AddToWorkbench from 'landings/Dashboard/containers/AddToWorkbench';
import NoPermissionView from 'components/NoPermissionView';

const addWorkbenceArr = [
  'DEPOSIT_MONEY_TREND',
  'DEPOSIT_CUSTOMER_TREND',
  'WITHDRAWAL_TREND',
  'DEPOSIT_DISTRIBUTE_TREND',
  'NEW_DEAL_PAGE'
];

export default class Root extends PureComponent {
  state = {
    dataReady: false
  };
  componentDidMount() {
    const {
      initialParams,
      getTrendDatas,
      searchParams,
      userRights,
      setDashboardViewRight,
      getDepositDistribute
    } = this.props;
    const type = 'TRADE_PANEL';

    Promise.resolve(setDashboardViewRight(userRights)).then(() => {
      const { dashboardViewRight } = this.props;

      if (
        dashboardViewRight['accountTrade'] ||
        dashboardViewRight['checkCustomer']
      ) {
        initialParams(type);
        Promise.all([
          getTrendDatas({ ...searchParams, type }),
          getDepositDistribute(searchParams)
        ]).then(() => {
          this.setState({
            dataReady: true
          });
        });
      }
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
      getTrendDatas,
      searchParams,
      getDepositDistribute
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

    if (field === 'date') {
      getDepositDistribute(obj);
    }
  };
  render() {
    const {
      data: { labels = [], data = [] },
      match: { url },
      userRights,
      searchParams,
      modifyParams,
      paginationInfo,
      dashboardViewRight,
      depositDistributeData
    } = this.props;
    const { dataReady } = this.state;
    const { timeRange } = searchParams;
    const { pageNo, pageSize } = paginationInfo;
    const pageStart = (pageNo - 1) * pageSize;
    const pageEnd = pageStart + pageSize;
    const tableData = data.slice(pageStart, pageEnd);
    const tableLabels = labels.slice(pageStart, pageEnd);

    // 权限判断
    if (
      !dashboardViewRight['accountTrade'] &&
      !dashboardViewRight['checkCustomer']
    )
      return <NoPermissionView />;

    return (
      <div className={cs['container']}>
        <div className={cs['navigation-bar']}>
          <div className={cs['navigation-left']}>
            <span className={cs['panel-title']}>
              {i18n['dashboard.navigator.achievements.trade']}
            </span>
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
        {dashboardViewRight['accountTrade'] && (
          <PagePanel>
            <PagePanel.Header>
              <div className={cs['chart-title']}>
                {i18n['dashboard.title.trade']}
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
                {dataReady && (
                  <Chart
                    data={data}
                    labels={labels}
                    searchParams={searchParams}
                    modifyParams={modifyParams}
                    rights={dashboardViewRight}
                  />
                )}
              </div>
            </PagePanel.Body>
          </PagePanel>
        )}
        {dashboardViewRight['checkCustomer'] && (
          <div className={cs['wraper']}>
            <PagePanel>
              <PagePanel.Header className={cs['panel-header']}>
                {i18n['dashboard.data_type.NEW_DEPOSIT_CUSTOMER_PAGE']}
                <Popover
                  placement="bottomRight"
                  trigger="click"
                  content={
                    <div className={cs['tips-content']}>
                      {
                        i18n[
                          'dashboard.data_type.NEW_DEPOSIT_CUSTOMER_PAGE.tips'
                        ]
                      }
                    </div>
                  }
                >
                  <Icon
                    icon="question"
                    className={`${cs['icon']} main-color`}
                  />
                </Popover>
              </PagePanel.Header>
              <PagePanel.Body>
                <div className={cs['chart']}>
                  {dataReady && <DepositTrend data={data} labels={labels} />}
                </div>
              </PagePanel.Body>
            </PagePanel>
            <PagePanel>
              <PagePanel.Header className={cs['panel-header']}>
                {i18n['dashboard.data_type.NEW_WITHDRAWAL_CUSTOMER_PAGE']}
                <Popover
                  placement="bottomRight"
                  trigger="click"
                  content={
                    <div className={cs['tips-content']}>
                      {
                        i18n[
                          'dashboard.data_type.NEW_WITHDRAWAL_CUSTOMER_PAGE.tips'
                        ]
                      }
                    </div>
                  }
                >
                  <Icon
                    icon="question"
                    className={`${cs['icon']} main-color`}
                  />
                </Popover>
              </PagePanel.Header>
              <PagePanel.Body>
                <div className={cs['chart']}>
                  {dataReady && <WithdrawalTrend data={data} labels={labels} />}
                </div>
              </PagePanel.Body>
            </PagePanel>
          </div>
        )}
        {dashboardViewRight['checkCustomer'] && (
          <PagePanel>
            <PagePanel.Header className={cs['panel-header']}>
              {i18n['dashboard.chart.deposit_distribute']}
              <Popover
                placement="right"
                trigger="click"
                content={
                  <div className={cs['tips-content']}>
                    {i18n['dashboard.chart.deposit_distribute.tips']}
                  </div>
                }
              >
                <Icon icon="question" className={`${cs['icon']} main-color`} />
              </Popover>
            </PagePanel.Header>
            <PagePanel.Body>
              <div className={cs['chart']}>
                {dataReady && <DepositDistribute {...depositDistributeData} />}
              </div>
            </PagePanel.Body>
          </PagePanel>
        )}
        <PagePanel className={cs['table-panel']}>
          <PagePanel.Header>
            {i18n['dashboard.title.table.trade']}
          </PagePanel.Header>
          <PagePanel.Body className={cs['table-panel-body']}>
            <Table>
              <Table.Header>
                <th>{i18n['dashboard.date']}</th>
                {dashboardViewRight['accountTrade'] && (
                  <th>{i18n['dashboard.data_type.NEW_DEPOSIT_PAGE']}</th>
                )}
                {dashboardViewRight['checkCustomer'] && (
                  <th>
                    {i18n['dashboard.data_type.NEW_DEPOSIT_CUSTOMER_PAGE']}
                  </th>
                )}
                {dashboardViewRight['checkCustomer'] && (
                  <th>
                    {
                      i18n[
                        'dashboard.data_type.NEW_DEPOSIT_CUSTOMER_PAGE_AVERAGE'
                      ]
                    }
                  </th>
                )}
                {dashboardViewRight['accountTrade'] && (
                  <th>{i18n['dashboard.data_type.NEW_WITHDRAWAL_PAGE']}</th>
                )}
                {dashboardViewRight['checkCustomer'] && (
                  <th>
                    {i18n['dashboard.data_type.NEW_WITHDRAWAL_CUSTOMER_PAGE']}
                  </th>
                )}
                {dashboardViewRight['checkCustomer'] && (
                  <th>
                    {
                      i18n[
                        'dashboard.data_type.NEW_WITHDRAWAL_CUSTOMER_PAGE_AVERAGE'
                      ]
                    }
                  </th>
                )}
                {dashboardViewRight['accountTrade'] && (
                  <th>{i18n['dashboard.data_type.NEW_NET_DEPOSIT_PAGE']}</th>
                )}
                {dashboardViewRight['accountTrade'] && (
                  <th>{i18n['dashboard.data_type.NEW_DEAL_PAGE']}</th>
                )}
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
                      {dashboardViewRight['accountTrade'] && (
                        <td>{item.NEW_DEPOSIT_PAGE}</td>
                      )}
                      {dashboardViewRight['checkCustomer'] && (
                        <td>{item.NEW_DEPOSIT_CUSTOMER_PAGE}</td>
                      )}
                      {dashboardViewRight['checkCustomer'] && (
                        <td>{item.NEW_DEPOSIT_CUSTOMER_PAGE_AVERAGE}</td>
                      )}
                      {dashboardViewRight['accountTrade'] && (
                        <td>{item.NEW_WITHDRAWAL_PAGE}</td>
                      )}
                      {dashboardViewRight['checkCustomer'] && (
                        <td>{item.NEW_WITHDRAWAL_CUSTOMER_PAGE}</td>
                      )}
                      {dashboardViewRight['checkCustomer'] && (
                        <td>{item.NEW_WITHDRAWAL_CUSTOMER_PAGE_AVERAGE}</td>
                      )}
                      {dashboardViewRight['accountTrade'] && (
                        <td>{item.NEW_NET_DEPOSIT_PAGE}</td>
                      )}
                      {dashboardViewRight['accountTrade'] && (
                        <td>{item.NEW_DEAL_PAGE}</td>
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
