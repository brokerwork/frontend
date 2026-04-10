import i18n from 'utils/i18n';
import PagePanel from 'components/PagePanel';
import ActionsBar from '../../containers/ActionsBar';
import List from '../../containers/List';
import cs from './AgentDepositReportRoot.less';
import setPageTitle from 'utils/setPageTitle';
import { MENUS } from 'utils/headerMenus';
import moment from 'moment';
import { dateTimeFormatStyle } from 'utils/config';

export default class AgentDepositReports extends PureComponent {
  state = {
    refreshTime: moment()
  };
  componentWillUnmount() {
    clearInterval(this.__timer);
  }

  componentDidMount() {
    const { brandInfo } = this.props;

    if (brandInfo.siteName) {
      const moduleName = MENUS.find(item => item.id === 'reportmgmt').label;

      setPageTitle(`${brandInfo.siteName} - ${moduleName}`);
    }
    this.__timer = setInterval(this.refresh, 5 * 60 * 1000);
  }

  refresh = () => {
    const {
      getAgentDepositList,
      updateNeedRefresh,
      accountQueryItem,
      accountQueryValue,
      currentPagination
    } = this.props;
    const { pageNo, pageSize } = currentPagination;

    getAgentDepositList({
      name: accountQueryItem.value === 'name' ? accountQueryValue : '',
      login: accountQueryItem.value === 'login' ? accountQueryValue : '',
      pageNo: pageNo,
      pageSize: pageSize
    }).then(res => {
      if (res.result) {
        if (res.data.list.length === 0) {
          updateNeedRefresh(i18n['report.date_range_type.default_no_results']);
        } else {
          updateNeedRefresh('');
        }

        this.setState({
          refreshTime: moment()
        });
      }
    });
  };

  render() {
    const { location, match, history } = this.props;
    const { refreshTime } = this.state;

    return (
      <PagePanel>
        <PagePanel.Header>
          {i18n['report.agent_deposit.report_name']}
          <div className={cs['header-right']}>
            <a onClick={this.refresh}>
              <i className="fa fa-refresh" />
            </a>
            {i18n['general.data.refresh_time']}
            {refreshTime.format(dateTimeFormatStyle)}
          </div>
        </PagePanel.Header>
        <PagePanel.Body>
          <ActionsBar location={location} history={history} match={match} />
          <List history={history} match={match} location={location} />
        </PagePanel.Body>
      </PagePanel>
    );
  }
}
