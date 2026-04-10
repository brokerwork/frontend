import { Field } from 'redux-form';
import Form from 'components/Form';
import i18n from 'utils/i18n';
import { default as FormField } from 'components/FormField';
import { required } from 'components/FormField/validate';
import UploadFile from 'components/UploadFile';
import CopyToClipboard from 'components/CopyToClipboard';

import cs from './index.less';
import { NAV_CONTENT_TYPES, NAV_CUSTOM_CONTENT_TYPES } from '../../constant';
const validateRequired = value => {
  if (!value) {
    return label => label;
  } else {
    return undefined;
  }
};
const validateUrl = value => {
  const reg = /(http|https):\/\/.*/;

  if (!value) {
    return i18n['twapp.brand_setting.custom_nav.content_custom.link_tips'];
  } else if (!reg.test(value)) {
    return i18n['twapp.brand_setting.custom_nav.content_custom.link_style_tips'];
  } else {
    return undefined;
  }
};
export default class EditForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      image: ''
    };
  }
  riskDescEditor = null;

  componentDidMount() {}
  renderItem = () => {
    const { formValues } = this.props;
    const { image } = this.state;
    if (formValues.type === 'CUSTOM') {
      if (formValues.source === 'LINK') {
        return (
          <Form.Item>
            <Form.Label className={cs.form_label} />
            <Form.Control>
              <Field
                name="inputValue"
                fieldType="textarea"
                component={FormField}
                validate={validateUrl}
                placeholder={i18n['twapp.brand_setting.custom_nav.content_custom.link_tips']}
              />
            </Form.Control>
          </Form.Item>
        );
      } else if (formValues.source === 'CONTENT') {
        return (
          <Form.Item className={cs.editor_input}>
            <div style={{ margin: '15px 0' }}>
              <UploadFile className="upload" onChange={this.onChange} onlyImage={true}>
                {i18n['platform.tab.open.account.risk.setting.upload.file']}
              </UploadFile>
              {image ? (
                <div>
                  <span style={{ color: 'darkgreen', marignRight: '10px' }}>{image}</span>
                  <CopyToClipboard text={image} />
                </div>
              ) : null}
            </div>
            <div style={{ height: '300px' }}>
              <Field
                name="textValue"
                fieldType="editor"
                getInstance={instance => {
                  this.riskDescEditor = instance;
                }}
                component={FormField}
                label={i18n['twapp.brand_setting.custom_nav.content_custom.input_tips']}
                validate={validateRequired}
              />
            </div>
          </Form.Item>
        );
      }
    }
  };
  onChange = url => {
    this.setState({
      image: url
    });
  };
  render() {
    const { formValues, type, system } = this.props;
    if (!formValues) return null;
    const navOptions =
      type === 'SYSTEM' || system ? NAV_CONTENT_TYPES : NAV_CONTENT_TYPES.filter(item => item.value !== 'SYSTEM');
    return (
      <div>
        <Form>
          <Form.Item>
            <Form.Label className={cs.form_label}>
              <span className="required" />
              {i18n['twapp.brand_setting.custom_nav.content']}：
            </Form.Label>
            <Form.Control className={cs['rem-group']}>
              <Field
                name="type"
                fieldType="radio"
                component={FormField}
                options={navOptions}
                label={i18n['twapp.brand_setting.custom_nav.content_tips']}
                validate={validateRequired}
              />
            </Form.Control>
          </Form.Item>
          {formValues.type === 'CUSTOM' && (
            <Form.Item>
              <Form.Label className={cs.form_label} />
              <Form.Control>
                <Field
                  name="source"
                  fieldType="radio"
                  component={FormField}
                  options={NAV_CUSTOM_CONTENT_TYPES}
                  label={i18n['twapp.brand_setting.custom_nav.content_source_tips']}
                  validate={formValues.type === 'CUSTOM' && validateRequired}
                />
              </Form.Control>
            </Form.Item>
          )}
          {this.renderItem()}
        </Form>
      </div>
    );
  }
}
