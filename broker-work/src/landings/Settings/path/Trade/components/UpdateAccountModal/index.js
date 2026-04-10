import Modal from 'components/Modal';
import i18n from 'utils/i18n';
import UpdateForm, { UPDATE_FORM } from './UpdateForm';
import { FormattedMessage } from 'react-intl';

import cs from './UpdateAccountModal.less';

const parseDropdownDataList = data => {
  const copyData = [];

  data.forEach(_data => {
    copyData.push({
      label: `${_data.entityNo} : ${_data.name}`,
      value: _data.id
    });
  });
  return copyData;
};
export default class UpdateAccountModal extends PureComponent {
  constructor(props) {
    super(props);
    const copyData =
      this.props.type === 'edit'
        ? Object.assign({}, this.props.data, {
            warnMode: this.props.data.warnMode || 'NUMBER'
          })
        : Object.assign({}, { warnMode: 'NUMBER' });
    this.state = {
      accountData: copyData,
      singleInfo: {}
    };
  }
  updateAccount = data => {
    const { showTipsModal, onSave, type, accountList } = this.props;
    const copyData = JSON.parse(JSON.stringify(data));
    copyData.commissionEnable = copyData.commissionEnable
      ? copyData.commissionEnable.length
      : 0;
    copyData.swapsEnable = copyData.swapsEnable
      ? copyData.swapsEnable.length
      : 0;
    let balance =
      type === 'add'
        ? this.state.singleInfo.balance || 0
        : copyData.balance || 0;
    let enableItem =
      copyData.commissionEnable === 1 ? i18n['settings.trade.table_fee'] : '';
    enableItem =
      copyData.swapsEnable === 1
        ? enableItem + i18n['settings.trade.table_commission']
        : enableItem;
    let accountName = accountList.find(item => item.id === copyData.userId)
      .name;
    let login = type === 'add' ? this.state.singleInfo.login : copyData.login;
    let accountTotalBalance = copyData.accountTotalBalance || 0;
    const warnClass =
      copyData.warnMode === 'PERCENT'
        ? balance < accountTotalBalance * copyData.marginWarnPercent / 100
        : balance < copyData.marginWarn;
    showTipsModal({
      content: (
        <div className={cs['add-confirm-modal']}>
          <div>{i18n['settings.left_menu.account_update_tips']}</div>
          <div className="col-sm-6">
            {i18n['settings.trade.confirm_tips.name']}：{accountName}
          </div>
          <div className="col-sm-6">
            {i18n['settings.trade.table_login']}：{login}
          </div>
          <div className="col-sm-12">
            {i18n['settings.trade.margin_warn']}：<span
              className={warnClass ? cs['warning-text'] : ''}
            >
              {copyData.warnMode === 'PERCENT'
                ? `${copyData.marginWarnPercent}％`
                : `${copyData.marginWarn || 0}USD`}
            </span>
            {warnClass ? (
              <span className={cs['warning-text']}>
                （{i18n['settings.trade.low_tips']}）
              </span>
            ) : (
              ''
            )}{' '}
          </div>
          <div className="col-sm-12">
            {i18n['settings.trade.confirm_tips.agent_item']}：{enableItem}
          </div>
        </div>
      ),
      onConfirm: cb => {
        if (onSave) onSave(copyData);
        cb();
      },
      noCancel: true
    });
  };
  onSave = () => {
    const { submitForm } = this.props;
    submitForm(UPDATE_FORM);
  };
  onUpdateFormChange = data => {
    const { getBalance, type } = this.props;
    const copyData = JSON.parse(JSON.stringify(data)) || {};
    const { accountData } = this.state;
    if (
      (!accountData.userId && data.userId) ||
      (accountData && accountData.userId && accountData.userId !== data.userId)
    ) {
      Promise.resolve(getBalance(data.userId)).then(res => {
        if (res.result) {
          const { singleBalance } = this.props;
          let singleInfo = {};
          singleInfo.login = singleBalance.login;
          singleInfo.balance = singleBalance.balance;
          this.setState({
            singleInfo: singleInfo
          });
        }
      });
    }
    this.setState({
      accountData: copyData
    });
  };
  onHide = () => {
    const { onHide } = this.props;
    this.setState({
      singleInfo: {}
    });
    onHide();
  };
  render() {
    const { type, accountList } = this.props;
    const { accountData, singleInfo } = this.state;
    const accountListData = parseDropdownDataList(accountList);
    return (
      <Modal backdrop="static" onHide={this.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>
            {type === 'edit'
              ? i18n['settings.trade.update_modal.edit_title']
              : i18n['settings.trade.update_modal.add_title']}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={cs['body']}>
          <UpdateForm
            initialValues={accountData}
            onSubmit={this.updateAccount}
            onChange={this.onUpdateFormChange}
            accountListData={accountListData}
            type={type}
            singleInfo={singleInfo}
            {...this.props}
          />
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className={'btn btn-primary'}
            onClick={this.onSave}
          >
            {i18n['general.confirm']}
          </button>
          <button
            type="button"
            className={'btn btn-default'}
            onClick={this.onHide}
          >
            {i18n['general.cancel']}
          </button>
        </Modal.Footer>
      </Modal>
    );
  }
}
