import { reduxForm, Field } from 'redux-form';
import { Form, Button } from 'lean-ui';
import { renderField } from 'utils/v2/renderField';
import i18n from 'utils/i18n';
import cs from './BasicInfoForm.less';
import { COUNTRY_PROVINCE_CITY_KEY } from '../../constant';
const FormItem = Form.Item;
const FormLabel = Form.Label;
const FormControl = Form.Control;
export const BASIC_INFO_FORM = 'USER_SETTING_BASIC_INFO_FORM';

class BasicInfoForm extends PureComponent {
  render() {
    const { genderList, handleSubmit, serverList, disabled } = this.props;

    return (
      <form onSubmit={handleSubmit} className={cs['form']}>
        <div>
          <span>{i18n['user_setting.basic_info.header_img_label']}</span>
          <Field
            name="headImage"
            component={renderField}
            columns={8}
            onlyImage={true}
            removabled={false}
            disabled={disabled}
            itemClassName={cs['upload-img']}
            isHead
            showDefaultImage
            type="uploadField"
            label={i18n['user_setting.basic_info.header_img']}
          />
        </div>
        <Form>
          <FormItem col={2}>
            <FormLabel className={cs['label']}>
              {i18n['user_setting.basic_info.entity_no_label']}
            </FormLabel>
            <FormControl>
              <Field
                name="entityNo"
                component={renderField}
                columns={8}
                className={cs['input']}
                type="textField"
                disabled
                label={i18n['user_setting.basic_info.entity_no']}
              />
            </FormControl>
          </FormItem>
          <FormItem col={2}>
            <FormLabel className={cs['label']}>
              {i18n['user_setting.basic_info.user_name_label']}
            </FormLabel>
            <FormControl>
              <Field
                name="username"
                component={renderField}
                columns={8}
                className={cs['input']}
                type="textField"
                maxLength={255}
                disabled={disabled}
                label={i18n['user_setting.basic_info.user_name']}
              />
            </FormControl>
          </FormItem>
          <FormItem col={2}>
            <FormLabel className={cs['label']}>
              {i18n['user_setting.basic_info.real_name_label']}
            </FormLabel>
            <FormControl>
              <Field
                name="name"
                component={renderField}
                columns={8}
                disabled={disabled}
                className={cs['input']}
                type="textField"
                maxLength={255}
                label={i18n['user_setting.basic_info.real_name']}
              />
            </FormControl>
          </FormItem>
          <FormItem col={2}>
            <FormLabel className={cs['label']}>
              {i18n['user_setting.basic_info.phone_label']}
            </FormLabel>
            <FormControl>
              <Field
                name="phones"
                component={renderField}
                columns={8}
                disabled={disabled}
                type="phoneField"
                label={i18n['user_setting.basic_info.phone']}
              />
            </FormControl>
          </FormItem>
          <FormItem col={2}>
            <FormLabel className={cs['label']}>
              {i18n['user_setting.basic_info.email_label']}
            </FormLabel>
            <FormControl>
              <Field
                name="email"
                component={renderField}
                columns={8}
                className={cs['input']}
                disabled
                type="textField"
                label={i18n['user_setting.basic_info.email']}
              />
            </FormControl>
          </FormItem>
          <FormItem col={2}>
            <FormLabel className={cs['label']}>
              {i18n['user_setting.basic_info.gender_label']}
            </FormLabel>
            <FormControl>
              <Field
                name="sex"
                className={cs['dropdown']}
                component={renderField}
                columns={8}
                disabled={disabled}
                type="selectField"
                options={genderList}
                label={i18n['user_setting.basic_info.gender']}
              />
            </FormControl>
          </FormItem>
          <FormItem col={2}>
            <FormLabel className={cs['label']}>
              {i18n['user_setting.basic_info.birthday_label']}
            </FormLabel>
            <FormControl>
              <Field
                name="birthday"
                component={renderField}
                columns={8}
                disabled={disabled}
                type="dateField"
                className={cs['input']}
                label={i18n['user_setting.basic_info.birthday']}
              />
            </FormControl>
          </FormItem>
          <FormItem col={2}>
            <FormLabel className={cs['label']}>
              {i18n['user_setting.basic_info.server_label']}
            </FormLabel>
            <FormControl>
              <Field
                name="vendorServerId"
                className={cs['dropdown']}
                component={renderField}
                columns={8}
                disabled
                type="selectField"
                options={serverList}
                label={i18n['user_setting.basic_info.server']}
              />
            </FormControl>
          </FormItem>
          <FormItem col={2}>
            <FormLabel className={cs['label']}>
              {i18n['user_setting.basic_info.account_info_label']}
            </FormLabel>
            <FormControl>
              <Field
                name="login"
                component={renderField}
                columns={8}
                disabled
                className={cs['input']}
                type="textField"
                label={i18n['user_setting.basic_info.account_info']}
              />
            </FormControl>
          </FormItem>
          <FormItem col={2}>
            <FormLabel className={cs['label']}>
              {i18n['user_setting.basic_info.address_label']}
            </FormLabel>
            <FormControl>
              <Field
                name={COUNTRY_PROVINCE_CITY_KEY}
                component={renderField}
                columns={8}
                disabled={disabled}
                type="cityField"
                label={i18n['user_setting.basic_info.address']}
              />
            </FormControl>
          </FormItem>
          <FormItem col={1}>
            <FormLabel className={cs['label']}>
              {i18n['user_setting.basic_info.detail_address_label']}
            </FormLabel>
            <FormControl>
              <Field
                name="address"
                component={renderField}
                columns={10}
                type="textField"
                disabled={disabled}
                className={cs['input']}
                maxLength={255}
                label={i18n['user_setting.basic_info.detail_address']}
              />
            </FormControl>
          </FormItem>
          <FormItem col={1}>
            <FormLabel className={cs['label']}>
              {i18n['user_setting.basic_info.self_intro_label']}
            </FormLabel>
            <FormControl>
              <Field
                name="comment"
                component={renderField}
                columns={10}
                className={cs['input']}
                type="textareaField"
                maxLength={255}
                disabled={disabled}
                label={i18n['user_setting.basic_info.self_intro']}
              />
            </FormControl>
          </FormItem>
          <FormItem col={1}>
            <FormLabel className={cs['label']}>
              <Button
                type="primary"
                htmlType="submit"
                className={cs['btn']}
                disabled={disabled}
              >
                {i18n['general.save']}
              </Button>
            </FormLabel>
          </FormItem>
        </Form>
      </form>
    );
  }
}

export default reduxForm({
  form: BASIC_INFO_FORM,
  onSubmitFail: errors => {
    setTimeout(() => {
      let errorDom = document
        .querySelectorAll('[class*=error]')[0]
        .querySelector('input');
      errorDom
        ? errorDom.focus()
        : document.querySelectorAll('[class*=error]')[0].focus();
    }, 0);
  }
})(BasicInfoForm);
