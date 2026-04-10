import { Link } from 'react-router-dom';
import Tabs from '../../containers/Tabs';
import AccountInfo from '../../containers/AccountInfo';
import cs from './Root.less';
import i18n from 'utils/i18n';
import { Layout, Content, Header } from 'components/v2/PageWraper';
import ActionBar from '../../containers/ActionBar';
import AccountDatas from '../../containers/AccountDatas';
import CustomInfo from '../../containers/CustomInfo';
import { Button } from 'lean-ui';
import getQueryString from 'utils/queryString';
export default class Root extends PureComponent {
  state = {
    loaded: false
  };

  componentDidMount() {
    const {
      match: { params },
      setAccountId,
      getAppropriatenessTestStatus
    } = this.props;

    Promise.all([setAccountId(params.id), getAppropriatenessTestStatus()]).then(
      () => {
        this.getAccountDetail().then(({ result }) => {
          if (result) {
            this.setState({
              loaded: true
            });
          }
        });
      }
    );
  }

  getAccountDetail = () => {
    const { accountId, currentServer, getAccountDetail } = this.props;
    return getAccountDetail(accountId, {
      vendor: location.search.split('&')[0].split('=')[1],
      serverId: location.search.split('&')[1].split('=')[1]
    });
  };

  filterRights = () => {
    const {
      rights,
      accountInfo: { ownerType }
    } = this.props;
    const result = {
      update: {
        accountInfo: rights.update.accountInfo,
        ownerInfo: rights.update.ownerInfo,
        leverage: rights.update.leverage,
        balance: rights.update.balance,
        credit: rights.update.credit,
        password: rights.update.password,
        sensitive: rights.privilege[ownerType].sensitive,
        readOnly: rights.update.readOnly,
        enable: rights.update.enable,
        group: rights.update.group,
        accountGroup: rights.update.accountGroup,
        ownerShip: rights.update.ownerShip
      },
      verify: rights.verify,
      show: {
        accountInfo: rights.privilege[ownerType].accountInfo,
        trade: rights.privilege[ownerType].trade,
        ownerInfo:
          rights.privilege[ownerType].baseInfo ||
          rights.privilege[ownerType].financialInfo ||
          rights.privilege[ownerType].certificatesInfo ||
          rights.privilege[ownerType].classificationInfo ||
          rights.privilege[ownerType].appropriatenessTestInfo,
        baseInfo: rights.privilege[ownerType].baseInfo,
        financialInfo: rights.privilege[ownerType].financialInfo,
        certificatesInfo: rights.privilege[ownerType].certificatesInfo,
        classificationInfo: rights.privilege[ownerType].classificationInfo,
        appropriatenessTestInfo:
          rights.privilege[ownerType].appropriatenessTestInfo,
        leverage: rights.privilege[ownerType].leverage,
        balance: rights.privilege[ownerType].balance,
        credit: rights.privilege[ownerType].credit,
        password: rights.privilege[ownerType].password,
        group: rights.privilege[ownerType].group,
        accountGroup: rights.privilege[ownerType].accountGroup
      },
      privilege: rights.privilege
    };

    return result;
  };

  

  globalSave = () => {
    const { changedFormArray, submit } = this.props;
    changedFormArray.map(form => submit(form));
  };

  globalEmpty = event => {
    event.nativeEvent.stopImmediatePropagation();
    const { globalFormEmpty, changedFormArray, reset } = this.props;
    changedFormArray.map(form => reset(form));
    globalFormEmpty();
    document.body.click();
  };

  promiseArr = [];
  onSingleFormSubmit = (formName, promise) => {
    const { changedFormArray, showTopAlert, globalFormEmpty } = this.props;
    if (this.promiseArr.find(p => p.formName === formName)) {
      return;
    }
    this.promiseArr.push({
      formName,
      promise
    });
    if (this.promiseArr.length === changedFormArray.length) {
      const promiseData = this.promiseArr.map(p => p.promise);
      Promise.all(promiseData).then(res => {
        this.promiseArr = [];
        if (res.every(r => r.result === true)) {
          globalFormEmpty();
          this.getAccountDetail().then(res => {
            if (res.result) {
              showTopAlert({
                bsStyle: 'success',
                content: i18n['general.modify_success']
              });
            }
          });
        }
      });
    }
  };

  render() {
    const { loaded } = this.state;
    const { globalFormChange, changedFormArray, currentServer } = this.props;

    if (!loaded) return null;

    const filteredRights = this.filterRights();
    // 自定义平台 隐藏内容
    const isCustom =
      currentServer.vendor && currentServer.vendor.indexOf('CUSTOM') > -1;
    // 模拟账户
    const searchObj = getQueryString(window.location.search);
    const isSimAccount =
      searchObj.get('isSimAccount') === 'true' ? true : false;
    return (
      <Layout footer>
        {loaded ? (
          <Header className={cs['header']}>
            <ActionBar
              filteredRights={filteredRights}
              onChange={this.getAccountDetail}
              isSimAccount={isSimAccount}
            />
          </Header>
        ) : (
          undefined
        )}
        <Content
          old
          className={`${cs['account-detail']} account-detail ${
            isSimAccount ? cs['sim-account'] : ''
          }`}
        >
          <AccountDatas
            filteredRights={filteredRights}
            onChange={this.getAccountDetail}
            isSimAccount={isSimAccount}
          />
          <div className={cs['wrap']}>
            {!isSimAccount ? (
              <div className={cs['left']}>
                {filteredRights.show.accountInfo && !isCustom ? (
                  <AccountInfo
                    filteredRights={filteredRights}
                    onChange={this.getAccountDetail}
                    onSingleFormSubmit={this.onSingleFormSubmit}
                  />
                ) : (
                  undefined
                )}
                {filteredRights.show.ownerInfo ? (
                  <CustomInfo
                    filteredRights={filteredRights}
                    onSingleFormSubmit={this.onSingleFormSubmit}
                  />
                ) : (
                  undefined
                )}
              </div>
            ) : (
              undefined
            )}
            <div className={cs['right']}>
              <Tabs
                filteredRights={filteredRights}
                onSingleFormSubmit={this.onSingleFormSubmit}
                isSimAccount={isSimAccount}
              />
            </div>
          </div>
          <div
            className={`${cs['g-save']} ${
              changedFormArray && changedFormArray.length
                ? cs['show']
                : cs['hidden']
            }`}
          >
            <Button onClick={this.globalSave} type="primary">
              {i18n['general.save']}
            </Button>
            <Button onClick={this.globalEmpty}>{i18n['general.cancel']}</Button>
          </div>
        </Content>
      </Layout>
    );
  }
}
