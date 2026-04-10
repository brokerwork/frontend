import cs from './index.less';
import i18n from 'utils/i18n';
import { FormattedMessage } from 'react-intl';
import { Button, Form, Card } from 'lean-ui';
import { reduxForm } from 'redux-form';
import CustomField, { validate } from 'components/v2/CustomField';
import ContentCard from '../../../../../../components/ContentCard';
import getCustomFieldValue from 'utils/fieldValue';
import CardPanel from 'components/v2/CardPanel';
import moment from 'moment';
import { dateTimeFormatStyle } from 'utils/config';
import { Link } from 'react-router-dom';
import ReduxFormWraper from 'components/v2/ReduxFormWraper';

export const ACCOUNT_FORM_BASIC_INFO =
  'CUSTOMER_DETAILS_ACCOUNT_FORM_BASIC_INFO';
export const ACCOUNT_FORM_ID_INFO = 'CUSTOMER_DETAILS_ACCOUNT_FORM_ID_INFO';
export const ACCOUNT_FORM_FINACIAL_INFO =
  'CUSTOMER_DETAILS_ACCOUNT_FORM_FINACIAL_INFO';

// 基本信息 表单
const BasicInfo = reduxForm({
  form: ACCOUNT_FORM_BASIC_INFO,
  validate,
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
  enableReinitialize: true
})(CustomField);

// 财务信息 表单
const FinacialInfo = reduxForm({
  form: ACCOUNT_FORM_FINACIAL_INFO,
  validate,
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
  enableReinitialize: true
})(CustomField);

// 证件信息 表单
const IdInfo = reduxForm({
  form: ACCOUNT_FORM_ID_INFO,
  validate,
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
  enableReinitialize: true
})(CustomField);

export default class AccountOwnerInfo extends Component {
  state = {
    editing: false
  };
  submitData = {};
  onSubmit = (key, value) => {
    this.submitData[key] = value;
    return this.submitData;
  };
  onSubmitSuccess = data => {
    const {
      updateAccountOwnerInfo,
      customerDetailInfo,
      showTopAlert,
      getCustomerDetail,
      onHide
    } = this.props;
    if (data.baseInfo && data.financialInfo && data.certificatesInfo) {
      updateAccountOwnerInfo(customerDetailInfo.customerId, data).then(res => {
        if (res.result) {
          showTopAlert({
            bsStyle: 'success',
            content: i18n['general.save_success']
          });
          getCustomerDetail();
          // if (onHide) {
          //   onHide();
          // }
          this.toggleEdit(false);
        }
      });
    }
  };
  onSubmitFail = errors => {
    this.submitData = {};
  };
  onCancel = () => {
    const { resetForm } = this.props;
    resetForm(ACCOUNT_FORM_BASIC_INFO);
    resetForm(ACCOUNT_FORM_ID_INFO);
    resetForm(ACCOUNT_FORM_FINACIAL_INFO);
  };
  onSave = () => {
    const { submitForm } = this.props;
    submitForm(ACCOUNT_FORM_BASIC_INFO);
    submitForm(ACCOUNT_FORM_ID_INFO);
    submitForm(ACCOUNT_FORM_FINACIAL_INFO);
  };
  formatBasicField = () => {
    const {
      accountOwnerFormColumns: { t_account_profiles },
      customerDetailInfo
    } = this.props;
    return t_account_profiles.map(item => {
      if (item.key === 'customerId') {
        const temp = JSON.parse(JSON.stringify(item));
        temp.optionList = [
          {
            label: customerDetailInfo.customName,
            value: customerDetailInfo.customerId
          }
        ];
        temp.readonly = true;
        return temp;
      } else {
        return item;
      }
    });
  };
  _renderRow = (key, col, idx) => {
    const { accountOwnerInfo } = this.props;

    return (
      <Form.Item col={col.longField ? 'longLabel' : 2 / col.columns} key={idx}>
        <Form.Label title={col.label} className={cs['label']}>
          {`${col.label}: `}
        </Form.Label>
        <Form.Control className={cs['control']}>
          {accountOwnerInfo[key]
            ? getCustomFieldValue(col, accountOwnerInfo[key][col.key])
            : undefined}
        </Form.Control>
      </Form.Item>
    );
  };
  toggleEdit = toggle => {
    if (!toggle) {
      this.onCancel();
    }
    this.setState({
      editing: toggle
    });
  };
  onVerify = data => {
    const {
      verifyIdentity,
      customerDetailInfo: { customerId }
    } = this.props;
    verifyIdentity(customerId, data);
  };

  render() {
    const {
      accountOwnerInfo,
      accountOwnerInfo: { checkState } = {},
      onHide,
      accountOwnerFormColumns,
      customerDetailInfo: { enabled, customerId },
      isAdaptOn
    } = this.props;
    const { editing } = this.state;
    const ownerState = accountOwnerInfo.state;
    const disabled = ownerState !== 'NOT_CHECK' || !enabled;
    const basicInfoField = this.formatBasicField();
    const appropriatenessTestInfo =
      accountOwnerInfo.appropriatenessTestInfo || {};
    return (
      <CardPanel
        onClose={onHide}
        show={true}
        title={
          <span>
            {i18n['customer.detail.account_owner_title']}
            {/* {!disabled ? ( */}
            {/* <VerifyIdButton
              data={accountOwnerInfo}
              fields={accountOwnerFormColumns}
              onSubmit={this.onVerify}
            /> */}
            {/* ) : (
              undefined
            )} */}
          </span>
        }
      >
        <Card>
          <div className={cs['main-panel']}>
            <ContentCard.Header
              border
              primary
              className={cs['owner-header']}
              icon="fa fa fa-user"
              iconClassName={cs['white']}
              iconWrap
              oldIcon
              title={i18n['customer.edit_account.basic_info']}
            />
            <Form className={cs['static-form-body']}>
              <ReduxFormWraper
                reduxForm={BasicInfo}
                fields={basicInfoField}
                onSubmit={this.onSubmit.bind(this, 'baseInfo')}
                onSubmitSuccess={this.onSubmitSuccess}
                onSubmitFail={this.onSubmitFail}
                initialValues={accountOwnerInfo.baseInfo}
                disabled={disabled || !editing}
                newFormField
                pure
              />
            </Form>

            <ContentCard.Header
              border
              className={cs['owner-header']}
              primary
              iconWrap
              iconClassName={cs['white']}
              icon="fa fa fa-dollar"
              title={i18n['customer.edit_account.financial_info']}
              oldIcon
            />
            <Form className={cs['static-form-body']}>
              <ReduxFormWraper
                reduxForm={FinacialInfo}
                fields={accountOwnerFormColumns.t_account_finacial}
                onSubmit={this.onSubmit.bind(this, 'financialInfo')}
                onSubmitSuccess={this.onSubmitSuccess}
                onSubmitFail={this.onSubmitFail}
                initialValues={accountOwnerInfo.financialInfo}
                disabled={disabled || !editing}
                newFormField
                pure
              />
            </Form>
            <ContentCard.Header
              border
              primary
              className={cs['owner-header']}
              icon="fa fa fa-vcard"
              iconWrap
              iconClassName={cs['white']}
              title={i18n['customer.edit_account.certificate_info']}
            />
            <Form className={cs['static-form-body']}>
              <ReduxFormWraper
                reduxForm={IdInfo}
                fields={accountOwnerFormColumns.t_account_id_info}
                onSubmit={this.onSubmit.bind(this, 'certificatesInfo')}
                onSubmitSuccess={this.onSubmitSuccess}
                onSubmitFail={this.onSubmitFail}
                initialValues={accountOwnerInfo.certificatesInfo}
                disabled={disabled || !editing}
                newFormField
                pure
              />
            </Form>
            {true || isAdaptOn ? (
              <div data-test="adapt-content">
                <ContentCard.Header
                  border
                  primary
                  className={cs['owner-header']}
                  icon="fa fa fa-test"
                  iconWrap
                  iconClassName={cs['white']}
                  title={
                    i18n['customer.edit_account.appropriateness_test_info']
                  }
                >
                  {appropriatenessTestInfo.time ? ( //用时间来判断是否有答题结果
                    <ContentCard.Tools>
                      <Link
                        target="_blank"
                        to={`/adaptiveTest/${customerId}/CUSTOMER`}
                      >
                        <i className={'fa fa-eye'} />{' '}
                        {i18n['appropriateness.view_detail']}
                      </Link>
                    </ContentCard.Tools>
                  ) : (
                    undefined
                  )}
                </ContentCard.Header>
                <div className={cs['owner-form']}>
                  <Form className={cs['static-form-body']}>
                    <Form.Item col={2}>
                      <Form.Label>
                        {i18n['appropriateness.test_time']}
                      </Form.Label>
                      <Form.Control className={cs['control']}>
                        {appropriatenessTestInfo.time &&
                          moment(appropriatenessTestInfo.time).format(
                            dateTimeFormatStyle
                          )}
                      </Form.Control>
                    </Form.Item>
                    <Form.Item col={2}>
                      <Form.Label>
                        {i18n['appropriateness.test_score']}
                      </Form.Label>
                      <Form.Control className={cs['control']}>
                        {typeof appropriatenessTestInfo.score !==
                        'undefined' ? (
                          <div>
                            {appropriatenessTestInfo.score}(
                            <FormattedMessage
                              id="appropriateness.total_score"
                              defaultMessage={
                                i18n['appropriateness.total_score']
                              }
                              values={{
                                score: appropriatenessTestInfo.totalScore || ''
                              }}
                            />
                            )
                          </div>
                        ) : (
                          undefined
                        )}
                      </Form.Control>
                    </Form.Item>
                    <Form.Item col={2}>
                      <Form.Label>
                        {i18n['appropriateness.test_result']}
                      </Form.Label>
                      <Form.Control className={cs['control']}>
                        {appropriatenessTestInfo.result ? (
                          <div>
                            {
                              i18n[
                                `adaptive_test.item_title.${
                                  appropriatenessTestInfo.result
                                }`
                              ]
                            }
                            {', '}
                            {i18n['appropriateness.suggest_leverage']}:
                            {appropriatenessTestInfo.leverage ? (
                              <span>
                                {' 1:'}
                                {appropriatenessTestInfo.leverage}
                              </span>
                            ) : (
                              undefined
                            )}
                          </div>
                        ) : (
                          undefined
                        )}
                      </Form.Control>
                    </Form.Item>
                  </Form>
                </div>
              </div>
            ) : (
              undefined
            )}
            {disabled ? (
              undefined
            ) : (
              <CardPanel.Footer>
                {editing ? (
                  <span>
                    <Button type="primary" onClick={this.onSave}>
                      {i18n['general.confirm']}
                    </Button>
                    <Button onClick={this.toggleEdit.bind(this, false)}>
                      {i18n['general.cancel']}
                    </Button>
                  </span>
                ) : (
                  <Button
                    type="primary"
                    onClick={this.toggleEdit.bind(this, true)}
                  >
                    {i18n['general.edit']}
                  </Button>
                )}
              </CardPanel.Footer>
            )}
          </div>
        </Card>
      </CardPanel>
    );
  }
}
