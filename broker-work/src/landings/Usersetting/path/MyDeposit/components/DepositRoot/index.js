import PagePanel from 'components/PagePanel';
import { Tabs, Tab, Panel } from 'react-bootstrap';
import i18n from 'utils/i18n';
import cs from './Root.less';
import Form from 'components/Form';
import setPageTitle from 'utils/setPageTitle';
import getQueryString from 'utils/queryString';
import StatisticalReport from '../../containers/StatisticalReport';
import ProfitReport from '../../containers/ProfitReport';

export default class DepositRoot extends PureComponent {
  componentDidMount() {
    const {
      brandInfo,
      getDepositByUserId,
      userInfo,
      location,
      match,
      history
    } = this.props;
    const { params } = match;
    if (brandInfo.siteName) {
      setPageTitle(
        `${brandInfo.siteName} - ${i18n[
          'navigation.user_tools.agent_deposit_detail'
        ]}`
      );
    }
    const userId = params.userId === 'NA' ? userInfo.id : params.userId;
    this.setState({ userId: userId });
    Promise.resolve(getDepositByUserId(userId)).then(() => {
      this.setState({ userId: userId });
    });
  }
  state = {
    activeKey: 1,
    userId: ''
  };

  componentWillReceiveProps(nextProps) {
    const nextMatch = nextProps.match;
    const newId = nextMatch.params.userId;
    const { getDepositByUserId, userInfo } = this.props;
    if (newId && newId !== this.props.match.params.userId) {
      const userId = newId === 'NA' ? userInfo.id : newId.userId;
      this.setState({ userId: userId });
      setTimeout(() => {
        getDepositByUserId(userId);
      }, 0);
    }
  }
  render() {
    const { activeKey, userId } = this.state;
    const depositDetail = this.props.depositDetail || {};
    const color =
      parseFloat(depositDetail.balance || 0) +
        parseFloat(depositDetail.positionProfit || 0) >
      depositDetail.marginWarn
        ? 'safe'
        : 'drange';
    return (
      <PagePanel>
        <PagePanel.Header>
          {i18n['settings.agent_detail.header']}
        </PagePanel.Header>
        <PagePanel.Body className={cs['body']}>
          <Form className={cs['top-content']}>
            <Form.Item col={2}>
              <Form.Label className={cs['label']}>
                {i18n['report.agent_deposit_header.login']}：
              </Form.Label>
              <div className={cs['agent-detail-content']}>
                {depositDetail.login || ''}
              </div>
            </Form.Item>
            <Form.Item col={2}>
              <Form.Label className={cs['label']}>
                {i18n['report.agent_deposit_header.accountNum']}：
              </Form.Label>
              <div className={cs['agent-detail-content']}>
                {depositDetail.accountNum || 0}
              </div>
            </Form.Item>
            <Form.Item col={2}>
              <Form.Label className={cs['label']}>
                {i18n['report.agent_deposit.deposit_account_balance']}：
              </Form.Label>
              <div className={cs['agent-detail-content']}>
                {depositDetail.balance || 0} USD
              </div>
            </Form.Item>
            <Form.Item col={2}>
              <Form.Label className={cs['label']}>
                {i18n['report.agent_deposit.deposit_float_balance']}：
              </Form.Label>
              <div className={`${cs['agent-detail-content']} ${cs[color]} `}>
                {(parseFloat(depositDetail.balance || 0) -
                  parseFloat(depositDetail.positionProfit || 0)
                ).toFixed(2)}{' '}
                USD
              </div>
            </Form.Item>
            <Form.Item col={2}>
              <Form.Label className={cs['label']}>
                {i18n['report.agent_deposit_header.marginWarn']}：
              </Form.Label>
              <div className={cs['agent-detail-content']}>
                {depositDetail.warnMode === 'PERCENT'
                  ? `${(parseFloat(depositDetail.accountTotalBalance) *
                      parseFloat(depositDetail.marginWarnPercent / 100)
                    ).toFixed(2) ||
                      0}  USD (${depositDetail.marginWarnPercent}％)`
                  : `${depositDetail.marginWarn || 0} USD`}
              </div>
            </Form.Item>
            <Form.Item col={2}>
              <Form.Label className={cs['label']}>
                {i18n['report.agent_deposit_header.account_total_balance']}：
              </Form.Label>
              <div className={cs['agent-detail-content']}>
                {(depositDetail.accountTotalBalance &&
                  depositDetail.accountTotalBalance.toFixed(2)) ||
                  0}{' '}
                USD
              </div>
            </Form.Item>
            <Form.Item col={2}>
              <Form.Label className={cs['label']}>
                {i18n['report.agent_deposit.position_order']}：
              </Form.Label>
              <div className={cs['agent-detail-content']}>
                {depositDetail.positionNum || 0}
                {i18n['report.agent_deposit.per_order']}
              </div>
            </Form.Item>
          </Form>
          <Tabs
            activeKey={activeKey}
            onSelect={key => {
              this.setState({ activeKey: key });
            }}
            id={'a1'}
          >
            <Tab
              eventKey={1}
              title={i18n['report.agent_deposit.customer_position']}
              className={cs['tab-content']}
            >
              {activeKey === 1 ? (
                <StatisticalReport
                  type="Position"
                  userId={userId}
                  {...this.props}
                />
              ) : (
                undefined
              )}
            </Tab>
            <Tab
              eventKey={2}
              title={i18n['report.agent_deposit.customer_history']}
              className={cs['tab-content']}
            >
              {activeKey === 2 ? (
                <StatisticalReport
                  type="HistoryOrder"
                  userId={userId}
                  {...this.props}
                />
              ) : (
                undefined
              )}
            </Tab>
            <Tab
              eventKey={3}
              title={i18n['report.agent_deposit.profit_detail']}
              className={cs['tab-content']}
            >
              {activeKey === 3 ? (
                <ProfitReport
                  userId={userId}
                  type="ProfitReport"
                  {...this.props}
                />
              ) : (
                undefined
              )}
            </Tab>
          </Tabs>
        </PagePanel.Body>
      </PagePanel>
    );
  }
}
