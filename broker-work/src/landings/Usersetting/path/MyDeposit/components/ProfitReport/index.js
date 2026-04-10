import i18n from 'utils/i18n';
import ActionsBar from './ActionsBar';
import List from './List';
import cs from './ProfitReport.less';

export default class ProfitReport extends PureComponent {
  render() {
    const { location, match, history } = this.props;

    return (
      <div>
        <ActionsBar
          location={location}
          history={history}
          match={match}
          {...this.props}
        />
        <List
          history={history}
          match={match}
          location={location}
          {...this.props}
        />
      </div>
    );
  }
}
