import { connect } from 'react-redux';
import HandleTool from '../components/HandleTool';
import { showBannerNotice, closeBannerNotice } from 'commonActions/actions';

import { noticeDone } from '../controls/actions';

export default connect(
  ({ reportManagement: { needShowNotice } }) => {
    return {
      needShowNotice
    };
  },
  {
    noticeDone,
    showBannerNotice,
    closeBannerNotice
  }
)(HandleTool);
