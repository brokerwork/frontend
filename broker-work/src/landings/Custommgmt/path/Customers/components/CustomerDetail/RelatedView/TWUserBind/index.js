import cs from './index.less';
import i18n from 'utils/i18n';
import ContentCard from '../../../../../../components/ContentCard';
import { FormattedMessage } from 'react-intl';
import { Table, Button, Dialog } from 'lean-ui';
import moment from 'moment';
import Modal from 'components/Modal';

export default class Contacts extends Component {
  state = {
    isModalShow: false,
    isEmailMissingModalShow: false
  };
  openEmailMissingModal = () => {
    this.setState({ isEmailMissingModalShow: true });
  };
  closeEmailMissingModal = () => {
    this.setState({ isEmailMissingModalShow: false });
  };

  onOkClick = () => {
    const {
      sendBindTaEmail,
      customerDetailInfo,
      showTopAlert,
      getCustomerDetail
    } = this.props;
    const customerId = customerDetailInfo.customerId;
    const email = customerDetailInfo.email;
    //preSendBindEmail
    sendBindTaEmail(customerId, email).then(res => {
      showTopAlert({
        content: i18n['customer.detail.send_email_success'],
        bsStyle: 'success'
      });
      getCustomerDetail();
      this.closeModal();
    });
  };

  openModal = () => {
    const { customerDetailInfo } = this.props;
    const email = customerDetailInfo.email;
    if (!email) {
      this.openEmailMissingModal();
      return;
    }
    this.setState({ isModalShow: true });
  };
  closeModal = () => {
    this.setState({ isModalShow: false });
  };

  render() {
    const {
      productInfo,
      customerDetailInfo,
      customerDetailInfo: { enabled, sendTimeOfInvitingEmail },
      twUserOfCustomer: tauser
    } = this.props;
    const { isModalShow, isEmailMissingModalShow } = this.state;
    return (
      <div>
        {productInfo ? (
          Object.keys(tauser).length ? (
            <ContentCard>
              <ContentCard.Header
                icon="trader"
                iconClassName={cs['trader']}
                title={i18n['customer.detail.ta_user_binded_title']}
              />
              <ContentCard.Body className={cs['staff-list']}>
                <div
                  className={`${cs['staff-list-static']} ${
                    cs['staff-list-oneline']
                  } ${cs['staff-item']}`}
                >
                  <div className={cs['staff-item-row']}>
                    <span className={cs['staff-item-label']}>
                      {i18n['customer.detail.name_label']}
                    </span>
                    <span>{tauser.name} </span>
                  </div>
                  <div className={cs['staff-item-row']}>
                    <span className={cs['staff-item-label']}>
                      {i18n['customer.detail.tel_label']}
                    </span>
                    <span>{tauser.phone} </span>
                  </div>
                  <div className={cs['staff-item-row']}>
                    <span className={cs['staff-item-label']}>
                      {' '}
                      {i18n['customer.detail.user_name_label']}{' '}
                    </span>
                    <span>{tauser.username} </span>
                  </div>
                  <div className={cs['staff-item-row']}>
                    <span className={cs['staff-item-label']}>
                      {' '}
                      {i18n['customer.detail.email_label']}{' '}
                    </span>
                    <span>{tauser.email} </span>
                  </div>
                </div>
              </ContentCard.Body>
            </ContentCard>
          ) : (
            <ContentCard>
              <ContentCard.Header
                icon="trader"
                iconClassName={cs['trader']}
                title={i18n['customer.detail.ta_user_unbound_title']}
              >
                <ContentCard.Tools>
                  <span className={cs['last-send-time']}>
                    {sendTimeOfInvitingEmail &&
                      `${i18n['customer.detail.last_tw_email_time']} ${moment(
                        sendTimeOfInvitingEmail
                      ).format('MM-DD/HH:mm')}`}
                  </span>
                  {enabled ? (
                    <Button
                      className={cs['add-button']}
                      onClick={this.openModal}
                    >
                      {i18n['customer.detail.send_email']}
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
        {isModalShow ? (
          <Dialog
            title={i18n['tipsmodal.title']}
            visible={isModalShow}
            align="center"
            onCancel={this.closeModal}
            footer={
              <div>
                <Button type="primary" onClick={this.onOkClick}>
                  {i18n['tipsmodal.confirm']}
                </Button>
                <Button onClick={this.closeModal}>
                  {i18n['tipsmodal.cancel']}
                </Button>
              </div>
            }
          >
            <div style={{ textAlign: 'center' }}>
              <p>{i18n['customer.detail.bind_tips1']}</p>
              <p>{i18n['customer.detail.bind_tips2']}</p>
            </div>
          </Dialog>
        ) : (
          undefined
        )}
        {isEmailMissingModalShow ? (
          <Dialog
            title={i18n['tipsmodal.title']}
            visible={isEmailMissingModalShow}
            align="center"
            onCancel={this.closeEmailMissingModal}
            footer={
              <div>
                <Button type="primary" onClick={this.closeEmailMissingModal}>
                  {i18n['tipsmodal.confirm']}
                </Button>
                <Button onClick={this.closeEmailMissingModal}>
                  {i18n['tipsmodal.cancel']}
                </Button>
              </div>
            }
          >
            <div style={{ textAlign: 'center' }}>
              <p>{i18n['customer.detail.bind_missing_tips3']}</p>
            </div>
          </Dialog>
        ) : (
          undefined
        )}
      </div>
    );
  }
}
