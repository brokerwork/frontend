import PropTypes from 'prop-types';
import cs from './Root.less';
import getQueryString from 'utils/queryString';
import { SEARCH_TYPE } from '../../path/List/constant';
import i18n from 'utils/i18n';
import setPageTitle from 'utils/setPageTitle';
import { MENUS } from 'utils/headerMenus';
import { Layout } from 'components/v2/PageWraper';
export default class Root extends PureComponent {
  state = {
    loaded: false
  };

  getChildContext() {
    return {
      reload: this.load
    };
  }

  componentDidMount() {
    const {
      getServerList,
      updateServer,
      updateSearchOption,
      updateFilterUser,
      location: { search },
      needShowNotice,
      showBannerNotice,
      noticeDone,
      brandInfo
    } = this.props;
    const promises = [];

    if (brandInfo.siteName) {
      const moduleName = MENUS.find(item => item.id === 'accountmgmt').label;

      setPageTitle(`${brandInfo.siteName} - ${moduleName}`);
    }

    getServerList().then(({ result, data }) => {
      if (result && data.length !== 0) {
        const serverList = _.cloneDeep(data);
        let currentServer = serverList[0];

        if (search) {
          const searchInfo = getQueryString(search);
          const serverId = searchInfo.get('serverId');
          const ownId = searchInfo.get('userId');

          if (serverId) {
            const target = serverList.find(item => item.value === serverId);
            if (target) currentServer = target;
          }
        }

        promises.push(updateServer(currentServer));

        Promise.all(promises).then(() => {
          this.load(() => {
            this.setState({
              loaded: true
            });
          });
        });
      }
    });

    // if (needShowNotice) {
    //   showBannerNotice({
    //     content: (
    //       <div>
    //         <b>{i18n['banner_notice.notice']}</b>{' '}
    //         <span>{i18n['account.banner_notice']}</span>
    //       </div>
    //     ),
    //     onClose: () => {
    //       noticeDone();
    //     }
    //   });
    // }
  }

  componentWillUnmount() {
    const { closeBannerNotice } = this.props;

    closeBannerNotice();
  }

  load = callback => {
    const {
      currentServer,
      getListColumns,
      getFormColumns,
      getAccountRange,
      getOwnerInfoModule,
      getAccountColumns
    } = this.props;
    const isCtrader = currentServer.vendor === 'CTRADER';
    const formName = isCtrader ? 'cbroker' : 'account';

    return Promise.all([
      getOwnerInfoModule(),
      getListColumns(formName, currentServer),
      getFormColumns(formName, currentServer),
      getAccountColumns()
    ]).then(() => {
      if (!isCtrader) {
        getAccountRange(currentServer);
      }
      if (currentServer.vendor && currentServer.vendor.indexOf('CUSTOM') > -1) {
        this.getResources().then(([src]) => {
          if (src.result) if (callback) callback();
        });
      } else {
        this.getResources().then(([src, mtg]) => {
          if (src.result && mtg.result) if (callback) callback();
        });
      }
    });
  };

  getResources = () => {
    const { currentServer, getResources, getMtGroupByRight } = this.props;
    const promiseBox = [getResources(currentServer)];
    // 自定义平台 不调用getMtGroupByRight
    if (currentServer.vendor && currentServer.vendor.indexOf('CUSTOM') < 0) {
      promiseBox.push(getMtGroupByRight(currentServer));
    }
    return Promise.all(promiseBox);
  };

  render() {
    const { children } = this.props;
    const { loaded } = this.state;

    return <Layout>{loaded && children}</Layout>;
  }
}

Root.childContextTypes = {
  reload: PropTypes.func
};
