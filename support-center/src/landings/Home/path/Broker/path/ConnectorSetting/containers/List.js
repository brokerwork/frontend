import { connect as reduxConnect } from "react-redux";
import List from "../components/List";
import {
  disconnect,
  connect,
  getServerList,
  setConnectorOrder
} from "../controls/actions";
import { showTipsModal, showTopAlert } from "common/actions";

export default reduxConnect(
  ({ brokerConnectorSetting: { serverList } }) => ({
    serverList
  }),
  {
    disconnect,
    connect,
    getServerList,
    showTipsModal,
    showTopAlert,
    setConnectorOrder
  }
)(List);
