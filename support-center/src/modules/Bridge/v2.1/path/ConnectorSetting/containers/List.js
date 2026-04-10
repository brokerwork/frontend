import { connect } from "react-redux";
import List from "../components/List";
import {
  getConnectorList,
  startConnector,
  stopConnector,
  removeConnector
} from "../controls/actions";
import { showTipsModal, showTopAlert } from "common/actions";

export default connect(
  ({ bridgeConnectorSetting: { connectorList } }) => ({
    connectorList
  }),
  {
    getConnectorList,
    startConnector,
    stopConnector,
    removeConnector,
    showTipsModal,
    showTopAlert
  }
)(List);
