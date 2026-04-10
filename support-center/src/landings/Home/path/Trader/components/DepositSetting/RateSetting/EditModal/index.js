import Modal from 'components/Modal';
import Button from 'components/Button';
import i18n from 'utils/i18n';
import TraderEditRateForm from '../EditRateForm';
import PayPlatModalForm from '../PayPlatModalForm';
import { PAY_PALT_MODAL_FORM } from '../PayPlatModalForm';
import { EDIT_RATE_FORM } from '../EditRateForm/form';

export default class Edit extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalTitle: ''
    };
  }
  onSave = () => {
    const { submitForm, type } = this.props;
    switch (type) {
      case 'rate':
        submitForm(EDIT_RATE_FORM);
        break;
      case 'payPlat':
        submitForm(PAY_PALT_MODAL_FORM);
        break;
    }
  };
  onClose = () => {
    this.props.onClose();
  };
  renderForm = () => {
    const {
      type,
      sortType,
      editData,
      updateRateSetting,
      updatePayPlat,
      getPlatSetting,
      plat,
      showTopAlert
    } = this.props;
    switch (type) {
      case 'rate':
        this.setState({
          modalTitle: i18n['trader.plat.setting.edit.rate.title']
        });
        return (
          <TraderEditRateForm
            editData={editData}
            update={updateRateSetting}
            type={type}
            getPlatSetting={getPlatSetting}
            plat={plat}
            close={this.onClose}
            sortType={sortType}
            showTopAlert={showTopAlert}
          />
        );
      case 'payPlat':
        this.setState({
          modalTitle: i18n['trader.plat.setting.edit.payplat.title']
        });
        return (
          <PayPlatModalForm
            editData={editData}
            update={updatePayPlat}
            type={type}
            getPlatSetting={getPlatSetting}
            plat={plat}
            close={this.onClose}
            showTopAlert={showTopAlert}
          />
        );
    }
  };
  render() {
    const { modalTitle } = this.state;
    return (
      <Modal onClose={this.onClose} size="lg">
        <Modal.Header>{modalTitle}</Modal.Header>
        <Modal.Body>{this.renderForm()}</Modal.Body>
        <Modal.Footer>
          <Button style="primary" onClick={this.onSave}>
            {i18n['general.save']}
          </Button>
          <Button onClick={this.onClose}> {i18n['general.cancel']}</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
