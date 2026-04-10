import CustomField, { validate } from 'components/v2/CustomField';
import { reduxForm } from 'redux-form';
import cs from './OwnerInfo.less';
import { Menu } from 'lean-ui';
export const BASE_INFO_FORM = 'BASE_INFO_FORM';
export const FINANCIAL_INFO_FORM = 'FINANCIAL_INFO_FORM';
export const CERTIFICATES_INFO_FORM = 'CERTIFICATES_INFO_FORM';
export const CLASSIFICATION_INFO_FORM = 'CLASSIFICATION_INFO_FORM';
export const TEST_INFO_FORM = 'TEST_INFO_FORM';

export const BaseInfoForm = reduxForm({
  form: BASE_INFO_FORM,
  enableReinitialize: true,
  shouldValidate: () => true,
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
  validate
})(CustomField);

export const FinancialInfoForm = reduxForm({
  form: FINANCIAL_INFO_FORM,
  enableReinitialize: true,
  shouldValidate: () => true,
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
  validate
})(CustomField);

export const CertificatesInfoForm = reduxForm({
  form: CERTIFICATES_INFO_FORM,
  enableReinitialize: true,
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
  shouldValidate: () => true,
  validate
})(CustomField);

export const ClassificationInfoForm = reduxForm({
  form: CLASSIFICATION_INFO_FORM,
  enableReinitialize: true,
  shouldValidate: () => true,
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
  validate
})(CustomField);

export const TestInfoForm = reduxForm({
  form: TEST_INFO_FORM,
  enableReinitialize: true,
  shouldValidate: () => true,
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
  validate
})(CustomField);
