import { connect } from "react-redux";
import Demand from "../components/Demand";
import { getDemandService } from "../controls/actions";

export default connect(
  ({ consumption: { demandService } }) => ({
    demandService
  }),
  {
    getDemandService
  }
)(Demand);
