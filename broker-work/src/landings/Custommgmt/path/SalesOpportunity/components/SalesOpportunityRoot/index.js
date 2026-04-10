import i18n from 'utils/i18n';
import PagePanel from 'components/PagePanel';
import OpportunityList from '../../containers/OpportunityList';
import OpportunityActionsBar from '../../containers/OpportunityActionsBar';
import { MENUS } from 'utils/headerMenus';
import setPageTitle from 'utils/setPageTitle';
import { Layout, Sider, Content, Summary } from 'components/v2/PageWraper';
import Conditions from '../../containers/OpportunityConditions';
import ConditionFilter from 'components/v2/ConditionFilter';

export default class Root extends PureComponent {
  componentDidMount() {
    const { brandInfo } = this.props;

    if (brandInfo.siteName) {
      const moduleName = MENUS.find(item => item.id === 'custommgmt').label;

      setPageTitle(`${brandInfo.siteName} - ${moduleName}`);
    }
  }

  render() {
    const props = this.props;
    return (
      <Conditions>
        {/* <PagePanel.Header>
          {i18n['navigation.customer.sales_opportunity']}
        </PagePanel.Header>
        <PagePanel.Body> */}
        <Summary>
          <OpportunityActionsBar />
        </Summary>
        <Layout direction="horizontal">
          <Sider>
            <ConditionFilter.Panel />
          </Sider>
          <OpportunityList {...props} detailsComponent={this.props.children} />
        </Layout>
        {/* </PagePanel.Body> */}
      </Conditions>
    );
  }
}
