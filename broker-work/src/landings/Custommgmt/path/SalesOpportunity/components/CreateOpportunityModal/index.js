import { Button, Dialog } from 'lean-ui';
import { DropdownForCode } from 'components/v2/Dropdown';
import Dropdown from 'components/v2/Dropdown';
import CreateOpportunityForm from './CreateOpportunityForm';
import i18n from 'utils/i18n';
import cs from './CreateOpportunityModal.less';
import { CREATE_OPPORTUNITY_FORM } from './CreateOpportunityForm';

export default class CreateOpportunityModal extends PureComponent {
  state = {
    fields: [],
    selectedOwe: null
  };

  componentDidMount() {
    const { getFormColumns, customerDetailInfo } = this.props;
    let contactsOweOption = this.getOweOptions();
    this.setState({
      selectedOwe: customerDetailInfo.oweId
        ? { label: customerDetailInfo.oweName, value: customerDetailInfo.oweId }
        : contactsOweOption[0]
    });
    getFormColumns().then(({ result }) => {
      if (result) {
        this.setState({
          fields: this.formatterFields().filter(
            item => item.key !== 'loseCause'
          )
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
            defaultSelect
            disabled={disabled}
            className={cs['dropdown']}
            value={input.value}
            onChange={this.onSelectSalesStage.bind(this, input)}
          />
        );
      }
    };
  };

  onSelectSalesStage = (input, selected) => {
    let result;

    if (selected == 6) {
      result = this.formatterFields();
    }

    if (selected != 6) {
      result = this.formatterFields().filter(item => item.key !== 'loseCause');
    }

    input.onChange(selected);
    this.setState({
      fields: result
    });
  };

  onSave = () => {
    const { submitForm } = this.props;

    submitForm(CREATE_OPPORTUNITY_FORM);
  };

  getData = data => {
    const {
      createOpportunity,
      onSave,
      showTopAlert,
      customerInfo
    } = this.props;
    const { selectedOwe } = this.state;
    const copyData = JSON.parse(JSON.stringify(data));
    const selectedOweId =
      selectedOwe && selectedOwe.value !== 'select'
        ? selectedOwe.value
        : undefined;
    const selectedOweName =
      selectedOwe && selectedOwe.value !== 'select'
        ? selectedOwe.label
        : undefined;
    copyData.customerId = customerInfo.customerId;
    copyData.oweId = selectedOweId;
    copyData.oweName = selectedOweName;

    if (copyData.salesStage !== 6) {
      copyData.loseCause = '';
    }

    createOpportunity(copyData).then(({ result }) => {
      if (result) {
        showTopAlert({
          bsStyle: 'success',
          content: i18n['customer.sales_opportunity.create.create_success']
        });
        onSave();
      }
    });
  };

  formatterFields = () => {
    const { formColumns, customerDetailInfo } = this.props;
    const copyData = formColumns.concat();
    const expectTimeIdx = copyData.findIndex(item => item.key === 'expectTime');
    const customNameIdx = copyData.findIndex(item => item.key === 'customName');
    const oweNameIdx = copyData.findIndex(item => item.key === 'oweName');
    const salesStageIdx = copyData.findIndex(item => item.key === 'salesStage');
    const ignoreFields = ['createTime', 'statementDate'];

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

    return copyData.filter(item => !ignoreFields.includes(item.key));
  };
  onOweDropdownSelect = item => {
    this.setState({ selectedOwe: item });
  };

  getOweOptions = () => {
    const { customerDetailInfo } = this.props;
    let contactsOweOption = [];
    if (customerDetailInfo['participant']) {
      customerDetailInfo['participant'].map((item, index) => {
        if (customerDetailInfo.oweId && customerDetailInfo.oweId !== item) {
          contactsOweOption.push({
            label: customerDetailInfo['participantName'][index],
            value: item
          });
        }
        if (!customerDetailInfo.oweId) {
          contactsOweOption.push({
            label: customerDetailInfo['participantName'][index],
            value: item
          });
        }
      });
    }
    if (customerDetailInfo.oweName) {
      contactsOweOption.push({
        label: customerDetailInfo.oweName,
        value: customerDetailInfo.oweId
      });
    }
    return contactsOweOption;
  };

  //机会归属的特殊处理
  getOweNameField = () => {
    const { customerDetailInfo } = this.props;
    let contactsOweOption = this.getOweOptions();
    return {
      key: 'oweNameSelect',
      factory: input => {
        const { selectedOwe } = this.state;
        const defaultSelect = {
          label: i18n['general.default_select'],
          value: 'select'
        };
        let v = selectedOwe;
        if (!v)
          v = customerDetailInfo.oweId
            ? {
                label: customerDetailInfo.oweName,
                value: customerDetailInfo.oweId
              }
            : contactsOweOption[0];
        return (
          <Dropdown
            className={cs['control-width']}
            value={v}
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

  render() {
    const { show, onHide, customerInfo } = this.props;
    const { fields } = this.state;
    const info = {
      customName: customerInfo.customName,
      oweName: customerInfo.oweName
    };
    const fieldGenerator = this.fieldGenerator();

    return (
      <Dialog
        title={i18n['customer.sales_opportunity.create.title']}
        visible={show}
        onCancel={onHide}
        footer={
          <div>
            <Button type="primary" onClick={this.onSave}>
              {i18n['general.confirm']}
            </Button>
            <Button onClick={onHide}>{i18n['general.cancel']}</Button>
          </div>
        }
      >
        <CreateOpportunityForm
          fieldGenerator={fieldGenerator}
          fields={fields}
          initialValues={info}
          onSubmit={this.getData}
        />
      </Dialog>
    );
  }
}
