import cs from './style.less';
import i18n from 'utils/i18n';
import UserSelector from 'components/v2/UserSelector';
import { Icon } from 'lean-ui';
import Breadcrumb from 'components/v2/Breadcrumb';
import SearchSelect from 'components/v2/SearchSelect';

const routes = [
  {
    path: '/accountmgmt',
    breadcrumbName: i18n['account.title']
  },
  {
    path: '',
    breadcrumbName: i18n['account.detail']
  }
];

export default class AccountDatas extends Component {
  onChangeUser = user => {
    const {
      updateAccountInfoField,
      accountId,
      showTopAlert,
      currentServer,
      onChange
    } = this.props;

    updateAccountInfoField(
      {
        accountId,
        selectedId: user.value || 0,
        field: 'ownership'
      },
      currentServer
    ).then(({ result }) => {
      if (result) {
        showTopAlert({
          content: i18n['general.modify_success'],
          bsStyle: 'success'
        });
        onChange();
      }
    });
  };

  onChangeUserGroup = value => {
    const {
      updateAccountInfoField,
      accountId,
      showTopAlert,
      currentServer,
      onChange
    } = this.props;

    updateAccountInfoField(
      {
        accountId,
        selectedId: value || 0,
        field: 'group'
      },
      currentServer
    ).then(({ result }) => {
      if (result) {
        showTopAlert({
          content: i18n['general.modify_success'],
          bsStyle: 'success'
        });
        onChange();
      }
    });
  };

  getUser = () => {
    const {
      accountInfo: { user }
    } = this.props;
    let result = '';

    if (user) {
      result = {
        label: `${user.name} (${user.roleName}/${user.entityNo})`,
        value: user.id
      };
    }
    return result;
  };

  onUserGroupFilter = text => {
    const {
      resources: { accountGroup = [] }
    } = this.props;
    if (!text) {
      return Promise.resolve({
        result: true,
        data: accountGroup
      });
    }
    const regExp = new RegExp(text, 'gi');
    const matchData = accountGroup.filter(v => v.label.search(regExp) !== -1);
    return Promise.resolve({
      result: true,
      data: matchData || []
    }).then(({ data }) => {
      this.setState({ accountGroupOpts: matchData });
    });
  };

  render() {
    const {
      accountInfo,
      currentServer: { vendor },
      resources,
      filteredRights,
      accountId,
      updateAssetData,
      assetData,
      isSimAccount
    } = this.props;
    const color = accountInfo.profit >= 0 ? '' : 'text-danger';
    const user = this.getUser();
    const isAsset =
      accountInfo.customAccountType === 'Corporate' && accountInfo.isParent;
    const isCustomPlat = /^CUSTOM/gi.test(vendor);
    console.log(isSimAccount, filteredRights, 'debug');
    return (
      <div className={`${cs['account-datas']} account-detail-datas`}>
        {!isSimAccount && isAsset && assetDataReady ? (
          <div className={cs['item']} ref="container">
            <label>{i18n['account.asset_accounts.label']}</label>
            <AssetAccounts
              getPopupContainer={() => findDOMNode(this.refs['container'])}
              currentServer={currentServer}
              size="small"
              className={`${cs['mWidth']}`}
              searchPlaceHolder={
                i18n['account.user_selector.search.placehoder']
              }
              placeholder={i18n['general.default_select']}
              assetData={assetData}
              defaultSelect={assetData.map(d => d.id)}
              accountId={accountId}
              updateAssetData={updateAssetData}
              isParent={accountInfo.isParent}
            />
          </div>
        ) : null}
        {!isSimAccount && filteredRights.show.accountInfo ? (
          <div className={cs['item']}>
            <label>
              {i18n['account.modify_ownership.label.account_ownership']}
            </label>
            <UserSelector
              searchByField
              className={`${cs['mWidth']}`}
              searchPlaceHolder={
                i18n['account.user_selector.search.placehoder']
              }
              placeholder={i18n['general.default_select']}
              value={user.value}
              originValue={user}
              size="small"
              onSelect={this.onChangeUser}
              disabled={!filteredRights.update.ownerShip}
            />
          </div>
        ) : (
          undefined
        )}
        {!isSimAccount && filteredRights.show.accountGroup ? (
          <div className={cs['item']}>
            <label>{i18n['account.modify_group.label.user_group']}</label>
            <SearchSelect
              placeholder={i18n['general.default_select']}
              disabled={!filteredRights.update.accountGroup}
              onSelect={this.onChangeUserGroup}
              value={accountInfo.userGroup}
              size="small"
              data={resources.accountGroup}
              searchPlaceholder={i18n['general.search']}
            />
          </div>
        ) : (
          undefined
        )}
        {filteredRights.privilege.balance
          ? vendor !== 'CTRADER'
            ? [
                <div key="balance" className={cs['item']}>
                  <label>{i18n['account.detail.info.balance']}</label>
                  {accountInfo.balance}
                </div>,
                <div key="credit" className={cs['item']}>
                  {accountInfo.credit !== undefined ? (
                    <label>{i18n['account.detail.info.credit']}</label>
                  ) : (
                    undefined
                  )}
                  {accountInfo.credit !== undefined
                    ? accountInfo.credit
                    : undefined}
                </div>,
                <div key="profit" className={cs['item']}>
                  <label>{i18n['account.detail.info.profit']}</label>
                  <span className={color}>{accountInfo.profit}</span>
                </div>,
                <div key="equity" className={cs['item']}>
                  <label>{i18n['account.detail.info.equity']}</label>
                  {accountInfo.equity}
                </div>,
                <div key="margin" className={cs['item']}>
                  <label>{i18n['account.detail.info.margin']}</label>
                  {accountInfo.margin}
                </div>,
                <div key="marginFree" className={cs['item']}>
                  <label>{i18n['account.detail.info.marginFree']}</label>
                  {accountInfo.marginFree}
                </div>,
                <div key="margin_level" className={cs['item']}>
                  <label>{i18n['account.detail.info.margin_level']}</label>
                  {accountInfo.marginLevel}
                </div>
              ]
            : [
                <div key="balance" className={cs['item']}>
                  <label>{i18n['account.detail.info.balance']}</label>
                  {accountInfo.balance}
                </div>
              ]
          : null}
        {
          <div key="regdate" className={cs['item']}>
            <label>{i18n['account.detail.info.regdate']}</label>
            {accountInfo.regdate}
          </div>
        }
      </div>
    );
  }
}
