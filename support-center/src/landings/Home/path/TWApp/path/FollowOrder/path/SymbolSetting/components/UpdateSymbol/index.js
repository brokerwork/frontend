import Modal from "components/Modal";
import Button from "components/Button";
import SymbolForm, { SYMBOL_FORM } from "../Forms/Symbol";
import cs from "./UpdateSymbol.less";
import i18n from "utils/i18n";

export default class UpdateSymbol extends PureComponent {
  onSubmit = values => {
    const {
      updateSymbol,
      currentServerId,
      showTopAlert,
      onClose,
      group,
      getServerSymbol
    } = this.props;

    updateSymbol(currentServerId, { ...values, groupName: group }).then(
      ({ result }) => {
        if (result) {
          showTopAlert({
            style: "success",
            content: i18n['general.modify_success']
          });
          onClose();
          getServerSymbol();
        }
      }
    );
  };

  onSave = () => {
    const { submitForm } = this.props;

    submitForm(SYMBOL_FORM);
  };

  getTenantSymbol = () => {
    const { tenantSymbolList, symbol } = this.props;

    return (
      tenantSymbolList.find(item => item.value === symbol.symbolName) || {}
    );
  };

  render() {
    const { onClose, symbol } = this.props;
    const tenantSymbol = this.getTenantSymbol();

    return (
      <Modal onClose={onClose}>
        <Modal.Header>{i18n['followOrder.symbolSetting.change_config']}</Modal.Header>
        <Modal.Body className={cs["modal-body"]}>
          <SymbolForm
            initialValues={symbol}
            tenantSymbol={tenantSymbol}
            onSubmit={this.onSubmit}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button style="primary" onClick={this.onSave}>
            {i18n['general.save']}
          </Button>
          <Button onClick={onClose}>{i18n['general.cancel']}</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
