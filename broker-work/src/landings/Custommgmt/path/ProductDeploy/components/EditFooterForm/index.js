import { reduxForm } from 'redux-form';
import CustomField, { validate } from 'components/CustomField';
import i18n from 'utils/i18n';
import { deepCopy } from 'utils/simpleDeepCopy';
import { FormattedMessage } from 'react-intl';

export const EDIT_FOOTER_FORM = 'EDIT_FOOTER_FORM';

let hasMediatorFlag;

const AForm = reduxForm({
  form: EDIT_FOOTER_FORM,
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

export default class ApproveForm extends Component {
  onSubmitFail = data => {
    const { onFail } = this.props;
    if (onFail) onFail(data);
  };

  onSubmit = data => data;

  onSubmitSuccess = data => {
    const { onSave } = this.props;
    if (onSave) onSave(data, EDIT_FOOTER_FORM);
  };
  render() {
    const { editFooterFields = [], initialValues, disabled } = this.props;
    return (
      <AForm
        fields={editFooterFields}
        disabled={disabled}
        onSubmitFail={this.onSubmitFail}
        onSubmitSuccess={this.onSubmitSuccess}
        onSubmit={this.onSubmit}
        initialValues={initialValues}
      />
    );
  }
}
