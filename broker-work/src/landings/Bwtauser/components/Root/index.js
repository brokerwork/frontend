import { Route } from 'react-router-dom';
import List from '../../containers/List';
import ActionBar from '../../containers/ActionBar';
import Detail from '../../containers/Detail';
import Conditions from '../../containers/Conditions';
import i18n from 'utils/i18n';
import { CardPanelWrapper } from 'components/CardPanel';
import { Layout, Sider, Content, Summary } from 'components/v2/PageWraper';
import ConditionFilter from 'components/v2/ConditionFilter';
import setPageTitle from 'utils/setPageTitle';
import { MENUS } from 'utils/headerMenus';

export default class Root extends PureComponent {
  componentDidMount() {
    const { brandInfo } = this.props;
    if (brandInfo.siteName) {
      const moduleName = MENUS.find(item => item.id === 'usermgmt').label;
      setPageTitle(`${brandInfo.siteName} - ${moduleName}`);
    }
  }
  render() {
    const { match, history } = this.props;
    const props = this.props;
    return (
      <Conditions {...props}>
        <Summary>
          <ActionBar history={history} />
        </Summary>
        <Layout direction="horizontal">
          <Sider>
            <ConditionFilter.Panel />
          </Sider>
          <List match={match} history={history} />
          <Route
            path={`${match.url}/:userId`}
            children={props => (
              <CardPanelWrapper appear>
                {props.match && (
                  <Detail match={props.match} history={props.history} />
                )}
              </CardPanelWrapper>
            )}
          />
        </Layout>
      </Conditions>
    );
  }
}
