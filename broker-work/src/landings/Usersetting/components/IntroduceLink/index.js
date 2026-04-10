import {
  showTopAlert,
  getMyLinkQrcode,
  getIntroduceLink
} from 'commonActions/actions';
import { connect } from 'react-redux';
import IntroduceLink from './IntroduceLink';

export default connect(
  ({ common }) => ({
    myLinkQrcode: common.myLinkQrcode,
    introduceLink: common.myIntroduceLink
  }),
  {
    showTopAlert,
    getMyLinkQrcode,
    getIntroduceLink
  }
)(IntroduceLink);
