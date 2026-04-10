import { connect } from "react-redux";
import List from "../components/List";
import { switchServerFollow, getServerList } from "../controls/actions";
import { showTopAlert, showTipsModal } from "common/actions";

export default connect(
  ({ twappFollowOrder: { connector: { serverList } } }) => ({
    serverList
  }),
  {
    switchServerFollow,
    getServerList,
    showTopAlert,
    showTipsModal
  }
)(List);
