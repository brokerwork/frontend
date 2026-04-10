import { connect } from "react-redux";
import VendorList from "../components/VendorList";
import {
  getVendorInfo,
  getServerGroup,
  setPipsOrigin,
  setVendorOrigin
} from "../controls/actions";
import { showTopAlert } from "common/actions";

export default connect(
  ({ traderVendor: { vendorInfo } }) => ({
    vendorInfo
  }),
  {
    getVendorInfo,
    getServerGroup,
    setPipsOrigin,
    setVendorOrigin,
    showTopAlert
  }
)(VendorList);
