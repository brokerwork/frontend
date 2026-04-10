import { connect } from "react-redux";
import Content from "../components/Content";
import { updateCurrentServerId } from "../controls/actions";

export default connect(
  ({ twappFollowOrder: { symbol: { groupList, currentServerId } } }) => ({
    groupList,
    currentServerId
  }),
  {
    updateCurrentServerId
  }
)(Content);
