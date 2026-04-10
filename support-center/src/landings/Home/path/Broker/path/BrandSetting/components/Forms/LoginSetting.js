import { Field } from 'redux-form';
import FormField from 'components/FormField';
import { required, isEmail } from 'components/FormField/validate';
import Form from 'components/Form';
import i18n from 'utils/i18n';
import cs from './Forms.less';
import Radio from 'components/Radio';

const renderLoginPicker = ({ moduleList, input }) => {
  const onChange = loginBoxPosition => {
    input.onChange(loginBoxPosition);
  };

  return (
    <div className={cs['loginPicker']}>
      {moduleList.map((item, index) => {
        return (
          <div key={index}>
            <Radio
              checked={input.value === item.type}
              onChange={check => {
                if (check) {
                  onChange(item.type);
                }
              }}
            >
              {item.label}
            </Radio>
            <img className={cs['login-module-img']} src={item.pic} />
          </div>
        );
      })}
    </div>
  );
};
export class LoginSetting extends PureComponent {
  render() {
    const { loginModuleList } = this.props;

    return (
      <div className={cs['formSection']}>
        <div className={cs['formSectionTile']}>{i18n['brand.setting.login.background.title']}</div>
        <div className={cs['formSectionBody']}>
          <Form.Item>
            <Form.Control>
              <Field name="loginBoxPosition" moduleList={loginModuleList} component={renderLoginPicker} />
            </Form.Control>
          </Form.Item>
          <Form.Item className={cs['background_item']}>
            <Form.Label>
              <span className="required" />
              {i18n['brand.setting.login.background.file']}：
            </Form.Label>
            <Form.Control>
              <Field
                name="background"
                fieldType="file"
                onlyImage
                label={i18n['twapp.brand_setting.login_setting.background_image']}
                component={FormField}
                validate={required}
              />
            </Form.Control>
            <Form.HelpText>{i18n['brand.setting.login.background.tips']}</Form.HelpText>
          </Form.Item>
        </div>
      </div>
    );
  }
}
