import * as actions from '../controls/actions';
import { connect } from 'react-redux';
import Root from '../components/Root';
import {
  updateSearchOption,
  updateFilterUser
} from '../path/List/controls/actions';
import { showBannerNotice, closeBannerNotice } from 'commonActions/actions';

export default connect(
  ({
    common: { brandInfo },
    accountManagement: { currentServer, serverList, needShowNotice }
  }) => ({
    brandInfo,
    currentServer,
    serverList,
    needShowNotice
  }),
  {
    ...actions,
    updateSearchOption,
    updateFilterUser,
    showBannerNotice,
    closeBannerNotice
  }
)(Root);
