import { Field } from 'redux-form';
import FormField from 'components/FormField';
import { required, isEmail } from 'components/FormField/validate';
import Form from 'components/Form';
import Button from 'components/Button';
import i18n from 'utils/i18n';
import cs from './Forms.less';
import { BRAND_FORM } from '.';
import _ from 'lodash';

export class BasicSetting extends PureComponent {
  state = { defaultLanguages: [] };
  lastOneLang = '';
  onEnabledLanguageChange = (e, languages) => {
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
    this.getDefaultLanguageList(languages, () => {
      const prev = this.props.brandFormValues.defaultLanguage;
      const newfirst = languages.find(lang => lang.enabled).value;
      // 若之前设置的默认语言已被禁用，则重新选择一个已被启用的语言作为默认语言
      if (!this.state.defaultLanguages.find(lang => lang.value === prev)) {
        this.props.changeField(BRAND_FORM, 'defaultLanguage', newfirst);
      }
    });
  };
  componentWillReceiveProps(nextProps) {
    this.getDefaultLanguageList(nextProps.brandFormValues.languages);
  }

  // 获取可被设为默认语言的已启用语言
  getDefaultLanguageList(languages = _.get(this.props, 'brandFormValues.languages', ''), cb = () => {}) {
    if (!languages) return;
    const defaultLanguages = languages
      .filter(lang => lang.enabled)
      .map(lang => {
        if (lang.enabled) this.lastOneLang = lang.value;
        return { ...lang };
      });
    this.setState({ defaultLanguages }, cb);
  }
  render() {
    const { defaultLanguages } = this.state;
    const {
      validDomain,
      productDomain,
      initialValues: {},
      isBetaUI
    } = this.props;
    return (
      <div className={cs['formSection']}>
        <div className={cs['formSectionTile']}>{i18n['brand.setting.basic_settings_label']}</div>
        <div className={cs['formSectionBody']}>
          <Form.Item>
            <Form.Label>
              <span className="required" />
              {i18n['brand.setting.site.name']}：
            </Form.Label>
            <Form.Control>
              <Field
                name="siteName"
                label={i18n['brand.setting.site.name']}
                fieldType="text"
                maxLength={50}
                component={FormField}
                validate={required}
              />
            </Form.Control>
            <Form.HelpText>{i18n['brand.setting.site.name.tips']}</Form.HelpText>
          </Form.Item>
          {!isBetaUI && (
            <Form.Item>
              <Form.Label>{i18n['brand.setting.site.back.ground.title']}：</Form.Label>
              <Form.Control>
                <Field name="background" fieldType="file" onlyImage component={FormField} />
              </Form.Control>
              <Form.HelpText>{i18n['brand.setting.site.back.ground.tips']}</Form.HelpText>
            </Form.Item>
          )}
          <Form.Item>
            <Form.Label>
              <span className="required" />
              {i18n['brand.setting.site.logo']}：
            </Form.Label>
            <Form.Control>
              <Field
                name="productLogo"
                label={i18n['brand.setting.site.logo']}
                fieldType="file"
                component={FormField}
                validate={required}
              />
            </Form.Control>
            <Form.HelpText>{i18n['brand.setting.site.logo.tips']}</Form.HelpText>
          </Form.Item>
          <Form.Item>
            <Form.Label>
              <span className="required" />
              {i18n['brand.setting.site.icon']}：
            </Form.Label>
            <Form.Control>
              <Field
                name="productIcon"
                label={i18n['brand.setting.site.icon']}
                fieldType="file"
                component={FormField}
                validate={required}
              />
            </Form.Control>
            <Form.HelpText>{i18n['brand.setting.site.icon.tips']}</Form.HelpText>
          </Form.Item>
          <Form.Item>
            <Form.Label>
              <span className="required" />
              {i18n['brand.setting.company.name']}：
            </Form.Label>
            <Form.Control>
              <Field
                name="companyName"
                label={i18n['brand.setting.company.name']}
                fieldType="text"
                component={FormField}
                validate={required}
              />
            </Form.Control>
            <Form.HelpText>{i18n['brand.setting.company.tips']}</Form.HelpText>
          </Form.Item>
          <Form.Item>
            <Form.Label>{i18n['brand.setting.company.email']}：</Form.Label>
            <Form.Control>
              <Field name="companyEmail" fieldType="text" component={FormField} validate={isEmail} />
            </Form.Control>
            <Form.HelpText>{i18n['brand.setting.company.tips']}</Form.HelpText>
          </Form.Item>
          <Form.Item>
            <Form.Label>{i18n['brand.setting.company.mob']}：</Form.Label>
            <Form.Control>
              <Field name="companyPhone" fieldType="text" component={FormField} />
            </Form.Control>
            <Form.HelpText>{i18n['brand.setting.company.tips']}</Form.HelpText>
          </Form.Item>
          <Form.Item>
            <Form.Label>{i18n['brand.setting.company.address']}：</Form.Label>
            <Form.Control>
              <Field name="companyAddress" fieldType="text" component={FormField} />
            </Form.Control>
            <Form.HelpText>{i18n['brand.setting.company.tips']}</Form.HelpText>
          </Form.Item>
          <Form.Item>
            <Form.Label>{i18n['brand.setting.company.website']}：</Form.Label>
            <Form.Control>
              <Field name="companySite" fieldType="text" component={FormField} />
            </Form.Control>
            <Form.HelpText>{i18n['brand.setting.company.tips']}</Form.HelpText>
          </Form.Item>
          <Form.Item>
            <Form.Label>{i18n['brand.setting.company.bind.domain']}：</Form.Label>
            <Form.Control groupControl>
              <Field
                name="customerDomain"
                fieldClassName="form-group-left form-group-primary"
                fieldType="text"
                component={FormField}
              />
              <div className="form-group-right">
                <Button style="primary" onClick={validDomain}>
                  {i18n['app.btn.check']}
                </Button>
              </div>
            </Form.Control>
            <Form.HelpText>
              {i18n['brand.setting.company.domain.tips']}（{productDomain}）
            </Form.HelpText>
          </Form.Item>
          <Form.Item>
            <Form.Label>{i18n['brand.setting.system_languages']}：</Form.Label>
            <Form.Control staticControl>
              <Field
                name="languages"
                fieldType="checkboxList"
                checkedKey="enabled"
                onChange={this.onEnabledLanguageChange}
                component={FormField}
              />
            </Form.Control>
          </Form.Item>
          <Form.Item>
            <Form.Label>{i18n['brand.setting.default_language']}：</Form.Label>
            <Form.Control staticControl>
              <Field name="defaultLanguage" fieldType="radio" component={FormField} options={defaultLanguages} />
            </Form.Control>
          </Form.Item>
          {/* <Form.Item>
            <Form.Label>
              {i18n['brand.setting.help_center.title']}：
            </Form.Label>
            <Form.Control staticControl>
              <Field
                name="showHelpCenter"
                fieldType="radio"
                component={FormField}
                options={[
                  { label: i18n['general.visible'], value: true },
                  { label: i18n['general.hidden'], value: false }
                ]}
              />
            </Form.Control>
          </Form.Item> */}
        </div>
      </div>
    );
  }
}
