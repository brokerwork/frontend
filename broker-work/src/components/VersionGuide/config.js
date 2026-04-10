import helpCenterIcon from './images/help_center.png';
import i18n from 'utils/i18n';

export const guides = {
  helpCenter: {
    icon: helpCenterIcon,
    content: i18n['version.guide.help_center']
  }
};

const versionGuideConf = {
  version: '3.1',
  keys: [],
  guides
};

export default versionGuideConf;
