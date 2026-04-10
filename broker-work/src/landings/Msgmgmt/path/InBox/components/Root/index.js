import ActionBar from '../../containers/ActionBar';
import List from '../../containers/List';
import i18n from 'utils/i18n';
import { Layout, Content, Summary } from 'components/v2/PageWraper';

export default class Root extends PureComponent {
  render() {
    const { push } = this.props.history;
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: '1',
          overflow: 'auto'
        }}
      >
        <Summary>
          <ActionBar />
        </Summary>
        <List push={push} />
      </div>
    );
  }
}
