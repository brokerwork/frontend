import { Field, getFormValues } from 'redux-form';
import { default as FormField } from 'components/FormField';
import Form from 'components/Form';
import i18n from 'utils/i18n';
import cs from './Form.less';
import Radio from 'components/Radio';
import { required } from 'components/FormField/validate';
import Nav from 'components/Nav';
// import { languages } from "utils/config";
import Editor from 'components/Editor';

const renderLoginPicker = ({ moduleList, input }) => {
  const onChange = loginBoxPosition => {
    input.onChange(loginBoxPosition);
  };

  return (
    <div className={cs['login-picker']}>
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

class RenderLoginTip extends PureComponent {
  state = {
    activeKey: '' //languages[0].value
  };

  componentWillReceiveProps({ languages = [] }) {
    if (languages.length > 0 && !languages.find(lang => !!lang.enabled && lang.value == this.state.activeKey)) {
      this.setState({
        activeKey: languages[0].value
      });
    }
  }

  onChange = activeKey => {
    this.setState({
      activeKey
    });
  };

  onEditorChange = value => {
    const { activeKey } = this.state;
    const { onChange, loginTipMap } = this.props;

    onChange({
      ...loginTipMap,
      [activeKey]: value
    });
  };

  render() {
    const { activeKey } = this.state;
    const { loginTipMap, languages } = this.props;
    if (typeof languages !== 'object') return false;
    return (
      <div>
        <Nav className={cs['nav']} activeKey={activeKey} onChange={this.onChange}>
          {languages.map((item, idx) => {
            if (!!item.enabled) {
              return (
                <Nav.Item key={idx} eventKey={item.value}>
                  {item.label}
                </Nav.Item>
              );
            }
          })}
        </Nav>
        <Editor
          content={loginTipMap[activeKey] || ''}
          // onBlur={input.onBlur}
          onChange={this.onEditorChange}
        />
      </div>
    );
  }
}

class LoginSetting extends PureComponent {
  isRenderLoginPicker = () => {
    const { versionRights = {} } = this.props;
    return versionRights['SC_TW_LOGINPAGE'];
  };

  state = {
    showLoginPicker: this.isRenderLoginPicker()
  };

  render() {
    const { loginModuleList, languages, loginTipMap, onLangLoginTipChange, themeId } = this.props;
    const { showLoginPicker } = this.state;
    const moduleList = loginModuleList[themeId];
    return (
      <div className={cs['form-section']}>
        <div className={cs['form-section-title']}>{i18n['brand.setting.login.background.title']}</div>
        <div className={cs['form-section-body']}>
          <Form.Item className={cs['background_item']}>
            <Form.Label>
              <span className="required" />
              {i18n['twapp.brand_setting.login_setting.background_image']}：
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
            <Form.HelpText>{i18n['twapp.brand_setting.login_setting.background_image.tips']}</Form.HelpText>
          </Form.Item>
          {showLoginPicker && (
            <Form.Item>
              <Form.Control>
                <Field name="loginBoxPosition" moduleList={moduleList} component={renderLoginPicker} />
              </Form.Control>
            </Form.Item>
          )}
          <Form.Item>
            <Form.Label>{i18n['brand.setting.site.login_tip']}：</Form.Label>
            <Form.Control>
              <RenderLoginTip languages={languages} loginTipMap={loginTipMap} onChange={onLangLoginTipChange} />
            </Form.Control>
          </Form.Item>
        </div>
      </div>
    );
  }
}

export default LoginSetting;
