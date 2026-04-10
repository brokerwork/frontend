import i18n from 'utils/i18n';
import OutstandActionBar from '../../containers/ActionsBar';
import OutstandingList from '../../containers/List';
import setPageTitle from 'utils/setPageTitle';
import ConditionFilter from 'components/v2/ConditionFilter';
import Conditions from '../../containers/Conditions';
import { Layout, Sider, Summary } from 'components/v2/PageWraper';
import { MENUS } from 'utils/headerMenus';
import cs from './OutStandingReportRoot.less';

export default class OutStandingReport extends PureComponent {
  componentDidMount() {
    const { brandInfo } = this.props;

    if (brandInfo.siteName) {
      const moduleName = MENUS.find(item => item.id === 'reportmgmt').label;

      setPageTitle(`${brandInfo.siteName} - ${moduleName}`);
    }
  }

  render() {
    const props = this.props;
    return (
      <Conditions {...props}>
        <Summary>
          <OutstandActionBar {...props} />
        </Summary>
        <Layout direction="horizontal">
          <Sider>
            <ConditionFilter.Panel />
          </Sider>
          <OutstandingList {...props} />
        </Layout>
      </Conditions>
    );
  }
}
