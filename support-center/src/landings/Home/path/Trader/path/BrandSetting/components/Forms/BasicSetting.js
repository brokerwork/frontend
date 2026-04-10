import { Field } from 'redux-form';
import { default as FormField } from 'components/FormField';
import { required, isEmail } from 'components/FormField/validate';
import { connect } from 'react-redux';
import Form from 'components/Form';
import Button from 'components/Button';
import i18n from 'utils/i18n';
import cs from './Form.less';
import Tab from 'components/Tab';

class BasicSetting extends PureComponent {
  state = {
    nameActiveKey: 'zh-CN',
    emailActiveKey: 'zh-CN',
    mobileActiveKey: 'zh-CN',
    addActiveKey: 'zh-CN',
    netActiveKey: 'zh-CN',
    urlActiveKey: 'zh-CN',
    titleActiveKey: 'zh-CN'
  };
  onChangeTab = (type, key) => {
    this.setState({
      [type + 'ActiveKey']: key
    });
  };
  render() {
    const {
      validDomain,
      productDomain,
      formValues,
      defaultLanguages,
      onLanguageStateChange,
      onRemCodeShowChange,
      languages
    } = this.props;
    return (
      <div className={cs['form-section']}>
        <div className={cs['form-section-title']}>{i18n['brand.setting.basic_settings_label']}</div>
        <div className={cs['form-section-body']}>
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
            <Form.Label>{i18n['brand.setting.site.mob.logo']}：</Form.Label>
            <Form.Control>
              <Field
                name="mobileLogo"
                label={i18n['brand.setting.site.mob.logo']}
                fieldType="file"
                component={FormField}
              />
            </Form.Control>
            <Form.HelpText>{i18n['brand.setting.site.mob.logo.tips']}</Form.HelpText>
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
            <Form.Label>{i18n['brand.setting.olcustomer.srv']}：</Form.Label>
            <Form.Control>
              <Field
                name="olCustomerSrv"
                label={i18n['brand.setting.olcustomer.srv']}
                fieldType="text"
                component={FormField}
              />
            </Form.Control>
            <Form.HelpText>{i18n['brand.setting.olcustomer.srv.tips']}</Form.HelpText>
          </Form.Item>

          <Tab activeKey={this.state.nameActiveKey} onChange={this.onChangeTab.bind(this, 'name')}>
            {languages.map((el, index) => {
              return (
                <Tab.Panel key={index} title={el.label} eventKey={el.value} className={cs['tab']}>
                  <div style={{ marginTop: '15px' }}>
                    <Form.Item>
                      <Form.Label>
                        <span className="required" />
                        {i18n['brand.setting.company.name']}：
                      </Form.Label>
                      <Form.Control>
                        <Field
                          name={'companyNames.' + el.value}
                          label={i18n['brand.setting.company.name']}
                          fieldType="text"
                          component={FormField}
                        />
                      </Form.Control>
                      <Form.HelpText>{i18n['brand.setting.company.tips']}</Form.HelpText>
                    </Form.Item>
                  </div>
                </Tab.Panel>
              );
            })}
          </Tab>

          <Tab activeKey={this.state.emailActiveKey} onChange={this.onChangeTab.bind(this, 'email')}>
            {languages.map((el, index) => {
              return (
                <Tab.Panel key={index} title={el.label} eventKey={el.value} className={cs['tab']}>
                  <div style={{ marginTop: '15px' }}>
                    <Form.Item>
                      <Form.Label>{i18n['brand.setting.company.email']}：</Form.Label>
                      <Form.Control>
                        <Field
                          name={'companyEmails.' + el.value}
                          fieldType="text"
                          component={FormField}
                          validate={isEmail}
                        />
                      </Form.Control>
                      <Form.HelpText>{i18n['brand.setting.company.tips']}</Form.HelpText>
                    </Form.Item>
                  </div>
                </Tab.Panel>
              );
            })}
          </Tab>

          <Tab activeKey={this.state.mobileActiveKey} onChange={this.onChangeTab.bind(this, 'mobile')}>
            {languages.map((el, index) => {
              return (
                <Tab.Panel key={index} title={el.label} eventKey={el.value} className={cs['tab']}>
                  <div style={{ marginTop: '15px' }}>
                    <Form.Item>
                      <Form.Label>{i18n['brand.setting.company.mob']}：</Form.Label>
                      <Form.Control>
                        <Field name={'companyPhones.' + el.value} fieldType="text" component={FormField} />
                      </Form.Control>
                      <Form.HelpText>{i18n['brand.setting.company.tips']}</Form.HelpText>
                    </Form.Item>
                  </div>
                </Tab.Panel>
              );
            })}
          </Tab>

          <Tab activeKey={this.state.addActiveKey} onChange={this.onChangeTab.bind(this, 'add')}>
            {languages.map((el, index) => {
              return (
                <Tab.Panel key={index} title={el.label} eventKey={el.value} className={cs['tab']}>
                  <div style={{ marginTop: '15px' }}>
                    <Form.Item>
                      <Form.Label>{i18n['brand.setting.company.address']}：</Form.Label>
                      <Form.Control>
                        <Field name={'companyAddresses.' + el.value} fieldType="text" component={FormField} />
                      </Form.Control>
                      <Form.HelpText>{i18n['brand.setting.company.tips']}</Form.HelpText>
                    </Form.Item>
                  </div>
                </Tab.Panel>
              );
            })}
          </Tab>

          <Tab activeKey={this.state.netActiveKey} onChange={this.onChangeTab.bind(this, 'net')}>
            {languages.map((el, index) => {
              return (
                <Tab.Panel key={index} title={el.label} eventKey={el.value} className={cs['tab']}>
                  <div style={{ marginTop: '15px' }}>
                    <Form.Item>
                      <Form.Label>{i18n['brand.setting.company.website']}：</Form.Label>
                      <Form.Control>
                        <Field name={'companySites.' + el.value} fieldType="text" component={FormField} />
                      </Form.Control>
                      <Form.HelpText>{i18n['brand.setting.company.tips']}</Form.HelpText>
                    </Form.Item>
                  </div>
                </Tab.Panel>
              );
            })}
          </Tab>

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
            <Form.Label>{i18n['brand.setting.rem_code']}：</Form.Label>
            <Form.Control className={cs['rem-group']}>
              <Field
                label={i18n['brand.setting.rem_code.show']}
                name="remCodeShow"
                fieldType="checkbox"
                component={FormField}
                onFieldChange={onRemCodeShowChange}
              />
              <Field
                label={i18n['brand.setting.rem_code.required']}
                name="remCodeRequired"
                fieldType="checkbox"
                component={FormField}
                disabled={!formValues.remCodeShow}
              />
            </Form.Control>
          </Form.Item>
          <Form.Item>
            <Form.Label>{i18n['brand.setting.system_languages']}：</Form.Label>
            <Form.Control staticControl>
              <Field
                name="languages"
                fieldType="checkboxList"
                onFieldChange={onLanguageStateChange}
                checkedKey="enabled"
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
          <Tab activeKey={this.state.titleActiveKey} onChange={this.onChangeTab.bind(this, 'title')}>
            {languages.map((el, index) => {
              return (
                <Tab.Panel key={index} title={el.label} eventKey={el.value} className={cs['tab']}>
                  <div style={{ marginTop: '15px' }}>
                    <Form.Item>
                      <Form.Label>{i18n['brand.setting.mobile_title']}：</Form.Label>
                      <Form.Control>
                        <Field name={'mobileTitles.' + el.value} fieldType="text" component={FormField} />
                      </Form.Control>
                    </Form.Item>
                  </div>
                </Tab.Panel>
              );
            })}
          </Tab>
        </div>
      </div>
    );
  }
}

export default BasicSetting;
