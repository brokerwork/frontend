import { Alert, Button } from 'lean-ui';
import i18n from 'utils/i18n';
import cs from './index.less';
import LoseForm, { LOSE_FORM } from './LoseForm';
import ProgressStatusBar from 'components/v2/ProgressStatusBar';
import { FormattedMessage } from 'react-intl';
export default class SalesStage extends Component {
  hideLoseModal = () => {};
  getSalesStageList = () => {
    const { salesStageList } = this.props;

    return salesStageList.filter(
      stage => stage.value !== '' && stage.value != 6
    );
  };
  lose = data => {
    const { updateSalesStage, showTopAlert, detail, getDetail } = this.props;

    updateSalesStage({
      opportunityId: detail.basicinfo.opportunityId,
      salesStage: 6,
      loseCause: data.loseCause
    }).then(({ result }) => {
      this.hideLoseModal();
      if (result) {
        showTopAlert({
          bsStyle: 'success',
          content: i18n['general.modify_success']
        });
        getDetail();
      }
    });
  };
  setLose = () => {
    const { showTipsModal, loseCauseList, detail } = this.props;
    if (!this.isEditable()) return;
    showTipsModal({
      header: i18n['customer.sales_opportunity.detail.lose'],
      content: (
        <div>
          <p>
            <FormattedMessage
              id="customer.sales_opportunity.detail.lose_tips"
              defaultMessage={
                i18n['customer.sales_opportunity.detail.lose_tips']
              }
              values={{ name: detail.basicinfo.opportunityName }}
            />
          </p>
          <LoseForm loseCauseList={loseCauseList} onSubmit={this.lose} />
        </div>
      ),
      onConfirm: cb => {
        this.hideLoseModal = cb;
        this.onSubmitLose();
      }
    });
  };
  onSubmitLose = () => {
    const { submitForm } = this.props;
    submitForm(LOSE_FORM);
  };
  isEditable = () => {
    const { detail, showTipsModal } = this.props;
    if (
      detail.basicinfo.salesStage == 5 &&
      detail.contracts &&
      detail.contracts.length
    ) {
      showTipsModal({
        content: i18n['customer.sales_opportunity.detail.win_reject'],
        noCancel: true
      });
      return false;
    }
    return true;
  };
  updateSalesStage = stage => {
    const {
      updateSalesStage,
      detail,
      showTipsModal,
      showTopAlert,
      getDetail
    } = this.props;
    if (!this.isEditable()) return;
    if (stage.value == 5) {
      const content = () => {
        return (
          <div>
            <p>{i18n['customer.sales_opportunity.detail.win_tips1']}</p>
            <p>{i18n['customer.sales_opportunity.detail.win_tips2']}</p>
          </div>
        );
      };

      showTipsModal({
        content: content(),
        onConfirm: cb => {
          cb();
          updateSalesStage({
            opportunityId: detail.basicinfo.opportunityId,
            salesStage: stage.value
          }).then(({ result }) => {
            if (result) {
              showTopAlert({
                bsStyle: 'success',
                content: i18n['general.modify_success']
              });
              getDetail();
            }
          });
        }
      });

      return;
    }

    updateSalesStage({
      opportunityId: detail.basicinfo.opportunityId,
      salesStage: stage.value
    }).then(({ result }) => {
      if (result) {
        showTopAlert({
          bsStyle: 'success',
          content: i18n['general.modify_success']
        });
        getDetail();
      }
    });
  };
  restart = () => {
    const {
      updateSalesStage,
      showTopAlert,
      showTipsModal,
      detail,
      getDetail
    } = this.props;
    const salesStage =
      detail.basicinfo.salesStage == 6 ? '' : detail.basicinfo.salesStage;

    showTipsModal({
      content: i18n['customer.sales_opportunity.detail.restart_tips'],
      onConfirm: cb => {
        cb();
        updateSalesStage({
          opportunityId: detail.basicinfo.opportunityId,
          salesStage,
          loseCause: ''
        }).then(({ result }) => {
          if (result) {
            showTopAlert({
              bsStyle: 'success',
              content: i18n['general.modify_success']
            });
            getDetail();
          }
        });
      }
    });
  };

  render() {
    const {
      getLoseCauseList,
      detail: { basicinfo = {} },
      canEdit,
      loseCauseList
    } = this.props;
    const isLost = basicinfo.isLose;
    const salesStageList = this.getSalesStageList();
    return (
      <div className={cs['sales-box']}>
        {isLost ? (
          <Alert
            closable={false}
            className={cs['alert']}
            type="warning"
            message={
              <div>
                {i18n['customer.sales_opportunity.detail.lose_alert_tips']}
                {
                  (
                    loseCauseList.find(
                      cause => cause.value === basicinfo.loseCause
                    ) || {}
                  ).label
                }
              </div>
            }
          />
        ) : (
          undefined
        )}
        <div className={cs['stage-content']}>
          <div
            className={cs['win-line']}
            style={{ flex: salesStageList.length }}
          >
            <ProgressStatusBar
              disabled={isLost || !canEdit}
              data={salesStageList}
              value={basicinfo.salesStage}
              onChange={this.updateSalesStage}
            />
          </div>
          <div className={cs['lose-line']} style={{ flex: 1 }}>
            {isLost ? (
              <Button
                type="primary"
                disabled={!canEdit}
                className={cs['lose-btn']}
                onClick={this.restart}
              >
                {i18n['customer.sales_opportunity.detail.restart']}
              </Button>
            ) : (
              <Button
                disabled={!canEdit}
                className={cs['lose-btn']}
                onClick={this.setLose}
                // onClick={this.toggleModal.bind(this, 'Lose', true)}
              >
                {i18n['customer.sales_opportunity.detail.lose']}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }
}
