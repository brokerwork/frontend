import { Card, Button } from 'lean-ui';
import ApplyModal from '../../containers/ApplyModal';
import i18n from 'utils/i18n';
import cs from './index.less';

export default class RebateAccount extends Component {
  state = {
    isShowApplyModal: false,
    dataLoaded: false
  };
  componentDidMount() {
    const { getRebateAccount, getWithdrawConfig, getBankList } = this.props;
    getRebateAccount().then(() => {
      const { rebateAccount } = this.props;
      this.setState({
        dataLoaded: true
      });
    });
  }
  toggleApplyModal = (toggle = true) => {
    this.setState({
      isShowApplyModal: toggle
    });
  };
  onApplyCompleted = () => {
    const { getApplications, params } = this.props;
    this.toggleApplyModal(false);
    getApplications(params);
  };
  render() {
    const { rebateAccount } = this.props;
    const { isShowApplyModal } = this.state;
    const isExist = !!rebateAccount.accountId;
    return (
      <div>
        <div className={cs['panel']}>
          <div className={cs['head']}>
            {i18n['withdraw.rebate_account.title']}
          </div>
          <div className={cs['body']}>
            <div className={cs['bate-content']}>
              <div>
                <span>{i18n['withdraw.rebate_account.label_account']}：</span>
                <span className={cs['form-text']}>
                  {isExist
                    ? rebateAccount.accountId
                    : i18n['withdraw.rebate_account.no_account_notice']}
                </span>
              </div>
              <div>
                <span>
                  {i18n['withdraw.rebate_account.label_accountName']}：
                </span>
                <span className={cs['form-text']}>
                  {rebateAccount.accountName}
                </span>
              </div>
              <div>
                <span>{i18n['withdraw.rebate_account.label_currency']}：</span>
                <span className={cs['form-text']}>
                  {rebateAccount.currency}
                </span>
              </div>
              <div>
                <span>{i18n['withdraw.rebate_account.label_balance']}：</span>
                <span className={cs['form-text']}>{rebateAccount.balance}</span>
              </div>
            </div>
            <div className={cs['button']}>
              <Button
                disabled={!isExist}
                onClick={this.toggleApplyModal}
                type="primary"
              >
                {i18n['withdraw.rebate_account.button_apply']}
              </Button>
            </div>
          </div>
        </div>
        {isShowApplyModal ? (
          <ApplyModal
            show={isShowApplyModal}
            onCompleted={this.onApplyCompleted}
            onHide={this.toggleApplyModal.bind(this, false)}
          />
        ) : (
          undefined
        )}
      </div>
    );
  }
}
