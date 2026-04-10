import { connect } from 'react-redux';
import Header from '../index';

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
)(Header);
