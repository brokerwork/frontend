import cs from './index.less';
import i18n from 'utils/i18n';
import ContentCard from '../../../../../../components/ContentCard';
import { FormattedMessage } from 'react-intl';
import { Button, Tooltip } from 'lean-ui';
import moment from 'moment';
import Modal from 'components/Modal';
import { GET_ACCOUNT_OWNER_OF_CUSTOMER_BY_ID } from '../../../../controls/actions';
import AccountOwnerInfo from './AccountOwnerInfo';
import { CardPanelWrapper } from 'components/v2/CardPanel';

export default class AccountOwnerInfoIndex extends Component {
  state = {
    tag: null,
    showModal: false
  };
  toggleModal = toggle => {
    this.setState({
      showModal: toggle
    });
  };
  render() {
    const {
      productInfo,
      customerDetailInfo,
      customerDetailInfo: { enabled },
      accountOwnerInfo
    } = this.props;
    const { showModal } = this.state;
    const ownerState =
      accountOwnerInfo.state && accountOwnerInfo.state.toLowerCase();
    if (!Object.keys(accountOwnerInfo).length) {
      return <div />;
    }
    return (
      <div>
        <ContentCard>
          <ContentCard.Header icon="profile" iconClassName={cs['profile']}>
            <ContentCard.Title>
              {i18n['customer.detail.account_owner_title']}
              <Tooltip
                className={cs['owner-state-icon']}
                trigger="hover"
                placement="right"
                title={
                  <div className={cs['ques-content']}>
                    {i18n['customer.owner.tips']}
                  </div>
                }
              >
                <i className="fa fa-question-circle" />
              </Tooltip>
              {/* {ownerState ? (
                <span
                  className={`${cs['account-owner-tag']} ${cs[
                    `owner-stage-${ownerState}`
                  ]}`}
                >
                  {i18n[`customer.detail.account_owner.state.${ownerState}`] ||
                    ownerState}
                </span>
              ) : (
                undefined
              )} */}
            </ContentCard.Title>
            <ContentCard.Tools>
              <Button
                onClick={this.toggleModal.bind(this, true)}
                className={cs['add-button']}
              >
                {i18n['general.view']}
              </Button>
            </ContentCard.Tools>
          </ContentCard.Header>
        </ContentCard>
        <CardPanelWrapper appear>
          {showModal ? (
            <AccountOwnerInfo
              {...this.props}
              onHide={this.toggleModal.bind(this, false)}
            />
          ) : (
            undefined
          )}
        </CardPanelWrapper>
      </div>
    );
  }
}
