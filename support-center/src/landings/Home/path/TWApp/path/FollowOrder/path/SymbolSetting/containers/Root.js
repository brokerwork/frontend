import { connect } from "react-redux";
import Root from "../components/Root";
import { getServerSymbol, updateCurrentServerId } from "../controls/actions";

export default connect(
  ({ twappFollowOrder: { symbol: { serverList, currentServerId } } }) => ({
    serverList,
    currentServerId
  }),
  {
    getServerSymbol,
    updateCurrentServerId
  }
)(Root);
