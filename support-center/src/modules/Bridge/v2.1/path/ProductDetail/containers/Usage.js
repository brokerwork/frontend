import { connect } from "react-redux";
import Usage from "../components/Usage";
import { getUsageInfo } from "../controls/actions";

export default connect(
  ({ bridgeProductDetail: { usageInfo } }) => ({
    usageInfo
  }),
  {
    getUsageInfo
  }
)(Usage);
