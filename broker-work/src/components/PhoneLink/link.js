import { FormattedMessage } from 'react-intl';
import cs from './PhoneLink.less';
import i18n from 'utils/i18n';
import language, { getVersion } from 'utils/language';

import { getToken } from 'utils/userInfo';
let timer = null;
const roleMap = {
  customer: 1,
  contact: 2
};
export default class PhoneLink extends Component {
  state = {
    status: 0
  };
  onClickPhone = () => {
    const { phone, showTipsModal, showTopAlert, name, id, role } = this.props;
    const to = (
      <span className={cs['phone']}>
        {name}({phone})
      </span>
    );
    const callInfo = {
      phone: phone.replace(/ /g, ''),
      id,
      roleCode: roleMap[role],
      name
    };

    showTipsModal({
      header: i18n['phone.comfirm_tips.header'],
      content: (
        <FormattedMessage
          id="phone.comfirm_tips.content"
          defaultMessage={i18n['phone.comfirm_tips.content']}
          values={{ to }}
        />
      ),
      onConfirm: cb => {
        this.callPhone(callInfo);
        cb();
      }
    });
  };
  callPhone = ({ phone, id, roleCode, name }) => {
    const { phoneCallStart, phoneCallEnd, showTopAlert } = this.props;
    if (timer) {
      showTopAlert({
        content: i18n['ip_phone.in_progress']
      });
      return;
    }
    const PHONE_URL = __QA__
      ? 'https://qacall.lwork.com'
      : __DEV__
        ? 'https://devcall.lwork.com'
        : __PROD__
          ? 'https://internetcall.lwork.com'
          : undefined;
    if (!PHONE_URL) return;
    const token = getToken();
    let languageType = language.getType();
    languageType = languageType.split('-').join('');
    const langVer = getVersion();
    const callInfo = {
      calledId: id,
      calledName: name,
      calledRoleCode: roleCode,
      calledPhone: phone
    };
    const phoneWindow = window.open(
      `${PHONE_URL}?token=${token}&&info=${JSON.stringify(
        callInfo
      )}&&languageType=${languageType}&&langVer=${langVer}`,
      '',
      getWindowFeatures(450, 300)
    );
    phoneCallStart();
    timer = setInterval(() => {
      if (!phoneWindow.window) {
        clearInterval(timer);
        timer = null;
        phoneCallEnd();
      }
    }, 2000);
  };
  render() {
    const { children, phone, id, role, userRights } = this.props;
    const content = children || phone;
    if (!id || !phone || !roleMap[role] || !userRights.CUSTOMER_PHONE) {
      return <span>{content}</span>;
    }
    return (
      <a style={{ cursor: 'pointer' }} onClick={this.onClickPhone}>
        {' '}
        {content}{' '}
      </a>
    );
  }
}

function getWindowFeatures(width, height) {
  const screenWidth = window.screen.availWidth || window.screen.width;
  const screenHeight = window.screen.availHeight || window.screen.height;
  return `width=${width},height=${height},left=${(screenWidth - width) /
    2},top=${(screenHeight - height) / 2}`;
}
