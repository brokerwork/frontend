import PageWraper from 'components/PageWraper';
import { Switch, Route } from 'react-router-dom';
import { injectReducer } from 'utils/injectReducer';
import SubPath from './path';
import MyDashboard from './containers/Root';
import { connect } from 'react-redux';
import { MENUS } from 'utils/headerMenus';
import setPageTitle from 'utils/setPageTitle';
import DataUpdateTips from './components/DataUpdateTips';
import Menu from './components/Menu';
import cs from './index.less';
import { Layout, Sider, Content } from 'components/v2/PageWraper';

import * as reducers from './controls/reducers';

injectReducer('dashboard_my_dashboard', reducers);

class Dashbaoard extends Component {
  componentDidMount() {
    const { brandInfo } = this.props;
    if (brandInfo.siteName) {
      const moduleName = MENUS.find(item => item.id === 'dashboard').label;
      setPageTitle(`${brandInfo.siteName} - ${moduleName}`);
    }
  }
  render() {
    const {
      match: { url },
      userRights
    } = this.props;
    return (
      <Layout direction="horizontal">
        <Sider>
          <Menu userRights={userRights} />
        </Sider>
        <Layout footer>
          <Content>
            <DataUpdateTips />
            <div className={cs['content']}>
              <Switch>
                <Route exact path={`${url}`} component={MyDashboard} />
                <SubPath />
              </Switch>
            </div>
          </Content>
        </Layout>
      </Layout>
    );
  }
}
export default connect(
  ({ common: { brandInfo, userRights } }) => ({
    brandInfo,
    userRights
  }),
  {}
)(Dashbaoard);
