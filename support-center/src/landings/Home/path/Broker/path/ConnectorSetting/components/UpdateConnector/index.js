import CardPanel from "components/CardPanel";
import Button from "components/Button";
import ConnectorForm, { CONNECTOR_FORM } from "../Forms/Connector";
import CtraderConnectorForm, {
  CTRADER_CONNECTOR_FORM
} from "../Forms/CtraderConnector";
import Checkbox from "components/Checkbox";
import i18n from "utils/i18n";
import cs from "./UpdateConnector.less";
import { SubmissionError } from "redux-form";

export default class UpdateConnector extends PureComponent {
  componentDidMount() {
    const { getCurrentNo, connector } = this.props;

    if (connector.vendor !== "CTRADER") {
      getCurrentNo(connector);
    }
  }

  onSave = () => {
    const { submitForm, connector } = this.props;
    const formName =
      connector.vendor === "CTRADER" ? CTRADER_CONNECTOR_FORM : CONNECTOR_FORM;

    submitForm(formName);
  };

  onSubmit = values => {
    const { checkConnector, showTipsModal, showTopAlert } = this.props;
    const {
      _status, // eslint-disable-line
      _type, // eslint-disable-line
      ...connector
    } = values;
    let isClear = values.isClear;
    if (
      !(
        (Number(values.rebateBeginNo) < Number(values.beginNo) &&
          Number(values.rebateEndNo) < Number(values.beginNo) &&
          Number(values.rebateEndNo)) ||
        (Number(values.endNo) &&
          Number(values.rebateBeginNo) > Number(values.endNo) &&
          (Number(values.rebateEndNo) > Number(values.endNo) ||
            !Number(values.rebateEndNo))) ||
        (!Number(values.beginNo) && !Number(values.endNo)) ||
        (!Number(values.rebateBeginNo) && !Number(values.rebateEndNo))
      )
    ) {
      showTopAlert({
        content: i18n["OW_PRODUCT_00038"]
      });
      return;
    }
    let errors = {};
    const { beginNo, endNo, rebateBeginNo, rebateEndNo } = values;
    if (beginNo * 1 > endNo * 1) {
      errors.beginNo = " ";
      errors.endNo = i18n["connector.setting.link.account.range"];
    }
    if (rebateBeginNo * 1 > rebateEndNo * 1) {
      errors.rebateBeginNo = " ";
      errors.rebateEndNo = i18n["connector.setting.link.rebate.range"];
    }
    if (Object.keys(errors).length) {
      throw new SubmissionError(errors);
    } else {
      checkConnector(connector).then(({ result, data }) => {
        if (result) {
          if (!!data) {
            showTipsModal({
              header: i18n["common.tips.risk"],
              size: "md",
              content: (
                <div>
                  <div>{i18n["connector.setting.clear.data.tip1"]}：</div>
                  <ul className={cs["list"]}>
                    <li>
                      <Checkbox
                        inline
                        onChange={evt => (isClear = evt.target.checked)}
                      >
                        {i18n["connector.setting.clear.data.checkbox"]}
                      </Checkbox>
                    </li>
                    <li>1、{i18n["connector.setting.clear.data.tip2"]}</li>
                    <li>2、{i18n["connector.setting.clear.data.tip3"]}</li>
                    <li>3、{i18n["connector.setting.clear.data.tip4"]}</li>
                  </ul>
                  <span className="text-danger">
                    {i18n["connector.setting.clear.data.tip5"]}
                  </span>
                </div>
              ),
              onConfirm: cb => {
                this.updateConnector({
                  ...connector,
                  isClear
                });
                cb();
              }
            });
          } else {
            this.updateConnector(connector);
          }
        }
      });
    }
  };

  updateConnector = connector => {
    const { updateConnector, showTopAlert, onSave } = this.props;
    connector.beginNo = connector.beginNo === '' ? 0 : connector.beginNo;
    connector.rebateBeginNo = connector.rebateBeginNo === '' ? 0 : connector.rebateBeginNo;
    connector.rebateEndNo = connector.rebateEndNo === '' ? 0 : connector.rebateEndNo;
    connector.endNo = connector.endNo === '' ? 0 : connector.endNo;
    updateConnector(connector).then(({ result }) => {
      if (result) {
        showTopAlert({
          content: i18n["general.modify_success"],
          style: "success"
        });

        if (onSave) onSave();
      }
    });
  };

  render() {
    const { onClose, connector, currentNo } = this.props;

    return (
      <CardPanel onClose={onClose}>
        <CardPanel.Header>
          {i18n["connector.setting.modify.title"]}
        </CardPanel.Header>
        <CardPanel.Body>
          {connector.vendor === "CTRADER" ? (
            <CtraderConnectorForm
              initialValues={connector}
              onSubmit={this.onSubmit}
            />
          ) : (
            <ConnectorForm
              currentNo={currentNo}
              initialValues={connector}
              onSubmit={this.onSubmit}
            />
          )}
        </CardPanel.Body>
        <CardPanel.Footer>
          <Button style="primary" onClick={this.onSave}>
            {i18n["app.btn.save"]}
          </Button>
          <Button onClick={onClose}>{i18n["app.btn.cancel"]}</Button>
        </CardPanel.Footer>
      </CardPanel>
    );
  }
}
