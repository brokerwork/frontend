import { NavLink } from 'react-router-dom';
import { Form, FormGroup, Col, ControlLabel } from 'react-bootstrap';
import { Button } from 'lean-ui';
import i18n from 'utils/i18n';
import BalanceForm, { BALANCE_FORM } from './Form';
import CbrokerForm, { CBROKER_BALANCE_FORM } from './CbrokerForm';
import cs from './Balance.less';
import ImportExcel from '../../ImportExcel';
import PreviewModal from './PreviewModal';
import { Dialog } from 'lean-ui';
import _ from 'lodash';

export default class BalanceModal extends PureComponent {
  state = {
    formValues: {},
    previewData: null,
    showPreviewModal: false
  };

  onSave = () => {
    const {
      submitForm,
      currentServer: { vendor }
    } = this.props;
    const formName = vendor === 'CTRADER' ? CBROKER_BALANCE_FORM : BALANCE_FORM;

    submitForm(formName);
  };

  onSubmit = values => {
    const { onSave } = this.props;

    onSave(values);
  };

  onFormChange = formValues => {
    this.setState({
      formValues
    });
  };

  onExcelImported = previewData => {
    this.setState({
      previewData
    });
  };

  onImport = (sendEmail, type) => {
    const { onImport } = this.props;
    const { previewData } = this.state;

    onImport(
      previewData,
      sendEmail,
      type === 'excel' ? 'deposit' : 'widthdraw'
    );
  };

  render() {
    const {
      visible,
      onHide,
      currentServer: { vendor },
      filteredRights,
      submitDisable
    } = this.props;
    const { formValues, previewData, showPreviewModal } = this.state;

    return (
      <Dialog
        title={i18n['account.button.money']}
        visible={visible}
        onCancel={onHide}
        okText={i18n['general.apply']}
        cancelText={i18n['general.cancel']}
        footer={
          <div>
            {formValues.type === 'excel' ? (
              <a
                href="/deposit"
                target="_blank"
                className={`${cs['link']} main-color main-color-border`}
              >
                {i18n['account.batch_deposit.record']}
              </a>
            ) : (
              undefined
            )}
            {formValues.type === 'widthdrawExcel' ? (
              <a
                href="/batchWithdraw"
                target="_blank"
                className={`${cs['link']} main-color main-color-border`}
              >
                {i18n['account.batch_widthdraw.record']}
              </a>
            ) : (
              undefined
            )}
            {formValues.type === 'excel' ||
            formValues.type === 'widthdrawExcel' ? (
              <Button
                type="primary"
                onClick={() => this.setState({ showPreviewModal: true })}
                disabled={!previewData}
              >
                {i18n['general.preview']}
              </Button>
            ) : (
              <Button
                type="primary"
                onClick={this.onSave}
                disabled={submitDisable}
              >
                {i18n['general.confirm']}
              </Button>
            )}
            <Button onClick={onHide}>{i18n['general.cancel']}</Button>
            {showPreviewModal ? (
              <PreviewModal
                type={formValues.type}
                previewData={previewData}
                onImport={this.onImport}
                onHide={() => this.setState({ showPreviewModal: false })}
              />
            ) : (
              undefined
            )}
          </div>
        }
      >
        {vendor === 'CTRADER' ? (
          <CbrokerForm
            initialValues={{ type: 'DEPOSITE' }}
            onSubmit={this.onSubmit}
          />
        ) : (
          <BalanceForm
            initialValues={{ sendEmail: 1, type: 'DEPOSITE' }}
            onSubmit={this.onSubmit}
            onChange={this.onFormChange}
            type={formValues.type}
            filteredRights={filteredRights}
          />
        )}
        {formValues.type === 'excel' || formValues.type === 'widthdrawExcel' ? (
          <Form horizontal>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3} className={cs['label']}>
                {i18n['account.batch_deposit.import_file']}
              </Col>
              <Col sm={8}>
                <ImportExcel
                  onChange={this.onExcelImported}
                  type={formValues.type}
                />
              </Col>
            </FormGroup>
          </Form>
        ) : (
          undefined
        )}
      </Dialog>
    );
  }
}
