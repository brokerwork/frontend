import PagePanel from 'components/PagePanel';
import Table from 'components/Table';
import i18n from 'utils/i18n';
import { Popover, Icon } from 'lean-ui';
import PaginationBar from 'components/v2/PaginationBar';
import DateRangePicker from 'landings/Dashboard/components/DateRangePicker';
import Chart from '../Chart';
import cs from 'landings/Dashboard/components/common.less';
import AddToWorkbench from 'landings/Dashboard/containers/AddToWorkbench';
import NoPermissionView from 'components/NoPermissionView';

const addWorkbenceArr = [
  'USER_RANK_NEW_CUSTOMER_PAGE',
  'USER_RANK_NEW_ACCOUNT_PAGE',
  'USER_RANK_NEW_DEPOSIT_PAGE',
  'USER_RANK_NEW_WITHDRAWAL_PAGE',
  'USER_RANK_NEW_DEAL_PAGE',
  'USER_RANK_NEW_PROFIT_PAGE',
  'USER_RANK_NEW_COMMISSION_PAGE',
  'USER_RANK_NEW_NET_DEPOSIT_PAGE',
  'USER_RANK_NEW_DEPOSIT_CUSTOMER_PAGE'
];

export default class Root extends PureComponent {
  state = {
    dataReady: false
  };
  componentDidMount() {
    const {
      initialParams,
      getRankingsData,
      searchParams,
      userRights,
      setDashboardViewRight
    } = this.props;
    const type = 'USER_RANK_PANEL';
    initialParams(type);
    Promise.all([
      getRankingsData({ ...searchParams, type }),
      setDashboardViewRight(userRights)
    ]).then(() => {
      this.setState({
        dataReady: true
      });
    });
  }
  componentWillUnmount() {
    this.props.resetData();
  }
  onPageChange = v => {
    const { modifyTablePagination, paginationInfo } = this.props;
    modifyTablePagination({ ...paginationInfo, ...v });
  };

  modifyParams = (field, value) => {
    const { modifyParams, searchParams, getRankingsData } = this.props;
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
  };
  render() {
    const {
      data: { labels = [], data = [] },
      match: { url },
      searchParams,
      modifyParams,
      paginationInfo,
      dashboardViewRight
    } = this.props;
    const { dataReady } = this.state;
    const { pageNo, pageSize } = paginationInfo;
    const pageStart = (pageNo - 1) * pageSize;
    const pageEnd = pageStart + pageSize;
    const tableData = data.slice(pageStart, pageEnd);
    const tableLabels = labels.slice(pageStart, pageEnd);

    const tipsConfig = [
      {
        text: i18n['dashboard.tips.staff_performance.new_customer'],
        show: dashboardViewRight['checkCustomer']
      },
      {
        text: i18n['dashboard.tips.staff_performance.new_account'],
        show: dashboardViewRight['accountTrade']
      },
      {
        text: i18n['dashboard.tips.staff_performance.commission'],
        show: dashboardViewRight['commission']
      }
    ];

    if (
      !dashboardViewRight['checkCustomer'] &&
      !dashboardViewRight['accountTrade'] &&
      !dashboardViewRight['commission']
    )
      return <NoPermissionView />;

    return (
      <div className={cs['container']}>
        <div className={cs['navigation-bar']}>
          <div className={cs['navigation-left']}>
            <span className={cs['panel-title']}>
              {i18n['dashboard.navigator.achievements.staff_performance']}
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
                <Icon
                  icon="question"
                  className={`${cs['icon']} main-color`}
                />
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
            {i18n['dashboard.title.staff_performance_top']}
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
        <PagePanel className={cs['table-panel']}>
          <PagePanel.Header>
            {i18n['dashboard.title.staff_performance']}
          </PagePanel.Header>
          <PagePanel.Body className={cs['table-panel-body']}>
            <Table>
              <Table.Header>
                <th>{i18n['dashboard.table_header.staff']}</th>
                {dashboardViewRight['checkCustomer'] && (
                  <th>
                    {i18n['dashboard.table_header.new_customer_proportion']}
                  </th>
                )}
                {dashboardViewRight['accountTrade'] && (
                  <th>{i18n['dashboard.table_header.new_account']}</th>
                )}
                {dashboardViewRight['accountTrade'] && (
                  <th>{i18n['dashboard.table_header.deposit']}</th>
                )}
                {dashboardViewRight['accountTrade'] && (
                  <th>{i18n['dashboard.table_header.withdraw']}</th>
                )}
                {dashboardViewRight['accountTrade'] && (
                  <th>{i18n['dashboard.table_header.net_deposit']}</th>
                )}
                {dashboardViewRight['accountTrade'] && (
                  <th>{i18n['dashboard.table_header.deal']}</th>
                )}
                {dashboardViewRight['accountTrade'] && (
                  <th>{i18n['dashboard.table_header.profit']}</th>
                )}
                {dashboardViewRight['commission'] && (
                  <th>{i18n['dashboard.table_header.commission']}</th>
                )}
                {dashboardViewRight['checkCustomer'] && (
                  <th>
                    {
                      i18n[
                        'dashboard.data_type.USER_RANK_NEW_DEPOSIT_CUSTOMER_PAGE'
                      ]
                    }
                  </th>
                )}
              </Table.Header>
              <Table.Body>
                {tableData.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{tableLabels[index]}</td>
                      {dashboardViewRight['checkCustomer'] && (
                        <td>{item.USER_RANK_NEW_CUSTOMER_PAGE}</td>
                      )}
                      {dashboardViewRight['accountTrade'] && (
                        <td>{item.USER_RANK_NEW_ACCOUNT_PAGE}</td>
                      )}
                      {dashboardViewRight['accountTrade'] && (
                        <td>{item.USER_RANK_NEW_DEPOSIT_PAGE}</td>
                      )}
                      {dashboardViewRight['accountTrade'] && (
                        <td>{item.USER_RANK_NEW_WITHDRAWAL_PAGE}</td>
                      )}
                      {dashboardViewRight['accountTrade'] && (
                        <td>{item.USER_RANK_NEW_NET_DEPOSIT_PAGE}</td>
                      )}
                      {dashboardViewRight['accountTrade'] && (
                        <td>{item.USER_RANK_NEW_DEAL_PAGE}</td>
                      )}
                      {dashboardViewRight['accountTrade'] && (
                        <td>{item.USER_RANK_NEW_PROFIT_PAGE}</td>
                      )}
                      {dashboardViewRight['commission'] && (
                        <td>{item.USER_RANK_NEW_COMMISSION_PAGE}</td>
                      )}
                      {dashboardViewRight['checkCustomer'] && (
                        <td>{item.USER_RANK_NEW_DEPOSIT_CUSTOMER_PAGE}</td>
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
