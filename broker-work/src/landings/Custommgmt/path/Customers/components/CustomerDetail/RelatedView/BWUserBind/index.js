import cs from './index.less';
import i18n from 'utils/i18n';
import ContentCard from '../../../../../../components/ContentCard';
import { FormattedMessage } from 'react-intl';
import { Button, Tooltip } from 'lean-ui';
import moment from 'moment';
import Modal from 'components/Modal';
import Tips from 'components/Tips';
import AddUserAndBind from '../../../../../AddUserAndBind';

export default class BWUserBind extends Component {
  state = {
    isBwUserAddBindingModalShow: false
  };

  hideBwUserAddBindingModal = () => {
    this.setState({
      isBwUserAddBindingModalShow: false
    });
  };

  showBwUserAddBindingModal = () => {
    this.setState({
      isBwUserAddBindingModalShow: true
    });
  };

  onBindComplete = () => {
    const {
      getCustomerDetail,
      customerDetailInfo: { customerId }
    } = this.props;
    // 更新用户信息
    getCustomerDetail(customerId);
  };
  unBind = () => {
    const {
      customerDetailInfo: { bindUserId, customerId, bindUserName },
      unBindBwUserDirectUserCount,
      getCustomerDetail,
      showTipsModal
    } = this.props;
    showTipsModal({
      content: i18n['customer.detail.unbind.warn'],
      onConfirm: cb => {
        unBindBwUserDirectUserCount({
          customerId,
          userId: bindUserId,
          userName: bindUserName
        }).then(({ result }) => {
          if (result) getCustomerDetail(customerId);
        });
        cb();
      }
    });
  };
  render() {
    const {
      productInfo,
      customerDetailInfo: { enabled, bindUserId, bindUserName },
      customerDetailInfo,
      bwBindUserDirectCount,
      userRights
    } = this.props;
    const { isBwUserAddBindingModalShow } = this.state;
    return (
      <div>
        {productInfo ? (
          bindUserId && bindUserName ? (
            <ContentCard>
              <ContentCard.Header
                icon="fa fa-brokerwork-customer"
                iconColor="#ff665c"
              >
                <ContentCard.Title>
                  {i18n['customer.detail.bw_user_binded_title']}
                  <Tooltip
                    className={cs['owner-state-icon']}
                    trigger="hover"
                    placement="right"
                    title={
                      <div className={cs['ques-content']}>
                        {i18n['customer.bw_owner.tips']}
                      </div>
                    }
                  >
                    <i className="fa fa-question-circle" />
                  </Tooltip>
                </ContentCard.Title>
                <Button type="primary" onClick={this.unBind}>
                  {i18n['customer.detail.unbind']}
                </Button>
              </ContentCard.Header>
              <ContentCard.Body className={cs['staff-list']}>
                <div
                  className={`${cs['staff-list-static']} ${
                    cs['staff-list-oneline']
                  } ${cs['staff-item']}`}
                >
                  <div className={cs['staff-item-row']}>
                    <span className={cs['staff-item-label']}>
                      {i18n['customer.detail.user_name_label']}
                    </span>
                    {userRights['USER'] && userRights['BW_USER'] ? (
                      <a target="_blank" href={'/usermgmt/' + bindUserId}>
                        {bindUserName}
                      </a>
                    ) : (
                      <span>{bindUserName} </span>
                    )}
                  </div>
                  <div className={cs['staff-item-row']}>
                    <span className={cs['staff-item-label']}>
                      {i18n['customer.detail.bw_user_binded.direct_num']}
                    </span>
                    <span>{bwBindUserDirectCount}</span>
                  </div>
                </div>
              </ContentCard.Body>
            </ContentCard>
          ) : (
            <ContentCard>
              <ContentCard.Header icon="trader" iconClassName={cs['broker']}>
                <ContentCard.Title>
                  {i18n['customer.detail.bw_user_unbound_title']}
                  <Tooltip
                    className={cs['owner-state-icon']}
                    trigger="hover"
                    placement="right"
                    title={
                      <div className={cs['ques-content']}>
                        {i18n['customer.bw_owner.tips']}
                      </div>
                    }
                  >
                    <i className="fa fa-question-circle" />
                  </Tooltip>
                </ContentCard.Title>
                <ContentCard.Tools>
                  {enabled ? (
                    <Button
                      className={cs['add-button']}
                      onClick={this.showBwUserAddBindingModal}
                    >
                      {i18n['customer.detail.binding_btn']}
                    </Button>
                  ) : (
                    undefined
                  )}
                </ContentCard.Tools>
              </ContentCard.Header>
            </ContentCard>
          )
        ) : (
          undefined
        )}
        <AddUserAndBind
          isShow={isBwUserAddBindingModalShow}
          onHide={this.hideBwUserAddBindingModal}
          customerInfo={customerDetailInfo}
          onBindComplete={this.onBindComplete}
          header={i18n['customer.detail.bw_user_binding_card']}
        />
      </div>
    );
  }
}
