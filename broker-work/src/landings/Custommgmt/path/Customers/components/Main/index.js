import i18n from 'utils/i18n';
import List from '../../containers/List';
import ActionsBar from '../../containers/ActionsBar';
import Conditions from '../../containers/Conditions';
import PagePanel from 'components/PagePanel';
import { Layout, Sider, Content, Summary } from 'components/v2/PageWraper';
import ConditionFilter from 'components/v2/ConditionFilter';
export default class Main extends Component {
  render() {
    const props = this.props;
    return (
      <Conditions {...props}>
        <Summary>
          <ActionsBar {...props} />
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
