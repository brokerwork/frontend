import ActionBar from '../../containers/ActionBar';
import List from '../../containers/List';
import PagePanel from 'components/PagePanel';
import getQueryString from 'utils/queryString';
import i18n from 'utils/i18n';
import cs from './index.less';
import moment from 'moment';
import { dateTimeFormatStyle } from 'utils/config';

export default class Root extends PureComponent {
  state = {
    refreshTime: moment()
  };
  refreshReports = () => {
    const { params, getRefreshReports } = this.props;
    getRefreshReports(params).then(res => {
      this.setState({
        refreshTime: moment()
      });
    });
  };
  componentDidMount() {
    const { params, location, modifyParams, getReports } = this.props;
    const query = getQueryString(location.search);
    // const customerId = query.get('customerId');
    const customerNo = query.get('customerNo');
    const promise = customerNo
      ? [
          modifyParams(
            {
              fuzzyItem: 'CustomerId', //customerId 表示customerNo
              fuzzyVal: customerNo
            },
            params
          )
        ]
      : [];
    Promise.all(promise).then(res => {
      const { params: newProps } = this.props;
      getReports(newProps);
    });
  }
  render() {
    const { refreshTime } = this.state;
    return (
      <PagePanel>
        <PagePanel.Header>
          {i18n['report.payment.report_name']}
          <div className={cs['header-right']}>
            <a onClick={this.refreshReports}>
              <i className="fa fa-refresh" />
            </a>
            {i18n['general.data.refresh_time']}
            {refreshTime.format(dateTimeFormatStyle)}
          </div>
        </PagePanel.Header>
        <PagePanel.Body>
          <ActionBar />
          <List />
        </PagePanel.Body>
      </PagePanel>
    );
  }
}
