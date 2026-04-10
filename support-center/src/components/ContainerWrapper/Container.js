import Header from './Header';
import Menu from './Menu';
import Content from './Content';
import cs from './Container.less';
import { Redirect } from 'react-router-dom';
import { getUserInfo } from 'utils/userInfo';
import { getTenantId } from 'utils/tenantInfo';

export default class Container extends PureComponent {
  state = {
    loaded: false
  };

  componentDidMount() {
    const { getTenantInfo, getVersionRights } = this.props;

    getTenantInfo().then(res => {
      const { result, data } = res;
      if (result) {
        const { userId } = getUserInfo();
        const { tenantName, tenantId, env, tenantType } = data;
        this.setState({
          loaded: true
        });
        // gio添加
        if (
          env !== 'prod' ||
          !['normal', 'channel'].includes(tenantType) // 租户类型非 [正常, 渠道] 的不统计
        )
          return;
        gio('init', '969d48a890b3cfd0', {});
        gio('clearUserId');
        gio('setUserId', `${tenantId}_${userId}`);
        gio('people.set', {
          companyId: tenantId,
          companyName: tenantName
        });
        gio('send');
      }
    });

    getVersionRights();
  }

  render() {
    const { children, location } = this.props;
    const { loaded } = this.state;

    if (!loaded) return null;

    return (
      <div className={cs['container']}>
        <Header />
        <Menu location={this.props.location} />
        <Content>
          {location.pathname === '/home' ? (
            <Redirect
              to={{
                pathname: '/home/dashboard',
                search: `?tenantId=${getTenantId()}`
              }}
            />
          ) : (
            undefined
          )}
          {children}
        </Content>
      </div>
    );
  }
}
