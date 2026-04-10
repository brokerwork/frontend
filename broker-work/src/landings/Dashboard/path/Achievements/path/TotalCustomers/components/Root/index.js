import PagePanel from 'components/PagePanel';
import Table from 'components/Table';
import i18n from 'utils/i18n';
import PaginationBar from 'components/v2/PaginationBar';
import { Popover, Icon } from 'lean-ui';
import DateRangePicker from 'landings/Dashboard/components/DateRangePicker';
import moment from 'moment';
import { dateFormatStyle } from 'utils/config';
import Chart from '../Chart';
import rcs from './Root.less';
import cs from 'landings/Dashboard/components/common.less';
import AddToWorkbench from 'landings/Dashboard/containers/AddToWorkbench';
import NoPermissionView from 'components/NoPermissionView';

const addWorkbenceArr = ['TOTAL_CUSTOMER_PAGE', 'TOTAL_ACCOUNT_PAGE'];

export default class Root extends PureComponent {
  state = {
    dataReady: false
  };
  componentDidMount() {
    const {
      initialParams,
      getLatestTotalData,
      getTrendDatas,
      searchParams,
      userRights,
      setDashboardViewRight
    } = this.props;
    const type = 'TOTAL_CUSTOMER_PANEL';
    initialParams(type);
    Promise.all([
      getLatestTotalData(type),
      getTrendDatas({ ...searchParams, type }),
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
      data: { labels = [], data = [] },
      match: { url },
      searchParams,
      modifyParams,
      latestTotalData,
      paginationInfo,
      userRights,
      dashboardViewRight
    } = this.props;
    const { dataReady } = this.state;

    if (
      !dashboardViewRight['checkCustomer'] &&
      !dashboardViewRight['checkAccount']
    )
      return <NoPermissionView />;

    const { timeRange } = searchParams;
    const { pageNo, pageSize } = paginationInfo;
    const pageStart = (pageNo - 1) * pageSize;
    const pageEnd = pageStart + pageSize;
    const tableData = data.slice(pageStart, pageEnd);
    const tableLabels = labels.slice(pageStart, pageEnd);
    const tipsConfig = [
      {
        text: i18n['dashboard.tips.total_customer.total_customer'],
        show: dashboardViewRight['checkCustomer']
      },
      {
        text: i18n['dashboard.tips.total_customer.total_customer_has_deposit'],
        show: dashboardViewRight['checkCustomer']
      },
      {
        text: i18n['dashboard.tips.total_customer.total_customer_has_deal'],
        show: dashboardViewRight['checkCustomer']
      },
      {
        text: i18n['dashboard.tips.total_customer.total_account'],
        show: dashboardViewRight['checkAccount']
      },
      {
        text: i18n['dashboard.tips.total_customer.total_account_has_deposit'],
        show: dashboardViewRight['checkAccount']
      },
      {
        text: i18n['dashboard.tips.total_customer.total_account_has_detal'],
        show: dashboardViewRight['checkAccount']
      }
    ];
    return (
      <div className={cs['container']}>
        <div className={cs['navigation-bar']}>
          <div className={cs['navigation-left']}>
            <span className={cs['panel-title']}>
              {i18n['dashboard.navigator.achievements.total_customers']}
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
        </div>
        <PagePanel>
          <PagePanel.Header>
            {i18n['dashboard.title.total_customer']}
          </PagePanel.Header>
          <PagePanel.Body className={rcs['panel-content']}>
            <div className={rcs['panel']}>
              {dashboardViewRight['checkCustomer'] && (
                <div className={rcs['panel-item']}>
                  <div className={rcs['big-panel']}>
                    <i className={`fa fa-group ${rcs['big-panel-icon']}`} />
                    <div className={rcs['big-panel-data']}>
                      <div className={rcs['label']}>
                        {i18n['dashboard.title.total_customer']}
                      </div>
                      <div className={rcs['data']}>
                        {latestTotalData.TOTAL_CUSTOMER_TENANT}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {dashboardViewRight['checkAccount'] && (
                <div className={rcs['panel-item']}>
                  <div className={rcs['big-panel']}>
                    <i
                      className={`fa fa-coin ${rcs['big-panel-icon']} ${
                        rcs['account']
                      }`}
                    />
                    <div className={rcs['big-panel-data']}>
                      <div className={rcs['label']}>
                        {i18n['dashboard.title.total_account']}
                      </div>
                      <div className={rcs['data']}>
                        {latestTotalData.TOTAL_ACCOUNT_TENANT}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className={rcs['panel']}>
              {dashboardViewRight['checkCustomer'] && (
                <div className={rcs['panel-item']}>
                  <div className={`${rcs['panel-item']} ${rcs['small-item']}`}>
                    {i18n['dashboard.has_deposit_customer']}:{' '}
                    {latestTotalData.TOTAL_CUSTOMER_TENANT_HAS_DEPOSIT}
                  </div>
                  <div className={`${rcs['panel-item']} ${rcs['small-item']}`}>
                    {i18n['dashboard.has_deal_customer']}:{' '}
                    {latestTotalData.TOTAL_CUSTOMER_TENANT_HAS_DEAL}
                  </div>
                </div>
              )}
              {dashboardViewRight['checkAccount'] && (
                <div className={rcs['panel-item']}>
                  <div className={`${rcs['panel-item']} ${rcs['small-item']}`}>
                    {i18n['dashboard.has_deposit_account']}:{' '}
                    {latestTotalData.TOTAL_ACCOUNT_TENANT_HAS_DEPOSIT}
                  </div>
                  <div className={`${rcs['panel-item']} ${rcs['small-item']}`}>
                    {i18n['dashboard.has_deal_account']}:{' '}
                    {latestTotalData.TOTAL_ACCOUNT_TENANT_HAS_DEAL}
                  </div>
                </div>
              )}
            </div>
          </PagePanel.Body>
        </PagePanel>
        <div className={cs['navigation-bar']} style={{ marginTop: '15px' }}>
          <div className={cs['navigation-left']}>
            <div />
          </div>
          <AddToWorkbench options={addWorkbenceArr} defaultVal={[]} />
          <DateRangePicker
            align="right"
            className={cs['datepicker']}
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
              {i18n['dashboard.title.total_customer_tend']}
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
                  rights={dashboardViewRight}
                  modifyParams={modifyParams}
                />
              )}
            </div>
          </PagePanel.Body>
        </PagePanel>
        <PagePanel className={cs['panel-margin']}>
          <PagePanel.Header>
            {i18n['dashboard.title.table.new_cutstomer']}
          </PagePanel.Header>
          <PagePanel.Body>
            <Table>
              <Table.Header>
                <th>{i18n['dashboard.table_header.date']}</th>
                {dashboardViewRight['checkCustomer'] && (
                  <th>{i18n['dashboard.table_header.total_customer']}</th>
                )}
                {dashboardViewRight['checkCustomer'] && (
                  <th>
                    {i18n['dashboard.table_header.total_customer_has_deposit']}
                  </th>
                )}
                {dashboardViewRight['checkCustomer'] && (
                  <th>
                    {i18n['dashboard.table_header.total_customer_has_deal']}
                  </th>
                )}
                {dashboardViewRight['checkAccount'] && (
                  <th>{i18n['dashboard.table_header.total_account']}</th>
                )}
                {dashboardViewRight['checkAccount'] && (
                  <th>
                    {i18n['dashboard.table_header.total_account_has_deposit']}
                  </th>
                )}
                {dashboardViewRight['checkAccount'] && (
                  <th>
                    {i18n['dashboard.table_header.total_account_has_deal']}
                  </th>
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
                      {dashboardViewRight['checkCustomer'] && (
                        <td>{item.TOTAL_CUSTOMER_PAGE}</td>
                      )}
                      {dashboardViewRight['checkCustomer'] && (
                        <td>{item.TOTAL_CUSTOMER_HAS_DEPOSIT_PAGE}</td>
                      )}
                      {dashboardViewRight['checkCustomer'] && (
                        <td>{item.TOTAL_CUSTOMER_HAS_DEAL_PAGE}</td>
                      )}
                      {dashboardViewRight['checkAccount'] && (
                        <td>{item.TOTAL_ACCOUNT_PAGE}</td>
                      )}
                      {dashboardViewRight['checkAccount'] && (
                        <td>{item.TOTAL_ACCOUNT_HAS_DEPOSIT_PAGE}</td>
                      )}
                      {dashboardViewRight['checkAccount'] && (
                        <td>{item.TOTAL_ACCOUNT_HAS_DEAL_PAGE}</td>
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
