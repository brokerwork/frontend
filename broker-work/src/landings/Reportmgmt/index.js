import { Route, Switch } from 'react-router-dom';
import StatisticalReport from './path/StatisticalReport';
import CommissionReports from './path/CommissionReport';
import DownloadCenter from './path/DownloadCenter';
// import RetryDeposit from './path/RetryDepositReport';
import OutStandingReport from './path/OutStandingReport';
// import AgentDepositReport from './path/AgentDepositReport';
// import CustomerSigningPerformanceReport from './path/CustomerSigningPerformanceReport';
// import CustomerPaymentReport from './path/CustomerPaymentReport';
import CustomReportEditor from './path/CustomReportEditor';
import CustomReport from './path/CustomReport';
import UserCustomReport from './path/UserCustomReport';
import { injectReducer } from 'utils/injectReducer';
import * as reducers from './reducers';
import HandleTool from './containers/HandleTool';
import { Message } from 'lean-ui';

injectReducer('reportManagement', reducers);

export default class Reportmgmt extends Component {
  componentWillReceiveProps(nextProps) {
    Message.destroy();
  }
  render() {
    const props = this.props;
    return (
      <Switch>
        <Route
          path={`${props.match.url}/reports/:type`}
          component={StatisticalReport}
        />
        <Route
          path={`${props.match.url}/commissionreports/:type`}
          component={CommissionReports}
        />
        <Route
          path={`${props.match.url}/downloadcenter`}
          component={DownloadCenter}
        />
        <Route
          path={`${props.match.url}/outstandingreport`}
          component={OutStandingReport}
        />
        <Route
          path={`${props.match.url}/customReport/create`}
          component={CustomReportEditor}
        />
        <Route
          path={`${props.match.url}/customReport/edit`}
          component={CustomReportEditor}
        />
        <Route
          path={`${props.match.url}/customReport/detail/:reportId`}
          component={CustomReport}
        />
        <Route
          path={`${props.match.url}/customReport/userDetail/:reportId`}
          component={UserCustomReport}
        />
        {/*
        <Route
          path={`${props.match.url}/customReport/:id`}
          component={OutStandingReport}
        />
        <Route
          path={`${props.match.url}/retrydeposit`}
          component={RetryDeposit}
        />
        <Route
          path={`${props.match.url}/agentdepositreport`}
          component={AgentDepositReport}
        />
        <Route
          path={`${props.match.url}/customerSigningPerformanceReport`}
          component={CustomerSigningPerformanceReport}
        />
        <Route
          path={`${props.match.url}/paymentreport`}
          component={CustomerPaymentReport}
        />
        */}
        <Route path={`${props.match.url}/:subPath`} component={HandleTool} />
      </Switch>
    );
  }
}
