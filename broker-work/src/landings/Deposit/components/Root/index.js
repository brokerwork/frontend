import PagePanel from 'components/PagePanel';
import List from '../../containers/List';
import i18n from 'utils/i18n';

export default class Root extends PureComponent {
  componentDidMount() {
    const { getDepositList } = this.props;

    getDepositList();
  }

  render() {
    return (
      <PagePanel>
        <PagePanel.Header>
          {i18n['account.batch_deposit.record']}
        </PagePanel.Header>
        <PagePanel.Body>
          <List />
        </PagePanel.Body>
      </PagePanel>
    );
  }
}
