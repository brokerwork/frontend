import { connect } from "react-redux";
import Root from "../components/Root";
import { getServerList } from "../controls/actions";

export default connect(null, {
  getServerList
})(Root);
