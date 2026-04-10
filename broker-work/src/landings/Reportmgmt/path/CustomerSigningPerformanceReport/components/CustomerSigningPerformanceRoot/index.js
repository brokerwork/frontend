import i18n from 'utils/i18n';
import PagePanel from 'components/PagePanel';
import ActionsBar from '../../containers/ActionsBar';
import List from '../../containers/List';
import cs from './CustomerSigningPerformanceRoot.less';
import moment from 'moment';
import { dateTimeFormatStyle } from 'utils/config';
import setPageTitle from 'utils/setPageTitle';
import { MENUS } from 'utils/headerMenus';

export default class CustomerSigningPerformanceRoot extends PureComponent {
  state = {
    refreshTime: moment()
  };
  componentDidMount() {
    const { brandInfo } = this.props;

    if (brandInfo.siteName) {
      const moduleName = MENUS.find(item => item.id === 'reportmgmt').label;

      setPageTitle(`${brandInfo.siteName} - ${moduleName}`);
    }
  }

  refresh = () => {
    const { params, modifyParams, refreshList } = this.props;
    refreshList().then(res => {
      if (res.result) {
        modifyParams(params);
      }
    });
  };

  render() {
    const { location, match, history } = this.props;
    const { refreshTime } = this.state;

    return (
      <PagePanel>
        <PagePanel.Header>
          {i18n['report.customer_signing_performance.report_header']}
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
