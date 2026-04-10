import CardPanel from "components/CardPanel";
import Button from "components/Button";
import ConnectorForm, { CONNECTOR_FORM } from "../Forms/Connector";
import i18n from "utils/i18n";

export default class UpdateConnector extends PureComponent {
  onSubmit = values => {
    const { updateConnector, onUpdate, showTopAlert } = this.props;

    updateConnector(values).then(({ result }) => {
      if (result) {
        showTopAlert({
          style: "success",
          content: i18n["bridge.connector.update_success"]
        });
        onUpdate();
      }
    });
  };

  onSave = () => {
    const { submitForm } = this.props;

    submitForm(CONNECTOR_FORM);
  };

  render() {
    const { onClose, connector } = this.props;

    return (
      <CardPanel onClose={onClose}>
        <CardPanel.Header>{i18n["bridge.connector.update"]}</CardPanel.Header>
        <CardPanel.Body>
          <ConnectorForm initialValues={connector} onSubmit={this.onSubmit} />
        </CardPanel.Body>
        <CardPanel.Footer>
          <Button style="primary" onClick={this.onSave}>
            {i18n["general.save"]}
          </Button>
          <Button onClick={onClose}>{i18n["general.cancel"]}</Button>
        </CardPanel.Footer>
      </CardPanel>
    );
  }
}
