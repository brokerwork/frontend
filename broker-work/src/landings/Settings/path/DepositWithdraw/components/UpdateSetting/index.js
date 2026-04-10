import SettingInfo from '../SettingInfo';
// import Modal from 'components/Modal';
// import { Button } from 'react-bootstrap';
import { Dialog } from 'lean-ui';
import cs from './UpdateSetting.less';
import { SETTING_TYPE } from '../../constant';
import UpdateSettingForm, { UPDATE_SETTING_FORM } from './UpdateSettingForm';
import i18n from 'utils/i18n';
import { FormattedMessage } from 'react-intl';

export default class UpdateSetting extends PureComponent {
  state = {
    showSettingInfoModal: false
  };

  showSettingInfoModal = () => {
    this.setState({
      showSettingInfoModal: true
    });
  };

  closeSettingInfoModal = () => {
    this.setState({
      showSettingInfoModal: false
    });
  };

  getSettingData = () => {
    const { depositWithdrawInfo } = this.props;

    return SETTING_TYPE.map(item => {
      return {
        ...item,
        options: depositWithdrawInfo[item.value].map(option => {
          return {
            label: option.typeName,
            value: option.id
          };
        })
      };
    });
  };

  getInitialValues = () => {
    const { depositWithdrawInfo } = this.props;
    const result = {};

    SETTING_TYPE.forEach(item => {
      result[item.value] = depositWithdrawInfo[item.value]
        .filter(_item => {
          return _item.selected;
        })
        .map(_item => {
          return _item.id;
        });
    });

    return result;
  };

  onSave = () => {
    const { submitForm } = this.props;

    submitForm(UPDATE_SETTING_FORM);
  };

  onSubmit = values => {
    const { updateSetting, showTopAlert, onSave } = this.props;
    const ids = Object.values(values).join(',');

    updateSetting(ids).then(({ result }) => {
      if (result) {
        showTopAlert({
          bsStyle: 'success',
          content: i18n['general.save_success']
        });

        if (onSave) onSave();
      }
    });
  };

  render() {
    const { showSettingInfoModal } = this.state;
    const { onClose } = this.props;
    return (
      <Dialog
        onCancel={onClose}
        visible={true}
        title={i18n['settings.deposit_withdraw.setting']}
        onOk={this.onSave}
        onCancel={onClose}
        okText={i18n['general.save']}
        cancelText={i18n['general.cancel']}
        className={cs.dialog}
        width={700}
      >
        <div className={cs['tips']}>
          <FormattedMessage
            id="settings.deposit_withdraw.setting.tips.new"
            defaultMessage={i18n['settings.deposit_withdraw.setting.tips.new']}
            values={{
              link: (
                <a className={cs['link']} onClick={this.showSettingInfoModal}>
                  {i18n['settings.deposit_withdraw.setting.tips.check.new']}
                </a>
              )
            }}
          />
        </div>
        <UpdateSettingForm
          initialValues={this.getInitialValues()}
          data={this.getSettingData()}
          onSubmit={this.onSubmit}
        />
        {showSettingInfoModal && (
          <SettingInfo onClose={this.closeSettingInfoModal} />
        )}
      </Dialog>
    );
  }
}
