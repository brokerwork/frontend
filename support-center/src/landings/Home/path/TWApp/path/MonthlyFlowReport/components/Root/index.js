import ContentWrapper from 'components/ContentWrapper';
import i18n from 'utils/i18n';
import List from '../../containers/List';

export default class Root extends PureComponent {
  componentDidMount() {
    const { getMonthlyList } = this.props;
    getMonthlyList();
  }
  render() {    
    return (
      <ContentWrapper header={i18n['menu.twapp.monthly_flow_report']}>
        <List />
      </ContentWrapper>
    );
  }
}