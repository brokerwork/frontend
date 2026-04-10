import { connect } from "react-redux";
import VideoService from "../components/VideoService";
import { getVideoService } from "../controls/actions";

export default connect(
  ({ dashboard: { videoService } }) => ({
    videoService
  }),
  { getVideoService }
)(VideoService);
