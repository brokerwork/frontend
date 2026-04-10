import ContentWrapper from 'components/ContentWrapper';
import List from '../../containers/List';
import i18n from 'utils/i18n';

export default class Root extends PureComponent {
  componentDidMount() {
    const { getServerList } = this.props;

    getServerList();
  }

  render() {
    return (
      <ContentWrapper header={i18n['left.menu.connector.setting']}>
        <List />
      </ContentWrapper>
    );
  }
}