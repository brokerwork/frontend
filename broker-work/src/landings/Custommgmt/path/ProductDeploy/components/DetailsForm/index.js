import { reduxForm } from 'redux-form';
import CustomField, { validate } from 'components/CustomField';
import i18n from 'utils/i18n';
import { deepCopy } from 'utils/simpleDeepCopy';
import { FormattedMessage } from 'react-intl';

const RenderFormCom = formKey => {
  return reduxForm({
    form: formKey,
    onSubmitFail: errors => {
      setTimeout(() => {
        let errorDom = document
          .querySelectorAll('[class*=error]')[0]
          .querySelector('input');
        errorDom
          ? errorDom.focus()
          : document.querySelectorAll('[class*=error]')[0].focus();
      }, 0);
    },
    validate: function(values, props) {
      const errors = validate(values, props);
      return Object.assign({}, errors);
    }
  })(({ fields, disabled }) => {
    return <CustomField disabled={disabled} fields={fields} />;
  });
};

export default class ApproveForm extends Component {
  FormCom;

  constructor(props) {
    super(props);
    const { formKey } = this.props;

    this.FormCom = RenderFormCom(formKey);
  }

  onSubmitFail = data => {
    const { onFail } = this.props;
    if (onFail) onFail(data);
  };

  onSubmit = data => data;

  onSubmitSuccess = data => {
    const { onSave, formKey } = this.props;
    if (onSave) onSave(data, formKey);
  };
  render() {
    const { detailsFields = [], initialValues, disabled } = this.props;
    const { FormCom } = this;
    if (!FormCom) {
      return undefined;
    }
    return (
      <FormCom
        fields={detailsFields}
        disabled={disabled}
        onSubmitFail={this.onSubmitFail}
        onSubmitSuccess={this.onSubmitSuccess}
        onSubmit={this.onSubmit}
        initialValues={initialValues}
      />
    );
  }
}
