import { injectIntl } from 'react-intl';
import Contacts from './Contacts';
import Recommends from './Recommends';
import Opportunities from './Opportunities';
import Accounts from './Accounts';
import TWUserBind from './TWUserBind';
import BWUserBind from './BWUserBind';
import Contracts from './Contracts';
import ProductDeploy from './ProductDeploy';
import Bills from './Bills';
import AccountOwner from './AccountOwner';
class RelatedView extends PureComponent {
  render() {
    const {
      tenantType,
      userRights,
      getCustomerDetail,
      customerDetailInfo
    } = this.props;
    return (
      <div>
        {tenantType === 'inner' ? (
          <div>
            <Contacts {...this.props} />
            <Opportunities {...this.props} />
            <Contracts
              onUpdated={getCustomerDetail.bind(
                this,
                customerDetailInfo.customerIdx
              )}
              {...this.props}
            />
            <Bills
              {...this.props}
              onUpdated={getCustomerDetail.bind(
                this,
                customerDetailInfo.customerId
              )}
            />
            <ProductDeploy
              onUpdated={getCustomerDetail.bind(
                this,
                customerDetailInfo.customerId
              )}
              {...this.props}
            />
            <Accounts {...this.props} />
            <AccountOwner {...this.props} />
            <TWUserBind {...this.props} />
          </div>
        ) : (
          <div>
            <Accounts {...this.props} />
            <AccountOwner {...this.props} />
            <TWUserBind {...this.props} />
            {userRights['CUSTOMER_BIND'] ? (
              <BWUserBind {...this.props} />
            ) : (
              undefined
            )}
            <Recommends {...this.props} />
            <Contacts {...this.props} />
            <Opportunities {...this.props} />
          </div>
        )}
      </div>
    );
  }
}

export default injectIntl(RelatedView);
