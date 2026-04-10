import { connect } from "react-redux";
import BasicInfo from "../components/BasicInfo";
import { getProductInfo, refreshApiToken } from "../controls/actions";

export default connect(
  ({ bridgeProductDetail: { productInfo } }) => ({
    productInfo
  }),
  {
    getProductInfo,
    refreshApiToken
  }
)(BasicInfo);
