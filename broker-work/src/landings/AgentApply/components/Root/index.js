import { Button, Form, Steps, Dialog } from 'lean-ui';
import { getType as getLanguageType } from 'utils/language';
import { languages } from 'utils/config';
import LanguageSelector from 'components/v2/LanguageSelector';
import AgentApplyBaseInfoForm, {
  AGENT_APPLY_BASE_INFO_FORM
} from '../AgentApplyForm/BaseInfo';
import AgentApplyIdInfoForm, {
  AGENT_APPLY_ID_INFO_FORM
} from '../AgentApplyForm/IdInfo';
import Loading from 'components/v2/Loading';
import TopAlert from 'components/v2/TopAlert';
import Footer from 'components/v2/Footer';
import queryString from 'utils/queryString';
import cs from './Root.less';
import i18n from 'utils/i18n';
import { OpacityWrapper } from 'components/v2/OpacityWrapper';
import setPageTitle from 'utils/setPageTitle';
import RiskConfirmModal from '../../containers/RiskConfirmModal';
const FormItem = Form.Item;
const FormLabel = Form.Label;
const FormControl = Form.Control;
const Step = Steps.Step;

// 网易易盾支持的语言列表
const capchaLanguages = [
  ['zh-CN', '简体中文'],
  ['zh-TW', '繁体中文'],
  ['en', '英语'],
  ['ja', '日语'],
  ['ko', '韩语'],
  ['th', '泰语'],
  ['vi', '越南语'],
  ['fr', '法语'],
  ['ru', '俄语'],
  ['ar', '阿拉伯语'],
  ['id', '印尼语']
];
function getCapchaLanguage(lang) {
  return (
    capchaLanguages.find(item => {
      return item[0] === lang || !!lang.match(item[0]);
    })[0] || 'en'
  );
}

export default class Root extends PureComponent {
  state = {
    currentLanguage:
      languages.find(lang => lang.value === getLanguageType()) || languages[0],
    ready: false,
    validateData: null,
    needIdInfo: false,
    currentProgress: 1,
    baseInfo: {},
    idInfo: {},
    storeIdInfo: {},
    showRiskConfirmModal: false,
    isAgree: false,
    submitButtonClicked: false,
    success: false,
    visible: this.props.tipsModalData,
    btnDisabled: false
  };

  componentDidMount() {
    const { getLanguage, getBrandInfo, getAccessConfig } = this.props;
    // 与登录界面逻辑保持一致
    getBrandInfo().then(res => {
      const {
        data: { languages, defaultLanguage } = {},
        data: brandData,
        result
      } = res;
      if (!result) return;
      // 仅使用已启用的语言
      const enabledLanguages = languages.filter(lang => lang.enabled);
      // 获取默认语言，如果没有默认语言，则选择第一个被启用的语言
      const _defaultLanguage = defaultLanguage || enabledLanguages[0].value;
      // const _defaultLanguage = _.get(defaultLanguage, '[0].value', 'en-US');
      // 优先使用用户设置的语言
      // 再者使用SC品牌设置的默认系统语言
      // 再者使用已启用语言的第一个
      // 再者将回退至英文[en-US]
      const langType = getLanguageType(_defaultLanguage);
      // 如果是未启用或支持的浏览器语言，则使用默认语言
      if (!enabledLanguages.find(lang => langType === lang.value)) {
        console.info(
          'LANGUAGE NOT SUPPORT!!!',
          `SWITCH TO [${_defaultLanguage}]`
        );
        this.props.setLanguageType(_defaultLanguage);
        return;
      }
      // 优化显示，让用户在首次进入时，等待加载完成显示，而不是看到页面的反复刷新。
      this.setState({ dataReady: true }, () => {
        this.getFieldsConfiguration();
        setTimeout(() => {
          this.setPageInfos(brandData);
        }, 100);
      });
      getLanguage();
      getAccessConfig();
    });
  }

  getFieldsConfiguration() {
    const { getFormField, getAgentConfig, getPhoneCountryCode } = this.props;
    getPhoneCountryCode();
    getAgentConfig();
    getFormField().then(({ result }) => {
      if (result) {
        const { formFields } = this.props;
        this.setState(
          {
            needIdInfo: formFields.idInfo.length !== 0
          },
          () => {}
        );
      }
    });
  }

  setPageInfos(brandData) {
    const { getCountry } = this.props;
    const { tenantId, siteName, productIcon } = brandData;
    // 设置网站的favicon
    const iconEle = document.createElement('link');
    const iconEleIe = document.createElement('link');
    const head = document.getElementsByTagName('head')[0];
    iconEle.setAttribute('rel', 'shortcut icon');
    iconEle.setAttribute('type', 'image/x-icon');
    iconEle.setAttribute('href', productIcon);
    iconEleIe.setAttribute('rel', 'icon');
    iconEleIe.setAttribute('type', 'image/x-icon');
    iconEleIe.setAttribute('href', productIcon);
    head.appendChild(iconEleIe);
    head.appendChild(iconEle);

    setPageTitle(`${siteName} - ${i18n['agent.apply.title']}`);

    getCountry(tenantId === 'T001256').then(() => {
      this.setState({
        ready: true
      });
      Promise.resolve().then(() => {
        const { needIdInfo } = this.state;

        if (needIdInfo) {
          this.captchaInit();
        }
      });
    });
  }

  showRiskConfirmModal = () => {
    this.setState({
      showRiskConfirmModal: true
    });
  };

  closeRiskConfirmModal = () => {
    this.setState({
      showRiskConfirmModal: false,
      submitButtonClicked: false,
      isAgree: false
    });
  };
  captchaInit = () => {
    const head = document.getElementsByTagName('head')[0];
    const scriptTag = document.createElement('script');

    scriptTag.src = `//cstaticdun.126.net/load.min.js?t=${Date.now()}`;
    scriptTag.onload = () => {
      this.init();
    };
    head.appendChild(scriptTag);
  };
  init = () => {
    const { currentLanguage } = this.state;
    const currentLang = currentLanguage.value;
    const captchaId = '0c2058677d4149e48181fb30a8b639ac';

    initNECaptcha({
      captchaId,
      element: '#captcha',
      mode: 'float',
      // 除去对中文的支持，其他语言均显示英文
      lang: getCapchaLanguage(currentLang), // === 'zh-CN' ? 'zh-CN' : 'en',
      onVerify: (err, data) => {
        if (!err) {
          this.setState({
            validateData: {
              ...data,
              captchaId
            }
          });
        } else {
          this.setState({
            validateData: null
          });
        }
      }
    });
  };
  onLanguaegChange = lang => {
    const { setLanguageType } = this.props;

    setLanguageType(lang.value);
  };

  onFormChange = values => {
    this.setState({
      storeIdInfo: values
    });
  };

  onSave = () => {
    const { submitForm } = this.props;
    const { needIdInfo } = this.state;
    const formName = needIdInfo
      ? AGENT_APPLY_ID_INFO_FORM
      : AGENT_APPLY_BASE_INFO_FORM;

    submitForm(formName);
  };

  onSubmit = values => {
    const {
      submitAgentInfo,
      showTopAlert,
      location,
      agentConfig: { enableRiskAgreement }
    } = this.props;
    const { baseInfo, isAgree } = this.state;
    const data = Object.assign({}, values, baseInfo);

    if (location.search) {
      const params = queryString(location.search);
      data.customSource = params.get('iid');
      data.uid = params.get('uid');
    }

    if (data.phones && !data.phones.phone) {
      delete data.phones;
    }

    if (enableRiskAgreement) {
      if (isAgree) {
        this.setState({
          btnDisabled: true
        });
        submitAgentInfo(data).then(({ result }) => {
          if (result) {
            this.setState({
              submitButtonClicked: false,
              success: true,
              btnDisabled: false
            });
          }
        });
      } else {
        this.showRiskConfirmModal();
      }
    } else {
      this.setState({
        btnDisabled: true
      });
      submitAgentInfo(data).then(({ result }) => {
        if (result) {
          this.setState({
            success: true,
            btnDisabled: false
          });
        }
      });
    }
  };

  next = () => {
    const { submitForm } = this.props;

    submitForm(AGENT_APPLY_BASE_INFO_FORM);
  };

  onSubmitBaseInfo = values => {
    const { storeIdInfo, validateData } = this.state;
    const { getUploadSignToken } = this.props;

    getUploadSignToken(validateData).then(({ result }) => {
      if (result) {
        this.setState({
          currentProgress: 2,
          baseInfo: values,
          idInfo: storeIdInfo
        });
      }
    });
  };

  prev = () => {
    this.setState(
      {
        currentProgress: 1,
        validateData: null
      },
      () => {
        this.captchaInit();
      }
    );
  };

  filterIdInfoField = () => {
    const { formFields } = this.props;

    return formFields.idInfo.map(item => {
      return {
        ...item,
        type: item.key === 'bankAccount' ? 'edit' : undefined,
        placeHolder:
          item.key === 'bankAccount'
            ? i18n['withdraw.add_bank.tip']
            : item.placeHolder
        // initOssSignature:
        //   item.fieldType === 'image' ? this.initOssSignature : undefined
      };
    });
  };

  initOssSignature = () => {
    const { getUploadSign, uploadToken } = this.props;

    return getUploadSign(uploadToken);
  };

  onConfirm = () => {
    const { submitButtonClicked } = this.state;

    this.setState(
      {
        isAgree: true,
        showRiskConfirmModal: false
      },
      () => {
        if (submitButtonClicked) {
          this.onSave();
        }
      }
    );
  };

  onSubmitButtonClick = () => {
    const {
      agentConfig: { enableRiskAgreement }
    } = this.props;
    if (enableRiskAgreement) {
      this.setState(
        {
          submitButtonClicked: true
        },
        () => {
          this.onSave();
        }
      );
    } else {
      this.onSave();
    }
  };

  render() {
    const {
      agentConfig,
      brandInfo,
      formFields,
      loading,
      topAlertData,
      closeTopAlert,
      tipsModalData,
      closeTipsModal,
      checkUserInfo,
      isAsyncValidating
    } = this.props;
    const {
      currentLanguage,
      ready,
      needIdInfo,
      currentProgress,
      validateData,
      baseInfo,
      idInfo,
      showRiskConfirmModal,
      success,
      btnDisabled
    } = this.state;
    return (
      <div className={cs['container']}>
        {ready ? (
          <div>
            <div className={cs['header']}>
              <div className={cs['logo']}>
                <img src={agentConfig.logo} />
              </div>
              <LanguageSelector
                value={currentLanguage}
                right
                onChange={this.onLanguaegChange}
              />
            </div>
            {success ? (
              <div className={cs['content']}>
                <div className={cs['success-content']}>
                  <i className={`fa fa-check-circle ${cs['success-icon']}`} />
                  <p className={cs['success-text']}>
                    {i18n['agent.apply.success_tips']}
                  </p>
                  <p className={cs['success-tips']}>
                    {i18n['agent.apply.success_contact_tips']}
                  </p>
                  <a
                    href={brandInfo.companySite}
                    className={`btn btn-default ${cs['success-btn']}`}
                  >
                    {i18n['agent.apply.go_to_site']}
                  </a>
                </div>
              </div>
            ) : (
              <div className={cs['content']}>
                <div className={cs['title']}>{agentConfig.title}</div>
                <div className={cs['comment']}>{agentConfig.comment}</div>

                {needIdInfo ? (
                  <Steps current={currentProgress}>
                    <Step title={i18n['agent.apply.progress.contact']} />
                    <Step title={i18n['agent.apply.progress.review']} />
                    <Step title={i18n['agent.apply.progress.opened']} />
                  </Steps>
                ) : (
                  undefined
                )}

                {needIdInfo ? (
                  <div className={cs['form']}>
                    {currentProgress === 1 ? (
                      <AgentApplyBaseInfoForm
                        checkUserInfo={checkUserInfo}
                        fields={formFields.baseInfo}
                        initialValues={baseInfo}
                        onSubmit={this.onSubmitBaseInfo}
                      />
                    ) : (
                      undefined
                    )}

                    {currentProgress === 2 ? (
                      <AgentApplyIdInfoForm
                        fields={this.filterIdInfoField()}
                        onSubmit={this.onSubmit}
                        initialValues={idInfo}
                        onChange={this.onFormChange}
                      />
                    ) : (
                      undefined
                    )}

                    {needIdInfo && currentProgress === 1 ? (
                      <FormItem col={1}>
                        <FormLabel />
                        <FormControl>
                          <div id="captcha" style={{ width: '100%' }} />
                        </FormControl>
                      </FormItem>
                    ) : (
                      undefined
                    )}

                    {currentProgress === 1 ? (
                      <FormItem col={1}>
                        <FormLabel />
                        <FormControl>
                          <Button
                            disabled={!validateData || !!isAsyncValidating}
                            type="primary"
                            className={cs['btn']}
                            onClick={this.next}
                          >
                            {i18n['general.next_step']}
                          </Button>
                        </FormControl>
                      </FormItem>
                    ) : (
                      undefined
                    )}

                    {currentProgress === 2 ? (
                      <FormItem col={1}>
                        <FormLabel />
                        <FormControl>
                          <div className={cs['actions']}>
                            <div>
                              {agentConfig.enableRiskAgreement ? (
                                <a onClick={this.showRiskConfirmModal}>
                                  {agentConfig.name
                                    ? agentConfig.name
                                    : i18n['agent.apply.risk']}
                                </a>
                              ) : (
                                undefined
                              )}
                            </div>

                            <a onClick={this.prev}>
                              {i18n['general.prev_step']}
                            </a>
                          </div>
                          <Button
                            type="button"
                            type="primary"
                            className={cs['btn']}
                            onClick={this.onSubmitButtonClick}
                            disabled={btnDisabled}
                          >
                            {i18n['general.submit']}
                          </Button>
                        </FormControl>
                      </FormItem>
                    ) : (
                      undefined
                    )}
                  </div>
                ) : (
                  <div className={cs['form']}>
                    <AgentApplyBaseInfoForm
                      fields={formFields.baseInfo}
                      initialValues={baseInfo}
                      onSubmit={this.onSubmit}
                    />
                    <FormItem col={1}>
                      ·<FormLabel />
                      <FormControl>
                        {agentConfig.enableRiskAgreement ? (
                          <div className={cs['actions']}>
                            <a onClick={this.showRiskConfirmModal}>
                              {agentConfig.name
                                ? agentConfig.name
                                : i18n['agent.apply.risk']}
                            </a>
                          </div>
                        ) : (
                          undefined
                        )}
                        <Button
                          type="button"
                          bsStyle="primary"
                          className={cs['btn']}
                          onClick={this.onSubmitButtonClick}
                          disabled={btnDisabled}
                        >
                          {i18n['general.submit']}
                        </Button>
                      </FormControl>
                    </FormItem>
                  </div>
                )}
              </div>
            )}
            <Footer
              brandInfo={brandInfo}
              className={cs['footer']}
              helpCenter={false}
            />
            <RiskConfirmModal
              show={showRiskConfirmModal}
              onHide={this.closeRiskConfirmModal}
              onConfirm={this.onConfirm}
            />
          </div>
        ) : (
          undefined
        )}

        <OpacityWrapper appear>
          {loading ? <Loading /> : undefined}
        </OpacityWrapper>

        {topAlertData ? (
          <TopAlert onClose={closeTopAlert} {...topAlertData} />
        ) : (
          undefined
        )}

        {tipsModalData ? (
          <Dialog
            title="提示"
            visible={this.state.visible}
            onCancel={closeTipsModal}
            onOk={() => {
              this.setState({
                visible: false
              });
            }}
            onCancel={() => {
              this.setState({
                visible: false
              });
            }}
            afterClose={closeTipsModal}
            cancelText={i18n['customer.sales_opportunity.follow_record.cancel']}
            okText={i18n['customer.sales_opportunity.follow_record.confirm']}
          >
            {tipsModalData}
          </Dialog>
        ) : (
          undefined
        )}
      </div>
    );
  }
}
