import i18n from 'utils/i18n';
import ActionsBar from '../../containers/ActionsBar';
import Conditions from '../../containers/Conditions';
import List from '../../containers/List';
import setPageTitle from 'utils/setPageTitle';
import { MENUS } from 'utils/headerMenus';
import { Layout, Summary } from 'components/v2/PageWraper';

export default class Report extends PureComponent {
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
          <ActionsBar {...props} />
        </Summary>
        <Layout direction="horizontal">
          <List {...props} />
        </Layout>
      </Conditions>
    );
  }
}
