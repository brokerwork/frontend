import cs from './index.less';
import i18n from 'utils/i18n';
import ContentCard from '../../../../../../components/ContentCard';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import { Link as AccountItemLink } from '../../../List/AccountItem';
export default class Contacts extends Component {
  render() {
    const {
      customerDetailInfo,
      accountsOfCustomer = [],
      showTopAlert,
      userRights
    } = this.props;
    return (
      <div>
        <ContentCard limit={4}>
          <ContentCard.Header
            title={
              <FormattedMessage
                id="customer.detail.account_title"
                defaultMessage={i18n['customer.detail.account_title']}
                values={{ number: `${accountsOfCustomer.length}` }}
              />
            }
            icon="fa fa-trading"
            iconSolid
          />
          <ContentCard.Body className={cs['staff-list']}>
            {accountsOfCustomer.map((o, index) => {
              return (
                <div
                  className={`${cs['staff-list-oneline']} ${cs['staff-item']}`}
                  key={index}
                >
                  <div className={cs['staff-item-row']}>
                    <span className={cs['staff-item-label']}>
                      {i18n['customer.detail.account_label']}
                    </span>
                    <span>
                      <AccountItemLink
                        data={{ ...o, account: o.accountId }}
                        className={cs['straff-name-label']}
                        disabled={!userRights.ACCOUNT}
                        showTopAlert={showTopAlert}
                      >
                        {o.vendor ? ` (${o.vendor})` : undefined}
                      </AccountItemLink>
                    </span>
                  </div>
                  <div className={cs['staff-item-row']}>
                    <span className={cs['staff-item-label']}>
                      {i18n['customer.detail.leverage']}:
                    </span>
                    <span>{`1:${o.leverage}`}</span>
                    {/* 经过产品确认，暴力处理了 没有去请求leverage列表 因为此处可能有多个serverId,请求过多 */}
                  </div>
                  <div className={cs['staff-item-row']}>
                    <span className={cs['staff-item-label']}>
                      {i18n['customer.detail.balance']}:
                    </span>
                    <span>
                      <span>$ {o.balance}</span>
                    </span>
                  </div>
                  <div className={cs['staff-item-row']}>
                    <span className={cs['staff-item-label']}>
                      {i18n['customer.detail.equity']}:
                    </span>
                    <span>
                      <span>$ {o.equity}</span>
                    </span>
                  </div>
                  <div className={cs['staff-item-row']}>
                    <span className={cs['staff-item-label']}>
                      {i18n['customer.detail.margin']}:
                    </span>
                    <span>
                      <span>$ {o.margin}</span>
                    </span>
                  </div>
                  <div className={cs['staff-item-row']}>
                    <span className={cs['staff-item-label']}>
                      {i18n['customer.detail.marginAvailable']}:
                    </span>
                    <span>
                      <span>$ {o.marginFree}</span>
                    </span>
                  </div>
                  <div className={cs['staff-item-row']}>
                    <span className={cs['staff-item-label']}>
                      {i18n['customer.detail.first_deposit_day']}:
                    </span>
                    <span>
                      {o.firstDepositDay
                        ? moment(o.firstDepositDay).format(
                            'YYYY-MM-DD HH:mm:ss'
                          )
                        : i18n['message.null']}
                    </span>
                  </div>
                  <div className={cs['staff-item-row']}>
                    <span className={cs['staff-item-label']}>
                      {i18n['customer.detail.bind_time']}:
                    </span>
                    <span>
                      {!o.regDate
                        ? i18n['message.null']
                        : moment(o.regDate).format('YYYY-MM-DD HH:mm:ss')}
                    </span>
                  </div>
                  <div className={cs['staff-more']}>
                    <div className={cs['staff-item-row']}>
                      <span className={cs['staff-item-label']}>
                        {i18n['customer.detail.position_count']}
                      </span>
                      <span className={cs['count-badge']}>
                        {o.positionCount}
                      </span>
                    </div>
                    <div className={cs['staff-item-row']}>
                      <span className={cs['staff-item-label']}>
                        {i18n['customer.detail.order_count']}:
                      </span>
                      <span className={cs['count-badge']}>{o.orderCount}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </ContentCard.Body>
        </ContentCard>
      </div>
    );
  }
}
