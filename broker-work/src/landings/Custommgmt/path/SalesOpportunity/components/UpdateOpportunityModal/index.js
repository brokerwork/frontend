import { Button } from 'react-bootstrap';
import Modal from 'components/Modal';
import { DropdownForCode } from 'components/Dropdown';
import UpdateOpportunityForm from './UpdateOpportunityForm';
import Dropdown from 'components/Dropdown';
import i18n from 'utils/i18n';
import cs from './UpdateOpportunityModal.less';

import { UPDATE_OPPORTUNITY_FORM } from './UpdateOpportunityForm';

export default class UpdateOpportunityModal extends Component {
  state = {
    fields: [],
    selectedOwe: null,
    showModal: false
  };

  componentDidMount() {
    const { getFormColumns, info, show } = this.props;

    getFormColumns().then(({ result }) => {
      if (result) {
        this.setState({
          showModal: show
        });
      }
    });
  }

  fieldGenerator = () => {
    return {
      key: 'salesStage',
      factory: (input, disabled, fieldConfig) => {
        return (
          <DropdownForCode
            data={fieldConfig.optionList}
            disabled={disabled}
            className={cs['dropdown']}
            value={input.value}
            defaultSelect
            onChange={this.onSelectSalesStage.bind(this, input)}
          />
        );
      }
    };
  };

  onSelectSalesStage = (input, selected) => {
    input.onChange(selected);
  };

  onSave = () => {
    const { submitForm } = this.props;

    submitForm(UPDATE_OPPORTUNITY_FORM);
  };

  getData = data => {
    const {
      updateOpportunity,
      onSave,
      showTopAlert,
      info,
      detail,
      hasContract
    } = this.props;
    const { selectedOwe } = this.state;
    const selectedOweId =
      selectedOwe !== null
        ? selectedOwe.value === 'select' ? undefined : selectedOwe.value
        : info.oweId;
    const selectedOweName =
      selectedOwe !== null
        ? selectedOwe.value === 'select' ? undefined : selectedOwe.label
        : info.oweName;
    const copyData = JSON.parse(JSON.stringify(data));

    copyData.oweId = selectedOweId;
    copyData.oweName = selectedOweName;
    if (copyData.salesStage != 6) {
      copyData.loseCause = '';
    }

    updateOpportunity(copyData, hasContract).then(({ result }) => {
      if (result) {
        showTopAlert({
          bsStyle: 'success',
          content: i18n['general.modify_success']
        });
        onSave();
      }
    });
  };

  formatterFields = () => {
    const { formColumns, info } = this.props;
    const copyData = formColumns.concat();
    const expectTimeIdx = copyData.findIndex(item => item.key === 'expectTime');
    const customNameIdx = copyData.findIndex(item => item.key === 'customName');
    const oweNameIdx = copyData.findIndex(item => item.key === 'oweName');
    const salesStageIdx = copyData.findIndex(item => item.key === 'salesStage');
    const statementDateIdx = copyData.findIndex(
      item => item.key === 'statementDate'
    );
    const loseCauseIdx = copyData.findIndex(item => item.key === 'loseCause');
    const ignoreFields = [
      'createTime'
      // 'statementDate',
      // 'salesStage'
      // 'loseCause'
    ];

    if (expectTimeIdx !== -1) {
      copyData[expectTimeIdx] = {
        ...copyData[expectTimeIdx],
        fieldType: 'datestring'
      };
    }

    if (customNameIdx !== -1) {
      copyData[customNameIdx] = {
        ...copyData[customNameIdx],
        readonly: true
      };
    }

    if (oweNameIdx !== -1) {
      copyData[oweNameIdx] = {
        ...copyData[oweNameIdx],
        fieldType: 'oweNameSelect',
        component: this.getOweNameField()
      };
    }

    if (salesStageIdx !== -1) {
      copyData[salesStageIdx] = {
        ...copyData[salesStageIdx],
        fieldType: 'salesStage'
      };
    }

    if (statementDateIdx !== -1) {
      copyData[statementDateIdx] = {
        ...copyData[statementDateIdx],
        readonly: true
      };
    }

    let result = copyData.filter(item => !ignoreFields.includes(item.key));
    if (!info.isLose) {
      result = result.filter(item => item.key !== 'loseCause');
    }
    return result;
  };

  convertOweInfo = () => {
    const { info } = this.props;
    if (info.oweName && info.oweId) {
      return { label: info.oweName, value: info.oweId };
    }
    return;
  };

  onOweDropdownSelect = item => {
    this.setState({ selectedOwe: item });
  };

  getOweOptions = () => {
    const { customerParticipant } = this.props;
    let contactsOweOption = [];
    if (customerParticipant['participant']) {
      customerParticipant['participant'].map((item, index) => {
        if (customerParticipant.oweId && customerParticipant.oweId !== item) {
          contactsOweOption.push({
            label: customerParticipant['participantName'][index],
            value: item
          });
        }
        if (!customerParticipant.oweId) {
          contactsOweOption.push({
            label: customerParticipant['participantName'][index],
            value: item
          });
        }
      });
    }
    if (customerParticipant.oweName) {
      contactsOweOption.push({
        label: customerParticipant.oweName,
        value: customerParticipant.oweId
      });
    }
    return contactsOweOption;
  };

  //联系人归属的特殊处理
  getOweNameField = () => {
    const { info } = this.props;
    let contactsOweOption = this.getOweOptions();
    return {
      key: 'oweNameSelect',
      factory: (input, disabled) => {
        const { selectedOwe } = this.state;
        const defaultSelect = {
          label: i18n['general.default_select'],
          value: 'select'
        };
        let v = selectedOwe;
        if (!v)
          v = info.oweId ? { label: info.oweName, value: info.oweId } : '';
        return (
          <Dropdown
            className={cs['control-width']}
            value={v}
            disabled={disabled}
            defaultSelect={defaultSelect}
            data={contactsOweOption}
            onSelect={item => {
              this.onOweDropdownSelect(item);
              input.onChange(item);
            }}
          />
        );
      }
    };
  };

  formatterInfo = () => {
    const { info } = this.props;
    const copyData = JSON.parse(JSON.stringify(info));

    if (copyData.isLose) {
      copyData.salesStage = 6;
    }
    return copyData;
  };

  render() {
    const { onHide, justForm, disabled } = this.props;
    const { showModal } = this.state;
    const info = this.formatterInfo();
    const fieldGenerator = this.fieldGenerator();
    const fields = this.formatterFields();
    if (justForm) {
      return (
        <UpdateOpportunityForm
          fieldGenerator={fieldGenerator}
          fields={fields}
          initialValues={info}
          onSubmit={this.getData}
          disabled={disabled}
          newFormField={true}
        />
      );
    }
    return (
      <Modal backdrop="static" show={showModal} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>
            {i18n['customer.sales_opportunity.update.title']}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UpdateOpportunityForm
            fieldGenerator={fieldGenerator}
            fields={fields}
            initialValues={info}
            onSubmit={this.getData}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="primary" onClick={this.onSave}>
            {i18n['general.confirm']}
          </Button>
          <Button onClick={onHide}>{i18n['general.cancel']}</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
