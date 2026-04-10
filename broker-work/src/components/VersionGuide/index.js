import { connect } from 'react-redux';
import VersionGuide from './VersionGuide';
import {
  injecteVersionGuideKey,
  comfirmVersionGuideKey
} from 'commonActions/actions';

export default connect(
  ({ common }) => {
    return {
      versionGuideKeys: common.versionGuideKeys,
      userInfo: common.userInfo
    };
  },
  {
    injecteVersionGuideKey,
    comfirmVersionGuideKey
  }
)(VersionGuide);
