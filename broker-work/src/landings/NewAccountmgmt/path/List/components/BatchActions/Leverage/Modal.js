import { Button } from 'react-bootstrap';
import { Dialog } from 'lean-ui';
import i18n from 'utils/i18n';
import cs from './Leverage.less';
import Form, { LEVERAGE_FORM } from './Form';
import CbrokerForm, { CBROKER_LEVERAGE_FORM } from './CbrokerForm';

export default class LeverageModal extends PureComponent {
  onSave = () => {
    const {
      submitForm,
      currentServer: { vendor }
    } = this.props;
    const formName =
      vendor === 'CTRADER' ? CBROKER_LEVERAGE_FORM : LEVERAGE_FORM;

    submitForm(formName);
  };

  onSubmit = values => {
    const { onSave } = this.props;

    onSave(values);
  };

  render() {
    const {
      onHide,
      resources,
      currentServer: { vendor },
      visible
    } = this.props;

    return (
      <Dialog
        title={i18n['account.modify_leverage.modal_title']}
        visible={visible}
        onCancel={onHide}
        onOk={this.onSave}
        okText={i18n['general.apply']}
        cancelText={i18n['general.cancel']}
      >
        {vendor === 'CTRADER' ? (
          <CbrokerForm resources={resources} onSubmit={this.onSubmit} />
        ) : (
          <Form
            resources={resources}
            initialValues={{ sendEmail: 1 }}
            onSubmit={this.onSubmit}
          />
        )}
      </Dialog>
    );
  }
}
