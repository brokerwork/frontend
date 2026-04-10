import CustomizeFieldForm from "../Forms/CustomizeField";
import i18n from "utils/i18n";
import {
  relationFuncCancel,
  defaultSelectGenerator,
  defaultSelectProcess,
  errorThrower
} from "../../controls/process";
const hasOptionType = ["select", "radio", "checkbox"];

export default class CustomizeField extends PureComponent {
  constructor(props) {
    super(props);
    let info = {};
    if (props.type !== "create") {
      info = Object.assign({}, props.selectedField, {
        defaultSelect: defaultSelectGenerator(props.selectedField.options)
      });
    }
    this.state = {
      relationFunc: info.relationFunc,
      fieldInfo: info,
      initialFieldInfo: info
    };
  }
  updateField = values => {
    const {
      formId,
      showTopAlert,
      onSave,
      getFieldList,
      type,
      createCustomizeField,
      updateCustomizeField
    } = this.props;
    const action =
      type === "create" ? createCustomizeField : updateCustomizeField;
    action({ ...values, formId }).then(({ result }) => {
      if (result) {
        showTopAlert({
          style: "success",
          content: i18n["general.save_success"]
        });
        onSave();
        getFieldList(formId);
      }
    });
  };
  errorCheck = (values) => {
    errorThrower(values);
  }
  onSubmit = values => {
    const { showTipsModal, type } = this.props;
    const { relationFunc, fieldInfo } = this.state;

    defaultSelectProcess(values);
    this.errorCheck(values);
    values.defaultSelect =
      values.defaultSelect === -1 ? "" : values.defaultSelect;

    if (type === "create") {
      this.updateField(values);
    } else if (relationFunc === true && !values.relationFunc) {
      showTipsModal({
        content: i18n["broker.field_setting.relationFunc.warning"],
        onConfirm: cb => {
          this.updateField(relationFuncCancel(values));
          cb();
        }
      });
    } else if (values.relationFunc && values.overuse) {
      showTipsModal({
        content: i18n["field.setting.field.normal"],
        onConfirm: cb => {
          this.updateField(values);
          cb();
        }
      });
    } else if (["select", "radio", "checkbox"].includes(fieldInfo.fieldType)) {
      showTipsModal({
        content: (
          <div>
            <p>{i18n["field.setting.risk.tip1"]}</p>
            <p>{i18n["field.setting.risk.tip2"]}</p>
          </div>
        ),
        onConfirm: cb => {
          this.updateField(values);
          cb();
        }
      });
    } else {
      this.updateField(values);
    }
  };

  onFormChange = fieldInfo => {
    this.setState({ fieldInfo });
  };

  onFieldTypeChange = fieldType => {
    const initialFieldInfo = { fieldType };

    if (hasOptionType.includes(fieldType)) {
      initialFieldInfo.options = [{}, {}];
      initialFieldInfo.defaultSelect = -1;
    }

    this.setState({
      initialFieldInfo
    });
  };

  render() {
    const { fieldInfo, initialFieldInfo } = this.state;
    const { relationFieldList, type, formId, selectedField, languages } = this.props;
    if (
      typeof fieldInfo.defaultSelect === "string" &&
      !fieldInfo.defaultSelect
    ) {
      fieldInfo.defaultSelect = -1;
    }
    return (
      <div>
        <CustomizeFieldForm
          type={type}
          initialValues={initialFieldInfo}
          onChange={this.onFormChange}
          onFieldTypeChange={this.onFieldTypeChange}
          fieldInfo={fieldInfo}
          relationFieldList={relationFieldList}
          onSubmit={this.onSubmit}
          formId={formId}
          selectedField={selectedField}
          languages={languages}
        />
      </div>
    );
  }
}
