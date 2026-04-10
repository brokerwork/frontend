import { Field } from 'redux-form';
import Form from 'components/Form';
import i18n from 'utils/i18n';
import { default as FormField } from 'components/FormField';
import { required } from 'components/FormField/validate';
import cs from './index.less';
import { NAV_LEVEL } from '../../constant';
const validateUpperNav = (value) => {
  if (!value) {
    return i18n['twapp.brand_setting.custom_nav.first_nav.tips']
  } else {
    return undefined
  }
}
export default class AddForm extends PureComponent {
  constructor(props) {
    super(props);
  }
  componentDidMount() {}
  render() {
    if (!this.props.formValues) return null;
    const { formValues, parentMenuList } = this.props;
    return (
      <div>
        <Form>
          <Form.Item>
            <Form.Label className={cs.form_label}>{i18n['twapp.brand_setting.custom_nav.type']}：</Form.Label>
            <Form.Control className={cs['rem-group']}>
              <Field name="level" fieldType="radio" component={FormField} options={NAV_LEVEL} />
            </Form.Control>
          </Form.Item>
          {formValues.level === 'two' && (
            <Form.Item>
              <Form.Label className={cs.form_label}>{i18n['twapp.brand_setting.custom_nav.upper']}：</Form.Label>
              <Form.Control>
                <Field name="parent" fieldType="select" component={FormField} options={parentMenuList} validate={formValues.level === 'two' && validateUpperNav}/>
              </Form.Control>
            </Form.Item>
          )}
          <Form.Item>
            <Form.Label className={cs.form_label}>{i18n['twapp.brand_setting.custom_nav.name_chinese']}：</Form.Label>
            <Form.Control>
              <Field name="message.zh-CN" fieldType="text" component={FormField} />
            </Form.Control>
          </Form.Item>
          <Form.Item>
            <Form.Label className={cs.form_label}>{i18n['twapp.brand_setting.custom_nav.name_english']}：</Form.Label>
            <Form.Control>
              <Field name="message.en-US" fieldType="text" component={FormField} />
            </Form.Control>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
