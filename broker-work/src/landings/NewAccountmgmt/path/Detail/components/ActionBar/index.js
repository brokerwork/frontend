import cs from './style.less';
import i18n from 'utils/i18n';
import UserSelector from 'components/UserSelector';
import { DropdownForCode } from 'components/v2/Dropdown';
import { Icon, Button } from 'lean-ui';
import Breadcrumb from 'components/v2/Breadcrumb';
import Leverage from '../../containers/Leverage';
import Balance from '../../containers/Balance';
import Password from '../../containers/Password';
import Credit from '../../containers/Credit';

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

export default class ActionBar extends PureComponent {
  state = {
    leverage: false,
    balance: false,
    credit: false,
    password: false
  };
  onClick = type => {
    this.setState({
      [type]: !this.state[type]
    });
  };
  render() {
    const {
      accountInfo,
      filteredRights,
      currentServer: { vendor },
      isBlackUser,
      isSimAccount,
      userRights
    } = this.props;
    const { leverage, balance, credit, password } = this.state;
    return (
      <div className={cs['action-bar']}>
        <div className={cs['info']}>
          <Icon className={cs['icon']} fontType="bw" icon="account" />
          <div className={cs['bread']}>
            <div className={cs['blank_list']}>
              <Breadcrumb routes={routes} />
              {isBlackUser && (
                <span className={cs['text']}>
                  （{i18n['account.detail.info.black_list']}）
                </span>
              )}
            </div>
            <div className={cs['detail']}>
              {i18n['account.detail.info.account']}
              {accountInfo.account}
              <span className={cs['currency']}>
                （{i18n['account.detail.info.currency']}
                {accountInfo && accountInfo.currency}）
              </span>
            </div>
          </div>
        </div>
        <div className={cs['options']}>
          <Button.Group className={cs['group']}>
            {!isSimAccount &&
            filteredRights.update['leverage'] &&
            filteredRights.show['leverage'] ? (
              <Button onClick={this.onClick.bind(this, 'leverage')}>
                {i18n['account.edit_account.leverage']}
              </Button>
            ) : (
              undefined
            )}
            {(isSimAccount ? (
              userRights['DEMO_DEPOSIT_WITHDRAW'] &&
              filteredRights.update['balance']
            ) : (
              filteredRights.update['balance']
            )) ? (
              <Button onClick={this.onClick.bind(this, 'balance')}>
                {i18n['account.edit_account.money']}
              </Button>
            ) : (
              undefined
            )}
            {!isSimAccount &&
            ['MT4', 'MT5'].includes(vendor) &&
            filteredRights.update['credit'] ? (
              <Button onClick={this.onClick.bind(this, 'credit')}>
                {i18n['account.edit_account.credit']}
              </Button>
            ) : (
              undefined
            )}
          </Button.Group>
          {(isSimAccount ? (
            userRights['DEMO_RESET_PASSWORD'] &&
            filteredRights.update['password']
          ) : (
            filteredRights.update['password']
          )) ? (
            <Button onClick={this.onClick.bind(this, 'password')}>
              {i18n['account.edit_account.reset_password']}
            </Button>
          ) : (
            undefined
          )}
        </div>
        <Leverage
          visible={leverage}
          filteredRights={filteredRights}
          onClose={this.onClick.bind(this, 'leverage')}
        />
        <Balance
          visible={balance}
          filteredRights={filteredRights}
          onClose={this.onClick.bind(this, 'balance')}
        />
        <Password
          visible={password}
          filteredRights={filteredRights}
          onClose={this.onClick.bind(this, 'password')}
        />
        <Credit
          visible={credit}
          filteredRights={filteredRights}
          onClose={this.onClick.bind(this, 'credit')}
        />
      </div>
    );
  }
}
