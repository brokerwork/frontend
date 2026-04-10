import cs from './footer.less';
import fetch from 'isomorphic-fetch';
import i18n from 'utils/i18n';
import VersionGuide from '../VersionGuide';
import { Layout, Icon } from 'lean-ui';
export default class Footer extends PureComponent {
  gotoHelpCenter = () => {
    const { getTopRight } = this.props;
    let rights = '';
    let newWindow = window.open('_blank');
    Promise.resolve(getTopRight()).then(({ result }) => {
      if (result) {
        const { topRights } = this.props;
        topRights.forEach(item => {
          rights += item.entityNo + ',';
        });
        rights = rights.substring(0, rights.length - 1);
        newWindow.location = `http://helpcenter.finsoftware.net?rights=${rights}`;
      }
    });
  };
  render() {
    const {
      classNames,
      className = '',
      brandInfo,
      helpCenter = false
    } = this.props;
    const {
      companyEmail,
      companyAddress,
      companyName,
      companyPhone,
      companySite,
      showPoweredBy,
      tenantId,
      showHelpCenter
    } = brandInfo;
    const currentYear = new Date().getFullYear();
    return (
      <div>
        {classNames ? (
          undefined
        ) : (
          <Layout.Footer className={`${cs['footer']} ${className}`}>
            {companyEmail ? (
              <a href={`mailto:${companyEmail}`} className={cs['piece']}>
                <Icon className={cs['piece-icon']} icon="email-outline" />
                {companyEmail}
              </a>
            ) : (
              undefined
            )}
            {companyPhone ? (
              <span className={cs['piece']}>
                <Icon className={cs['piece-icon']} icon="telephone-outline" />
                {companyPhone}
              </span>
            ) : (
              undefined
            )}
            {companyAddress ? (
              <span className={cs['piece']}>
                <Icon className={cs['piece-icon']} icon="location-outline" />
                {companyAddress}
              </span>
            ) : (
              undefined
            )}
            <span className={cs['piece']}>Copyright © {currentYear}</span>
            {companySite || companyName ? (
              <span className={cs['piece']}>
                <a
                  href={companySite}
                  target="_blank"
                  className={cs['decorate']}
                >
                  {companyName}
                </a>.
              </span>
            ) : (
              undefined
            )}
            <span className={cs['piece']}>All rights reserved.</span>
            {showPoweredBy ? (
              <span className={cs['piece']}>
                Powered by{' '}
                <a
                  href="http://www.lwork.com"
                  className={cs['decorate']}
                  target="_blank"
                >
                  LEAN WORK
                </a>
              </span>
            ) : (
              undefined
            )}
            {helpCenter && showHelpCenter ? (
              <span
                className={cs['help-center-jump']}
                onClick={this.gotoHelpCenter}
                data-test="jumpHelpCenter"
              >
                <VersionGuide guideKey="helpCenter" vAlign="top">
                  {i18n['general.help_center']}
                </VersionGuide>
              </span>
            ) : (
              undefined
            )}
          </Layout.Footer>
        )}
      </div>
    );
  }
}
