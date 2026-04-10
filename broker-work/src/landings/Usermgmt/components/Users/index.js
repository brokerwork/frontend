import i18n from 'utils/i18n';
import PagePanel from 'components/PagePanel';
import ActionBar from '../../containers/ActionBar';
import Conditions from '../../containers/Conditions';
import List from '../../containers/List';
import ConditionFilter from 'components/v2/ConditionFilter';
import { Layout, Sider, Content, Summary } from 'components/v2/PageWraper';
import setPageTitle from 'utils/setPageTitle';
import { MENUS } from 'utils/headerMenus';

export default class Users extends PureComponent {
  componentDidMount() {
    const { brandInfo } = this.props;
    if (brandInfo.siteName) {
      const moduleName = MENUS.find(item => item.id === 'usermgmt').label;
      setPageTitle(`${brandInfo.siteName} - ${moduleName}`);
    }
  }
  render() {
    const props = this.props;
    return (
      <Conditions {...props}>
        <Summary>
          <ActionBar {...props} />
        </Summary>
        <Layout direction="horizontal">
          <Sider>
            <ConditionFilter.Panel />
          </Sider>
          <List {...props} />
        </Layout>
      </Conditions>
    );
  }
}
