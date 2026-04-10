import Modal from 'components/Modal';
import Button from 'components/Button';
import i18n from 'utils/i18n';
import EditRateForm, { EDIT_RATE_FORM } from '../EditRateForm/form';
import _ from 'lodash';

/**
 * 添加自定义汇率
 */
export default class AddRateModal extends PureComponent {
  onSave = () => {
    const { submitForm } = this.props;

    submitForm(EDIT_RATE_FORM);
  };

  onSubmit = data => {
    const { getPlatSetting, addRateSetting, plat, onClose, showTopAlert, type } = this.props;
    const params = _.cloneDeep(data);
    params.type = type;

    if (params.exchangeMode !== 'Automatic') {
      //手动模式剔除汇率来源数据
      delete params.exchangeSource;
      // delete params.exchangeFloat;
      params.exchangeFloat = 0;
    } else {
      // 汇率如果没有填写 默认为0;
      if (!params.exchangeFloat) {
        params.exchangeFloat = 0;
      }
    }
    addRateSetting(plat, type, params).then(res => {
      if (res.result) {
        showTopAlert({
          style: 'success',
          content: i18n['general.save_success']
        });
        getPlatSetting(plat);
        onClose();
      }
    });
  };

  render() {
    const { onClose } = this.props;

    return (
      <Modal onClose={onClose}>
        <Modal.Header>{i18n['platform.tab.deposit.exchange.add']}</Modal.Header>
        <Modal.Body>
          <EditRateForm initialValues={{ exchangeMode: 'Automatic' }} onSubmit={this.onSubmit} />
        </Modal.Body>
        <Modal.Footer>
          <Button style="primary" onClick={this.onSave}>
            {i18n['general.save']}
          </Button>
          <Button onClick={onClose}> {i18n['general.cancel']}</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
