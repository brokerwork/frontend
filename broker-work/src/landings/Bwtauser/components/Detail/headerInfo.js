import i18n from 'utils/i18n';
import cs from './index.less';
export default class HeaderInfo extends Component {
  render() {
    const { userInfo } = this.props;
    return (
      <div className={cs['sector']}>
        <span className={cs['userRegisterName']}>{userInfo.name} </span>
        <span className={cs['connectedCustomer']}>
          {i18n['tausermgmt.detail.connected_customer']}{' '}
        </span>
        <span className={cs['connectedCustomerNo']}>
          {userInfo.customerNo}{' '}
        </span>
        <span className={cs['connectedCustomerName']}>
          {userInfo.customerName}{' '}
        </span>
        {userInfo.isBlackUser ? (
          <span className={cs['blackList']}>
            {i18n['tausermgmt.black_list']}
          </span>
        ) : null}
      </div>
    );
  }
}
