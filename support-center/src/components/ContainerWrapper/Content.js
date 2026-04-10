import { connect } from "react-redux";
import { showTopAlert, closeTopAlert } from "common/actions";
import cs from "./Container.less";

class Content extends PureComponent {
  state = {
    height: 0
  };

  componentDidMount() {
    this.setHeight();

    window.addEventListener("resize", this.setHeight, false);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.setHeight, false);
  }

  setHeight = () => {
    const windowHeight = window.innerHeight;

    this.setState({
      height: windowHeight - 75
    });
  };

  render() {
    const { children } = this.props;
    const { height } = this.state;

    return (
      <div className={cs["content"]} style={{ height: `${height}px` }}>
        {children}
      </div>
    );
  }
}

export default connect(null, {
  showTopAlert,
  closeTopAlert
})(Content);
