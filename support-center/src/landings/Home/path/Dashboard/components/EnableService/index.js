import Modal from 'components/Modal';
import Button from 'components/Button';
import cs from './EnableService.less';
import EnableEmailServiceForm, { ENABLE_EMAIL_SERVICE_FORM } from '../Forms/EnableEmailService';
import i18n from 'utils/i18n';
import renderParagraph from 'utils/renderParagraph';
import { arch } from 'os';
import { FormattedMessage } from 'react-intl';

export default class EnableService extends PureComponent {
  componentDidMount() {
    const { type, getEmailServiceInfo } = this.props;

    if (type === 'email') {
      getEmailServiceInfo();
    }
  }

  onSave = () => {
    const { type, submitForm, confirmSubmit, showTopAlert } = this.props;
    if (!confirmSubmit(type)) return;
    if (type !== 'email') {
      this.enableService();
    } else {
      submitForm(ENABLE_EMAIL_SERVICE_FORM);
    }
  };

  onEnableEmailService = values => {
    this.enableService(values);
  };

  enableService = email => {
    const { type, enableService, showTopAlert, onSave } = this.props;

    enableService(type, email).then(({ result }) => {
      if (result) {
        showTopAlert({
          style: 'success',
          content: i18n['general.modify_success']
        });
        onSave();
        location.reload();
      }
    });
  };

  render() {
    const { onClose, type, tenantInfo, emailServiceInfo } = this.props;
    const isEnoughMoney = tenantInfo.balance >= 50;

    return (
      <Modal onClose={onClose}>
        <Modal.Header>{i18n['dashboard.vas.title']}</Modal.Header>
        <Modal.Body>
          {type !== 'live' && (
            <div>
              <div className={cs['title']}>
                {i18n[`dashboard.vas.${type}`]}
                {i18n['dashboard.vas.service.introduction']}
              </div>
              <p className={cs['content']}>{i18n[`dashboard.vas.introduction.${type}`]}</p>
              {type === 'sms' ? (
                [
                  <p className={cs['content']}>
                    {i18n['dashboard.vas.service.sms.incountry']}：
                    <span key="in" className={`${cs['money']} text-orange`}>
                      {i18n['dashboard.vas.service.charges.sms']}
                    </span>
                  </p>,
                  <p className={cs['content']}>
                    {i18n['dashboard.vas.service.sms.outsideCountry']}：
                    <span key="outside" className={`${cs['money']} text-orange`}>
                      {i18n['dashboard.vas.service.sms.outsideCountry.charges']}
                    </span>
                  </p>
                ]
              ) : (
                <p className={cs['content']}>
                  {i18n['dashboard.vas.service.charges']}
                  {type === 'voip' ? (
                    [
                      <span key="voice" className={`${cs['money']} text-orange`}>
                        {i18n['dashboard.vas.service.charges.voip_voice']}
                      </span>,
                      <span key="record" className={`${cs['money']} text-orange`}>
                        {i18n['dashboard.vas.service.charges.voip_record']}
                      </span>
                    ]
                  ) : (
                    <span className={`${cs['money']} text-orange`}>
                      {i18n[`dashboard.vas.service.charges.${type}`]}
                    </span>
                  )}
                </p>
              )}
            </div>
          )}
          {type === 'email' ? (
            <div>
              <div className={cs['title']}>{i18n['dashboard.vas.introduction.email.title']}</div>
              <div className={cs['form']}>
                <EnableEmailServiceForm initialValues={emailServiceInfo} onSubmit={this.onEnableEmailService} />
              </div>
            </div>
          ) : (
            undefined
          )}
          {type !== 'live' ? (
            <div>
              <div className={cs['title']}>{i18n['dashboard.vas.introduction.attention.title']}</div>
              <p className={cs['content']}>
                {i18n['dashboard.vas.introduction.attention.atleast']}{' '}
                <span className={`${cs['money']} text-orange`}>
                  {i18n[`dashboard.vas.introduction.attention.atleast.${type}`]}
                </span>
              </p>
              <p className={cs['content']}>{i18n['dashboard.vas.introduction.attention.deductions']}</p>
              <p className={cs['content']}>
                {i18n['dashboard.vas.introduction.balance']}
                <span className={`${cs['money']} text-danger`}>${tenantInfo.balance}</span>
              </p>
            </div>
          ) : (
            <div>
              <div className={cs['title']}>{i18n['dashboard.vas.live.title']}</div>
              <p className={cs['content']}>
                {renderParagraph('dashboard.vas.live.recommend.p', (item, i) => {
                  return <div key={i}>{item}</div>;
                })}
              </p>
              <div className={cs['title']}>{i18n['dashboard.vas.service.charges']}</div>
              <p className={cs['content']}>
                <div>
                  {i18n['dashboard.vas.live.basepkg']}
                  <span className={`${cs['money']} text-orange`}>
                    <FormattedMessage
                      id="dashboard.vas.live.month"
                      defaultMessage={i18n['dashboard.vas.live.month']}
                      values={{
                        value: '$300／1500G／'
                      }}
                    />
                  </span>
                </div>
                <div>{i18n['dashboard.vas.live.basepkg.describe']}</div>
                <div>
                  {i18n['dashboard.vas.live.addedpkg']}
                  <span className={`${cs['money']} text-orange`}>$20／100G</span>
                </div>
                <div>{i18n['dashboard.vas.live.addedpkg.describe']}</div>
              </p>
              <div className={cs['title']}>{i18n['dashboard.vas.live.usingStandard']}</div>
              <p className={cs['content']}>{i18n['dashboard.vas.live.usingStandard.describe']}</p>
            </div>
          )}
          {!isEnoughMoney && (
            <p className={`${cs['content']} text-danger`}>{i18n['dashboard.vas.introduction.not_enough_money.tips']}</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          {tenantInfo[type] && !tenantInfo[type].flag ? (
            <Button style="primary" disabled={!isEnoughMoney} onClick={this.onSave}>
              {i18n['dashboard.vas.introduction.confirm']}
            </Button>
          ) : (
            undefined
          )}
          <Button onClick={onClose}>{i18n['general.cancel']}</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
