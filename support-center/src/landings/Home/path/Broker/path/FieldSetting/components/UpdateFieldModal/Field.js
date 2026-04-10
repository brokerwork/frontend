import CardPanel from "components/CardPanel";
import Button from "components/Button";
import { getFormValues } from 'redux-form'
import FieldForm, { FIELD_FORM } from "../Forms/Field";
import { FIELD_OPTIONS, SENSITIVE_FIELD_TYPE } from "../../constant";
import i18n from "utils/i18n";
import Nav from "components/Nav";
import {
  relationFuncCancel,
  defaultSelectGenerator,
  defaultSelectProcess,
  errorThrower
} from "../../controls/process";

export default class Field extends PureComponent {
  constructor(props) {
    super(props);
    const defaultSelect =
      props.type === "create"
        ? -1
        : defaultSelectGenerator(props.selectedField.options);
    this.state = {
      fieldInfo:
        props.type === "create"
          ? {}
          : {
              ...props.selectedField,
              placeHolder:
                i18n[props.selectedField.placeHolder] ||
                props.selectedField.placeHolder,
              defaultSelect
            },
      placeholder:
        props.type === "create" ? "" : props.selectedField.placeHolder,
      fieldOptions: props.type === "create" ? [] : props.selectedField.options,
      relationFunc:
        props.type === "create" ? false : props.selectedField.relationFunc,
      defaultSelect
    };
  }

  onSelectField = fieldInfo => {
    const defaultSelect = defaultSelectGenerator(fieldInfo.options);
    this.setState({
      fieldInfo: {
        field: fieldInfo,
        ...fieldInfo,
        placeHolder: i18n[fieldInfo.placeHolder] || fieldInfo.placeHolder,
        defaultSelect
      },
      placeholder: fieldInfo.placeHolder,
      relationFunc: fieldInfo.relationFunc,
      defaultSelect
    });
  };
  onChangeField = (key, value)=>{
    this.setState({
      fieldInfo: {
        ...this.props.formValues,
        [key]: value
      }
    })
  }
  onOptionsDefaultCheck = (checked, idx) => {
    const { fieldInfo, fieldOptions } = this.state;

    this.setState({
      fieldInfo: {
        ...fieldInfo,
        options: [].concat(fieldOptions).map((option, _idx) => {
          return {
            ...option,
            isDefault: checked && idx === _idx
          };
        })
      }
    });
  };

  onFormChange = values => {
    this.setState({
      fieldOptions: values.options,
      relationFunc: values.relationFunc
    });
  };

  errorCheck = (values) => {
    errorThrower(values);
  }

  onSubmit = values => {
    const { showTipsModal, type, selectedField } = this.props;
    const { fieldInfo, placeholder } = this.state;
    const copyData = JSON.parse(JSON.stringify(values));
    const needConfirmField = ["radio", "checkbox", "select"];
    const relationFunc = type === "create" ? false : selectedField.relationFunc;
    const content = () => {
      if (relationFunc === true && !values.relationFunc) {
        return <div>{i18n["broker.field_setting.relationFunc.warning"]}</div>;
      } else if (relationFunc && values.overuse) {
        return <div>{i18n["field.setting.field.normal"]}</div>;
      } else {
        return (
          <div>
            <p>{i18n["field.setting.risk.tip1"]}</p>
            <p>{i18n["field.setting.risk.tip2"]}</p>
          </div>
        );
      }
    };
    defaultSelectProcess(copyData);
    copyData.enable = true;
    copyData.defaultSelect =
      copyData.defaultSelect === -1 ? "" : copyData.defaultSelect;
    copyData.placeHolder =
      copyData.placeHolder === i18n[placeholder]
        ? placeholder
        : copyData.placeHolder;
    FIELD_OPTIONS.filter(
      option =>
        option.value === "sensitive"
          ? !SENSITIVE_FIELD_TYPE.includes(fieldInfo.fieldType)
          : true
    ).forEach(({ value: key }) => {
      copyData[key] = !!copyData[key];
    });
    this.errorCheck(copyData);
    const submitData = relationFuncCancel(copyData);
    if (
      needConfirmField.includes(values.fieldType) &&
      !values.businessSelected
    ) {
      showTipsModal({
        content: content(),
        onConfirm: cb => {
          this.updateField(submitData);
          cb();
        }
      });
    } else {
      this.updateField(submitData);
    }
  };

  updateField = data => {
    const {
      updateField,
      showTopAlert,
      onSave,
      getFieldList,
      formId
    } = this.props;

    updateField({
      ...data,
      options: data.options ? data.options.filter(item => item) : undefined
    }).then(({ result }) => {
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

  render() {
    const {
      selectedField,
      fieldType,
      notEnabledField,
      type,
      formId,
      relationFieldList,
      languages
    } = this.props;
    const { fieldInfo, fieldOptions, relationFunc } = this.state;
    if (
      typeof fieldInfo.defaultSelect === "string" &&
      !fieldInfo.defaultSelect
    ) {
      fieldInfo.defaultSelect = -1;
    }
    return (
      <FieldForm
        onlyLetters={formId==='t_account_profiles'||formId==='t_account_withdraw'}
        onlyNumbers={formId==='t_account_withdraw'}
        type={type}
        formId={formId}
        initialValues={fieldInfo}
        fields={Object.keys(fieldInfo)}
        fieldInfo={fieldInfo}
        onChange={this.onFormChange}
        onSubmit={this.onSubmit}
        fieldType={fieldType}
        notEnabledField={notEnabledField}
        onSelectField={this.onSelectField}
        onChangeField={this.onChangeField}
        onOptionsDefaultCheck={this.onOptionsDefaultCheck}
        fieldOptions={fieldOptions}
        relationFunc={relationFunc}
        relationFieldList={relationFieldList}
        selectedField={selectedField}
        languages={languages}
      />
    );
  }
}
