import PagePanel from 'components/PagePanel';
import Table from 'components/Table';
import i18n from 'utils/i18n';
import PaginationBar from 'components/v2/PaginationBar';
import moment from 'moment';
import { dateFormatStyle } from 'utils/config';
import DateRangePicker from 'landings/Dashboard/components/DateRangePicker';
import Chart from '../Chart';
import cs from 'landings/Dashboard/components/common.less';
import AddToWorkbench from 'landings/Dashboard/containers/AddToWorkbench';
import NoPermissionView from 'components/NoPermissionView';
import { Popover, Icon } from 'lean-ui';
const addWorkbenceArr = ['COMMISSION_PANEL'];

export default class Root extends PureComponent {
  state = {
    dataReady: false
  };
  componentDidMount() {
    const {
      initialParams,
      getTrendDatas,
      searchParams,
      setDashboardViewRight,
      userRights
    } = this.props;
    const type = 'COMMISSION_PANEL';
    initialParams(type);
    Promise.all([
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
      userRights,
      searchParams,
      modifyParams,
      paginationInfo,
      dashboardViewRight
    } = this.props;
    const { dataReady } = this.state;
    const { timeRange } = searchParams;
    const { pageNo, pageSize } = paginationInfo;
    const pageStart = (pageNo - 1) * pageSize;
    const pageEnd = pageStart + pageSize;
    const tableData = data.slice(pageStart, pageEnd);
    const tableLabels = labels.slice(pageStart, pageEnd);
    const tipsConfig = [
      {
        text: i18n['dashboard.tips.commission'],
        show: dashboardViewRight['commission']
      }
    ];

    if (!dashboardViewRight['commission']) return <NoPermissionView />;

    return (
      <div className={cs['container']}>
        <div className={cs['navigation-bar']}>
          <div className={cs['navigation-left']}>
            <span className={cs['panel-title']}>
              {i18n['dashboard.navigator.achievements.commission']}
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
              {i18n['dashboard.title.commission']}
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
                />
              )}
            </div>
          </PagePanel.Body>
        </PagePanel>
        <PagePanel className={cs['table-panel']}>
          <PagePanel.Header>
            {i18n['dashboard.title.table.commission']}
          </PagePanel.Header>
          <PagePanel.Body className={cs['table-panel-body']}>
            <Table>
              <Table.Header>
                <th>{i18n['dashboard.table_header.date']}</th>
                <th>{i18n['dashboard.table_header.new_commission']}</th>
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
                      <td>{item.COMMISSION_PANEL}</td>
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
