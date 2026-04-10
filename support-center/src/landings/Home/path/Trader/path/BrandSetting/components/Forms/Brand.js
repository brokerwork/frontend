import { reduxForm, formValueSelector, change, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import Form from 'components/Form';
import Button from 'components/Button';
import i18n from 'utils/i18n';

import BasicSetting from './BasicSetting.js';
import ThemeSetting from './ThemeSetting.js';
import LoginSetting from './LoginSetting.js';

export const BRAND_FORM = 'TRADER_BRAND_SETTING_BRAND_FORM';

class BrandForm extends PureComponent {
  state = {
    languages: [],
    loginTipMap: {},
    defaultLanguages: [],
    themeId: 'default',
    permissions: []
  };
  submit = values => {
    const { onSave } = this.props;
    values.loginTipMap = this.state.loginTipMap;
    if (values.languages && values.languages.length) {
      onSave(values);
    } else {
      let errors = {};
      errors.languages = i18n['brand.setting.languages'];
      return errors;
    }
  };

  componentWillReceiveProps({ languages = [], loginTipMap = {}, themeId = 'default' }) {
    // 仅初始化数据，后续的props更新不做更改
    this.setState({
      loginTipMap,
      languages,
      themeId
    });
    this.getDefaultLanguageList(languages);
  }

  onRemCodeShowChange = value => {
    const { change } = this.props;

    if (!value) {
      change('remCodeRequired', false);
    }
  };
  lastOneLang = '';
  // 语言数据启用变化
  onLanguageStateChange = languages => {
    const { loginTipMap } = this.state;
    const enabledLangs = languages.filter(lang => lang.enabled);
    if (enabledLangs.length === 1) {
      // 获取最后一次被禁用的最后剩下的一个语言
      this.lastOneLang = enabledLangs[0].value;
    } else if (enabledLangs.length === 0) {
      // 必须启用一项语言
      this.props.changeField(
        BRAND_FORM,
        'languages',
        (languages = languages.map(lang => {
          lang.enabled = lang.value === this.lastOneLang;
          return lang;
        }))
      );
    }
    // enabled: false, languageName: "简体中文", languageTag: "zh-CN"
    // 赛选提示信息数据上多余的语言配置
    languages.map(lang => {
      if (lang.value in loginTipMap && !lang.enabled) {
        delete loginTipMap[lang.value];
      }
    });
    this.setState({
      languages: [...languages],
      loginTipMap
    });
    this.getDefaultLanguageList(languages, () => {
      const prev = this.props.brandFormValues.defaultLanguage;
      const newfirst = languages.find(lang => lang.enabled).value;
      // 若之前设置的默认语言已被禁用，则重新选择一个已被启用的语言作为默认语言
      if (!this.state.defaultLanguages.find(lang => lang.value === prev)) {
        this.props.changeField(BRAND_FORM, 'defaultLanguage', newfirst);
      }
    });
  };
  // 获取可被设为默认语言的已启用语言
  getDefaultLanguageList(languages = this.props.brandFormValues.languages, cb = () => {}) {
    if (!languages) return;
    const defaultLanguages = languages
      .filter(lang => lang.enabled)
      .map(lang => {
        if (lang.enabled) this.lastOneLang = lang.value;
        return { ...lang };
      });
    this.setState({ defaultLanguages }, cb);
  }

  // 各个语言下提示信息配置修改时触发
  onLangLoginTipChange = value => {
    this.setState({
      loginTipMap: value
    });
  };
  /**
   * 改变主题
   * @param {String} themeId 主题id
   */
  onChangeTheme = themeId => {
    this.setState({
      themeId
    });
  };
  render() {
    const {
      handleSubmit,
      validDomain,
      productDomain,
      themeList,
      formValues,
      loginModuleList,
      permissions = [],
      versionRights
    } = this.props;
    const { loginTipMap, defaultLanguages, languages, themeId } = this.state;
    return (
      <Form onSubmit={handleSubmit(this.submit)} showHelpText>
        <BasicSetting
          defaultLanguages={defaultLanguages}
          formValues={formValues}
          productDomain={productDomain}
          validDomain={validDomain}
          onRemCodeShowChange={this.onRemCodeShowChange}
          onLanguageStateChange={this.onLanguageStateChange}
          languages={languages}
        />
        {versionRights['SC_TWUI_SET'] ? (
          <ThemeSetting themeList={themeList} onChangeTheme={this.onChangeTheme} />
        ) : null}
        <LoginSetting
          themeId={themeId}
          permissions={permissions}
          onLangLoginTipChange={this.onLangLoginTipChange}
          languages={languages}
          loginTipMap={loginTipMap}
          versionRights={versionRights}
          loginModuleList={loginModuleList}
        />
        <Form.Item>
          <Form.Label />
          <Form.Control>
            <Button style="primary" type="submit">
              {i18n['app.btn.save']}
            </Button>
            {/* <Button onClick={reset}>
              {i18n['app.btn.reset']}
            </Button> */}
          </Form.Control>
          <Form.HelpText />
        </Form.Item>
      </Form>
    );
  }
}

let BrandSelectingForm = reduxForm({
  form: BRAND_FORM,
  enableReinitialize: true,
  onSubmitFail: errors => {
    console.log('errors',errors)
    setTimeout(() => {
      let errorDom = document.querySelectorAll('[class*=has-error]')[0] && document.querySelectorAll('[class*=has-error]')[0].querySelector('input');
      errorDom && errorDom.focus();
      let uploadErrorDom = document.querySelectorAll('[class*=has-error]')[0] && document.querySelectorAll('[class*=has-error]')[0].querySelector('input[type=file]');
      if (uploadErrorDom) {
        document.querySelectorAll('[class*=has-error]')[0].setAttribute('tabindex', 0);
        document.querySelectorAll('[class*=has-error]')[0].focus();
      }
    }, 0);
  }
})(BrandForm);

const selector = formValueSelector(BRAND_FORM); // <-- same as form name
BrandSelectingForm = connect(
  state => {
    // can select values individually
    const loginTipMap = selector(state, 'loginTipMap');
    const languages = selector(state, 'languages');
    const themeId = selector(state, 'themeId');
    const permissions = selector(state, 'permissions');
    return {
      loginTipMap,
      languages,
      brandFormValues: getFormValues(BRAND_FORM)(state),
      themeId,
      permissions
    };
  },
  { changeField: change.bind(BRAND_FORM) }
)(BrandSelectingForm);

export default BrandSelectingForm;
