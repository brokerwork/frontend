import { connect } from "react-redux";
import Root from "../components/Root";
import { getTestDetail } from "../controls/actions";

export default connect(
  ({ previewAppropriatenessTest: { testDetail } }) => ({
    testDetail
  }),
  {
    getTestDetail
  }
)(Root);
